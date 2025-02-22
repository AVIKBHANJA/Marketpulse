import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRoutes from './routes/user.route.js';
import authRoutes from './routes/auth.route.js';
import cookieParser from 'cookie-parser';
import path from 'path';
import cors from 'cors';
import yahooFinance from 'yahoo-finance2';
import { HfInference } from "@huggingface/inference";

import axios from 'axios';

dotenv.config();

const hf = new HfInference(process.env.HUGGINGFACE_API_KEY);
const news = process.env.apiKey;

mongoose
  .connect(process.env.MONGO)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

const __dirname = path.resolve();
const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: 'http://localhost:5173', // Update with your client port
  credentials: true
}));

// Finance API Route
app.get('/api/finance', async (req, res) => {
  try {
    const { symbols } = req.query;
    const symbolsArray = symbols.split(',');
    const quotes = await Promise.all(
      symbolsArray.map(symbol => yahooFinance.quote(symbol))
    );
    res.json(quotes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


// Other Routes
app.use('/api/user', userRoutes);
app.use('/api/auth', authRoutes);

// Static Files
app.use(express.static(path.join(__dirname, '/client/dist')));

app.get("/analyze", async (req, res) => {
  const { keyword} = req.query;

  if (!keyword || !news) {
      return res.status(400).json({ error: "Keyword and API key are required." });
  }

  try {
      const newsUrl = `https://newsapi.org/v2/everything?q=${keyword}&apiKey=${news}`;
      const response = await axios.get(newsUrl);
     
      const articles = response.data.articles || [];

      if (articles.length === 0) {
          return res.status(404).json({ error: "No relevant articles found." });
      }

      let totalScore = 0;
      let numArticles = 0;
      let analyzedArticles = [];

      for (const article of articles) {
          const description = article.description;
          if (!description) continue;

          const sentiment = await hf.textClassification({
              model: "ProsusAI/finbert",
              inputs: description,
          });

          const sentimentLabel = sentiment[0].label;
          const score = sentiment[0].score * (sentimentLabel === "positive" ? 1 : -1);

          totalScore += score;
          numArticles++;

          analyzedArticles.push({
              title: article.title,
              url: article.url,
              publishedAt: article.publishedAt,
              description: description,
              sentiment: sentimentLabel,
              score: score.toFixed(2),
          });
      }

      const finalScore = totalScore / numArticles;
      const overallSentiment = finalScore > 0.15 ? "Positive" : finalScore < -0.15 ? "Negative" : "Neutral";

      res.json({
          overall_sentiment: overallSentiment,
          final_score: finalScore.toFixed(2),
          num_articles: numArticles,
          analyzed_articles: analyzedArticles,
      });
  } catch (error) {
      res.status(500).json({ error: "Error fetching news or analyzing sentiment." });
  }
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client', 'dist', 'index.html'));
});

// Error Handler
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    statusCode,
    message: err.message || 'Internal Server Error'
  });
});

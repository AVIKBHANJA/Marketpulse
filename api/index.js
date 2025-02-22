import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRoutes from './routes/user.route.js';
import authRoutes from './routes/auth.route.js';
import cookieParser from 'cookie-parser';
import path from 'path';
import cors from 'cors';
import yahooFinance from 'yahoo-finance2';

dotenv.config();

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

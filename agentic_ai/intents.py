import requests
import json
import re
import os
from fuzzywuzzy import fuzz, process
from dotenv import load_dotenv

#import spacy
from rapidfuzz import fuzz, process

# Load spaCy English model for NER
#nlp = spacy.load("en_core_web_sm")

load_dotenv()
ALPHA_VANTAGE_API_KEY = os.environ['ALPHA_VANTAGE_API_KEY']
BASE_URL = "https://www.alphavantage.co/query"

def load_intents(file_path="intents.json"):
    with open(file_path, "r") as file:
        return json.load(file)

def extract_stock_symbol(user_input):
    match = re.search(r'\b[A-Z]{1,5}\b', user_input)  # Matches stock symbols (1-5 uppercase letters)
    return match.group(0) if match else None


# def extract_stock_symbol(user_input):
#     """Extract stock symbols using NER (Named Entity Recognition)."""
#     doc = nlp(user_input)
#     for ent in doc.ents:
#         if ent.label_ in ["ORG", "PRODUCT"]:  # Stocks often recognized as ORG/PRODUCT
#             return ent.text.upper()
#     return None  # No stock symbol found



def find_best_match(user_input, intents, threshold=88, fallback_threshold=65):
    all_examples = []
    intent_map = {}

    # Normalize user input
    user_input = user_input.strip().lower()

    for intent in intents["intents"]:
        for example in intent["examples"]:
            example_lower = example.lower()  # Normalize case
            all_examples.append(example_lower)
            intent_map[example_lower] = intent  # Map example to its intent

    # Use WRatio for best match
    match = process.extractOne(user_input, all_examples, scorer=fuzz.WRatio)

    if match:
        best_match, score = match[:2]  # Extract best match and score

        if score >= threshold:
            return intent_map[best_match]  # Strong match

        elif score >= fallback_threshold:
            return intent_map[best_match]  # Return fallback match

    # Use token_sort_ratio as a backup
    best_alternative = process.extractOne(user_input, all_examples, scorer=fuzz.token_sort_ratio)
    if best_alternative:
        best_match, score = best_alternative[:2]
        print(f"Best alternative match ({score}%) for: {best_match}")
        return intent_map[best_match]

    return None  # No match found



def get_stock_trend(symbol):
    params = {"function": "SMA", "symbol": symbol, "interval": "monthly", "time_period": "10", "series_type": "close", "apikey": ALPHA_VANTAGE_API_KEY}
    response = requests.get(BASE_URL, params=params).json()
    values = response.get("Technical Analysis: SMA", {})

    if values:
        latest_date = list(values.keys())[0]
        return f"The 10-day SMA for {symbol} is {values[latest_date]['SMA']}."
    return "Trend data not available."

def get_earnings_report(symbol):
    params = {"function": "EARNINGS", "symbol": symbol, "apikey": ALPHA_VANTAGE_API_KEY}
    response = requests.get(BASE_URL, params=params).json()
    earnings = response.get("quarterlyEarnings", [])

    if earnings:
        return f"{symbol}'s last reported EPS: {earnings[0]['reportedEPS']} on {earnings[0]['fiscalDateEnding']}."
    return "Earnings report not found."

def get_stock_price(symbol):
    params = {"function": "GLOBAL_QUOTE", "symbol": symbol, "apikey": ALPHA_VANTAGE_API_KEY}
    response = requests.get(BASE_URL, params=params).json()
    price = response.get("Global Quote", {}).get("05. price")

    if price:
        return f"The current price of {symbol} is ${price}"
    return f"Stock price not found for {symbol}"

def get_stock_news(symbol):
    params = {"function": "NEWS_SENTIMENT", "tickers": symbol, "apikey": ALPHA_VANTAGE_API_KEY}
    response = requests.get(BASE_URL, params=params).json()
    articles = response.get("feed", [])

    if articles:
        return f"Latest headline: {articles[0]['title']}"
    return "No recent news found."

def get_stock_data(symbol):
    params = {"function": "OVERVIEW", "symbol": symbol, "apikey": ALPHA_VANTAGE_API_KEY}
    response = requests.get(BASE_URL, params=params).json()

    return {
        "symbol": symbol,
        "price": get_stock_price(symbol),
        "pe_ratio": response.get("PERatio", "N/A"),
        "market_cap": response.get("MarketCapitalization", "N/A"),
        "volume": response.get("Volume", "N/A"),
    }

def get_response(user_input, intents):
    best_intent = find_best_match(user_input, intents)

    if best_intent:
        stock_symbol = extract_stock_symbol(user_input)  # Extract stock symbol

        if best_intent["intent"] == "check_stock_price" and stock_symbol:
            return get_stock_price(stock_symbol)

        elif best_intent["intent"] == "get_stock_news" and stock_symbol:
            return get_stock_news(stock_symbol)

        elif best_intent["intent"] == "analyze_stock_trend" and stock_symbol:
            return get_stock_trend(stock_symbol)

        elif best_intent["intent"] == "get_earnings_report" and stock_symbol:
            return get_earnings_report(stock_symbol)

        elif best_intent["intent"] == "get_stock_data" and stock_symbol:
            stock_data = get_stock_data(stock_symbol)
            return f"The Current Stock Data for {stock_symbol} is: {stock_data}"

    return "I'm not sure how to answer that."

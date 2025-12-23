from flask import Flask, jsonify, request
from flask_cors import CORS
import math
import os
import requests
from dotenv import load_dotenv

load_dotenv()
WEATHER_API_KEY = os.getenv("WEATHER_API_KEY")
MARKET_API_KEY = os.getenv("MARKET_API_KEY")

app = Flask(__name__)
CORS(app)

# --- Logic Modules ---

# --- Logic Modules ---

def predict_crop_logic(data):
    """
    Rules-based logic for crop suggestion based on Soil, Water, Location.
    Inputs: soilType, water, location
    """
    soil = data.get('soilType', 'Alluvial')
    water = data.get('water', 'Borewell')
    location = data.get('location', 'Unknown')

    # Logic Matrix
    if soil == 'Black':
        if water in ['Canal', 'Drip']:
             return {"name": "Cotton", "confidence": "92%", "tips": "Black soil with good irrigation is ideal for Cotton."}
        else:
             return {"name": "Sorghum (Jowar)", "confidence": "85%", "tips": "Drought-tested crop for Black soil."}
             
    elif soil == 'Red':
        if water in ['Borewell', 'Rainfed']:
            return {"name": "Groundnut", "confidence": "88%", "tips": "Red soil drains well, perfect for Groundnut."}
        else:
             return {"name": "Vegetables (Tomato/Chilli)", "confidence": "80%", "tips": "With water, Red soil supports veggies well."}
             
    elif soil == 'Clay':
        return {"name": "Rice (Paddy)", "confidence": "95%", "tips": "Clay retains water, making it best for Paddy."}
        
    elif soil == 'Sandy':
        return {"name": "Watermelon / Melons", "confidence": "90%", "tips": "Sandy soil is great for creepers like melons."}
        
    # Default / Alluvial
    if water == 'Canal':
        return {"name": "Sugarcane", "confidence": "90%", "tips": "River plains with canal water suits Sugarcane."}
    
    return {"name": "Wheat / Maize", "confidence": "85%", "tips": "Standard adaptable crops for this region."}

# --- Endpoints ---

@app.route('/')
def home():
    return jsonify({"message": "AgriAssist Backend is Running 🚀"})

@app.route('/api/predict-crop', methods=['POST'])
def predict_crop():
    data = request.json
    result = predict_crop_logic(data)
    return jsonify(result)

@app.route('/api/weather', methods=['GET'])
def get_weather():
    city = request.args.get('city')
    lat = request.args.get('lat')
    lon = request.args.get('lon')

    if city:
        url = f"https://api.openweathermap.org/data/2.5/forecast?q={city}&appid={WEATHER_API_KEY}&units=metric"
    elif lat and lon:
        url = f"https://api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid={WEATHER_API_KEY}&units=metric"
    else:
        # Default to Vijayawada
        url = f"https://api.openweathermap.org/data/2.5/forecast?lat=16.5062&lon=80.6480&appid={WEATHER_API_KEY}&units=metric"
    
    try:
        print(f"Calling Weather API: {url}")
        response = requests.get(url)
        data = response.json()
        
        if str(data.get('cod')) != '200':
            print(f"Weather API Error Data: {data}")
            return jsonify({"error": data.get('message', 'API Error')}), 400

        city_name = data['city']['name']
        
        forecast_list = []
        seen_days = set()
        
        from datetime import datetime
        
        for item in data['list']:
            date = item['dt_txt'].split(' ')[0]
            if date not in seen_days:
                seen_days.add(date)
                
                dt_obj = datetime.strptime(date, '%Y-%m-%d')
                day_name = dt_obj.strftime('%A')
                
                # Check if it's today
                if date == datetime.now().strftime('%Y-%m-%d'):
                    day_name = "Today"
                
                forecast_list.append({
                    "day": day_name,
                    "temp": f"{round(item['main']['temp'])}°C",
                    "icon": get_weather_icon(item['weather'][0]['main']),
                    "condition": item['weather'][0]['description'].capitalize(),
                    "alert": None
                })
        
        return jsonify({
            "cityName": city_name,
            "forecast": forecast_list
        })
    except Exception as e:
        print(f"Weather API Exception: {e}")
        # Fallback to mock if API fails or other errors occur
        return jsonify({
            "cityName": "Vijayawada (Offline)",
            "forecast": [
                {"day": "Today", "temp": "31°C", "icon": "☀", "condition": "Sunny", "alert": None},
                {"day": "Tomorrow", "temp": "29°C", "icon": "🌦", "condition": "Cloudy", "alert": None},
                {"day": "Wednesday", "temp": "27°C", "icon": "⛈", "condition": "Thunderstorm", "alert": "Yellow Alert: Heavy Rain"},
            ]
        })

def get_weather_icon(condition):
    icons = {
        "Clear": "☀",
        "Clouds": "☁",
        "Rain": "🌧",
        "Thunderstorm": "⛈",
        "Drizzle": "🌦",
        "Snow": "❄",
        "Mist": "🌫",
        "Smoke": "🌫",
        "Haze": "🌫",
        "Dust": "🌫",
        "Fog": "🌫",
        "Sand": "🌫",
        "Ash": "🌫",
        "Squall": "🌫",
        "Tornado": "🌪"
    }
    return icons.get(condition, "🌫")

@app.route('/api/market', methods=['GET'])
def get_market():
    # Data.gov.in API for Agriculture Prices
    # We'll filter for Andhra Pradesh to keep it relevant
    url = f"https://api.data.gov.in/resource/9ef27ebe-055c-4bc3-a044-84d416d7a467?api-key={MARKET_API_KEY}&format=json&filters[state]=Andhra Pradesh&limit=10"
    
    try:
        response = requests.get(url)
        data = response.json()
        
        records = data.get('records', [])
        formatted_prices = []
        
        for rec in records:
            # Simple trend logic since real-time trend isn't always in the record
            trend = "up" if int(rec.get('modal_price', 0)) > 2000 else "stable"
            
            formatted_prices.append({
                "crop": f"{rec.get('commodity')} ({rec.get('variety')})",
                "mandi": rec.get('market'),
                "price": f"₹{rec.get('modal_price')}/q",
                "trend": trend,
                "last_updated": rec.get('arrival_date')
            })
            
        if not formatted_prices:
            # Fallback for AP
            return jsonify([
                {"crop": "Rice (BPT-5204)", "mandi": "Nellore", "price": "₹2,250/q", "trend": "up", "last_updated": "Today"},
                {"crop": "Mirchi (Guntur Teja)", "mandi": "Guntur", "price": "₹18,600/q", "trend": "up", "last_updated": "Live"},
                {"crop": "Maize", "mandi": "Kurnool", "price": "₹2,050/q", "trend": "down", "last_updated": "Today"},
            ])
            
        return jsonify(formatted_prices)
    except Exception as e:
        print(f"Market API Error: {e}")
        return jsonify([])

@app.route('/api/schemes', methods=['GET'])
def get_schemes():
    return jsonify([
        {"name": "PM-KISAN", "benefit": "₹6,000 / year", "eligibility": "Landholding < 2 Hectares"},
        {"name": "YSR Rythu Bharosa", "benefit": "₹13,500 / year", "eligibility": "All Farmers (Andhra Pradesh)"},
        {"name": "Free Power Supply", "benefit": "9-hour Free Supply", "eligibility": "Agricultural Pump sets (AP)"},
    ])

@app.route('/api/seeds', methods=['GET'])
def get_seeds():
    seeds = [
        {"id": 1, "name": "Hybrid Maize Seeds", "category": "Cereals", "price": "₹450/kg", "rating": 4.8, "stock": "High"},
        {"id": 2, "name": "Sonalika Wheat", "category": "Cereals", "price": "₹320/kg", "rating": 4.5, "stock": "Medium"},
        {"id": 3, "name": "Organic BT Cotton", "category": "Fiber", "price": "₹850/pk", "rating": 4.9, "stock": "Limited"},
        {"id": 4, "name": "Basmati Paddy", "category": "Rice", "price": "₹600/kg", "rating": 4.7, "stock": "High"},
        {"id": 5, "name": "Yellow Mustard", "category": "Oilseeds", "price": "₹280/kg", "rating": 4.2, "stock": "High"}
    ]
    return jsonify(seeds)

@app.route('/api/marketplace', methods=['GET', 'POST'])
def marketplace():
    # Price-centric list
    market_data = [
        {"id": 1, "crop": "Rice", "price": "₹3200/quintal", "trend": "up"},
        {"id": 2, "crop": "Cotton", "price": "₹8500/quintal", "trend": "stable"},
        {"id": 3, "crop": "Maize", "price": "₹2100/quintal", "trend": "down"},
        {"id": 4, "crop": "Wheat", "price": "₹2600/quintal", "trend": "up"}
    ]
    return jsonify(market_data)

@app.route('/api/crop-info/<crop_name>', methods=['GET'])
def crop_info(crop_name):
    # Context-aware mock data
    info = {
        "Rice": {"pesticides": "Imidacloprid, Neem Oil", "diseases": "Blast, Bacterial Blight", "harvest": "120-150 days"},
        "Cotton": {"pesticides": "Acephate, Spinosad", "diseases": "Wilt, Boll Rot", "harvest": "160-180 days"},
        "Maize": {"pesticides": "Chlorpyrifos", "diseases": "Leaf Blight, Smut", "harvest": "90-110 days"}
    }
    return jsonify(info.get(crop_name, info["Rice"]))

if __name__ == '__main__':
    # Use PORT environment variable when available (platforms like Render set this).
    port = int(os.environ.get('PORT', 5000))
    # Control debug via FLASK_DEBUG env var (default False in production)
    debug_mode = os.environ.get('FLASK_DEBUG', 'false').lower() == 'true'
    # Bind to all interfaces so the service is reachable from outside the container
    app.run(debug=debug_mode, host='0.0.0.0', port=port)

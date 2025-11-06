# ChatBot Copilot 🤖

An Indian boy best friend personality chatbot with Anime.js frontend, Flask backend, and MongoDB database.

---

## 📋 Quick Start

### 1. Get MongoDB (5 minutes)
```bash
# Go to: https://mongodb.com/cloud/atlas
# Sign up → Create cluster → Create user → Copy URI
# Example: mongodb+srv://user:password@cluster.mongodb.net/
```

### 2. Setup
```bash
cd backend
cp .env.example .env
# Edit .env and add: MONGODB_URI=your-connection-string
pip install -r requirements.txt
python init_db.py
```

### 3. Run Locally
```bash
# Terminal 1: Backend
cd backend && python app.py

# Terminal 2: Frontend
cd frontend && python -m http.server 8000

# Open: http://localhost:8000/index.html
```

---

## 🔑 API Keys Required

### REQUIRED (1 key):
- **MongoDB Connection String** - Get from https://mongodb.com/cloud/atlas (FREE)

### OPTIONAL (Add later):
- Google Cloud TTS (for voice)
- SendGrid (for emails)
- Firebase (for authentication)

---

## �� Deployment

### Railway.app (Recommended - 5 min)
```
1. https://railway.app/ → Sign up with GitHub
2. New Project → Select repo
3. Add: MONGODB_URI = your-connection-string
4. Deploy! ✅
```
**Cost:** $5+/month | **Setup:** 5 min

### Render.com (Free tier - 10 min)
```
1. https://render.com/ → Sign up with GitHub
2. New Web Service → Select repo
3. Build: pip install -r backend/requirements.txt
4. Start: cd backend && gunicorn app:app
5. Deploy! ✅
```
**Cost:** Free or $7+/month | **Setup:** 10 min

### Docker
```bash
docker-compose up -d
# Access: http://localhost:5000
```

### AWS EC2
```
1. Launch Ubuntu instance (free tier)
2. SSH in → Install Docker
3. git clone → docker-compose up
4. Done! ✅
```
**Cost:** ~$10/month | **Setup:** 30 min

---

## 📁 Project Structure

```
chatbot-copilot/
├── backend/
│   ├── app.py              # Flask app
│   ├── init_db.py          # Database setup
│   ├── requirements.txt    # Dependencies
│   ├── .env                # Config (don't commit)
│   ├── config/
│   │   └── database.py     # MongoDB connection
│   ├── models/
│   │   └── conversation.py # Data models
│   └── routes/
│       └── chat.py         # API endpoints
├── frontend/
│   ├── index.html          # UI
│   ├── styles.css          # Styling
│   └── script.js           # Logic
├── docker-compose.yml
├── Dockerfile
└── README.md
```

---

## 📊 API Endpoints

```
POST   /api/chat/conversations
       Create conversation

POST   /api/chat/conversations/{id}/messages
       Send message

GET    /api/chat/conversations/{id}/messages
       Get history

GET    /health
       Check status
```

---

## ✨ Features

- 🤖 Indian boy best friend personality (Hinglish)
- 🎨 Beautiful animated UI (Anime.js)
- 💬 Real-time chat with MongoDB persistence
- 🗣️ Voice features (Web Speech API)
- 📱 Responsive design
- ⚡ 6 REST API endpoints

---

## 🛠️ Configuration

Edit `backend/.env`:
```env
FLASK_ENV=development
FLASK_RUN_PORT=5001
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/
DATABASE_NAME=chatbot_db
```

---

## 🆘 Troubleshooting

| Problem | Solution |
|---------|----------|
| Port in use | `lsof -i :5001` then `kill -9 <PID>` |
| MongoDB error | Check MONGODB_URI and IP whitelist |
| No response | Verify backend on port 5001 |
| Database not saving | Restart MongoDB or docker-compose |

---

## �� Testing

```bash
# Test API
curl http://localhost:5001/health

# Test conversation
curl -X POST http://localhost:5001/api/chat/conversations

# Test message
curl -X POST http://localhost:5001/api/chat/conversations/{id}/messages \
  -H "Content-Type: application/json" \
  -d '{"message":"Hi bro"}'
```

---

## 💰 Costs

| Platform | Startup | Monthly | Free Tier |
|----------|---------|---------|-----------|
| Railway | $0 | $5+ | No |
| Render | $0 | Free-$7 | Yes |
| AWS EC2 | $0 | ~$10 | Yes (1yr) |
| Docker | $0 | $0 | Yes |

---

## 📞 Resources

- MongoDB: https://mongodb.com/cloud/atlas
- Railway: https://railway.app/
- Render: https://render.com/
- Flask: https://flask.palletsprojects.com/
- Docker: https://docker.com/

---

## 🎉 Deploy Now!

Your chatbot is ready. Choose a platform above and deploy in 5-30 minutes!

**Happy chatting! Yo bro! Kya haal hai? 🤖**

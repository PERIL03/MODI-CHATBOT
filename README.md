# Modi-Style AI Chatbot 🇮🇳

A unique Node.js + Express chatbot that responds exclusively in the distinctive speaking style of PM Narendra Modi, powered by Google Gemini 2.5 Flash API with integrated text-to-speech functionality.

This project features authentic Hinglish responses, Modi's characteristic phrases, and voice synthesis to bring the PM's speaking style to life digitally.

## 🎯 What makes this special
- **Modi Persona**: Responds in PM Modi's characteristic speaking style with signature phrases
- **Hinglish Support**: Authentic Hindi-English mix as Modi typically speaks
- **Text-to-Speech**: Modi-style voice synthesis with adjustable voice selection
- **Live AI Integration**: Powered by Google Gemini 2.5 Flash API
- **Session Memory**: Maintains conversation context for natural dialogue
- **Modern UI**: Clean, responsive interface with Indian-themed styling

## 🌟 Key Features
- **Authentic Modi Speech Patterns**: Uses "Mitron", "bhaiyon aur behno", "Digital India", "Atmanirbhar Bharat", "sabka saath sabka vikas"
- **Voice Synthesis**: Multiple voice options to find the most Modi-like speech
- **Real-time Responses**: Live API integration with Google Gemini
- **Session Context**: Remembers conversation history for coherent dialogue
- **Mobile Responsive**: Works on all device sizes
- **Easy Deployment**: Docker support and platform-ready

## 📁 Project Structure
```
├── server.js          # Express server with Modi persona logic
├── public/
│   └── index.html     # Frontend with voice synthesis
├── package.json       # Dependencies and scripts
├── Dockerfile        # Container deployment
├── .env.example      # Environment variables template
└── README.md         # This file
```

## 🔧 Environment Variables
Create a `.env` file with your Google Gemini API credentials:

```env
GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_ENDPOINT=https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent
PORT=3000
```

**Security Note**: Never commit your `.env` file to version control!

## 🚀 Quick Start

### Local Development
```bash
# Clone the repository
git clone https://github.com/yourusername/modi-ai-chatbot.git
cd modi-ai-chatbot

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your Gemini API key

# Start the server
npm start
```

Open http://localhost:3000 and start chatting with Modi AI! 🇮🇳

### 🎤 Voice Features
1. **Auto-Speech**: Modi's responses are automatically spoken aloud
2. **Voice Selection**: Choose from available system voices using the dropdown
3. **Test Voice**: Click "🎤 Test Voice" to hear a sample Modi phrase
4. **Stop Speech**: Use "🔇 Stop Speech" to halt ongoing speech
5. **Replay**: Click 🔊 on any message to hear it again

### 💡 Pro Tips
- Try voices like "Daniel", "Alex", or "Fred" for more authoritative tones
- The system uses Modi-specific pronunciation for words like "Mitron" and "Bharat"
- Speech includes strategic pauses for dramatic effect, just like Modi's speeches

## 🐳 Docker Deployment

```bash
# Build the container
docker build -t modi-ai-chatbot .

# Run with environment variables
docker run -e GEMINI_API_KEY="$GEMINI_API_KEY" \
           -e GEMINI_ENDPOINT="$GEMINI_ENDPOINT" \
           -p 3000:3000 modi-ai-chatbot
```

## ☁️ Platform Deployment

Deploy to any Node.js hosting platform:

- **Render**: Connect your GitHub repo, add environment variables
- **Vercel**: Deploy with `vercel --prod`
- **Railway**: One-click deploy from GitHub
- **Heroku**: `git push heroku main`

**Remember**: Set your `GEMINI_API_KEY` and `GEMINI_ENDPOINT` in the platform's environment variables!

## 🎭 Demo Highlights

Perfect for class presentations and showcasing:

1. **Unique Persona**: Only Modi-style chatbot with authentic Hinglish responses
2. **Live AI Integration**: Real Google Gemini 2.5 Flash API calls
3. **Voice Synthesis**: Actual speech output with Modi-like characteristics
4. **Session Memory**: Maintains conversation context naturally
5. **Technical Stack**: Modern Node.js, Express, Web Speech API
6. **Easy Explanation**: Simple architecture, clear value proposition

### Sample Interactions
- Ask about technology → Get Modi's vision for Digital India
- Ask about education → Hear about youth empowerment and skill development  
- Ask about development → Learn about Atmanirbhar Bharat initiatives

## 🔒 Security Notes
- API keys are environment-based (never in code)
- Uses server-side proxy to protect credentials
- In-memory sessions (perfect for demos, not production)
- Rate limiting recommended for public deployment

## 🚀 Why This Project Stands Out

1. **Unique Concept**: First Modi-persona chatbot with voice synthesis
2. **Cultural Authenticity**: Genuine Hinglish speech patterns
3. **Technical Innovation**: Combines AI, voice synthesis, and web tech
4. **Practical Demo**: Easy to explain and impressive to experience
5. **Full-Stack**: Backend API integration + Frontend interactivity

## 📸 Screenshots

*Modi AI in action with voice synthesis and authentic Hinglish responses*

## 🤝 Contributing

Feel free to submit issues and pull requests to improve the Modi AI experience!

## 📄 License

MIT License - Feel free to use for educational purposes

## 🎓 Perfect for Academic Submissions

This project demonstrates:
- **AI Integration**: Real API usage with Google Gemini
- **Full-Stack Development**: Backend + Frontend coordination  
- **Innovation**: Unique cultural persona implementation
- **User Experience**: Voice synthesis and responsive design
- **Deployment Ready**: Docker and cloud platform support

---

**Made with 🧡 for showcasing AI innovation and cultural authenticity**

*"Technology ke saath culture ko jodna - yahi toh Digital India ka sapna hai!" - Modi AI* 🇮🇳

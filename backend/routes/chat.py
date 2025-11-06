from flask import Blueprint, request, jsonify, send_file
from config.database import get_db
from models.conversation import Message, Conversation
from google.cloud import texttospeech
import google.generativeai as genai
import random
import os

chat_bp = Blueprint('chat', __name__, url_prefix='/api/chat')

def init_gemini():
    api_key = os.getenv('GOOGLE_API_KEY')
    if api_key:
        genai.configure(api_key=api_key)
        return True
    return False

GEMINI_AVAILABLE = init_gemini()
if GEMINI_AVAILABLE:
    try:
        gemini_model = genai.GenerativeModel('gemini-2.5-flash')
        print("✅ Gemini 2.5 Flash model loaded successfully!")
    except Exception as e:
        print(f"Warning: Could not load Gemini model: {e}")
        GEMINI_AVAILABLE = False

PERSONALITY_RESPONSES = {
    'greeting': [
        "Yo bro! Kya haal hai? Ready to chat?",
        "Arre yaar! Welcome back buddy! Kaise ho?",
        "Haan bhai! Main yaha hoon, bolna na!",
    ],
    'default': [
        "Bilkul bro! Main samajh gaya.",
        "Haan haan, bilkul samjha!",
        "Arre yaar, suno to, samajh aa gaya!",
        "Bilkul buddy, main ready hoon!",
    ],
    'goodbye': [
        "Bye yaar! Fir se baatein karte hain!",
        "Thik hai buddy, fir milenge!",
        "Chalo bro, goodbye! Stay awesome!",
    ]
}

def get_google_tts_audio(text, output_file='output.mp3'):
    try:
        client = texttospeech.TextToSpeechClient()
        synthesis_input = texttospeech.SynthesisInput(text=text)
        voice = texttospeech.VoiceSelectionParams(
            language_code="hi-IN",
            name="hi-IN-Standard-B",
            ssml_gender=texttospeech.SsmlVoiceGender.MALE,
        )
        audio_config = texttospeech.AudioConfig(
            audio_encoding=texttospeech.AudioEncoding.MP3
        )
        response = client.synthesize_speech(
            input=synthesis_input,
            voice=voice,
            audio_config=audio_config
        )
        with open(output_file, 'wb') as out:
            out.write(response.audio_content)
        return True
    except Exception as e:
        print(f"TTS Error: {e}")
        return False

def get_personality_response(intent='default'):
    responses = PERSONALITY_RESPONSES.get(intent, PERSONALITY_RESPONSES['default'])
    return random.choice(responses)

@chat_bp.route('/conversations', methods=['POST'])
def create_conversation():
    try:
        data = request.get_json()
        user_id = data.get('user_id', 'anonymous')
        db = get_db()
        conversation_id = Conversation.create(db, user_id)
        return jsonify({
            'status': 'success',
            'conversation_id': conversation_id
        }), 201
    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 500

@chat_bp.route('/conversations/<conversation_id>/messages', methods=['POST'])
def send_message(conversation_id):
    """Send a message and get bot response"""
    try:
        data = request.get_json()
        user_message = data.get('message', '').strip()
        sender = data.get('sender', 'User')
        
        if not user_message:
            return jsonify({'status': 'error', 'message': 'Empty message'}), 400
        
        db = get_db()
        
        # Save user message
        Message.create(db, conversation_id, sender, user_message, sender_type='user')
        
        # Generate bot response based on user input
        bot_response = generate_bot_response(user_message)
        
        # Save bot message
        Message.create(db, conversation_id, 'ChatBot Bro', bot_response, sender_type='bot')
        
        # Generate TTS audio for bot response
        audio_url = None
        if os.getenv('GOOGLE_APPLICATION_CREDENTIALS'):
            output_file = f'/tmp/audio_{conversation_id}.mp3'
            if get_google_tts_audio(bot_response, output_file):
                audio_url = f'/api/chat/audio/{conversation_id}'
        
        return jsonify({
            'status': 'success',
            'user_message': user_message,
            'bot_response': bot_response,
            'audio_url': audio_url,
            'conversation_id': conversation_id
        }), 200
    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 500

@chat_bp.route('/conversations/<conversation_id>/messages', methods=['GET'])
def get_messages(conversation_id):
    """Get all messages for a conversation"""
    try:
        db = get_db()
        messages = Message.get_by_conversation(db, conversation_id)
        
        # Convert ObjectId to string for JSON serialization
        for msg in messages:
            msg['_id'] = str(msg['_id'])
            msg['conversation_id'] = str(msg['conversation_id'])
            msg['created_at'] = msg['created_at'].isoformat()
        
        return jsonify({
            'status': 'success',
            'messages': messages
        }), 200
    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 500

@chat_bp.route('/conversations', methods=['GET'])
def get_user_conversations():
    """Get all conversations for a user"""
    try:
        user_id = request.args.get('user_id', 'anonymous')
        db = get_db()
        conversations = Conversation.get_by_user(db, user_id)
        
        for conv in conversations:
            conv['_id'] = str(conv['_id'])
            conv['created_at'] = conv['created_at'].isoformat()
            conv['updated_at'] = conv['updated_at'].isoformat()
        
        return jsonify({
            'status': 'success',
            'conversations': conversations
        }), 200
    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 500

def generate_bot_response(user_message):
    """Generate a bot response using Gemini API or fallback to personality responses"""
    if GEMINI_AVAILABLE:
        try:
            prompt = f"""You are a friendly Indian boy best friend chatbot named "ChatBot Bro". 
            You respond in Hinglish (Hindi-English mix) with lots of personality.
            Keep responses brief (1-2 sentences max), casual, and friendly.
            Use phrases like "Bro", "Yaar", "Bilkul", "Arre", etc.
            Be enthusiastic and supportive like a best friend would be.
            
            User said: {user_message}
            
            Respond as the ChatBot Bro character:"""
            
            response = gemini_model.generate_content(prompt)
            bot_response = response.text.strip()
            
            # Ensure response is not empty
            if bot_response:
                print(f"[Gemini] User: {user_message}")
                print(f"[Gemini] Bot: {bot_response}")
                return bot_response
        except Exception as e:
            print(f"Gemini API Error: {e}")
            print("Falling back to personality responses...")
    
    # Fallback: Use simple intent-based responses
    user_lower = user_message.lower()
    
    if any(word in user_lower for word in ['hi', 'hello', 'hey', 'namaste', 'kya haal']):
        return get_personality_response('greeting')
    elif any(word in user_lower for word in ['bye', 'goodbye', 'see you', 'take care']):
        return get_personality_response('goodbye')
    elif any(word in user_lower for word in ['thanks', 'thank you', 'dhanyavaad', 'shukriya']):
        return "Arre yaar, koi baat nahi! Always here for you bro! 🙌"
    elif any(word in user_lower for word in ['how are you', 'kaise ho', 'how u', 'kaisa hai']):
        return "Main bilkul sahi hoon bro! Aur tu? Kaise hai?"
    elif any(word in user_lower for word in ['your name', 'naam', 'who are you', 'kaun ho']):
        return "Yaar, main tera best friend ChatBot Bro hoon! Hamesha tere liye available! 😎"
    elif any(word in user_lower for word in ['help', 'madad', 'problem', 'issue']):
        return "Arre bhai, main yaha hoon na! Kya problem hai? Bataa, main solve kar dunga! 💪"
    elif any(word in user_lower for word in ['love', 'like', 'awesome', 'great', 'fantastic']):
        return "Haan bro, bilkul! Mujhe bhi tera friendship bohot pasand hai! 🤝"
    else:
        return f"Haan bro, bilkul samajh gaya! '{user_message}' - bilkul sahi kaha tune! Aur kya bolna?"

@chat_bp.route('/audio/<conversation_id>', methods=['GET'])
def get_audio(conversation_id):
    try:
        audio_file = f'/tmp/audio_{conversation_id}.mp3'
        if os.path.exists(audio_file):
            return send_file(audio_file, mimetype='audio/mp3')
        return jsonify({'status': 'error', 'message': 'Audio not found'}), 404
    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 500

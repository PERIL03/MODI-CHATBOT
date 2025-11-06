from flask import Flask, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
import os

load_dotenv()

app = Flask(__name__)
CORS(app)

app.config['JSON_SORT_KEYS'] = False

from routes.chat import chat_bp
app.register_blueprint(chat_bp)

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'healthy', 'service': 'ChatBot Bro Backend'}), 200

@app.route('/', methods=['GET'])
def index():
    return jsonify({
        'message': 'Welcome to ChatBot Bro Backend!',
        'status': 'running',
        'endpoints': {
            'create_conversation': 'POST /api/chat/conversations',
            'send_message': 'POST /api/chat/conversations/<id>/messages',
            'get_messages': 'GET /api/chat/conversations/<id>/messages',
            'get_conversations': 'GET /api/chat/conversations'
        }
    }), 200

@app.errorhandler(404)
def not_found(error):
    return jsonify({'status': 'error', 'message': 'Endpoint not found'}), 404

@app.errorhandler(500)
def internal_error(error):
    return jsonify({'status': 'error', 'message': 'Internal server error'}), 500

if __name__ == '__main__':
    debug_mode = os.getenv('FLASK_ENV', 'development') == 'development'
    port = int(os.getenv('FLASK_RUN_PORT', 5000))
    app.run(debug=debug_mode, host='0.0.0.0', port=port)

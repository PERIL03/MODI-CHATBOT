from flask import Flask, jsonify, send_from_directory, send_file
from flask_cors import CORS
from dotenv import load_dotenv
import os
from pathlib import Path

load_dotenv()

app = Flask(__name__)
CORS(app)

app.config['JSON_SORT_KEYS'] = False

from routes.chat import chat_bp
app.register_blueprint(chat_bp)

frontend_dir = Path(__file__).parent.parent / 'frontend'

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'healthy', 'service': 'ChatBot Bro Backend'}), 200

@app.route('/')
def index():
    try:
        return send_file(frontend_dir / 'index.html')
    except:
        return jsonify({'error': 'index.html not found'}), 500

@app.route('/<path:filename>')
def serve_static(filename):
    if not filename or filename.startswith('api'):
        return jsonify({'error': 'Not found'}), 404
    
    try:
        file_path = frontend_dir / filename
        if file_path.exists() and file_path.is_file():
            return send_file(file_path)
    except:
        pass
    
    try:
        return send_file(frontend_dir / 'index.html')
    except:
        return jsonify({'error': 'Not found'}), 404

@app.errorhandler(404)
def not_found(error):
    try:
        return send_file(frontend_dir / 'index.html')
    except:
        return jsonify({'status': 'error', 'message': 'Endpoint not found'}), 404

@app.errorhandler(500)
def internal_error(error):
    return jsonify({'status': 'error', 'message': 'Internal server error'}), 500

if __name__ == '__main__':
    debug_mode = os.getenv('FLASK_ENV', 'development') == 'development'
    port = int(os.getenv('FLASK_RUN_PORT', 5000))
    app.run(debug=debug_mode, host='0.0.0.0', port=port)

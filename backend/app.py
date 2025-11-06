from flask import Flask, jsonify, send_file
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

current_dir = Path(__file__).resolve().parent
frontend_dir = current_dir.parent / 'frontend'

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'healthy', 'service': 'ChatBot Bro Backend'}), 200

@app.route('/')
def index():
    index_path = frontend_dir / 'index.html'
    if not index_path.exists():
        return jsonify({'error': f'index.html not found at {index_path}'}), 500
    return send_file(index_path, mimetype='text/html')

@app.route('/<path:filename>')
def serve_static(filename):
    if not filename or filename.startswith('api'):
        return jsonify({'error': 'Not found'}), 404
    
    file_path = frontend_dir / filename
    
    if file_path.exists() and file_path.is_file():
        mimetype = 'text/html'
        if filename.endswith('.css'):
            mimetype = 'text/css'
        elif filename.endswith('.js'):
            mimetype = 'application/javascript'
        return send_file(file_path, mimetype=mimetype)
    
    index_path = frontend_dir / 'index.html'
    if index_path.exists():
        return send_file(index_path, mimetype='text/html')
    
    return jsonify({'error': 'Not found'}), 404

@app.errorhandler(404)
def not_found(error):
    index_path = frontend_dir / 'index.html'
    if index_path.exists():
        return send_file(index_path, mimetype='text/html')
    return jsonify({'status': 'error', 'message': 'Endpoint not found'}), 404

@app.errorhandler(500)
def internal_error(error):
    return jsonify({'status': 'error', 'message': 'Internal server error'}), 500

if __name__ == '__main__':
    debug_mode = os.getenv('FLASK_ENV', 'development') == 'development'
    port = int(os.getenv('FLASK_RUN_PORT', 5000))
    app.run(debug=debug_mode, host='0.0.0.0', port=port)

"""
ChatBot Bro - Initialize Models and Database
Run this file to set up the database indexes and collections
"""

from config.database import get_db

def initialize_database():
    """Initialize database with indexes"""
    db = get_db()
    
    # Create conversations collection with index
    if 'conversations' not in db.list_collection_names():
        conversations = db.create_collection('conversations')
        conversations.create_index('user_id')
        conversations.create_index('created_at')
        print("✅ Created conversations collection with indexes")
    
    # Create messages collection with index
    if 'messages' not in db.list_collection_names():
        messages = db.create_collection('messages')
        messages.create_index('conversation_id')
        messages.create_index('created_at')
        messages.create_index('sender_type')
        print("✅ Created messages collection with indexes")
    
    print("✅ Database initialized successfully!")
    print("✅ You can now start the Flask app")

if __name__ == '__main__':
    initialize_database()

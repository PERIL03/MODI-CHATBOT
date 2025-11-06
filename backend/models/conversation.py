from datetime import datetime
from bson import ObjectId

class Conversation:
    @staticmethod
    def create(db, user_id):
        conversation = {
            'user_id': user_id,
            'created_at': datetime.utcnow(),
            'updated_at': datetime.utcnow(),
            'messages_count': 0
        }
        result = db['conversations'].insert_one(conversation)
        return str(result.inserted_id)
    
    @staticmethod
    def get_by_id(db, conversation_id):
        try:
            return db['conversations'].find_one({'_id': ObjectId(conversation_id)})
        except:
            return None
    
    @staticmethod
    def get_by_user(db, user_id):
        return list(db['conversations'].find({'user_id': user_id}).sort('created_at', -1))

class Message:
    @staticmethod
    def create(db, conversation_id, sender, content, sender_type='user'):
        message = {
            'conversation_id': ObjectId(conversation_id),
            'sender': sender,
            'content': content,
            'sender_type': sender_type,
            'created_at': datetime.utcnow()
        }
        result = db['messages'].insert_one(message)
        return str(result.inserted_id)
    
    @staticmethod
    def get_by_conversation(db, conversation_id, limit=50):
        try:
            return list(db['messages'].find(
                {'conversation_id': ObjectId(conversation_id)}
            ).sort('created_at', 1).limit(limit))
        except:
            return []
    
    @staticmethod
    def get_latest(db, conversation_id, limit=10):
        try:
            return list(db['messages'].find(
                {'conversation_id': ObjectId(conversation_id)}
            ).sort('created_at', -1).limit(limit))
        except:
            return []

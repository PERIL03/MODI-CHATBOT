from pymongo import MongoClient
from dotenv import load_dotenv
import os

load_dotenv()

MONGODB_URI = os.getenv('MONGODB_URI', 'mongodb://localhost:27017/')
DATABASE_NAME = os.getenv('DATABASE_NAME', 'chatbot_db')

def get_db():
    client = MongoClient(MONGODB_URI)
    db = client[DATABASE_NAME]
    return db

def get_conversations_collection(db):
    return db['conversations']

def get_messages_collection(db):
    return db['messages']

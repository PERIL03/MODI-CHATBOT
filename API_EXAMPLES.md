# ChatBot Copilot - API Examples & Responses

## Base URL
```
http://localhost:5000/api
```

## 1. Create Conversation

### Request
```bash
POST /api/chat/conversations
Content-Type: application/json

{
  "user_id": "user_123"
}
```

### Response (201 Created)
```json
{
  "status": "success",
  "conversation_id": "507f1f77bcf86cd799439011"
}
```

## 2. Send Message

### Request
```bash
POST /api/chat/conversations/507f1f77bcf86cd799439011/messages
Content-Type: application/json

{
  "message": "Hi bro, kya haal hai?",
  "sender": "User"
}
```

### Response (200 OK)
```json
{
  "status": "success",
  "user_message": "Hi bro, kya haal hai?",
  "bot_response": "Yo bro! Welcome back buddy! Kaise ho?",
  "audio_url": "/api/chat/audio/507f1f77bcf86cd799439011",
  "conversation_id": "507f1f77bcf86cd799439011"
}
```

### Bot Response Examples

**User Message**: "Hello"
**Bot Response**: "Yo bro! Welcome! Kya haal hai? Ready to chat? 🎉"

**User Message**: "How are you?"
**Bot Response**: "Main bilkul sahi hoon bro! Aur tu? Kaise hai?"

**User Message**: "What's your name?"
**Bot Response**: "Yaar, main tera best friend ChatBot Bro hoon! Hamesha tere liye available! 😎"

**User Message**: "Thanks"
**Bot Response**: "Arre yaar, koi baat nahi! Always here for you bro! 🙌"

**User Message**: "I have a problem"
**Bot Response**: "Arre bhai, main yaha hoon na! Kya problem hai? Bataa, main solve kar dunga! 💪"

## 3. Get Messages

### Request
```bash
GET /api/chat/conversations/507f1f77bcf86cd799439011/messages
```

### Response (200 OK)
```json
{
  "status": "success",
  "messages": [
    {
      "_id": "507f1f77bcf86cd799439012",
      "conversation_id": "507f1f77bcf86cd799439011",
      "sender": "User",
      "content": "Hi bro!",
      "sender_type": "user",
      "created_at": "2025-11-06T10:30:00.000Z"
    },
    {
      "_id": "507f1f77bcf86cd799439013",
      "conversation_id": "507f1f77bcf86cd799439011",
      "sender": "ChatBot Bro",
      "content": "Yo bro! Welcome! Kya haal hai?",
      "sender_type": "bot",
      "created_at": "2025-11-06T10:30:02.000Z"
    },
    {
      "_id": "507f1f77bcf86cd799439014",
      "conversation_id": "507f1f77bcf86cd799439011",
      "sender": "User",
      "content": "I'm doing great!",
      "sender_type": "user",
      "created_at": "2025-11-06T10:30:05.000Z"
    },
    {
      "_id": "507f1f77bcf86cd799439015",
      "conversation_id": "507f1f77bcf86cd799439011",
      "sender": "ChatBot Bro",
      "content": "Haan bro! Bilkul! Mujhe bhi tera friendship bohot pasand hai! 🤝",
      "sender_type": "bot",
      "created_at": "2025-11-06T10:30:07.000Z"
    }
  ]
}
```

## 4. Get User Conversations

### Request
```bash
GET /api/chat/conversations?user_id=user_123
```

### Response (200 OK)
```json
{
  "status": "success",
  "conversations": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "user_id": "user_123",
      "created_at": "2025-11-06T10:00:00.000Z",
      "updated_at": "2025-11-06T10:30:07.000Z",
      "messages_count": 10
    },
    {
      "_id": "507f1f77bcf86cd799439020",
      "user_id": "user_123",
      "created_at": "2025-11-06T09:00:00.000Z",
      "updated_at": "2025-11-06T09:15:30.000Z",
      "messages_count": 5
    }
  ]
}
```

## 5. Health Check

### Request
```bash
GET /health
```

### Response (200 OK)
```json
{
  "status": "healthy",
  "service": "ChatBot Bro Backend"
}
```

## 6. API Root

### Request
```bash
GET /
```

### Response (200 OK)
```json
{
  "message": "Welcome to ChatBot Bro Backend!",
  "status": "running",
  "endpoints": {
    "create_conversation": "POST /api/chat/conversations",
    "send_message": "POST /api/chat/conversations/<id>/messages",
    "get_messages": "GET /api/chat/conversations/<id>/messages",
    "get_conversations": "GET /api/chat/conversations"
  }
}
```

## Error Responses

### 400 Bad Request
```json
{
  "status": "error",
  "message": "Empty message"
}
```

### 404 Not Found
```json
{
  "status": "error",
  "message": "Endpoint not found"
}
```

### 500 Internal Server Error
```json
{
  "status": "error",
  "message": "Internal server error"
}
```

## Complete Conversation Flow Example

### 1. Create Conversation
```bash
curl -X POST http://localhost:5000/api/chat/conversations \
  -H "Content-Type: application/json" \
  -d '{"user_id": "user_123"}'
```
**Response**: `conversation_id: "abc123"`

### 2. Send First Message
```bash
curl -X POST http://localhost:5000/api/chat/conversations/abc123/messages \
  -H "Content-Type: application/json" \
  -d '{"message": "Namaste bro!", "sender": "Rahul"}'
```
**Response**: 
```json
{
  "status": "success",
  "user_message": "Namaste bro!",
  "bot_response": "Arre yaar! Welcome back buddy! Kaise ho?",
  "audio_url": "/api/chat/audio/abc123"
}
```

### 3. Send Second Message
```bash
curl -X POST http://localhost:5000/api/chat/conversations/abc123/messages \
  -H "Content-Type: application/json" \
  -d '{"message": "What is your name?", "sender": "Rahul"}'
```
**Response**:
```json
{
  "status": "success",
  "user_message": "What is your name?",
  "bot_response": "Yaar, main tera best friend ChatBot Bro hoon! Hamesha tere liye available! 😎",
  "audio_url": "/api/chat/audio/abc123"
}
```

### 4. Get All Messages
```bash
curl http://localhost:5000/api/chat/conversations/abc123/messages
```
**Response**: Full conversation history

### 5. Get All User Conversations
```bash
curl http://localhost:5000/api/chat/conversations?user_id=user_123
```
**Response**: All conversations for user_123

## cURL Cheat Sheet

### Using Variables
```bash
# Set variables
USER_ID="user_$(date +%s)"
BASE_URL="http://localhost:5000/api"

# Create conversation
RESPONSE=$(curl -s -X POST $BASE_URL/chat/conversations \
  -H "Content-Type: application/json" \
  -d "{\"user_id\": \"$USER_ID\"}")

# Extract conversation ID
CONV_ID=$(echo $RESPONSE | grep -o '"conversation_id":"[^"]*' | cut -d'"' -f4)

# Send message
curl -X POST $BASE_URL/chat/conversations/$CONV_ID/messages \
  -H "Content-Type: application/json" \
  -d "{\"message\": \"Hello bro!\", \"sender\": \"Test\"}"
```

### Using jq for JSON Processing
```bash
# Pretty print
curl http://localhost:5000/api/chat/conversations | jq .

# Extract specific field
curl http://localhost:5000/api/chat/conversations | jq '.conversations[0]._id'

# Filter messages
curl http://localhost:5000/api/chat/conversations/abc123/messages | \
  jq '.messages[] | select(.sender_type=="bot")'
```

## Testing Workflow

1. **Test API Endpoints**
   ```bash
   # Health check
   curl http://localhost:5000/health
   
   # Create conversation
   curl -X POST http://localhost:5000/api/chat/conversations \
     -H "Content-Type: application/json" \
     -d '{"user_id":"test"}'
   ```

2. **Test Message Sending**
   ```bash
   # Replace abc123 with actual conversation_id
   curl -X POST http://localhost:5000/api/chat/conversations/abc123/messages \
     -H "Content-Type: application/json" \
     -d '{"message":"Hi!","sender":"Test"}'
   ```

3. **Test Retrieval**
   ```bash
   # Get all messages
   curl http://localhost:5000/api/chat/conversations/abc123/messages
   
   # Get all conversations
   curl "http://localhost:5000/api/chat/conversations?user_id=test"
   ```

## Response Headers

All responses include:
```
Content-Type: application/json
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS
Access-Control-Allow-Headers: Content-Type
```

## Rate Limiting (Future Feature)

Currently no rate limiting, but recommended for production:
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1730889000
```

---

**Use these examples to test and integrate ChatBot Copilot!**

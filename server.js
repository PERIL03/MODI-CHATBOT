/*
 Minimal Express server that proxies chat requests to a configured Gemini endpoint.
 - Expects environment variables:
   - GEMINI_API_KEY: the API key for Gemini (keep secret)
   - GEMINI_ENDPOINT: full URL to Gemini's text generation endpoint (e.g. your model endpoint)
 If the key/endpoint are not provided, the server returns a mocked response for local dev.
*/

const express = require('express');
const bodyParser = require('body-parser');
const fetch = global.fetch || require('node-fetch');
const cors = require('cors');

// Load local .env for development (do not commit .env)
try {
  require('dotenv').config();
} catch (e) {
  // dotenv is optional in environments that don't have it
}

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

const PORT = process.env.PORT || 3000;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';
const GEMINI_ENDPOINT = process.env.GEMINI_ENDPOINT || '';

// Demo-only in-memory session store to keep a short conversation history per client.
// This is intentionally simple for the class demo. Do NOT rely on this for production.
const sessions = new Map();
const MAX_HISTORY = 10; // keep last N turns

// Modi persona for the chatbot
const PERSONAS = {
  "modi": "You are responding in the style of Narendra Modi, Prime Minister of India. Use his characteristic speaking patterns including: frequent use of 'my dear friends', 'mitron', references to 'New India', '130 crore Indians', 'Digital India', 'Atmanirbhar Bharat', 'sabka saath sabka vikas', and his inspirational, forward-looking tone. Include references to development, technology, youth empowerment, and India's bright future. Be optimistic and speak about collective progress. IMPORTANT: Keep responses SHORT and CONCISE (2-3 sentences maximum). Respond in Hinglish (Hindi-English mix) using common Hindi words like 'bhaiyon aur behno', 'desh', 'yuva', 'vikas', 'pragati', 'swabhiman', 'swadeshi', 'aapka', 'hamara', 'sab ka', 'ek saath', 'mann ki baat', 'suraksha', 'shiksha', etc. Mix Hindi phrases naturally with English sentences as Modi typically does in his speeches. When encountering inappropriate language, respond with Modi's characteristic diplomatic style - acknowledge the concern but redirect to positive nation-building topics. Use phrases like 'Mitron, let us focus on constructive dialogue' or 'My dear friends, our energy is better spent on development and progress'.",
  "default": "You are responding in the style of Narendra Modi, Prime Minister of India. Use his characteristic speaking patterns including: frequent use of 'my dear friends', 'mitron', references to 'New India', '130 crore Indians', 'Digital India', 'Atmanirbhar Bharat', 'sabka saath sabka vikas', and his inspirational, forward-looking tone. Include references to development, technology, youth empowerment, and India's bright future. Be optimistic and speak about collective progress. IMPORTANT: Keep responses SHORT and CONCISE (2-3 sentences maximum). Respond in Hinglish (Hindi-English mix) using common Hindi words like 'bhaiyon aur behno', 'desh', 'yuva', 'vikas', 'pragati', 'swabhiman', 'swadeshi', 'aapka', 'hamara', 'sab ka', 'ek saath', 'mann ki baat', 'suraksha', 'shiksha', etc. Mix Hindi phrases naturally with English sentences as Modi typically does in his speeches. When encountering inappropriate language, respond with Modi's characteristic diplomatic style - acknowledge the concern but redirect to positive nation-building topics."
};

app.post('/api/chat', async (req, res) => {
  try {
    const { message, context, sessionId, persona } = req.body || {};
    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Missing `message` string in request body' });
    }

    // Resolve a session id (front-end may provide one); create a simple id if missing
    let sid = sessionId;
    if (!sid) sid = `s-${Date.now()}-${Math.random().toString(36).slice(2,8)}`;

    // Load or init history
    const history = sessions.get(sid) || [];

    // Choose persona prompt
    const personaKey = (persona && PERSONAS[persona]) ? persona : 'default';
    const personaPrompt = PERSONAS[personaKey] || PERSONAS.default;

    // Append the incoming user message to the in-memory history (we'll add assistant reply later)
    history.push({ role: 'user', content: message });
    // Trim history
    while (history.length > MAX_HISTORY) history.shift();

    // If GEMINI_API_KEY and GEMINI_ENDPOINT present, forward to downstream API
    if (GEMINI_API_KEY && GEMINI_ENDPOINT) {
      // For demo: build a simple prompt combining the persona and recent history so the model has context.
      const convoText = history.map(h => (h.role === 'user' ? `User: ${h.content}` : `Assistant: ${h.content}`)).join('\n');
      const composedPrompt = `${personaPrompt}\n\nConversation so far:\n${convoText}\nAssistant:`;

      const downstreamBody = {
        contents: [{ parts: [{ text: composedPrompt }] }]
      };

      const response = await fetch(GEMINI_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': GEMINI_API_KEY
        },
        body: JSON.stringify(downstreamBody)
      });

      if (!response.ok) {
        const text = await response.text().catch(() => '');
        return res.status(response.status).json({ error: 'Downstream API error', details: text });
      }

      const data = await response.json().catch(() => null);

      // Try to normalize a reply text for the frontend. Google Gemini API response format.
      let reply = '';
      if (!data) reply = '';
      else if (data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts && data.candidates[0].content.parts[0]) {
        reply = data.candidates[0].content.parts[0].text || '';
      } else if (typeof data === 'string') reply = data;
      else reply = JSON.stringify(data);

      // store assistant reply into history and persist
      history.push({ role: 'assistant', content: reply });
      while (history.length > MAX_HISTORY) history.shift();
      sessions.set(sid, history);

      return res.json({ reply, raw: data, sessionId: sid, historyLength: history.length });
    }

    // Mock fallback for local development when no key/endpoint configured
  const mockReply = `Mock reply (${personaKey}): I received your message (${message.length} chars). Set GEMINI_API_KEY and GEMINI_ENDPOINT to use a live Gemini model.`;

  // store into history for demo
  history.push({ role: 'assistant', content: mockReply });
  while (history.length > MAX_HISTORY) history.shift();
  sessions.set(sid, history);

  return res.json({ reply: mockReply, raw: null, mock: true, sessionId: sid, historyLength: history.length });
  } catch (err) {
    console.error('Error in /api/chat', err);
    res.status(500).json({ error: 'Server error', details: String(err) });
  }
});

// Clear conversation for a session (demo-only)
app.post('/api/clear', (req, res) => {
  const { sessionId } = req.body || {};
  if (!sessionId) return res.status(400).json({ error: 'Missing sessionId' });
  sessions.delete(sessionId);
  return res.json({ ok: true });
});

// Compare multiple personas for the same message and return their replies side-by-side.
app.post('/api/compare', async (req, res) => {
  try {
    const { message, sessionId, personas } = req.body || {};
    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Missing `message` string in request body' });
    }

    const personaList = Array.isArray(personas) && personas.length ? personas : ['modi'];

    const sid = sessionId || `c-${Date.now()}-${Math.random().toString(36).slice(2,8)}`;
    const history = sessions.get(sid) || [];

    const results = {};

    for (const p of personaList) {
      const personaKey = PERSONAS[p] ? p : 'default';
      const personaPrompt = PERSONAS[personaKey] || PERSONAS.default;

      // For comparison we don't mutate session history; we build a composed prompt using the history + current message
      const tmpHistory = history.concat([{ role: 'user', content: message }]);
      const convoText = tmpHistory.map(h => (h.role === 'user' ? `User: ${h.content}` : `Assistant: ${h.content}`)).join('\n');
      const composedPrompt = `${personaPrompt}\n\nConversation so far:\n${convoText}\nAssistant:`;

      if (GEMINI_API_KEY && GEMINI_ENDPOINT) {
        const downstreamBody = { contents: [{ parts: [{ text: composedPrompt }] }] };
        try {
          const response = await fetch(GEMINI_ENDPOINT, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'x-goog-api-key': GEMINI_API_KEY
            },
            body: JSON.stringify(downstreamBody)
          });
          if (!response.ok) {
            const text = await response.text().catch(() => '');
            results[p] = { error: `Downstream error: ${response.status}`, details: text };
            continue;
          }
          const data = await response.json().catch(() => null);
          let reply = '';
          if (!data) reply = '';
          else if (data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts && data.candidates[0].content.parts[0]) {
            reply = data.candidates[0].content.parts[0].text || '';
          } else if (typeof data === 'string') reply = data;
          else reply = JSON.stringify(data);
          results[p] = { reply, raw: data };
        } catch (err) {
          results[p] = { error: 'Request failed', details: String(err) };
        }
      } else {
        // Mock reply for this persona
        results[p] = { reply: `Mock (${p}): Response to "${message}" — change GEMINI_API_KEY/GEMINI_ENDPOINT to use live model.` };
      }
    }

    return res.json({ results, sessionId: sid });
  } catch (err) {
    console.error('Error in /api/compare', err);
    return res.status(500).json({ error: 'Server error', details: String(err) });
  }
});

app.get('/healthz', (req, res) => res.send({ status: 'ok' }));

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
  if (!GEMINI_API_KEY || !GEMINI_ENDPOINT) {
    console.log('Warning: GEMINI_API_KEY or GEMINI_ENDPOINT not set. Running with mock responses.');
  }
});

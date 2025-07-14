// api/login.js - Función serverless para login con Upstash Redis
import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.KV_REST_API_URL,
  token: process.env.KV_REST_API_TOKEN,
});

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  try {
    // Parsear body manualmente
    const body = await new Promise((resolve, reject) => {
      let data = '';
      req.on('data', chunk => data += chunk);
      req.on('end', () => resolve(JSON.parse(data)));
      req.on('error', err => reject(err));
    });

    const { email, password } = body;

    const userKey = `user:${email}`;
    const user = await redis.get(userKey);

    if (!user || user.password !== password) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    const accessToken = Buffer.from(email + ':' + Date.now()).toString('base64');
    await redis.setex(`token:${accessToken}`, 86400, user.id);

    res.json({
      accessToken,
      user: {
        id: user.id,
        email: user.email,
        role: user.role || 'turista'
      }
    });
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
}
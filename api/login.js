// api/login.js - Función serverless para login con Upstash Redis
import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

export default async function handler(req, res) {
  // Configurar CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Manejar preflight OPTIONS
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  const { email, password } = req.body;

  try {
    // Buscar usuario en Redis
    const userKey = `user:${email}`;
    const user = await redis.get(userKey);

    if (!user || user.password !== password) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    // Generar token simple
    const accessToken = Buffer.from(email + ':' + Date.now()).toString('base64');
    
    // Guardar token en Redis con expiración (24 horas)
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
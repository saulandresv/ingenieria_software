// api/register.js - Función serverless para registro con Upstash Redis
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

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  const { email, password, role = 'turista' } = req.body;

  // Validación básica
  if (!email || !password) {
    return res.status(400).json({ error: 'Email y contraseña son requeridos' });
  }

  try {
    // Verificar si el usuario ya existe
    const userKey = `user:${email}`;
    const existingUser = await redis.get(userKey);

    if (existingUser) {
      return res.status(400).json({ error: 'El usuario ya existe' });
    }

    // Crear nuevo usuario
    const userId = `user_${Date.now()}`;
    const newUser = {
      id: userId,
      email: email,
      password: password,
      role: role,
      created_at: new Date().toISOString()
    };

    // Guardar usuario en Redis
    await redis.set(userKey, newUser);

    res.json({ 
      message: 'Usuario registrado exitosamente',
      user: { 
        id: userId,
        email: email,
        role: role
      }
    });
  } catch (error) {
    console.error('Error en registro:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
} 
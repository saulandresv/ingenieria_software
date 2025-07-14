// api/tramites.js - Función serverless para trámites con Upstash Redis
import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

export default async function handler(req, res) {
  // Configurar CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Verificar autenticación
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: 'Token de autenticación requerido' });
  }

  try {
    // Verificar token en Redis
    const token = authHeader.replace('Bearer ', '');
    const userId = await redis.get(`token:${token}`);

    if (!userId) {
      return res.status(401).json({ error: 'Token inválido' });
    }

    if (req.method === 'GET') {
      // Obtener trámites del usuario
      const tramitesKey = `tramites:${userId}`;
      const tramites = await redis.get(tramitesKey) || [];

      return res.json(tramites);
    }

    if (req.method === 'POST') {
      const { tipo, descripcion, documentos } = req.body;

      if (!tipo) {
        return res.status(400).json({ error: 'Tipo de trámite es requerido' });
      }

      // Crear nuevo trámite
      const newTramite = {
        id: `tramite_${Date.now()}`,
        user_id: userId,
        tipo: tipo,
        descripcion: descripcion || '',
        documentos: documentos || [],
        estado: 'En revisión',
        created_at: new Date().toISOString()
      };

      // Obtener trámites existentes y agregar el nuevo
      const tramitesKey = `tramites:${userId}`;
      const existingTramites = await redis.get(tramitesKey) || [];
      existingTramites.unshift(newTramite);

      // Guardar trámites actualizados
      await redis.set(tramitesKey, existingTramites);

      return res.json(newTramite);
    }

    res.status(405).json({ error: 'Método no permitido' });
  } catch (error) {
    console.error('Error en trámites:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
} 
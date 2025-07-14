import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.KV_REST_API_URL,
  token: process.env.KV_REST_API_TOKEN,
});

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET') return res.status(405).json({ error: 'Método no permitido' });

  try {
    const keys = await redis.keys('tramites:*');
    const enRevision = [];

    for (const key of keys) {
      const tramites = await redis.get(key);
      if (Array.isArray(tramites)) {
        enRevision.push(...tramites.filter(t => t.estado === 'En revisión'));
      }
    }

    return res.status(200).json({ tramites: enRevision });
  } catch (error) {
    console.error('Error obteniendo trámites en revisión:', error);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
}

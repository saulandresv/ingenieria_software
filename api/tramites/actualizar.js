import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.KV_REST_API_URL,
  token: process.env.KV_REST_API_TOKEN,
});

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Método no permitido' });

  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: 'Token requerido' });

  try {
    const token = authHeader.replace('Bearer ', '');
    const userId = await redis.get(`token:${token}`);
    if (!userId) return res.status(401).json({ error: 'Token inválido' });

    const userKey = `user:${userId}`;
    const userData = await redis.get(userKey);
    if (!userData || userData.role !== 'funcionario') {
      return res.status(403).json({ error: 'Permisos insuficientes' });
    }

    const { tramite_id, nuevo_estado } = req.body;
    if (!tramite_id || !nuevo_estado) {
      return res.status(400).json({ error: 'Faltan datos requeridos' });
    }

    // Buscar trámites de todos los usuarios (supone que conoces los ID de usuarios)
    const users = ['user_1', 'user_2', 'user_3'];
    let actualizado = false;

    for (const uid of users) {
      const key = `tramites:${uid}`;
      const tramites = await redis.get(key) || [];

      const index = tramites.findIndex(t => t.id === tramite_id);
      if (index !== -1) {
        tramites[index].estado = nuevo_estado;
        await redis.set(key, tramites);
        actualizado = true;
        return res.json({ message: 'Trámite actualizado', tramite: tramites[index] });
      }
    }

    if (!actualizado) {
      return res.status(404).json({ error: 'Trámite no encontrado' });
    }

  } catch (error) {
    console.error('Error al actualizar trámite:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
}

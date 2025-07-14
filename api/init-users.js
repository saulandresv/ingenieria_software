// api/init-users.js - Inicializar usuarios de prueba en Upstash Redis
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

  try {
    // Usuarios de prueba
    const testUsers = [
      {
        id: 'user_1',
        email: 'admin@aduana.com',
        password: 'admin123',
        role: 'auditor',
        created_at: new Date().toISOString()
      },
      {
        id: 'user_2',
        email: 'turista@example.com',
        password: 'turista123',
        role: 'turista',
        created_at: new Date().toISOString()
      },
      {
        id: 'user_3',
        email: 'funcionario@aduana.com',
        password: 'func123',
        role: 'funcionario',
        created_at: new Date().toISOString()
      }
    ];

    // Guardar usuarios en Redis
    for (const user of testUsers) {
      const userKey = `user:${user.email}`;
      await redis.set(userKey, user);
    }

    // Crear algunos trámites de ejemplo
    const sampleTramites = [
      {
        id: 'tramite_1',
        user_id: 'user_2',
        tipo: 'salida_vehiculo',
        descripcion: 'Salida temporal de vehículo turístico',
        documentos: ['pasaporte', 'licencia_conducir'],
        estado: 'En revisión',
        created_at: new Date().toISOString()
      },
      {
        id: 'tramite_2',
        user_id: 'user_2',
        tipo: 'entrada_vehiculo',
        descripcion: 'Entrada de vehículo con productos',
        documentos: ['declaracion_aduana'],
        estado: 'Aprobado',
        created_at: new Date().toISOString()
      }
    ];

    // Guardar trámites de ejemplo
    for (const tramite of sampleTramites) {
      const tramitesKey = `tramites:${tramite.user_id}`;
      const existingTramites = await redis.get(tramitesKey) || [];
      existingTramites.push(tramite);
      await redis.set(tramitesKey, existingTramites);
    }

    res.json({ 
      message: 'Usuarios de prueba inicializados correctamente',
      users: testUsers.map(u => ({ email: u.email, role: u.role }))
    });
  } catch (error) {
    console.error('Error inicializando usuarios:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
} 
// api/tramites.js - Función serverless para trámites
export default async function handler(req, res) {
  // Configurar CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Datos de ejemplo (en producción usarías una DB real)
  const tramites = [
    {
      id: 1,
      usuario: "sau",
      tipo: "salida_vehiculo",
      estado: "En revisión",
      fecha: "2025-06-17"
    },
    {
      id: 2,
      usuario: "maria",
      tipo: "entrada_vehiculo",
      estado: "Aprobado",
      fecha: "2025-06-18"
    }
  ];

  if (req.method === 'GET') {
    return res.json(tramites);
  }

  if (req.method === 'POST') {
    const newTramite = {
      ...req.body,
      id: Date.now(),
      fecha: new Date().toISOString().split('T')[0],
      estado: "En revisión"
    };
    
    // En producción, guardarías en DB
    tramites.push(newTramite);
    
    return res.json(newTramite);
  }

  res.status(405).json({ error: 'Método no permitido' });
} 
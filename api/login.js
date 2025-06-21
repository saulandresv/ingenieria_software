// api/login.js - Función serverless para login
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

  // Simulación de usuarios (en producción usarías una DB real)
  const users = [
    { id: 1, email: 'admin@aduana.com', password: 'admin123' },
    { id: 2, email: 'turista@example.com', password: 'turista123' },
    { id: 3, email: 'funcionario@aduana.com', password: 'func123' }
  ];

  // Buscar usuario
  const user = users.find(u => u.email === email && u.password === password);

  if (!user) {
    return res.status(401).json({ error: 'Credenciales inválidas' });
  }

  // Generar token simple
  const accessToken = Buffer.from(email + ':' + Date.now()).toString('base64');

  res.json({
    accessToken,
    user: { id: user.id, email: user.email }
  });
} 
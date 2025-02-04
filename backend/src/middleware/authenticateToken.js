import pkg from 'jsonwebtoken';
const { verify } = pkg;

const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  console.log("Encabezado Authorization recibido:", authHeader);

  const token = authHeader && authHeader.split(' ')[1];
  if (!token) {
    console.log("Token faltante");
    return res.status(403).json({ message: 'Token requerido' });
  }

  try {
    const decoded = verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    console.log("Token decodificado correctamente:", decoded);
    next();
  } catch (error) {
    console.log("Error al verificar el token:", error.message);
    res.status(401).json({ message: 'Token inválido' });
  }
};

export default verifyToken;


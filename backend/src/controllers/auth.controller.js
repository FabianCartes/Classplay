import jwt from 'jsonwebtoken'; // Importa el paquete completo
import { hash, compare } from 'bcrypt';
import User from '../entity/user.js'; // Tu modelo de usuario
import { AppDataSource } from "../data-source.js";

const { sign } = jwt; // Desestructura `sign` de la importación por defecto

const register = async (req, res) => {
  try {
    const { username, password, email } = req.body; // Ahora incluimos `email`

    // Validar los datos requeridos
    if (!username || !password || !email) {
      return res.status(400).json({ message: 'Todos los campos son obligatorios' });
    }

    // Hash de la contraseña
    const hashedPassword = await hash(password, 10);

    // Repositorio del usuario
    const userRepository = AppDataSource.getRepository(User);

    // Verificar si el usuario ya existe
    const existingUser = await userRepository.findOne({ where: { username } });
    const existingEmail = await userRepository.findOne({ where: { email } });

    if (existingUser) {
      return res.status(400).json({ message: 'El usuario ya existe' });
    }

    if (existingEmail) {
      return res.status(400).json({ message: 'El correo electrónico ya está en uso' });
    }

    // Crear y guardar el nuevo usuario
    const newUser = userRepository.create({ username, password: hashedPassword, email });
    await userRepository.save(newUser);

    res.status(201).json({ message: 'Usuario registrado exitosamente' });
  } catch (error) {
    console.error('Error en el registro:', error);
    res.status(500).json({ message: 'Error en el servidor', error: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOne({ where: { username } });

    if (!user || !await compare(password, user.password)) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    const token = sign(
      { id: user.id, username: user.username, rol: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    // Enviar también el rol del usuario
    res.json({
      token,
      user: {
        id: user.id,
        username: user.username,
        role: user.role // Aquí incluimos el rol
      }
    });
  } catch (error) {
    console.error('Error en el login:', error);
    res.status(500).json({ message: 'Error en el servidor', error });
  }
};

export default { register, login };

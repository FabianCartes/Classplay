// Función de validación para datos de usuario sin lanzar errores personalizados
const validateUserData = (userData) => {
    const errors = [];
  
    const { username, email, password, role } = userData;
  
    // Verificar si el username está presente y tiene un tamaño adecuado
    if (!username || username.length < 3 || username.length > 50) {
      errors.push("Username must be between 3 and 50 characters.");
    }
  
    // Verificar si el email es válido
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      errors.push("Email is not valid.");
    }
  
    // Verificar si la contraseña tiene un mínimo de 6 caracteres
    if (!password || password.length < 6) {
      errors.push("Password must be at least 6 characters.");
    }
  
    // Validar el rol (si es 'user' o 'moderador')
    if (role && !["user", "moderador"].includes(role)) {
      errors.push("Role must be either 'user' or 'moderador'.");
    }
  
    // Si hay errores, devolverlos
    return errors;
  };
  
  export { validateUserData };
  
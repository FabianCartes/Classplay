import { EntitySchema } from "typeorm";

const User = new EntitySchema({
  name: "User",
  tableName: "users",
  columns: {
    id: {
      primary: true,
      type: "int",
      generated: true,
      unsigned: true, // Clave primaria sin signo
    },
    username: {
      type: "varchar",
      length: 255, // Longitud máxima para el nombre de usuario
      nullable: false,
    },
    email: {
      type: "varchar",
      length: 255, // Longitud máxima para el correo
      unique: true, // Aseguramos que no haya correos duplicados
      nullable: false,
    },
    password: {
      type: "varchar",
      length: 255, // Longitud para la contraseña (puede variar según cómo la guardes)
      nullable: false,
    },
    role: {
      type: "enum",
      enum: ["user", "moderador"], // Roles posibles
      default: "user", // Valor predeterminado
    },
  },
});

export default User;

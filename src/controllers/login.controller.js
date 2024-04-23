import { pool } from "../db.js";

const loginUser = async (user, password) => {
  try {
    const text = "SELECT email, password FROM login WHERE email = $1 AND password = $2;";
    const values = [user, password];
    const result = await pool.query(text, values);

    if (!result.rowCount) {
      console.log({
        status: "Error",
        message: "No se pudo iniciar sesión.",
        code: 500,
      });
      return {
        status: "Error",
        message: "No se pudo iniciar sesión.",
        code: 500,
      };
    } else {
      console.log({
        status: "Success",
        message: "Inicio de sesión exitoso!.",
        code: 200,
        result: result.rows,
      });
      return {
        status: "Success",
        message: "Inicio de sesión exitoso!.",
        code: 200,
        result: result.rows,
      };
    }
  } catch (error) {
    return console.log({
      message: error.message,
      code: error.code,
      detail: error.detail,
      constraint: error.constraint,
      mensajeDelProgramador: "Login fallido",
    });
  }
};
export { loginUser }
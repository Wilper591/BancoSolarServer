import { pool } from "../db.js";

/* Crea un nuevo registro en tabla usuarios */
const createUser = async (nombre, balance) => {
  try {
    /* Inicia la transacción */
    console.log("BEGIN START CREATE USER");
    await pool.query("BEGIN");

    const query =
      "INSERT INTO usuarios(nombre, balance) VALUES($1, $2) RETURNING *;";
    const values = [nombre, balance];
    const newUser = await pool.query(query, values);

    if (!newUser.rowCount) {
      /* Error */
      const rollback = "ROLLBACK";
      await pool.query(rollback);
      console.log({
        status: "Error",
        message: "No se pudo crear al nuevo usuario.",
        code: 500,
      });
      return {
        status: "Error",
        message: "No se pudo crear al nuevo usuario",
        code: 500,
      };
    } else {
      /* Success */
      console.log({
        status: "Success",
        message: "Usuario creado Éxitosamente.",
        code: 200,
        nuevoUsuario: newUser.rows,
      });
      /* Finaliza transcción */
      await pool.query("COMMIT");
      console.log("COMMIT END");
      return {
        status: "Success",
        message: "Usuario creado Éxitosamente",
        code: 200,
        nuevoUsuario: newUser.rows,
      };
    }
  } catch (error) {
    await pool.end();
    return {
      message: error.message,
      code: error.code,
      detail: error.detail,
      constraint: error.constraint,
      mensajeDelProgramador: "Creacion de nuevo usuario fallida.",
    };
  }
};

/* Trae listado de clientes */
const getUsers = async () => {
  try {
    const query = "SELECT * FROM usuarios ORDER BY id ASC;";
    const result = await pool.query(query);

    if (!result.rowCount) {
      /* Error */
      console.log({
        status: "Error",
        message: "No se pudo obtener el listado de clientes.",
        code: 500,
      });
      return {
        status: "Error",
        message: "No se pudo obtener el listado de clientes.",
        code: 500,
      };
    } else {
      /* Success */
      console.log({
        status: "Success",
        message: "Listado de clientes obtenido exitosamente.",
        code: 200,
        listado: result.rows,
      });
      return {
        status: "Success",
        message: "Listado de clientes obtenido exitosamente.",
        code: 200,
        listado: result.rows,
      };
    }
  } catch (error) {
    return console.log({
      message: error.message,
      code: error.code,
      detail: error.detail,
      constraint: error.constraint,
      mensajeDelProgramador: "Busqueda de usuarios fallida",
    });
  }
};

/* Genera una transacción entre usuarios */
const newTransaction = async (balance, emisor, receptor) => {
  try {
    const discount =
      "UPDATE usuarios SET balance = balance - $1 WHERE id = $2 RETURNING *";
    const valuesDisc = [balance, emisor];
    const clientDiscount = await pool.query(discount, valuesDisc);

    const accredit =
      "UPDATE usuarios SET balance = balance + $1 WHERE id = $2 RETURNING *";
    const valuesAccre = [balance, receptor];
    const clientAccredit = await pool.query(accredit, valuesAccre);

    return {
      status: "Success",
      message: "Transacción realizada con éxito.",
      code: 200,
      emisor: clientDiscount.rows[0],
      receptor: clientAccredit.rows[0],
    };
  } catch (error) {
    return console.log({
      message: error.message,
      code: error.code,
      detail: error.detail,
      constraint: error.constraint,
      mensajeDelProgramador: "Transacción fallida",
    });
  }
};

/* Actualiza los datos del usuario */
const editUser = async (nombre, balance, id) => {
  try {
    /* Inicia la transacción */
    console.log("BEGIN START EDIT USER");
    await pool.query("BEGIN");

    const text =
      "UPDATE usuarios SET nombre = $1, balance = $2 WHERE id = $3 RETURNING *;";
    const values = [nombre, balance, id];
    const result = await pool.query(text, values);

    if (!result.rowCount) {
      /* Error */
      const rollback = "ROLLBACK";
      await pool.query(rollback);
      console.log({
        status: "Error",
        message: "No se pudo editar la información del usuario",
        code: 500,
      });
      return {
        status: "Error",
        message: "No se pudo editar la información del usuario",
        code: 500,
      };
    } else {
      /* Success */
      console.log({
        status: "Success",
        message: "Usuario Editado Correctamente",
        code: 200,
        edit: result.rows,
      });
      /* Termina la transacción */
      await pool.query("COMMIT");
      console.log("COMMIT END");
      return {
        status: "Success",
        message: "Usuario Editado Correctamente",
        code: 200,
        edit: result.rows,
      };
    }
  } catch (error) {
    return console.log({
      message: error.message,
      code: error.code,
      detail: error.detail,
      constraint: error.constraint,
      mensajeDelProgramador: "Edición de Usuario fallido",
    });
  }
};

/* Elimina un usuario por ID */
const deleteUser = async (id) => {
  try {
    /* Inicia la transacción */
    console.log("BEGIN START DELETE USER");
    await pool.query("BEGIN");

    const text = "DELETE FROM usuarios WHERE id = $1 RETURNING *";
    const values = [id];
    const result = await pool.query(text, values);

    if (!result.rowCount) {
      /* Error */
      const rollback = "ROLLBACK";
      await pool.query(rollback);
      console.log({
        status: "Error",
        message: "No se pudo Eliminar el Usuario",
        code: 500,
      });
      return {
        status: "Error",
        message: "No se pudo Eliminar el Usuario",
        code: 500,
      };
    } else {
      /* Success */
      console.log({
        status: "Success",
        message: "Usuario Eliminado Correctamente",
        code: 200,
        erase: result.rows,
      });
      /* Termina la transacción */
      await pool.query("COMMIT");
      console.log("COMMIT END");
      return {
        status: "Success",
        message: "Usuario Eliminado Correctamente",
        code: 200,
        erase: result.rows,
      };
    }
  } catch (error) {
    console.log({
      message: error.message,
      code: error.code,
      detail: error.detail,
      constraint: error.constraint,
      mensajeDelProgramador: "Eliminación de Usuario Fallido.",
    });
    return {
      message: error.message,
      code: error.code,
      detail: error.detail,
      constraint: error.constraint,
      mensajeDelProgramador: "Eliminación de Usuario Fallido",
    };
  }
};

export { createUser, getUsers, newTransaction, editUser, deleteUser };

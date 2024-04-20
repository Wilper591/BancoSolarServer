import { pool } from "../db.js";
import moment from "moment";
const fecha = moment().format("DD-M-YYYY H:mm:ss");

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

/* Genera registro de transferencia */
const newVoucher = async (emisor, receptor, monto) => {
  try {
    const values = [emisor, receptor, monto];
    const transaction = `INSERT INTO transferencias
      (emisor, receptor, monto, fecha) 
      VALUES($1 ,$2 , $3, '${fecha}') RETURNING *;`;
    const result = await pool.query(transaction, values);

    return {
      status: "Success",
      message: "Registro realizado con éxito.",
      code: 200,
      emisor: result.rows[0],
    };
  } catch (error) {
    return console.log({
      message: error.message,
      code: error.code,
      detail: error.detail,
      constraint: error.constraint,
      mensajeDelProgramador: "Registro de voucher fallida",
    });
  }
};

/* Genera nueva transferencia y actualiza saldo de cuentas entre usuarios */
const createTransaction = async (emisor, receptor, monto) => {
  try {
    /* Inicia la transacción */
    console.log("BEGIN START CREATE TRANSACTION");
    await pool.query("BEGIN");
    const transaction = await newTransaction(monto, emisor, receptor);
    const voucher = await newVoucher(emisor, receptor, monto);

    if (!transaction || !voucher) {
      const rollback = "ROLLBACK";
      await pool.query(rollback);

      console.log({
        status: "Error",
        message: "La operación ha sido anulada",
        code: 500,
      });
      return {
        status: "Error",
        message: "La operación ha sido anulada",
        code: 500,
      };
    } else {
      /* Finaliza transcción */
      await pool.query("COMMIT");
      console.log("COMMIT END");
      console.log({
        status: "Success",
        message: "Operación realizada con éxito.",
        code: 200,
        transaction: transaction,
        voucher: voucher,
      });
      return {
        status: "Success",
        message: "Operación realizada con éxito.",
        code: 200,
        transaction: transaction,
        voucher: voucher,
      };
    }
  } catch (error) {
    await pool.end();
    return console.log({
      message: error.message,
      code: error.code,
      detail: error.detail,
      constraint: error.constraint,
      mensajeDelProgramador: "Transacción fallida",
    });
  }
};

/* Trae listado de transacciones */
const getTransactions = async () => {
  try {
    /* Inicia la transacción */
    console.log("BEGIN START GET TRANSACTION");
    await pool.query("BEGIN");

    const query = `
    SELECT transferencias.*, emisor.nombre AS nombre_emisor, receptor.nombre AS nombre_receptor
    FROM transferencias 
    INNER JOIN usuarios emisor ON transferencias.emisor = emisor.id
    INNER JOIN usuarios receptor ON transferencias.receptor = receptor.id;
    `;
    const result = await pool.query(query);

    if (!result.rowCount) {
      /* Error */
      const rollback = "ROLLBACK";
      await pool.query(rollback);
      console.log({
        status: "Error",
        message: "No se pudo obtener el listado de clientes.",
        code: 500,
      });
    } else {
      /* Finaliza transcción */
      await pool.query("COMMIT");
      console.log("COMMIT END");
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
    await pool.end();
    return console.log({
      message: error.message,
      code: error.code,
      detail: error.detail,
      constraint: error.constraint,
      mensajeDelProgramador: "Transacción fallida",
    });
  }
};

export { createTransaction, getTransactions };

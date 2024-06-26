import { pool } from "../db.js";
import moment from "moment";
import { newTransaction } from "./users.controller.js";
const fecha = moment().format();

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
        message: "No se pudo realizar la transacción",
        code: 500,
      });
      return {
        status: "Error",
        message: "No se pudo realizar la transacción",
        code: 500,
      };
    } else {
      console.log({
        status: "Success",
        message: "Operación realizada con éxito.",
        code: 200,
        transaction: transaction,
        voucher: voucher,
      });
      /* Finaliza transcción */
      await pool.query("COMMIT");
      console.log("COMMIT END");
      return {
        status: "Success",
        message: "Operación realizada con éxito",
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
    const query = `
    SELECT transferencias.id, transferencias.monto, transferencias.fecha, emisor.nombre AS nombre_emisor, receptor.nombre AS nombre_receptor
    FROM transferencias 
    INNER JOIN usuarios emisor ON transferencias.emisor = emisor.id
    INNER JOIN usuarios receptor ON transferencias.receptor = receptor.id
    ORDER BY id ASC;`;
    const result = await pool.query(query);

    if (!result.rowCount) {
      /* Error */
      console.log({
        status: "Error",
        message: "No se pudo obtener el listado de transferencias",
        code: 500,
      });
      return {
        status: "Error",
        message: "No se pudo obtener el listado de transferencias",
        code: 500,
      };
    } else {
      /* Success */
      console.log({
        status: "Success",
        message: "Listado de transferencias obtenido exitosamente.",
        code: 200,
        listado: result.rows,
      });
      return {
        status: "Success",
        message: "Listado de transferencias obtenido exitosamente.",
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
      mensajeDelProgramador: "Busqueda de transferencias fallida",
    });
  }
};

export { createTransaction, getTransactions };

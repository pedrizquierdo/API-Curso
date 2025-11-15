import pool from "./config/db.js";

try {
  const [rows] = await pool.query("SELECT NOW() AS now");
  console.log("Conexión OK:", rows[0]);
} catch (err) {
  console.error("❌ ERROR DE CONEXIÓN:", err);
}

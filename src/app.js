import express from "express";
import pool from "./config/db.js";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT;

app.get("/", async (req, res) => {
  const [row] = await pool.query("SELECT 1 + 1 AS result");
  res.send(`¡Hola Mundo! La hora del servidor es: ${row[0].result}`).status(200);
});

app.get("/users", (req, res) => {
    res.send("¡Lista de usuarios! GET").status(200);
});

app.post("/users", (req, res) => {
    res.send("¡Usuario creado! POST").status(201);
});

app.delete("/users", (req, res) => {
    res.send("¡Usuario eliminado! DELETE").status(200);
});

app.put("/users", (req, res) => {
    res.send("¡Usuario actualizado! PUT").status(200);
});

app.patch("/users", (req, res) => {
    res.send("¡Usuario modificado! PATCH").status(200);
});


app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en el puerto: ${PORT} `);
});
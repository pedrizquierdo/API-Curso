import express from "express";
import pool from "./config/db.js";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";

dotenv.config();


const app = express();
const PORT = process.env.PORT;

app.disable("x-powered-by");
app.use(express.json());

app.get("/", async (req, res) => {
  try {
    const [row] = await pool.query("SELECT NOW() AS result");
    res.status(200).send(`¡Hola Mundo! La hora del servidor es: ${row[0].result}`);
  } catch (err) {
    console.error("Error en la DB:", err);
    res.status(500).send("Error en la base de datos");
  }
});

app.get("/users", async (req, res) => {
    try {
        const [rows] = await pool.query("SELECT name, email FROM users WHERE is_visible = TRUE");
        res.json(rows).status(200);
    } catch (error) {
        console.error(error); 
        res.status(500).json({error: "Error al obtener los usuarios"});
    }
});

app.post("/users", async (req, res) => {

  if (!req.body.name || !req.body.email || !req.body.password) {
    return res.status(400).json({ error: "Faltan datos obligatorios" });
  }
  
  const name = req.body.name;
  const email = req.body.email;
  const password = req.body.password;
  const password_hash = await bcrypt.hash(password, 10);

    try {
        const [result] = await pool.query("INSERT INTO users (name, email, password) VALUES (?, ?, ?)", [name, email, password_hash]);
        res.status(201).json({ message: "Usuario creado exitosamente", result: result });
    } catch (error) {
        console.error(error); 
        res.status(500).json({error: "Error al crear el usuario"});
    }
});

app.delete("/users/:id", async (req, res) => {
  if (!req.params.id) {
    return res.status(400).json({ error: "Falta el ID del usuario" });
  }
  const id = req.params.id;
    try {
      const [result] = await pool.query("UPDATE users SET is_visible = FALSE WHERE id = ?", [id]);
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: "Usuario no encontrado" });
      }
        res.status(200).json({ message: "Usuario eliminado exitosamente" });
    } catch (error) {
        console.error(error); 
        res.status(500).json({error: "Error al eliminar el usuario"});
    }
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
import express from "express";
import pool from "./config/db.js";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import cookie from "cookie-parser";


dotenv.config();


const app = express();
const PORT = process.env.PORT;

app.disable("x-powered-by");
app.use(express.json());
app.use(cookie());

app.get("/", async (req, res) => {
  try {
    const [row] = await pool.query("SELECT NOW() AS result");
    res.status(200).send(`¡Hola Mundo! La hora del servidor es: ${row[0].result}`);
  } catch (err) {
    console.error("Error en la DB:", err);
    res.status(500).send("Error en la base de datos");
  }
});

app.put("/users/softdelete/:id", async (req, res) => {
    const {id} = req.params;
    try {
        const [result] = await pool.query("UPDATE users SET is_visible = FALSE WHERE id_user = ?", [id]);
        res.status(200).json({message: "Usuario eliminado exitosamente", resultado: result});
    } catch (error) {
        console.error(error);
        res.status(500).json({error: "Error al eliminar el usuario"});    
    }   
});

app.put("/users/active/:id", async (req, res) => {
    const {id} = req.params;
    try {
        const [result] = await pool.query("UPDATE users SET is_visible = TRUE WHERE id_user = ?", [id]);
        res.status(200).json({message: "Usuario activado exitosamente", resultado: result});
    } catch (error) {
        console.error(error);
        res.status(500).json({error: "Error al activar el usuario"});    
    }   
});
    

app.put("/users/:id", async (req, res) => {
    const {id} = req.params;
    const {name, email} = req.body;
    try {
     const result = await pool.query("UPDATE users SET name = ?, email = ? WHERE id_user = ?", [name, email, id]);
     res.status(200).json({message: "Usuario actualizado exitosamente", resultado: result});
    } catch (error) {
        console.error(error);
        res.status(500).json({error: "Error al actualizar el usuario"});    
    }
});


app.post("/auth/login", async (req, res) => {
try {
    const {email, password} = req.body;
    const [rows] = await pool.query("SELECT id_user, name, email, password FROM users WHERE email = ?", [email]);
    if (rows.length === 0) {
        return res.status(401).json({error: "Credenciales inválidas"});
    }
    const user = rows[0];
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
        return res.status(401).json({error: "Credenciales inválidas"});
    }
    const token = jwt.sign({id: user.id_user}, process.env.JWT_SECRET, {expiresIn: "15m"});
    const refreshToken = jwt.sign({id: user.id_user}, process.env.JWT_REFRESH_SECRET, {expiresIn: "30d"});
    
    res.cookie("token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: 15 * 60 * 1000 // 15 minutos
    });

    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: 30 * 24 * 60 * 60 * 1000 // 30 días
    });

    res.json({message: "Inicio de sesión exitoso"});

} catch (error) {
    console.error(error);
    res.status(500).json({error: "Error al iniciar sesión"});
}    
});
    
app.post("/auth/register", async (req, res) => {
    const {name, email, password} = req.body;
    
    if (!name || !email || !password) {
        return res.status(400).json({error: "Todos los campos son obligatorios"});
    }
    try {
        const [emailExists] = await pool.query("SELECT id_user FROM users WHERE email = ?", [email]);
        if (emailExists.length > 0) {
            return res.status(400).json({error: "El email ya existe"});
        }   
        const password_hash = await bcrypt.hash(password, 10);  
        const [result] = await pool.query(
            "INSERT INTO users (name, email, password) VALUES (?, ?, ?)", [name, email, password_hash]
        );
        res.status(201).json({message: "Usuario creado exitosamente", resultado: result.insertId}); 
    } catch (error) {
        console.error(error);
        res.status(500).json({error: "Error al registrar el usuario"});
    }
});


app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en el puerto: ${PORT} `);
});
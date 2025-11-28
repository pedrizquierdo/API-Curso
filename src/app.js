import dotenv from "dotenv";
import express from "express";
import cookie from "cookie-parser";
import authRoutes from "./modules/auth/auth.routes.js";
import userRoutes from "./modules/users/user.routes.js";    

dotenv.config();

const app = express();
const PORT = process.env.PORT;

app.disable("x-powered-by")
app.use(express.json());    
app.use(cookie());    

// Rutas
app.use(authRoutes); // Rutas de autenticación
app.use(userRoutes); // Rutas de usuarios   

app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en el puerto: ${PORT}`);
});

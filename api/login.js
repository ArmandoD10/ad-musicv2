import { db } from "../db.js";
import bcrypt from "bcryptjs";

export default async function handler(req, res) {

    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");

    if (req.method === "OPTIONS") {
        return res.status(200).end();
    }

    if (req.method !== "POST") {
        return res.status(405).json({ error: "Método no permitido" });
    }

    const { usuario, contrasena } = req.body;

    if (!usuario || !contrasena) {
        return res.status(400).json({ error: "Datos incompletos" });
    }

    const result = await db.execute({
        sql: "SELECT * FROM usuarios WHERE email = ?",
        args: [usuario]
    });

    if (result.rows.length === 0) {
        return res.status(401).json({ error: "Usuario no existe" });
    }

    const user = result.rows[0];

    const match = await bcrypt.compare(contrasena, user.password);

    if (!match) {
        return res.status(401).json({ error: "Contraseña incorrecta" });
    }

    // Login OK
    return res.status(200).json({
        success: true,
        usuario: {
            id: user.id,
            nombre: user.nombre,
            email: user.email
        }
    });
}

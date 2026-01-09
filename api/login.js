import { db } from "../db.js";
import bcrypt from "bcryptjs";

export default async function handler(req, res) {
    try {
        if (req.method !== "POST") {
            return res.status(405).json({ error: "Método no permitido" });
        }

        const { email, password } = req.body;

        const result = await db.execute({
            sql: "SELECT * FROM usuario WHERE correo = ?",
            args: [email]
        });

        if (result.rows.length === 0) {
            return res.status(401).json({ error: "Usuario no existe" });
        }

        const usuario = result.rows[0];

        const valido = await bcrypt.compare(password, usuario.contrasena);

        if (!valido) {
            return res.status(401).json({ error: "Contraseña incorrecta" });
        }

        return res.json({
            success: true,
            usuario: {
                id: usuario.id,
                correo: usuario.correo
            }
        });

    } catch (err) {
        console.error("LOGIN ERROR:", err);
        return res.status(500).json({ error: "Error interno" });
    }
}



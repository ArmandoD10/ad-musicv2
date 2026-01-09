import { db } from "../db.js";
import cloudinary from "../cloudinary.js";

export default async function handler(req, res) {

  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  // GET canciones
  if (req.method === "GET") {
    const result = await db.execute(
      "SELECT * FROM canciones ORDER BY created_at DESC"
    );
    return res.status(200).json(result.rows);
  }

  // POST canción
  if (req.method === "POST") {
    const { nombre, artista, duracion, imagenBase64 } = req.body;

    const upload = await cloudinary.uploader.upload(imagenBase64, {
      folder: "musica"
    });

    await db.execute({
      sql: `
              INSERT INTO canciones (nombre, artista, duracion, imagen)
              VALUES (?, ?, ?, ?)
            `,
      args: [nombre, artista, duracion, upload.secure_url]
    });

    return res.status(201).json({ success: true });
  }

  res.status(405).json({ error: "Method not allowed" });
}

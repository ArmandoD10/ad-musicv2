import "dotenv/config";
import http from "http";
import { db } from "./db.js";
import cloudinary from "./cloudinary.js";

const server = http.createServer(async (req, res) => {

    // CORS
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");

    if (req.method === "OPTIONS") {
        res.writeHead(200);
        return res.end();
    }

    // GET canciones
    if (req.url === "/api/canciones" && req.method === "GET") {
        const result = await db.execute(
            "SELECT * FROM canciones ORDER BY created_at DESC"
        );

        res.writeHead(200, { "Content-Type": "application/json" });
        return res.end(JSON.stringify(result.rows));
    }

    // POST canción
    if (req.url === "/api/canciones" && req.method === "POST") {
        let body = "";

        req.on("data", chunk => body += chunk);

        req.on("end", async () => {
            try {
                const { nombre, artista, duracion, imagenBase64 } = JSON.parse(body);

                // Subir imagen
                const upload = await cloudinary.uploader.upload(imagenBase64, {
                    folder: "musica"
                });

                const imageUrl = upload.secure_url;

                // Guardar en Turso
                await db.execute({
                    sql: `
            INSERT INTO canciones (nombre, artista, duracion, imagen)
            VALUES (?, ?, ?, ?)
          `,
                    args: [nombre, artista, duracion, imageUrl]
                });

                res.writeHead(201, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ success: true }));

            } catch (err) {
                console.error("ERROR POST:", err);
                res.writeHead(500);
                res.end("Server error");
            }
        });

        return;
    }

    res.writeHead(404);
    res.end("Not found");
});

server.listen(3000, () => {
    console.log("🚀 Backend activo en http://localhost:3000");
});

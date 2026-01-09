alert("cargue");
document.getElementById("btnGuardarCancion").addEventListener("click", async (e) => {
    e.preventDefault(); // evitar que el form recargue la página

    const nombre = document.getElementById("songName").value.trim();
    const artista = document.getElementById("songartist").value.trim();
    const duracion = document.getElementById("songDuration").value.trim();
    const imagenInput = document.getElementById("songImage");

    if (!nombre || !artista || !duracion || !imagenInput.files[0]) {
        alert("Todos los campos son obligatorios.");
        return;
    }

    const formData = new FormData();
    formData.append("nombre", nombre);
    formData.append("artista", artista);
    formData.append("duracion", duracion);
    formData.append("imagen", imagenInput.files[0]);

    const respImagen = await fetch("/api/agregar-cancion", {
        method: "POST",
        body: formData
    });

    const data = await respImagen.json();
    console.log("Respuesta del servidor:", data);

    if (data.success) {
        alert("Canción guardada correctamente 🎶");
        document.getElementById("songModal").style.display = "none";
    } else {
        alert("Error al guardar la canción");
    }
});

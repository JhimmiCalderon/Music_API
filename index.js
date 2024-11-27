// Importar conexión a base de datos
const connection = require("./database/connection");

// Importar dependencias
const express = require("express");
const cors = require("cors");

// Mensaje de bievenida
console.log("La API REST para la app de musica se a inicializado!!")

// Ejecutar conexion a la bd
connection();

// Crear servidor de node
const app = express();
const port = 5000;

// configurar cors
app.use(cors());

// Convertit los datos del body a objetos js
app.use(express.json());
app.use(express.urlencoded({extended: true}));

// Cargar configuración de rutas
const UserRoutes = require("./routes/user");
const ArtistRoutes = require("./routes/artist");
const AlbumRoutes = require("./routes/album");
const SongRoutes = require("./routes/song");

// Usar estas rutas dentro de express
app.use("/api/user", UserRoutes);
app.use("/api/artist", ArtistRoutes);
app.use("/api/album", AlbumRoutes);
app.use("/api/song", SongRoutes);

// Ruta de prueba 
app.get("/ruta_probando", (req,res) => {

    return res.status(200).send({
        "id":12,
        "name": "Jam"
    });
});

// Poner el servidor a ecuchar las peticiones http
app.listen(port, () => {
    console.log("Servidor de node esta ecuchando en el port: ", port);
});
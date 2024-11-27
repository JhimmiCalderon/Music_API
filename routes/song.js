// Importar dependencias
const express = require("express");

// Cargar Router
const router = express.Router(); 

// Importar controlador
const Songcontroller = require("../controllers/song");

// Definir rutas
router.get("/pruba", Songcontroller.prueba);

// Exportar router
module.exports = router;

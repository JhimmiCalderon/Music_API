// Importar dependencias
const express = require("express");

// Cargar Router
const router = express.Router(); 

// Importar controlador
const Artistcontroller = require("../controllers/artist");

// Definir rutas
router.get("/pruba", Artistcontroller.prueba);

// Exportar router
module.exports = router;

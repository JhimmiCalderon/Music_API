// Importar dependencias
const express = require("express");

// Cargar Router
const router = express.Router(); 

// Importar controlador
const Albumcontroller = require("../controllers/album");

// Definir rutas
router.get("/pruba", Albumcontroller.prueba);

// Exportar router
module.exports = router;

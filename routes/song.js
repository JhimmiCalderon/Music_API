// Importar dependencias
const express = require("express");
const check = require("../middlewares/auth");

// Cargar Router
const router = express.Router(); 

// Importar controlador
const Songcontroller = require("../controllers/song");



// Definir rutas
router.get("/pruba", Songcontroller.prueba);
router.post("/save", check.auth, Songcontroller.save);  

// Exportar router
module.exports = router;

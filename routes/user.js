// Importar dependencias
const express = require("express");

// Cargar Router
const router = express.Router(); 

// Importar controlador
const Usercontroller = require("../controllers/user");

// Definir rutas
router.get("/pruba", Usercontroller.prueba);
router.post("/register", Usercontroller.register);
router.post("/login", Usercontroller.login);

// Exportar router
module.exports = router;

// Importar dependencias
const express = require("express");
const check = require("../middlewares/auth");


// Cargar Router
const router = express.Router(); 

// Importar controlador
const Albumcontroller = require("../controllers/album");

// Definir rutas
router.get("/pruba", Albumcontroller.prueba);
router.post("/save", check.auth, Albumcontroller.save);
router.post("/one/:id", check.auth, Albumcontroller.oneAlbum);
router.post("/list/:artistId", check.auth, Albumcontroller.list);
router.put("/update/:id", check.auth, Albumcontroller.update);


// Exportar router
module.exports = router;

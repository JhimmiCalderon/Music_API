// Importar dependencias
const express = require("express");
const check = require("../middlewares/auth");

// Cargar Router
const router = express.Router(); 

// Importar controlador
const Usercontroller = require("../controllers/user");

// Configuración de suida

const multer = require("multer");

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./uploads/profiles/")
    },
    filename: (req, file, cb) => {
        cb(null, "profile-"+Date.now()+"-"+file.originalname);
    }
});
// uploads funciona como si fuera un middleware
const uploads = multer({storage});

// Definir rutas
router.get("/pruba", Usercontroller.prueba);
router.post("/register", Usercontroller.register);
router.post("/login", Usercontroller.login);
router.get("/profile/:id", check.auth, Usercontroller.profile);
router.put("/update/", check.auth, Usercontroller.update);
router.post("/upload", [check.auth, uploads.single("file0")], Usercontroller.upload);
router.get("/avatars/:file", Usercontroller.perfilFile);
// Exportar router
module.exports = router;

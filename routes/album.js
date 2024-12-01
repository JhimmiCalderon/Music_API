// Importar dependencias
const express = require("express");
const check = require("../middlewares/auth");


// Cargar Router
const router = express.Router(); 

// Importar controlador
const Albumcontroller = require("../controllers/album");

// Configuracion de subida
const multer = require("multer");

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./uploads/albums")
    },
    filename: (req, file, cb) => {
        cb(null, "albums-" +Date.now()+"-"+file.originalname);
    }
});
const uploads = multer ({storage});

// Definir rutas
router.get("/pruba", Albumcontroller.prueba);
router.post("/save", check.auth, Albumcontroller.save);
router.post("/one/:id", check.auth, Albumcontroller.oneAlbum);
router.post("/list/:artistId", check.auth, Albumcontroller.list);
router.put("/update/:id", check.auth, Albumcontroller.update);
router.post("/upload/:id",[check.auth, uploads.single("file0")], Albumcontroller.upload);
router.get("/albumFile/:file", check.auth, Albumcontroller.albumFile);
router.delete("/remove/:id",check.auth, Albumcontroller.remove);


// Exportar router
module.exports = router;

// Importar dependencias
const express = require("express");
const check = require("../middlewares/auth");

// Cargar Router
const router = express.Router(); 

// Importar controlador
const Songcontroller = require("../controllers/song");

// Configuracion de subida
const multer = require("multer");

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./uploads/songs")
    },
    filename: (req, file, cb) => {
        cb(null, "songs-" +Date.now()+"-"+file.originalname);
    }
});
const uploads = multer ({storage});



// Definir rutas
router.get("/pruba", Songcontroller.prueba);
router.post("/save", check.auth, Songcontroller.save);  
router.post("/listensong/:id", check.auth, Songcontroller.song);
router.post("/list/:albumId", check.auth, Songcontroller.songLists);
router.put("/update/:id", check.auth, Songcontroller.update);
router.delete("/remove/:id", check.auth, Songcontroller.remove);
router.post("/upload/:id",[check.auth, uploads.single("file0")], Songcontroller.upload);
router.get("/sound/:file", check.auth, Songcontroller.sound);


// Exportar router
module.exports = router;

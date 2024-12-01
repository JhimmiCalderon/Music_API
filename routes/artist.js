// Importar dependencias
const express = require("express");
const check = require("../middlewares/auth");


// Cargar Router
const router = express.Router(); 

// Importar controlador
const Artistcontroller = require("../controllers/artist");


// Configuracion de subida
const multer = require("multer");

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./uploads/artists")
    },
    filename: (req, file, cb) => {
        cb(null, "artist-" +Date.now()+"-"+file.originalname);
    }
});
const uploads = multer ({storage});

// Definir rutas
router.get("/pruba", Artistcontroller.prueba);
router.post("/save", check.auth, Artistcontroller.save); 
router.post("/one/:id", check.auth, Artistcontroller.oneArtist); 
router.post("/listArtist/:page?", check.auth, Artistcontroller.listArtist);
router.put("/update/:id", check.auth, Artistcontroller.update);
router.delete("/remove/:id", check.auth, Artistcontroller.remove);
router.post("/upload/:id",[check.auth, uploads.single("file0")], Artistcontroller.upload);
router.get("/artistFile/:file", check.auth, Artistcontroller.artistFile );

// Exportar router
module.exports = router;


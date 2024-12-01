const Song = require("../models/song");

// accion de pruba
const prueba = (req,res) => {
    return res.status(200).send({
        status: "success",
        message: "Mensaje enviado desde: controllers/song.js"
    })
}
// Guardar una canción
const save = async (req, res) => {
    try {
        // Recoger datos en el body
        let params = req.body;

        // Crear objeto que voy a guardar 
        let song = new Song(params);

        // Guardarlo
        const songStored = await song.save();

        return res.status(200).send({
            status: "success",
            message: "Song saved",
            song: songStored
        });
    }
    catch (err) {
        console.log(err)
        return res.status(500).send({
            status: "err",
            message: "An internal oceurred error on the server"
        });
    }
}

// Exportar acciones
module.exports= {
    prueba, 
    save
}
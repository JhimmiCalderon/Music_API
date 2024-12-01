const Album = require("../models/album");

// accion de pruba
const prueba = (req,res) => {
    return res.status(200).send({
        status: "success",
        message: "Mensaje enviado desde: controllers/album.js"
    })
}

const save = async (req, res) => {
    try {
        // Sacar datos enviados en el body
        let params = req.body;

        // Crear objetos
        let album = new Album(params);

        // Guardar el objeto
        const albumStored = await album.save();

        return res.status(200).send({
            status: "success",
            message: "successfully created album",
            album: albumStored
        })
    } 
    catch (err) {
        return res.status(500).send({
            status: "err",
            message: "An internal error ocurred on the server"
        });
    }
}
// Mostrar un album
const oneAlbum = async (req, res) => {
    try {
        //Sacar un párametro url de(el id enviado el del album)
        const albumId = req.params.id;

        // Find para buscar el album
        const album = await Album.findById(albumId).populate("artist");

        // Respuesta por si no exite le album
        if (!album) {
            return res.status(404).send({
                status: "err",
                message: "Album does not exist"
            });
        }
        // Devolver respuesta
        return res.status(200).send({
            status: "succes",
            message: "Album found successfully",
            album
        });
    }
    catch (err) {
        console.log(err)
        return res.status(500).send({
            status: "err",
            message: "An internal ocurred error on the server"
        });
    }
}

// Mostar todos los artistas
const list = async (req,res) => {
    try {
        // Sacar el id del artista de la url
        const artistId = req.params.artistId;
       
         // Sacar todos los albums de un artistas
        if (!artistId) {
        
            return res.status(404).send({
                status: "err",
                message: " artist does not exist"
            });
        }

       
        const albumOfArtist = await Album.find({artist: artistId}).populate("artist");

        if (!albumOfArtist) {
            return res.status(404).send({
                status: "err",
                message: "Album does not exist"
            });
        }
        // Devolver respuesta
        return res.status(200).send({
            status: "succes",
            message: "Album the artist found successfully",
            albumOfArtist
        });
    }
    catch (err) {
        console.log(err)
        return res.status(500).send({
            status: "err",
            message: "An internal ocurred error on the server"
        });
    }
}


// Metodo de actualizar un album
const update = async (req, res) => {
    try {
        // Sacar id de la url
        let id = req.params.id;

        //  Recoger datos del body
        let data = req.body;

        // Buscar y actualizar el album
        const albumUpdate = await Album.findByIdAndUpdate(id, data, {new: true});

        if (!albumUpdate) {
            return res.status(404).send({
                status: "err",
                message: "Album not found"
            });
        }

        return res.status(200).send({
            status: "success",
            message: "Successfully updated album",
            albumUpdate
        });
    }
    catch (err) {
        console.log(err)
        return res.status(500).send({
            status: "err",
            message: "An internal  ocurred error on the server"
        });
    }
}
// Exportar acciones
module.exports= {
    prueba,
    save,
    oneAlbum,
    list,
    update

}
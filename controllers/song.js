const fs = require("fs");
const path = require("path");
const Song = require("../models/song");

// accion de pruba
const prueba = (req, res) => {
  return res.status(200).send({
    status: "success",
    message: "Mensaje enviado desde: controllers/song.js",
  });
};
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
      song: songStored,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).send({
      status: "err",
      message: "An internal oceurred error on the server",
    });
  }
};
// Mostrar una cancion
const song = async (req, res) => {
  try {
    //  Recoger id de la url
    let songId = req.params.id;

    // Find para buscar la cancion
    const song = await Song.findById(songId).populate("album");

    if (!song) {
      return res.status(404).send({
        status: "err",
        message: "song does not exist",
      });
    }
    return res.status(200).send({
      status: "success",
      message: "found song",
      song,
    });
  } catch (err) {
    return res.status(500).send({
      status: "err",
      message: "An internal ocurred error on the server",
    });
  }
};

// Mostrar todas ls canciiones de una album
const songLists = async (req, res) => {
  try {
    // Recoger id del album enviado
    let albumId = req.params.albumId;

    // Sacar todos las canciones de un album
    const songOfAlmbum = await Song.find({ album: albumId })
      .sort("track")
      .populate("album");

    // Devolvemos repsuat por si no hay cancion en el album
    if (!songOfAlmbum || songOfAlmbum.length == 0) {
      return res.status(404).send({
        status: "err",
        message: " there is no song to listen",
      });
    }

    return res.status(200).send({
      status: "success",
      message: "Founs song list",
      songOfAlmbum,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).send({
      status: "err",
      message: "An internal ocurred error on the server",
    });
  }
};

// Actualizar cancion
const update = async (req, res) => {
  try {
    // Recogr id de la cancion
    let id = req.params.id;
    // Recoger datos del body
    let data = req.body;

    //Buscar y actualizar artista
    const updateSong = await Song.findByIdAndUpdate(id, data, {new: true});

    if(!updateSong) {
        return res.status(500).send({
            status: "error",
            message: "Song not found"
        });
    }
    return res.status(200).send({
      status: "success",
      message: "Successfully updated user",
    });
  } catch (err) {
    console.log(err);
    return res.status(500).send({
      status: "err",
      message: "An internal ocurred error on the server",
    });
  }
};

// Eliminar una cancion 
const remove = async (req, res) => {
    try {
        // Sacar el id del artista de la url
        let removeSong = req.params.id;

        // Hacer consulta para buscar y eliminar el artistas con await
        const song = await Song.findByIdAndDelete(removeSong);
       

        // Devolver resultado
        return res.status(200).send({
            status: "success",
            message: "Removed song",
            song
        });
    }
    catch (error) {
        return res.status(200).send({
            status: "error",
            message: "An intela error ocurred on the server"
        });
    }
}
// Subir cancion
const upload = async (req, res) => {
    try {
  
      // Configuracion de subida (multer)
      // Recoger artist id
      let songId = req.params.id;
  
      // Recoger fichero de imagen y comprobar si existe
      if(!req.file){
        return res.status(404).send({
          status:"error",
          message: "image not included"
        });
      }
  
      // Conseguir el nombre del archivo
      let sound = req.file.originalname;
  
      // Sacara info de la imagen 
      const soundSplit = sound.split("\.");
      const extension = soundSplit[1];
  
      // Comprobar si la extension es valida 
      if(extension != "mp3" && extension != "ogg" ){
  
         
      // Borrar archivo subido
        const filePath = req.file.path;
        const fileDelete = fs.unlinkSync(filePath); // Este metodo de fs permite eliminar un archivo de manera asincrona
       // Devoolver respuesta negativa
        return res.status(400).send({
          status: "error",
          message:"Invalid file extension"
        })
      }
      // Si es corrrecto, guardar la imagne en la DB
      const songUpdated = await Song.findOneAndUpdate(
        { _id: songIdId }, // Asegúrate de que esto coincide con tu esquema
        { image: req.file.filename },
        { new: true } // Para devolver el usuario actualizado
      );
  
      if (!albumUpdated) {
        return res.status(500).send({
          status: "error",
          message: "Error when uploading song",
        });
      }
  
      // Devolver respuesta 
  
      return res.status(200).send({
        status: "success",
        message: "successful upload song",
        album: songUpdated,
        file: req.file,
       
      })
    } catch (error) {
      return res.status(500).send({
        status: "error",
        message: "An internal error ocurred on the server"
      })
    }
  }
  // Mostrar cancion
  
  const sound = async (req, res) => {
    try {
      // Sacar el parámetro de la URL
      const file = req.params.file;
  
      // Establecer la ruta completa del archivo
      const filePath = "./uploads/songs/" + file;
  
      // Comprobar si el archivo existe usando aqui usamos metodo fs.promises.stat
      await fs.promises.stat(filePath); // Si el archivo no existe, lanzará un error
  
      // Si el archivo existe, devolver la imagen
      return res.status(200).sendFile(path.resolve(filePath));
  
    } catch (error) {
      console.log(error)
      // Verificar específicamente el error ('ENOENT' archivo no encontrado)
      if (error.code === 'ENOENT') {
        return res.status(404).send({
          status: "error",
          message: "sound does not exist",
          
        });
      }
  
      //  En caso de otro error responder 
      
      return res.status(500).send({
        status: "error",
        message: "An internal error ocurred on the server"
      });
    }
  };
  
// Exportar acciones
module.exports = {
  prueba,
  save,
  song,
  songLists,
  update,
  remove,
  upload,
  sound
};

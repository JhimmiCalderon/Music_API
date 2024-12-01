const fs = require("fs");
const path = require("path");
const Album = require("../models/album");
const Song =require("../models/song");

// accion de pruba
const prueba = (req, res) => {
  return res.status(200).send({
    status: "success",
    message: "Mensaje enviado desde: controllers/album.js",
  });
};

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
      album: albumStored,
    });
  } catch (err) {
    return res.status(500).send({
      status: "err",
      message: "An internal error ocurred on the server",
    });
  }
};
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
        message: "Album does not exist",
      });
    }
    // Devolver respuesta
    return res.status(200).send({
      status: "succes",
      message: "Album found successfully",
      album,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).send({
      status: "err",
      message: "An internal ocurred error on the server",
    });
  }
};

// Mostar todos los artistas
const list = async (req, res) => {
  try {
    // Sacar el id del artista de la url
    const artistId = req.params.artistId;

    // Sacar todos los albums de un artistas
    if (!artistId) {
      return res.status(404).send({
        status: "err",
        message: " artist does not exist",
      });
    }

    const albumOfArtist = await Album.find({ artist: artistId }).populate(
      "artist"
    );

    if (!albumOfArtist) {
      return res.status(404).send({
        status: "err",
        message: "Album does not exist",
      });
    }
    // Devolver respuesta
    return res.status(200).send({
      status: "succes",
      message: "Album the artist found successfully",
      albumOfArtist,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).send({
      status: "err",
      message: "An internal ocurred error on the server",
    });
  }
};

// Metodo de actualizar un album
const update = async (req, res) => {
  try {
    // Sacar id de la url
    let id = req.params.id;

    //  Recoger datos del body
    let data = req.body;

    // Buscar y actualizar el album
    const albumUpdate = await Album.findByIdAndUpdate(id, data, { new: true });

    if (!albumUpdate) {
      return res.status(404).send({
        status: "err",
        message: "Album not found",
      });
    }

    return res.status(200).send({
      status: "success",
      message: "Successfully updated album",
      albumUpdate,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).send({
      status: "err",
      message: "An internal  ocurred error on the server",
    });
  }
};
// Subir Imagenes
const upload = async (req, res) => {
  try {
    // Configuracion de subida (multer)
    // Recoger artist id
    let albumId = req.params.id;

    // Recoger fichero de imagen y comprobar si existe
    if (!req.file) {
      return res.status(404).send({
        status: "error",
        message: "image not included",
      });
    }

    // Conseguir el nombre del archivo
    let image = req.file.originalname;

    // Sacara info de la imagen
    const imageSplit = image.split(".");
    const extension = imageSplit[1];

    // Comprobar si la extension es valida
    if (
      extension != "png" &&
      extension != "jpg" &&
      extension != "jpeg" &&
      extension != "gif"
    ) {
      // Borrar archivo subido
      const filePath = req.file.path;
      const fileDelete = fs.unlinkSync(filePath); // Este metodo de fs permite eliminar un archivo de manera asincrona
      // Devoolver respuesta negativa
      return res.status(400).send({
        status: "error",
        message: "Invalid file extension",
      });
    }
    // Si es corrrecto, guardar la imagne en la DB
    const albumUpdated = await Album.findOneAndUpdate(
      { _id: albumId }, // Asegúrate de que esto coincide con tu esquema
      { image: req.file.filename },
      { new: true } // Para devolver el usuario actualizado
    );

    if (!albumUpdated) {
      return res.status(500).send({
        status: "error",
        message: "Error when uploading image",
      });
    }

    // Devolver respuesta

    return res.status(200).send({
      status: "success",
      message: "successful upload image",
      album: albumUpdated,
      file: req.file,
      image,
    });
  } catch (error) {
    return res.status(500).send({
      status: "error",
      message: "An internal error ocurred on the server",
    });
  }
};
// Mostrar Foto perfil

const albumFile = async (req, res) => {
  try {
    // Sacar el parámetro de la URL
    const file = req.params.file;

    // Establecer la ruta completa del archivo
    const filePath = "./uploads/albums/" + file;

    // Comprobar si el archivo existe usando aqui usamos metodo fs.promises.stat
    await fs.promises.stat(filePath); // Si el archivo no existe, lanzará un error

    // Si el archivo existe, devolver la imagen
    return res.status(200).sendFile(path.resolve(filePath));
  } catch (error) {
    console.log(error);
    // Verificar específicamente el error ('ENOENT' archivo no encontrado)
    if (error.code === "ENOENT") {
      return res.status(404).send({
        status: "error",
        message: "file does not exist",
      });
    }

    //  En caso de otro error responder

    return res.status(500).send({
      status: "error",
      message: "An internal error ocurred on the server",
    });
  }
};

// Borrar album
const remove = async (req, res) => {
  try {
    // Sacar el id del artista de la url
    let albumId = req.params.id;

   
    // Remove de albums
    const albumRemove = await Album.find(albumId).deleteOne();
    const SongRemove = await Song.find({album: albumId}).deleteOne();

    // Devolver resultado
    return res.status(200).send({
      status: "success",
      message: "Removed artist",
      albumRemove,
      SongRemove

    });
  } catch (err) {
    console.log(err)
    return res.status(500).send({
      status: "error",
      message: "An internal error ocurred on the server",
    });
  }
};

// Exportar acciones
module.exports = {
  prueba,
  save,
  oneAlbum,
  list,
  update,
  upload,
  albumFile,
  remove
};

const artist = require("../models/artist");
const Artist = require("../models/artist");
const mongoosePaginate = require("mongoose-pagination");

// accion de pruba
const prueba = (req, res) => {
  return res.status(200).send({
    status: "success",
    message: "Mensaje enviado desde: controllers/artist.js",
  });
};

// Guardar artista
const save = async (req, res) => {
  try {
    // Recoger datos del body
    let params = req.body;

    // Crear el objeto a guardar
    let artist = new Artist(params);

    // Guardarlo
    const artistStored = await artist.save();

    return res.status(200).send({
      status: "success",
      message: "Artista creado exitosamente",
      artist: artistStored,
    });
  } catch (error) {
    return res.status(500).send({
      status: "error",
      message:
        "Ocurrio un error interno en el servidor(para guardar el artista)",
    });
  }
};

const oneArtist = async (req, res) => {
  try {
    // Sacar un parametro por url
    let artistId = req.params.id;

    // Find
    const artist = await Artist.findById(artistId);

    if (!artist) {
      return res.status(404).send({
        status: "error",
        message: "No existe el artista",
      });
    }

    return res.status(200).send({
      status: "success",
      message: "Mostrar artista",
      artist,
    });
  } catch (error) {
    return res.status(500).send({
      status: "error",
      message: "Ocurrio un error interno en el servidor",
    });
  }
};

// Mostrar muchos artistas
const listArtist = async (req, res) => {
  try {
    // sacar posible página
    const page = parseInt(req.params.page) || 1;
    //elementos por página
    const itemsPerPage = 5;

    //Find, ordenar y paginar
    const artists = await Artist.find({}, "")
      .sort("name") // Ordenar de forma alfabetico
      .skip((page - 1) * itemsPerPage) // Calcular elementos por pagina
      .limit(itemsPerPage)
      .exec(); // Para limitar el número de resultado

    if (!artists) {
      return res.status(404).send({
        status: "error",
        message: "No hay artistas",
      });
    }

    // Contar el total de registros
    const total = await Artist.countDocuments();

    // Devolver resultado
    return res.status(200).send({
      status: "succes",
      message: "Listado de usuarios",
      artists,
      page,
      totalArtist: total,
      itemsPerPage,
      totalPages: Math.ceil(total / itemsPerPage),
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      status: "error",
      message: "Ocurrio un error internor en el servidor",
    });
  }
};
// Editar artistas
const update = async (req, res) => {
  try {
    // Recoger id artista url
    const artistId = req.params.id;

    // Recoger datos del body
    const data = req.body;

    // Buscar y actualizar artista
    const artist = await Artist.findByIdAndUpdate(artistId, data, {
      new: true,
    });
    if (!artist) {
      return res.status(500).send({
        status: "error",
        message: "User not found",
      });
    }
    return res.status(200).send({
      status: "success",
      message: "Successfully updated user",
      artist,
    });
  } catch (error) {
    return res.status(500).send({
      status: "error",
      message: "An internal error occurred on the server",
    });
  }
};

// Metodo Eliminar Artista

const remove = async (req, res) => {
  try {
    // Sacar el id del artista de la url
    let removeArtistId = req.params.id;

    // Hacer consulta para buscar y eliminar el artistas con await
    const removedartist = await Artist.findByIdAndDelete(removeArtistId);
    // Remove de albums
    // Remove de songs

    // Devolver resultado
    return res.status(200).send({
      status: "success",
      message: "Removed artist",
      removedartist,
    });
  } catch (error) {
    return res.status(200).send({
      status: "error",
      message: "An internal error ocurred on the server",
    });
  }
};

// Subir Imagenes
const upload = async (req, res) => {
    try {
  
      // Configuracion de subida (multer)
      // Recoger artist id
      let artistId = req.params.id;
  
      // Recoger fichero de imagen y comprobar si existe
      if(!req.file){
        return res.status(404).send({
          status:"error",
          message: "image not included"
        });
      }
  
      // Conseguir el nombre del archivo
      let image = req.file.originalname;
  
      // Sacara info de la imagen 
      const imageSplit = image.split("\.");
      const extension = imageSplit[1];
  
      // Comprobar si la extension es valida 
      if(extension != "png" && extension != "jpg" && extension != "jpeg" && extension != "gif" ){
  
         
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
      const artistUpdated = await Artist.findOneAndUpdate(
        { _id: artistId }, // Asegúrate de que esto coincide con tu esquema
        { image: req.file.filename },
        { new: true } // Para devolver el usuario actualizado
      );
  
      if (!artistUpdated) {
        return res.status(500).send({
          status: "error",
          message: "Error when uploading image",
        });
      }
  
      // Devolver respuesta 
  
      return res.status(200).send({
        status: "success",
        message: "successful upload image",
        artist: artistUpdated,
        file: req.file,
        image,
      })
    } catch (error) {
      return res.status(500).send({
        status: "error",
        message: "An internal error ocurred on the server"
      })
    }
  }
  // Mostrar Foto perfil
  
  const artistFile = async (req, res) => {
    try {
      // Sacar el parámetro de la URL
      const file = req.params.file;
  
      // Establecer la ruta completa del archivo
      const filePath = "./uploads/artists/" + file;
  
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
          message: "file does not exist",
          
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
  oneArtist,
  listArtist,
  update,
  remove,
  upload,
  artistFile

};

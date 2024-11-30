// Importaciones
const fs = require("fs");
const path = require("path");
const bcrypt = require("bcrypt");
const validate = require("../helpers/validate");
const User = require("../models/user");
const jwt = require("../helpers/jwt");

// acción de pruba
const prueba = (req, res) => {
  return res.status(200).send({
    status: "success",
    message: "Mensaje enviado desde: controllers/user.js",
  });
};

// Registro
const register = async (req, res) => {
  // Recoger datos de la petición
  let params = req.body;
  try {
    // Comprbar que me llegan bien
    if (!params.name || !params.email || !params.password || !params.nick) {
      return res.status(400).send({
        status: "error",
        message: "Faltan datos obligatorios",
      });
    }
    // validacion de datos
    try {
      validate(params); // Importa la función validate desde helpers
    } catch (validationError) {
      return res.status(400).json({
        status: "error",
        message: validationError.message, // Devuelve el mensaje específico de validación
      });
    }

    // Control usuarios duplicados
    const existingUser = await User.findOne({
      $or: [
        // comprobar si alguno de esto se cumple
        { email: params.email.toLowerCase() },
        { nick: params.nick.toLowerCase() },
      ],
    });

    if (existingUser) {
      // verificar duplicado es por `email` o `nick`
      const duplicatedField = existingUser.email === email ? "email" : "nick";
      return res.status(400).send({
        status: "error",
        message: `El ${duplicatedField} ya está registrado.`,
      });
    }

    // Cifrar la contraseña
    let pwd = await bcrypt.hash(params.password, 10);
    params.password = pwd;

    // Crear ojeto del usuario
    let userSave = new User(params);

    // Guardar usuario en la BD
    const newUser = await userSave.save();

    // Limpiar el objeto a devolver
    let userToSave = userSave.toObject();
    delete userToSave.password;
    delete userToSave.role;

    // Devolver un resultado
    return res.status(200).send({
      status: "success",
      message: "Registro exitoso",
      user: userToSave,
    });
  } catch (error) {
    // Manejar errores de índices únicos (E11000)
    if (error.code === 11000) {
      const duplicatedField = Object.keys(error.keyValue)[0];
      return res.status(400).send({
        status: "error",
        message: `El ${duplicatedField} ya está registrado: ${error.keyValue[duplicatedField]}`,
      });
    }

    // En caso de otros errores internos

    return res.status(500).send({
      status: "error",
      message: "Ocurrió un error interno en el servidor",
    });
  }
};

// login
const login = async (req, res) => {
  try {
    // Recoger los parametros de la peticion
    let params = req.body;

    // Comprobar que me llegan
    if (!params.email || !params.password) {
      return res.status(400).send({
        status: "error",
        message: "Faltan datos por enviar ",
      });
    }
    // Buscar en la BD si existe el email
    const user = await User.findOne({ email: params.email }).select(
      "+password +role"
    );
    if (!user) {
      // Si no se encuentra el usuario
      return res.status(404).send({
        status: "error",
        message: "No existe el usuario",
      });
    }
    // Comprobar su contraseña
    const pwd = await bcrypt.compare(params.password, user.password);

    if (!pwd) {
      return res.status(400).send({
        status: "error",
        message: "Login incorrecto",
      });
    }

    // Limpiar objeto
    let identityUser = user.toObject();
    delete identityUser.password;
    delete identityUser._id;
    delete identityUser.role;
    delete identityUser.__v;
    delete identityUser.image;
    delete identityUser.created_at;

    // Conseguir token JWT
    const token = jwt.createToken(user);

    return res.status(200).send({
      status: "success",
      message: "Sección iniciada,token enviado",
      user: identityUser,
      token: token,
    });
  } catch (error) {
    return res.status(500).send({
      status: "error",
      message: "Ocurrio un error interno en el servidor",
    });
  }
};

// mostar Perfil
const profile = async (req, res) => {
  try {
    // Recoger id usuarios url
    let id = req.params.id;

    // Consulta para sacar los datos del perfil
    const userProfile = await User.findById(id)
      .select("-password -role -__v") // para excluir campos
      .exec();

    // Verificar si el usuario no existe
    if (!userProfile) {
      return res.status(404).send({
        status: "error",
        message: "Usuaro no existe",
      });
    }

    // Devolver resultado
    return res.status(200).send({
      status: "success",
      id,
      user: userProfile,
    });
  } catch (error) {
    return res.status(500).send({
      status: "error",
      message: "Ocurrio un error en el servidor",
    });
  }
};

// Actualizar
const update = async (req, res) => {
  try {
    // Recoger datos del usuario identificado
    let userIdentity = req.user;
    
    // Recoger datos a actualizar
    let userToUpdate = req.body;

    // Eliminar campos que no deben ser actualizados
    delete userToUpdate.iat;
    delete userToUpdate.exp;
    delete userToUpdate.role;

    // Comprobar si el email o nick ya existen en otro usuario
    const users = await User.find({
      $or: [
        { email: userToUpdate.email?.toLowerCase() },
        { nick: userToUpdate.nick?.toLowerCase() },
      ],
    });

    // Validar si hay duplicados en otros usuarios
    let userIsset = users.some(
      (user) => user._id.toString() !== userIdentity.id
    );

    if (userIsset) {
      return res.status(400).json({
        status: "error",
      });
    }

    // Cifrar la contraseña si se envía
    if (userToUpdate.password) {
      let pwd = await bcrypt.hash(userToUpdate.password, 10);
      userToUpdate.password = pwd;
    }

    // Actualizar usuario en la base de datos
    const userUpdated = await User.findByIdAndUpdate(
      userIdentity.id,
      userToUpdate,
      { new: true }
    );

    // Comprobar si la actualización fue exitosa
    if (!userUpdated) {
      return res.status(500).json({
        status: "error",
        message: "Error al actualizar el usuario",
      });
    }

    // Devolver una respuesta exitosa
    return res.status(200).json({
      status: "success",
      message: "Usuario actualizado correctamente",
      user: userUpdated,
    });
  } catch (error) {
       // Manejar errores de índices únicos (E11000)
       if (error.code === 11000) {
        const duplicatedField = Object.keys(error.keyValue)[0];
        return res.status(400).send({
          status: "error",
          message: `El ${duplicatedField} ya está registrado: ${error.keyValue[duplicatedField]}`,
        });
      }

      // En caso de otros errores internos
      return res.status(500).send({
        status: "error",
        message: "Ocurrió un error interno en el servidor",
      });
    }
};

// Subir imagen de perfil

const upload = async (req, res) => {
  try {

    // Configuracion de subida (multer)

    // Recoger fichero de imagen y comprobar si existe
    if(!req.file){
      return res.status(404).send({
        status:"error",
        message: "Peticion no inclye la imagen"
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
        message:"Extension del fichero invalido"
      })
    }
    // Si es corrrecto, guardar la imagne en la DB
    const userUpdated = await User.findOneAndUpdate(
      { _id: req.user.id }, // Asegúrate de que esto coincide con tu esquema
      { image: req.file.filename },
      { new: true } // Para devolver el usuario actualizado
    );

    if (!userUpdated) {
      return res.status(500).send({
        status: "error",
        message: "Error en la subida del avatar: Usuario no encontrado",
      });
    }

    // Devolver respuesta 

    return res.status(200).send({
      status: "success",
      message: "Metodo subir Imagen",
      user: userUpdated,
      file: req.file,
      image,
    })
  } catch (error) {
    return res.status(500).send({
      status: "error",
      message: "Ocurrio un error interno en el servidor"
    })
  }
}
// Mostrar Foto perfil

const perfilFile = async (req, res) => {
  try {
    // Sacar el parámetro de la URL
    const file = req.params.file;

    // Establecer la ruta completa del archivo
    const filePath = "./uploads/profiles/" + file;

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
        message: "El archivo no existe",
        
      });
    }

    //  En caso de otro error responder 
    
    return res.status(500).send({
      status: "error",
      message: "Ocurrió un error interno en el servidor"
    });
  }
};


// Exportar acciones
module.exports = {
  prueba,
  register,
  login,
  profile,
  update,
  upload,
  perfilFile
};

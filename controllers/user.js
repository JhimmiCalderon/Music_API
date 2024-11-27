// Importaciones
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
    console.log(params.email, params.nick);

    // Control usuarios duplicados
    const existingUser = await User.findOne({
      $or: [
        // comprobar si alguno de esto se cumple
        { email: params.email.toLowerCase() },
        { nick: params.nick.toLowerCase() },
      ],
    });

    if (existingUser) {
      // Determinar si el duplicado es por `email` o `nick`
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
      error: error.message,
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
  const user = await User.findOne({ email: params.email })
                         .select("+password +role");
        if (!user) {
            // Si no se encuentra el usuario
            return res.status(404).send({
                status: "error",
                message: "No existe el usuario",
            });
        }
    // Comprobar su contraseña
    const pwd = await bcrypt.compare(params.password, user.password);
    
    if(!pwd){
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
      token: token
    });
  } catch (error) {
    return res.status(500).send({
      status: "error",
      message: "Ocurrio un error interno en el servidor",
    });
  }
};

// Exportar acciones
module.exports = {
  prueba,
  register,
  login,
};

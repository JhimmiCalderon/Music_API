// Importar dependencias
const jwt = require("jwt-simple");
const moment = require("moment");

// Importar clave secreta
const { secret } = require("../helpers/jwt");

// Crear middleware (metodo o funcion)
exports.auth = (req, res, next) => {
  // Comprobar si ne llega la acabecera auth
  if (!req.headers.authorization) {
    return res.status(403).send({
      status: "error",
      message: "La petición no tiene cabecera de autenticación ",
    });
  }
  //  Limpiar token
  let token = req.headers.authorization.replace(/['"]+/g, "");
  // Decodificar el token
  try {
    let payload = jwt.decode(token, secret); // payload son todos loa datos que se an cargado

    // Comprobar expriración del token
    if (payload.exp <= moment().unix()) {
      return res.status(401).send({
        status: "error",
        message: "Token expirado",
      });
    }
    // Agrgar datos del usuario
    req.user = payload;
  } catch (error) {
    return req.status(404).send({
      status: "error",
      message: "Token invalido",
    });
  }

  // Pasar a la ejecucion de la accion
  next();
};

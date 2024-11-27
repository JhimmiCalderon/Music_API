// Importar dependencias
const jwt = require("jwt-simple");
const moment = require("moment");


// Clave secreta (Para genera el token y que sea completamnete seguro)
const secret = "CLAVE_SECRETA_API_musicaL_7a9f3c2d6b4e1a8d9f5b6c7d9a4d0b3e";

// Crear una funcion para generar tokens
const createToken = (user) => { // lo exportamos de aqui por que solo es una funcion
    const payload = {
        id: user._id,
        name: user.name,
        surname: user.surname,
        nick: user.nick,
        email: user.email,
        role: user.role,
        imagen: user.image,
        iat: moment().unix(),
        exp: moment().add(30, "days").unix()
    };
    // Devolver jwt token codificado
    return jwt.encode(payload, secret);
}


module.exports = {
	secret,
	createToken
}
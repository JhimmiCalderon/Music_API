// Importamos nuestra dependencia
const validator = require("validator");

const validate = (params) => {
  // Validar campo "name"
  let name = params.name &&
    !validator.isEmpty(params.name) &&
    validator.isLength(params.name, { min: 3, max: undefined }) &&
    validator.isAlpha(params.name, "es-ES");
  if (!name) throw new Error("El campo 'name' no es válido.");

  // Validar campo "nick"
  let nick = params.nick &&
    !validator.isEmpty(params.nick) &&
    validator.isLength(params.nick, { min: 2, max: 60 });
  if (!nick) throw new Error("El campo 'nick' no es válido.");

  // Validar campo "email"
  let email = params.email &&
    !validator.isEmpty(params.email) &&
    validator.isEmail(params.email);
  if (!email) throw new Error("El campo 'email' no es válido.");

  // Validar campo "password"
  let password = params.password && !validator.isEmpty(params.password);
  if (!password) throw new Error("El campo 'password' no es válido.");

  // Validar campo "surname"
  if (params.surname) {
    let surname = params.surname &&
      !validator.isEmpty(params.surname) &&
      validator.isLength(params.surname, { min: 3 }) &&
      validator.isAlpha(params.surname, "es-ES");
    if (!surname) throw new Error("El campo 'surname' no es válido.");
  }
  console.log("Validación superada");
};

module.exports = validate;

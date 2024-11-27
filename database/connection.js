// Importar mongoose
const mongoose = require("mongoose");

// Metodo de conexión
const connection = async() => {
    try{
        await mongoose.connect("mongodb://localhost:27017/app_musica");

        console.log("!Conexión a nuestra base de datos Exitosa¡");
    }catch(error){
        console.error("Error al conectar con MongoDB:", error.message);
        console.error("Detalles:", error);
        throw new Error("No se ha establecido la conexión a la BD");
    }
    
}

//  Exportar conexión
module.exports = connection
// accion de pruba
const prueba = (req,res) => {
    return res.status(200).send({
        status: "success",
        message: "Mensaje enviado desde: controllers/song.js"
    })
}

// Exportar acciones
module.exports= {
    prueba
}
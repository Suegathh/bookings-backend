
const errorHandler = (error, req, res, next) => {

    const statusCode = res.status ? res.statusCode : 500;

    return res.status(statusCode).json({message: error.message})
}

module.exports = {
    errorHandler
}
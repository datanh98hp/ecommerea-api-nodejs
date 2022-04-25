
function errorHandler(err, req, res, next) { //handle err authentication
    if (err.name==='UnathorizedError') {
       return res.status(401).json({ message: "The User is not authorized" })
    }
    if (err.name === 'ValidationError') {
       return res.status(401).json({ message: err})
    }
    return res.status(500).json({ err })
}

module.exports = errorHandler;
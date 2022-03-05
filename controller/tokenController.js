const jwt = require("jsonwebtoken")

function checkTokenController(req, res, next) {
    const authcookie = req.cookies.authcookie
    jwt.verify(authcookie, process.env.SALT, (err, data) => {
        if (err) {
            res.sendStatus(403)
        } else if (data.user) {
            req.user = data.user
            next()
        }
    })
}

function userToken(req, res) {
    const token = req.cookies
    return token
}


module.exports = { checkTokenController, userToken }
const { findUser, addUser } = require("../db/DAO")
const alert = require("alert")
const crypto = require('crypto')
const jwt = require("jsonwebtoken")

const SALT = process.env.SALT

async function loginController(req, res) {
    const user = {
        email: req.body.email,
        password: req.body.password
    }
    let doesUserExist
    const getUser = await findUser({ email: user.email })
        .then((result) => {
            doesUserExist = result
        })
        .catch((error) => {
            console.log(error)
        })
    if (doesUserExist.length == 0) {
        alert("Benutzer konnte nicht gefunden werden.")
        res.redirect("/")
    }
    const newHash = crypto.pbkdf2Sync(user.password, SALT, 1932, 64, 'sha512').toString('hex')
    if (newHash == doesUserExist[0].password) {
        const token = jwt.sign({ user: doesUserExist }, SALT)
        res.cookie("authcookie", token, { maxAge: 900000, httpOnly: true })
        alert("Erfolgreich angemeldet.")
        res.redirect("/")
    } else if (newHash != doesUserExist[0].password) {
        alert("Fehler beim anmelden.")
        res.redirect("/")
    }
}

async function registrationController(req, res) {
    if (req.body.password[0] !== req.body.password[1]) {
        alert("Passwörter stimmen nicht überein.")
    }
    if (!req.body.email.includes("@")) {
        alert("Email ist nicht valide!")
    }
    let doesUserExist
    const getUser = await findUser({ email: req.body.email })
        .then((result) => {
            doesUserExist = result
        })
        .catch((error) => {
            console.log(error)
        })
    if (doesUserExist.length == 0) {
        if (req.body.password[0] == req.body.password[1] && req.body.email.includes("@")) {
            const hash = crypto.pbkdf2Sync(req.body.password[0], SALT, 1932, 64, "sha512").toString("hex")
            const newUser = {
                name: req.body.name,
                email: req.body.email,
                password: hash,
                tasks: []
            }
            const registerUser = await addUser(newUser)
                .then(() => {
                    alert("Benutzer angelegt")
                    res.redirect("/")
                })
        }
    } else {
        alert("Benutzer schon vorhanden")
    }
}

module.exports = {
    loginController,
    registrationController,
}
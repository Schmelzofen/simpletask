const { getTaskContr, addTaskContr, deleteTaskContr, editTaskContr } = require("../controller/taskcontroller")
const { loginController, registrationController } = require("../controller/usercontroller")
const { checkTokenController, userToken } = require("../controller/tokenController")
const jwt = require("jsonwebtoken")

const routes = (app) => {
    app.route("/")
        .get((req, res) => {
            let token = userToken(req, res)
            res.render("pages/home", {
                token
            })
        })
    app.route("/menueins")
        .get(checkTokenController, (req, res) => {
            let token = userToken(req, res)
            res.render("pages/menueins", {
                token
            })
        })
    app.route('/menuzwei')
        .get(checkTokenController, (req, res) => {
            getTaskContr(req, res)
        })
    app.route("/error")
        .get((req, res) => {
            res.render("pages/error")
        })
    app.route('/addTask')
        .post(addTaskContr)
    app.route('/gettasks')
        .get(getTaskContr)
    app.route("/edittask")
        .post(editTaskContr)
    app.route('/deletetask')
        .post(deleteTaskContr)
    app.route("/register")
        .post(registrationController)
    app.route("/login")
        .post(loginController)
    app.route("/logoff")
        .get((req, res) => {
            res.clearCookie("authcookie")
            res.redirect("/")
        })
}

module.exports = { routes }
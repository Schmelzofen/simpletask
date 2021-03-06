const { ObjectId } = require('mongodb')
const { connect } = require('../db/connection')
const { findUserById } = require("../db/DAO")
const { userToken } = require("./tokenController")
const { mailController } = require("./mailController")
const jwt = require("jsonwebtoken")

async function getTaskContr(req, res) {
    let token = userToken(req, res)
    const decodedToken = jwt.verify(req.cookies.authcookie, process.env.SALT)
    const user = decodedToken.user
    let tasks
    const findTasksOfThatUser = await findUserById({ _id: ObjectId(user[0]._id) })
        .then((result) => {
            tasks = result.tasks
        })
    return res.render("pages/menuzwei", {
        tasks,
        token
    })
}

async function addTaskContr(req, res) {
    const db = await connect()
    const decodedToken = jwt.verify(req.cookies.authcookie, process.env.SALT)
    const user = decodedToken.user
    if (req.body.day >= 30 && req.body.month == 02 || req.body.day >= 32) {
        res.send({ Error: "Invalid Date" })
    } else {
        const tasks = {
            _id: ObjectId(),
            day: req.body.day,
            month: req.body.month,
            description: req.body.description,
            notification: req.body.notification,
        }
        let reminderDays = tasks.day - tasks.notification
        let reminderMonths = tasks.month
        if (reminderDays < 0) {
            daysLeft = reminderDays + 31
            monthsLeft = reminderMonths - 1
            if (monthsLeft <= 0) {
                monthsLeft = monthsLeft + 12
                console.log(monthsLeft)
                mailController(`30 0 12 ${daysLeft} ${monthsLeft} *`, user[0].email, tasks.description, tasks.day, tasks.month)
            } else {
                mailController(`30 0 12 ${daysLeft} ${monthsLeft} *`, user[0].email, tasks.description, tasks.day, tasks.month)
            }
        } else {
            mailController(`30 0 12 ${reminderDays} ${reminderMonths} *`, user[0].email, tasks.description, tasks.day, tasks.month)
        }
        const findUser = await db.collection("microlab").updateOne({ _id: ObjectId(user[0]._id) }, { $addToSet: { tasks } }, { upsert: true })
        res.redirect("/menuzwei")
    }
}

async function deleteTaskContr(req, res) {
    const db = await connect()
    const decodedToken = jwt.verify(req.cookies.authcookie, process.env.SALT)
    const user = decodedToken.user
    const task = req.body
    const getUser = await db.collection("microlab").findOne({ _id: ObjectId(user[0]._id) })
    const doesItExist = getUser.tasks.filter((item) => item._id == task._id)
    if (doesItExist.length == 1) {
        const removedElement = await db.collection("microlab").updateOne({ _id: ObjectId(user[0]._id) }, { $pull: { tasks: doesItExist[0] } })
        res.redirect("/menuzwei")
    }
}

async function editTaskContr(req, res) {
    const db = await connect()
    const decodedToken = jwt.verify(req.cookies.authcookie, process.env.SALT)
    const user = decodedToken.user
    const task = {
        _id: ObjectId(),
        day: req.body.day,
        month: req.body.month,
        description: req.body.description,
        notification: req.body.notification,
    }
    const getUser = await db.collection("microlab").findOne({ _id: ObjectId(user[0]._id) })
    const doesItExist = getUser.tasks.filter((item) => item._id == req.body._id)
    if (doesItExist.length == 1) {
        const removedElement = await db.collection("microlab").updateOne({ _id: ObjectId(user[0]._id) }, { $pull: { tasks: doesItExist[0] } })
        const addedElement = await db.collection("microlab").updateOne({ _id: ObjectId(user[0]._id) }, { $addToSet: { tasks: task } })
        res.redirect("/menuzwei")
    } else {
        console.log("Hello")
    }
}

module.exports = {
    getTaskContr,
    addTaskContr,
    deleteTaskContr,
    editTaskContr,
}
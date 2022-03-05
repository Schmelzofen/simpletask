const { ObjectId } = require('mongodb')
const { connect } = require('../db/connection')
const { getTask, addTask, editTask, deleteTask } = require('../db/DAO')
const { findUser, findUserById } = require("../db/DAO")
const jwt = require("jsonwebtoken")

async function getTaskContr(req, res) {
    const decodedToken = jwt.verify(req.cookies.authcookie, process.env.SALT)
    const user = decodedToken.user
    let tasks
    const findTasksOfThatUser = await findUserById({ _id: ObjectId(user[0]._id) })
        .then((result) => {
            tasks = result.tasks
        })
    return res.render("pages/menuzwei", {
        tasks
    })
}

async function addTaskContr(req, res) {
    const db = await connect()
    const decodedToken = jwt.verify(req.cookies.authcookie, process.env.SALT)
    const user = decodedToken.user
    const tasks = {
        _id: ObjectId(),
        day: req.body.day,
        month: req.body.month,
        description: req.body.description,
        notification: req.body.notification,
    }
    const findUser = await db.collection("microlab").updateOne({ _id: ObjectId(user[0]._id) }, { $addToSet: { tasks } }, { upsert: true })
    res.redirect("/menuzwei")
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
    } else {
        console.log("Ehm")
    }
}

module.exports = {
    getTaskContr,
    addTaskContr,
    deleteTaskContr,
}
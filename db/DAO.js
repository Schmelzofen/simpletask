const { ObjectId } = require('mongodb')
const { connect } = require('./connection')

async function getTask() {
    const db = await connect()
    const tasklist = await db.collection('microlab')
        .find()
        .toArray()
    return tasklist
}

async function addTask(task) {
    const db = await connect()
    const tasklist = await db.collection('microlab')
        .insertOne(task)
    return tasklist
}
async function editTask(id) {
    const db = await connect()
    const editTask = await db.collection('microlab')
        .updateOne({ _id: ObjectId(id) })
    return editTask
}

async function deleteTask(id) {
    const db = await connect()
    const deleteTask = await db.collection('microlab')
        .deleteOne({ _id: ObjectId(id) })
    return deleteTask
}

async function addUser(user) {
    const db = await connect()
    const add = await db.collection("microlab")
        .insertOne(user)
    return add
}

async function findUser(query) {
    const db = await connect()
    const userList = await db.collection("microlab")
        .find(query)
        .toArray()
    return userList
}

async function findUserById(query) {
    const db = await connect()
    const userList = await db.collection("microlab")
        .findOne(query)
    return userList
}

module.exports = {
    getTask,
    addTask,
    editTask,
    deleteTask,
    addUser,
    findUser,
    findUserById
}
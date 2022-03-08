const nodemailer = require("nodemailer")
const cron = require("node-cron")
const { job } = require("cron")

const url_taskMap = {}

async function mailController(whenToRemind, email, description, day, month) {
    console.log(whenToRemind, email, description, day, month)
    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
            user: process.env.EMAIL,
            pass: process.env.PASSWD
        }
    })

    let job = cron.schedule(`${whenToRemind}`, () => {
        let reminder = transporter.sendMail({
            from: '"TaskReminder" <taskreminderml@gmail.com>',
            to: email,
            subject: "Benachrichtigung",
            text: `Folgendes steht demnächst an: ${description}\nWann: ${day}.${month}.`,
            html: `<h1>Folgendes steht demnächst an: ${description}</h1><br><p>Wann: ${day}.${month}.</p>`
        }, (err, info) => {
            if (info.accepted) {
                job.stop()
            }
        })
        console.log("Message has been sent.")
    })
}


module.exports = {
    mailController
}
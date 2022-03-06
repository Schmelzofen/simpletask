const nodemailer = require("nodemailer")
const cron = require("node-cron")



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
    let mailHasBeenSent = false
    let job = cron.schedule(`${whenToRemind}`, () => {
        let reminder = transporter.sendMail({
            from: '"TaskReminder" <taskreminderml@gmail.com',
            to: email,
            subject: "Benachrichtigung",
            text: `Folgendes steht demnächst an: ${description}\nWann: ${day}.${month}.`,
            html: `<h1>Folgendes steht demnächst an: ${description}</h1><br><p>Wann: ${day}.${month}.</p>`
        })
        console.log(mailHasBeenSent)
        mailHasBeenSent = true
        console.log("Message has been sent.", mailHasBeenSent)
    })
    if (mailHasBeenSent === true) {
        job.stop()
        mailHasBeenSent === false
    }
}

module.exports = {
    mailController
}
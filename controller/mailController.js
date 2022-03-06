const nodemailer = require("nodemailer")
var CronJob = require("cron").CronJob

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
    const job = new CronJob(`${whenToRemind}`, () => {
        let reminder = transporter.sendMail({
            from: '"TaskReminder" <taskreminderml@gmail.com',
            to: email,
            subject: "Benachrichtigung",
            text: `Folgendes steht demnächst an: ${description}\nWann: ${day}.${month}.`,
            html: `<h1>Folgendes steht demnächst an: ${description}</h1><br><p>Wann: ${day}.${month}.</p>`
        }, null, true, 'America/Los_Angeles')

        console.log("Message has been sent: %s", reminder.messageId)
    })
    job.start()
}

module.exports = {
    mailController
}
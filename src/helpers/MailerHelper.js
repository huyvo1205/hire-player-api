import nodeMailer from "nodemailer"
import handlebars from "handlebars"
import fs from "fs"
import path from "path"
import config from "../config/config"

const sendMail = async ({ to, subject, payload }) => {
    const html = await fs.readFileSync(path.resolve("src/templates/otp.template.html"), { encoding: "utf8" })
    const template = handlebars.compile(html)
    const data = payload
    const htmlToSend = template(data)
    const transporter = nodeMailer.createTransport({
        host: config.EMAIL.MAIL_HOST,
        port: config.EMAIL.MAIL_PORT,
        secure: false, // TRUE for port 465 (smtps)
        auth: {
            user: config.EMAIL.ADMIN_EMAIL,
            pass: config.EMAIL.ADMIN_PASSWORD
        }
    })

    const options = {
        from: config.EMAIL.ADMIN_EMAIL,
        to,
        subject,
        html: htmlToSend
    }
    return transporter.sendMail(options)
}

export default { sendMail }

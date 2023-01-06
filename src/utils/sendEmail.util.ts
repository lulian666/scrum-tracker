import nodemailerConfig from "@/config/nodemailer.config"
import nodemailer from 'nodemailer'

const sendEmail = async ({ to, subject, html }: any) => {
    let testAccount = await nodemailer.createTestAccount()
    const transporter = nodemailer.createTransport(nodemailerConfig)

    return transporter.sendMail({
        from: '"Fred Foo 👻" <foo@example.com>',
        to,
        subject,
        html,
    })
}

export default sendEmail
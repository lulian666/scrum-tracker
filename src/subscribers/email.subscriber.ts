import EventEmitter from 'events'
import sendEmail from '@/utils/sendEmail.util'

const eventEmitter = new EventEmitter()

async function sendVerificationEmail(email: string) {
    const verifyLink = ``
    return sendEmail({
        to: 'email@email.com',
        subject: 'Email Confirmation',
        html: `<h1>test</h1>`,
    })
}

async function sendResetPasswordEmail(email: string, passwordToken: string) {
    const verifyLink = ``
    return sendEmail({
        to: 'email@email.com',
        subject: 'Reset Password',
        html: `${passwordToken}`,
    })
}


eventEmitter.on('signup', sendVerificationEmail)
eventEmitter.on('reset', sendResetPasswordEmail)

export default eventEmitter

// const sendVerificationEmail = async ({
//     name,
//     email,
//     verificationToken,
//     origin,
// }: any) => {
//     console.log('send email')
//     const verifyEmail = `${origin}/user/verify-email?token=${verificationToken}&email=${email}`
//     return sendEmail({
//         to: email,
//         subject: 'Email Confirmation',
//         html: `<h4>hi ${name}</h4><a>${verifyEmail}</a>`,
//     })
// }

// export default { sendVerificationEmail, sendResetPasswordEmail }

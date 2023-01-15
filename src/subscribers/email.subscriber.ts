import EventEmitter from 'events'
import sendEmail from '@/utils/sendEmail.util'

const sendVerificationEmail = () => {
    const eventEmitter = new EventEmitter()

    eventEmitter.on('signup', async (email) => {
        const verifyLink = ``
        return sendEmail({
            to: 'email@email.com',
            subject: 'Email Confirmation',
            html: `<h1>test</h1>`,
        })
    })
    return eventEmitter
}

const sendResetPasswordEmail = async () => {
    const eventEmitter = new EventEmitter()

    eventEmitter.on('reset', async ({ email, passwordToken }) => {
        const verifyLink = ``
        return sendEmail({
            to: 'email@email.com',
            subject: 'Reset Password',
            html: `${passwordToken}`,
        })
    })
    return eventEmitter
}

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

export default { sendVerificationEmail, sendResetPasswordEmail }

import EventEmitter from 'events'
import sendEmail from "@/utils/sendEmail.util"

const eventEmitter = new EventEmitter()

eventEmitter.on('signup', async (email) => {
    const verifyLink = ``
    return sendEmail({
        to: 'email@email.com',
        subject: 'Email Confirmation',
        html: `<h1>test</h1>`,
    })
}
)

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

export default eventEmitter
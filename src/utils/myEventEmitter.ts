import EventEmitter from 'events'

class MyEmitter extends EventEmitter {
    sendEmail() {
        this.emit('signup')
        console.log('emit')
    }
}

export default MyEmitter
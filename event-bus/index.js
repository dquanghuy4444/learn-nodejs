const EventEmitter = require('events')
const util = require('util')

const eventBus = new EventEmitter()

eventBus.addListener("something" , () =>{
    console.log("hi there")
})

eventBus.emit("something")

const User = function(name , scope) {
    this.name = name
    this.scope = scope
}

util.inherits(User, EventEmitter)

const john = new User("John" , 1)

john.on("hi" , (scope) =>{
    console.log(scope)
})

john.emit("hi" , 10)
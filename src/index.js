const http=require('http')
const express=require('express')
const path=require('path')
const socketio=require('socket.io')
const Filter=require('bad-words')
const {generateMessage,generateLocationMessage}=require('./utils/messages')
const {addUser,getUserInRoom,getUser,removeUser}=require('./utils/users')
const app=express()
const server=http.createServer(app)
const io=socketio(server)
const port=process.env.port||3000
const publicDirectoryPath=path.join(__dirname,'../public')
app.use(express.static(publicDirectoryPath))
//let count=0
io.on("connection",(socket)=>{
    //console.log('New connection')
    //socket.broadcast.emit('message',generateMessage('A new user has joined'))
    socket.on('join',({username,room},callback)=>{
       
        const {error , user}=addUser({id:socket.id,username,room})
        if(error){
          return  callback(error)
        }
        //console.log(myuser)
        socket.join(user.room)
        socket.emit('message',generateMessage('ADMIN','Welcome!'))
        socket.broadcast.to(user.room).emit('message',generateMessage('ADMIN',`${user.username} has joined!`))
        io.to(user.room).emit('roomData',{
            room:user.room,
            users:getUserInRoom(user.room)
        })
         callback()
    })
    socket.on('sendmessage',(message,callback)=>{
        const user=getUser(socket.id)
        const filter=new Filter()
        if(filter.isProfane(message)){
            return callback('Profanity not allowed')
        }
        io.to(user.room).emit('message',generateMessage(user.username,message))
        callback()
    })
    socket.on('sendlocation',(coords,callback)=>{
        const user=getUser(socket.id)
         io.to(user.room).emit('locationmessage',generateLocationMessage(user.username,`https://google.com/maps?q=${coords.latitude},${coords.longitude}`))
         callback()
    })
    socket.on('disconnect',()=>{
       const userleft= removeUser(socket.id)
        if(userleft){
            io.to(userleft.room).emit('message',generateMessage('ADMIN',`${userleft.username} has left the room`))
            io.to(userleft.room).emit('roomData',{
                room:userleft.room,
                users:getUserInRoom(userleft.room)
            })
        }
    })
  
    // socket.emit('countUpdated',count)
    // socket.on('increment',()=>{
    //     count++
    //     io.emit('countUpdated',count)
    // })
})
server.listen(port,()=>{
    console.log(`server is up on port ${port}!`)
    console.log('Hello terminal')
})
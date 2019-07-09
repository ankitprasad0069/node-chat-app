const users=[]
const addUser=({id,username,room})=>{
username=username.trim().toLowerCase()
room=room.trim().toLowerCase()
if(!username||!room){
    return {
        error:'Username and Room are required'
    }
}
const existingUser = users.find(user => user.room === room && user.username === username)
if(existingUser){
    return {
        error:'Username in use'
    }
}
const user={id,username,room}
users.push(user)
return {user}



}
const removeUser=(id)=>{
    const index=users.findIndex((user)=>{
        return user.id===id
    })

    if(index!=-1){
        return users.splice(index,1)[0]
    }
}
const getUser=(id)=>{
    return users.find((user)=>
       user.id===id
    )
}
const getUserInRoom=(room)=>{
    room=room.trim().toLowerCase()
    return users.filter((user)=>user.room===room)
}
module.exports={
    addUser,
    getUserInRoom,
    getUser,
    removeUser
    }
// const fk=addUser({
//     id:101,
//     username:'Ankit',
//     room:'South Delhi    '
// })
// console.log(fk)
// addUser({
//     id:23,
//     username:'kartik',
//     room:'South Delhi    '
// })

// const newuser=addUser({
//     id:24,
//     username:'sunny',
//     room:'South India   '
// })
// console.log(newuser)
// const user=getUserInRoom('South Delhi')
// console.log(user)
// const rem=removeUser(22)
// console.log(rem)
// console.log(users)

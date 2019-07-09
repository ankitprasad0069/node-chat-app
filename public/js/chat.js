const socket=io()
const $messageform=document.querySelector("#message-form")
const $messageformbutton=$messageform.querySelector('button')
const $messageforminput=$messageform.querySelector('input')
const $sendlocationbutton=document.querySelector('#send-location')
const $messagetemplate=document.querySelector('#message-template').innerHTML
const $messages=document.querySelector('#message')
const $locationmessagetemplate=document.querySelector('#location-message-template').innerHTML
const $sidebartemplate=document.querySelector('#sidebar-template').innerHTML
// socket.on('countUpdated',(cnt)=>{
//     console.log('The count has been updated',cnt)
// })
// document.querySelector("#increment").addEventListener('click',()=>{
//     console.log('Clicked')
//     socket.emit('increment')
// })
const {username,room}=Qs.parse(location.search,{ignoreQueryPrefix:true})
const autoscroll=()=>{
// New message element
const $newMessage=$messages.lastElementChild
/// height of new message
const newMessageStyles=getComputedStyle($newMessage)
const newMessageMargin=parseInt(newMessageStyles.marginBottom)
const newMessageHeight=$newMessage.offsetHeight+newMessageMargin
/// Visible Height
const visibleHeight=$messages.offsetHeight
/// height of message container
const containerHeight=$messages.scrollHeight
///how far i have scrolled
const scrollOffset=$messages.scrollTop+visibleHeight
if(containerHeight-newMessageHeight<=scrollOffset){
    $messages.scrollTop=$messages.scrollHeight
}

}
document.querySelector('#message-form').addEventListener('submit',(e)=>{
e.preventDefault()
const message=document.querySelector('#ankit').value
$messageformbutton.setAttribute('disabled','disabled')
socket.emit('sendmessage',message,(error)=>{
    $messageformbutton.removeAttribute('disabled')
    $messageforminput.value=''
    $messageforminput.focus()
    if(error){
        return console.log(error)
    }else
    console.log('The message was delivered')
})
})
$sendlocationbutton.addEventListener('click',()=>{
    if(!navigator.geolocation){
        return alert('Geolocation not supported')
    }
    $sendlocationbutton.setAttribute('disabled','disabled')
    navigator.geolocation.getCurrentPosition((position)=>{
        socket.emit('sendlocation',{
            latitude:position.coords.latitude,
            longitude:position.coords.longitude
        },()=>{
            console.log('Location shared')
            $sendlocationbutton.removeAttribute('disabled')

        })
    })
})
socket.on('roomData',({room,users})=>{
 const html=Mustache.render($sidebartemplate,{
     room:room.toUpperCase(),
     users
 })
 document.querySelector('#sidebar').innerHTML=html
})
socket.on('message',(message)=>{
      const html=Mustache.render($messagetemplate,{
          username:message.username,
          mymessage:message.text,
          createdAt:moment(message.createdAt).format('h:mm a')
      })
        $messages.insertAdjacentHTML('beforeend',html)
        autoscroll()
    console.log(message)
})
socket.on('locationmessage',(message)=>{
   
    const html=Mustache.render($locationmessagetemplate,{
        username:message.username,
        url:message.url,
        createdAt:moment(message.createdAt).format('h:mm a')
    })
    $messages.insertAdjacentHTML('beforeend',html)
    autoscroll()
    console.log(message)
})
socket.emit('join',{username,room},(error)=>{
if(error){
    alert(error)
    location.href='/'
}
})
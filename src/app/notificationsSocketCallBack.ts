import { Namespace, Socket } from 'socket.io';

 const notificationsSocketCallBack = function(socket:Socket, io:Namespace){
    socket.on('notification_create', (data)=>{
        if(!Object.keys(data).length) socket.emit('notification_error', {message: 'There is not a message'})
        console.log(data);

        socket.emit('notification_success', {message: 'There is success'})
        
    })
 }
export default notificationsSocketCallBack;
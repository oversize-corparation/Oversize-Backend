import { Server } from "socket.io";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
import checkSocketToken from "../utils/chekSocketToken";


async function connecting(io:Server){
    io.on("connection", async (socket) => {
        const token = socket.handshake.auth.token;
        const user = await checkSocketToken(token);
        if(!user.status) return io.emit('error', {message: user.message});
        socket.join("user:general"); 
        socket.join(`user:${user.user!.id}`);
        // socket.emit('error', {message: 'There is not a message'})
        socket.emit('success', {message: 'User successfully connected'})
        
        
        socket.on('notification_create', async (data)=>{

            const newNotification = await prisma.notifications.create({
                data: {
                    content: data.content,
                    type_id: data.type_id,
                    to: data.to,
                    user_id: user.user!.id,
                },
            });

            
            if(newNotification) {
                socket.emit('success', {message: 'User successfully created notification'})
                io.to(`user:${newNotification.to}`).emit('notification', {content: newNotification.content})
                
            } else socket.emit('error', {message: 'Something went wrong'})



            
        })












        
        socket.on("disconnect", () => {
            console.log(`❌ Uzildi: ${user.user!.firstname}`);
        });
    });
}

export default connecting;
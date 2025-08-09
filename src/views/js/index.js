const elFormToken = document.querySelector('.form-token');
const elFormNotificationCreate = document.querySelector('.form-notification_create');
const elFormChat = document.querySelector('.form-chat_send');
const elFormShow = document.querySelector('.form-show');

let token = ''
elFormToken.addEventListener('submit', (evt)=>{
    evt.preventDefault();
    const formData = new FormData(evt.target);
    const insertedToken = Object.fromEntries(formData).token.trim();
    if(!insertedToken) return 
    evt.target.elements['token'].value = ''; 
    token = insertedToken
    document.querySelectorAll('[disabled]').forEach(element => {
        element.removeAttribute('disabled');
    });
    executeSocket(token);
})

elFormNotificationCreate.elements['data'].value = `
{
    "content": "hello",
    "type_id": 1,
    "to": "28"
}
`

elFormChat.elements['data'].value = `
{
    "receiver_id": 28,
    "message": "hello my first chat"
}
`

function executeSocket(token){
    if(token) {
        const socket = io('/', {auth:{token}});
        elFormNotificationCreate.addEventListener('submit', (evt)=>{
            evt.preventDefault();
            const formData = new FormData(evt.target);
            const data = Object.fromEntries(formData).data.trim();  
            if(!data) return 
            socket.emit("notification_create", JSON.parse(data));
        })

        elFormChat.addEventListener('submit', (evt)=>{
            evt.preventDefault();
            const formData = new FormData(evt.target);
            const data = Object.fromEntries(formData).data.trim(); 
            if(!data) return 
            socket.emit("chat_send", JSON.parse(data));
        })

        socket.on('notification', (data) => {
            elFormShow.elements['message'].value = elFormShow.elements['message'].value + `\n...notification: ${JSON.stringify(data)}` 
        })

        socket.on('success', (data) => {
            elFormShow.elements['message'].value = elFormShow.elements['message'].value + `\n...success: ${JSON.stringify(data)}` 
        })

        socket.on('error', (data) => {
            elFormShow.elements['message'].value = elFormShow.elements['message'].value + `\n...error: ${JSON.stringify(data)}` 
        })

    } else alert("You need to insert token");
}






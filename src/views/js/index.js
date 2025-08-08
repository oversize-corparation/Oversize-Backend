const elFormToken = document.querySelector('.form-token');
const elFormShow = document.querySelector('.form-show');
const elFormNotificationCreate = document.querySelector('.form-notification_create');

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

function executeSocket(token){
    if(token) {
        const socketNotifications = io('/', {auth:{token}});
        elFormNotificationCreate.addEventListener('submit', (evt)=>{
            evt.preventDefault();
            const formData = new FormData(evt.target);
            const data = Object.fromEntries(formData).data.trim();  
            if(!data) return 
            socketNotifications.emit("notification_create", JSON.parse(data));
        })

        socketNotifications.on('notification', (data) => {
            elFormShow.elements['message'].value = elFormShow.elements['message'].value + `\n...notification: ${JSON.stringify(data)}` 
        })

        socketNotifications.on('success', (data) => {
            elFormShow.elements['message'].value = elFormShow.elements['message'].value + `\n...success: ${JSON.stringify(data)}` 
        })

        socketNotifications.on('error', (data) => {
            elFormShow.elements['message'].value = elFormShow.elements['message'].value + `\n...error: ${JSON.stringify(data)}` 
        })

    } else alert("You need to insert token");
}






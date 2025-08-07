const socketNotifications = io("/notifications");
const elFormToken = document.querySelector('.form-token');
const elFormShow = document.querySelector('.form-show');
const elFormNotificationCreate = document.querySelector('.form-notification_create');

elFormToken.addEventListener('submit', (evt)=>{
    evt.preventDefault();
    const formData = new FormData(evt.target);
    const token = Object.fromEntries(formData).token.trim();
    if(!token) return 
    evt.target.elements['token'] = ''; 
    window.localStorage.setItem('token', token);
    document.querySelectorAll('[disabled]').forEach(element => {
        element.removeAttribute('disabled');
    });
})

elFormNotificationCreate.elements['data'].value = `
{
    "content": "hello",
    "type_id": "2"
}
`

elFormNotificationCreate.addEventListener('submit', (evt)=>{
    evt.preventDefault();
    const formData = new FormData(evt.target);
    const data = Object.fromEntries(formData).data.trim();
    if(!data) return 
    socketNotifications.emit("notification_create", JSON.parse(data));
})

socketNotifications.on('notification_error', (data) => {
    elFormShow.elements['message'].value =`notification_error: ${JSON.stringify(data)}` 
})

socketNotifications.on('notification_success', (data) => {
    elFormShow.elements['message'].value =`notification_success: ${JSON.stringify(data)}` 
})






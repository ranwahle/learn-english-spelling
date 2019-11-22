import './components/notifier.js';

export function notify({type, message, duration}) {
    const area = document.querySelector('#notification-area');
    const element = document.createElement('notification-component');
    element.message = message;
    element.type = type;
    area.append(element);

    requestAnimationFrame(() => {
        element.hide();
        setTimeout(() => {
            element.remove();
        }, duration || 5000);
    })

}

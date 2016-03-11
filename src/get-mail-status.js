((document) => {
    document.addEventListener('DOMContentLoaded', () => {
        const ipc = require('electron').ipcRenderer;
        ipc.send('MAIL_STATUS', {
            count: document.querySelector('fullcount').innerHTML,
            mail: Array.from(document.querySelectorAll('entry')).map((entry) => ({
                subject: entry.querySelector('title').innerHTML,
                sender: entry.querySelector('author name').innerHTML,
                id: entry.querySelector('id').innerHTML
            }))
        });
    })
})(document);
((document) => {
    document.addEventListener('DOMContentLoaded', () => {
        console.log('MAIL_STATUS', document.querySelector('fullcount').textContent);
        const ipc = require('electron').ipcRenderer;
        ipc.send('MAIL_STATUS', {
            count: document.querySelector('fullcount').textContent,
            mail: Array.from(document.querySelectorAll('entry')).map((entry) => ({
                subject: entry.querySelector('title').textContent,
                sender: entry.querySelector('author name').textContent,
                id: entry.querySelector('id').textContent
            }))
        });
    })
})(document);
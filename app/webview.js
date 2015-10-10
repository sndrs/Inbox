var webview = document.getElementById('webview');
var path = require('path');

webview.addEventListener('new-window', (e) => {
    require('shell').openExternal(e.url);
});

function showWebView() {
    webview.style.opacity = 1;
    webview.removeEventListener('did-get-response-details', showWebView);
}

webview.addEventListener('did-get-response-details', showWebView);
webview.addEventListener('did-finish-load', () => {
    webview.executeJavaScript(`
        var ipc = require('ipc');
        var observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if(mutation.addedNodes) {
                    var newMailNode = Array.from(mutation.addedNodes).filter((node) =>
                        node.classList && Array.from(node.classList).some((className) =>
                            className === 'scroll-list-item'
                        )
                    );
                    newMailNode.length && ipc.send('newMail', {
                        sender: newMailNode[0].querySelector('[email]').innerText,
                        subject: newMailNode[0].querySelector('.bg').innerText
                    })
                }
            });
        });
        observer.observe(document.querySelector('[role=application]'), {childList: true, subtree: true});
    `);
});

require('ipc').on('newMail', details => {
    Notification.requestPermission();
    new Notification(details.sender, {
        title: details.sender,
        body: details.subject
    });
});
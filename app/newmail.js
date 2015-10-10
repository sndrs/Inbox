var observer = function () {
    var ipc = require('ipc');
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if(mutation.addedNodes) {
                var newMailNode = Array.from(mutation.addedNodes).filter((node) =>
                    node.classList && Array.from(node.classList).some((className) =>
                        className === 'scroll-list-item'
                    )
                );
                if (newMailNode.length) {
                    ipc.send('newMail', {
                        sender: newMailNode[0].querySelector('[email]').innerText,
                        subject: newMailNode[0].querySelector('.bg').innerText
                    })
                };
            };
        });
    });
    observer.observe(document.querySelector('[role=application]'), {childList: true, subtree: true});
}

module.exports = `(${observer.toString()})()`;
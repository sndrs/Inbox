var observer = function () {
    var ipc = require('ipc');

    // lodash debounce
    (function(){function t(){}function e(t){return n(t)&&d.call(t)==i}function n(t){var e=typeof t;return!!t&&("object"==e||"function"==e)}function o(t){return null==t?false:e(t)?y.test(s.call(t)):!!t&&typeof t=="object"&&(p(t)?y:r).test(t)}var i="[object Function]",r=/^\[object .+?Constructor\]$/,c={"function":true,object:true},u=c[typeof exports]&&exports&&!exports.nodeType&&exports,f=c[typeof module]&&module&&!module.nodeType&&module,a=c[typeof self]&&self&&self.Object&&self,l=c[typeof window]&&window&&window.Object&&window,c=f&&f.exports===u&&u,a=u&&f&&typeof global=="object"&&global&&global.Object&&global||l!==(this&&this.window)&&l||a||this,p=function(){try{Object({toString:0}+"")}catch(t){return function(){return false}}return function(t){return typeof t.toString!="function"&&typeof(t+"")=="string"}}(),l=Object.prototype,s=Function.prototype.toString,d=l.toString,y=RegExp("^"+s.call(l.hasOwnProperty).replace(/[\\^$.*+?()[\]{}|]/g,"\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g,"$1.*?")+"$"),m=Math.max,b=function(t,e){var n=null==t?void 0:t[e];return o(n)?n:void 0}(Date,"now")||function(){return(new Date).getTime()};t.debounce=function(t,e,o){function i(e,n){n&&clearTimeout(n),a=d=y=void 0,e&&(g=b(),l=t.apply(s,f),d||a||(f=s=void 0))}function r(){var t=e-(b()-p);0>=t||t>e?i(y,a):d=setTimeout(r,t)}function c(){i(v,d)}function u(){if(f=arguments,p=b(),s=this,y=v&&(d||!j),false===w)var n=j&&!d;else{a||j||(g=p);var o=w-(p-g),i=0>=o||o>w;i?(a&&(a=clearTimeout(a)),g=p,l=t.apply(s,f)):a||(a=setTimeout(c,o))}return i&&d?d=clearTimeout(d):d||e===w||(d=setTimeout(r,e)),n&&(i=true,l=t.apply(s,f)),!i||d||a||(f=s=void 0),l}var f,a,l,p,s,d,y,g=0,w=false,v=true;if(typeof t!="function")throw new TypeError("Expected a function");if(e=0>e?0:+e||0,true===o)var j=true,v=false;else n(o)&&(j=!!o.leading,w="maxWait"in o&&m(+o.maxWait||0,e),v="trailing"in o?!!o.trailing:v);return u.cancel=function(){d&&clearTimeout(d),a&&clearTimeout(a),g=0,a=d=y=void 0},u},t.isFunction=e,t.isNative=o,t.isObject=n,t.now=b,t.VERSION="3.10.1",typeof define=="function"&&typeof define.amd=="object"&&define.amd?(a._=t, define(function(){return t})):u&&f?c?(f.exports=t)._=t:u._=t:a._=t}).call(this);

    var notify = _.debounce(function() {
        setTimeout(function () { // give gmail a chance to update unread count
            ipc.send('INBOX_CHANGE')
        }, 100);
    }, 1000, {
        'leading': true,
        'trailing': false
    });

    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.type === 'characterData' ||
                (mutation.attributeName === 'class' && mutation.target.hasAttribute('email')) ||
                (mutation.addedNodes.length && Array.from(mutation.addedNodes).some((node) =>
                    node.classList && Array.from(node.classList).some((className) =>
                        className === 'scroll-list-item'
                    )))) {
                notify();
            };
        });
    });

    observer.observe(document.querySelector('[role=application]'), {
        childList: true,
        characterData: true,
        attributes: true,
        subtree: true
    });
}

module.exports = `(${observer.toString()})()`;
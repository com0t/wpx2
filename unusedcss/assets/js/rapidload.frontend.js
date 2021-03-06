(function () {

    var RapidLoad = function () {

        var fired = false

        var load_css = function (uucss) {
            var files = document.querySelectorAll('link[href*="uucss/uucss-"]')

            if (!files.length || fired) {
                return;
            }

            for (var i = 0; i < files.length; i++) {

                var file = files[i];

                var original = uucss.find(function (i) {
                    return file.href.includes(i.uucss)
                })

                if (!original) {
                    return;
                }

                let link = file.cloneNode()
                link.href = original.original
                if(window.rapidload && window.rapidload.frontend_debug === "1"){
                    link.removeAttribute('uucss')
                    link.setAttribute('uucss-reverted', '')
                }
                link.prev = file

                link.addEventListener('load',function (e) {
                    if (link.prev) link.prev.remove();
                });

                file.parentNode.insertBefore(link, file.nextSibling);

                fired = true
            }
        }

        var removeCriticalCSS = function (){
            let element = document.getElementById('rapidload-critical-css')
            if(element){
                element.remove();
            }
        }

        this.add_events = function () {

            if (!window.rapidload || !window.rapidload.files || !window.rapidload.files.length) {
                return;
            }

            ['mousemove', 'touchstart', 'keydown'].forEach(function (event) {

                var listener = function () {
                    load_css(window.rapidload.files)
                    removeCriticalCSS();
                    removeEventListener(event, listener);
                }
                addEventListener(event, listener);

            });

        }

        this.add_events()
    };

    document.addEventListener("DOMContentLoaded", function (event) {
        console.log('RapidLoad ???? 1.0');
        new RapidLoad();
    });

}());


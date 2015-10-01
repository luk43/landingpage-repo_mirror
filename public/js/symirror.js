/*
 * File: js/symirror.js
 * Authors: 
 * - Damian Senn <damian.senn@adfinis-sygroup.ch>
 * - Philipp Marmet <philipp.marmet@adfinis-sygroup.ch>
 *
*/
;(function() {

function getServerFile(url, doneCallback) {
    var xhr = new XMLHttpRequest()
    xhr.onreadystatechange = handleStateChange
    xhr.open("GET", url, true)
    xhr.send()

    function handleStateChange() {
        if ( xhr.readyState === 4 ) {
            doneCallback(xhr.status == 200 ? xhr.responseText : null)
        }
    }
}

function Mirror(options) {
    this.statisticsUrl    = options.statisticsUrl
    this.sizeElement      = options.sizeElement
    this.timestampElement = options.timestampElement
}

Mirror.prototype.getJSONStatistics = function(done) {
    getServerFile(this.statisticsUrl, function(e) {
        !( e === null ) ? done(JSON.parse(e)) : null
    })
}

Mirror.prototype.render = function() {
    var self = this

    this.getJSONStatistics(function(stats) {
        var d = stats.time
        var s = stats.size

        document.getElementById(self.sizeElement).textContent      = s
        document.getElementById(self.timestampElement).textContent = d
    })
}

var MIRRORS = [
    {
        statisticsUrl:     '/archlinux.json',
        sizeElement:       'mirror-archlinux-size',
        timestampElement:  'mirror-archlinux-lastsync'
    },
    {
        statisticsUrl:     '/centos.json',
        sizeElement:       'mirror-centos-size',
        timestampElement:  'mirror-centos-lastsync'
    },
    {
        statisticsUrl:     '/debian.json',
        sizeElement:       'mirror-debian-size',
        timestampElement:  'mirror-debian-lastsync'
    }
]

MIRRORS.forEach(function(options) {
    var mirror = new Mirror(options)

    mirror.render()
})

function showHelp(e) {
    var el = document.getElementById("helpbox-" + e)
    el.style.visibility = el.style.visibility == "visible" ? "hidden" : "visible"
    el.addEventListener('click', function(e) {
        if (e.target.className === 'helpbox') {
            el.style.visibility = 'hidden'
        }
    })
}
window.showHelp = showHelp

})();
// vim: set autoindent expandtab ts=4 sw=4 sts=4:
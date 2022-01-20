function isIn() {
    const d = document;
    return (d.fullScreenElement && d.fullScreenElement !== null) ||
        (d.msFullscreenElement && d.msFullscreenElement !== null) ||
        d.mozFullScreen || d.webkitIsFullScreen;
}

function enter(el) {
    el = el ?? document.documentElement;
    return (el.requestFullscreen ?? el.mozRequestFullScreen ?? el.msRequestFullscreen ?? el.webkitRequestFullScreen)?.call(el);
}

function exit() {
    const d = document;
    return (d.exitFullScreen ?? d.webkitExitFullscreen ?? d.msExitFullscreen ?? d.mozCancelFullScreen)?.call(d);
}

export default {
    isIn, enter, exit,
    toggle() { (isIn() ? exit : enter)(); }
};

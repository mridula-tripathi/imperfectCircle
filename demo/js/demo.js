// Avoid `console` errors in browsers that lack a console.
(function() {
    var method;
    var noop = function () {};
    var methods = [
        'assert', 'clear', 'count', 'debug', 'dir', 'dirxml', 'error',
        'exception', 'group', 'groupCollapsed', 'groupEnd', 'info', 'log',
        'markTimeline', 'profile', 'profileEnd', 'table', 'time', 'timeEnd',
        'timeStamp', 'trace', 'warn'
    ];
    var length = methods.length;
    var console = (window.console = window.console || {});

    while (length--) {
        method = methods[length];

        // Only stub undefined methods.
        if (!console[method]) {
            console[method] = noop;
        }
    }
}());
$(window).load(function () {
    var marker = $('.test').markCircle({brushSrc: "css/img/brush8.png"});
    $('#hide').click(function () {
        $('#test2').destroyMarker();
    });
    $('.test').click(function () {
        console.log("div clicked")
    });$('#innerDiv').click(function () {
        console.log("inner div clicked")
    });
    $('#destroy').click(function () {
        marker.destroy('#test2');
        marker.destroy($('#test1'));
    });
    $('#destroyall').click(function () {
        marker.destroy();
    });
    $('#create').click(function () {
        $('#test2').markCircle({lineColor: "red", lineWidth:1});
    });
});

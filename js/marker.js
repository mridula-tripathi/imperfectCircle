(function ($) {
    var MARKER_ID = "markerCircle",
        MARKER_CLASS = "markerCircle";
    $.fn.destroyMarker = function () {
        this.find('canvas.'+ MARKER_CLASS).remove();
    };
    $.fn.markCircle = function (options) {
        var marker = {
            options: $.extend({
                brushSrc: "",
                brushType: "",
                lineColor: "#000",
                lineWidth: "1"
            }, options),
            _create: function (element) {
                var self = this;
                this.lastPoint = null;
                this.targetDiv = element;
                var theCanvas;
                if(this.options.brushSrc) {
                    this.brush = new Image();
                    self.brush.onload = function () {
                        createCanvas();
                    };
                    this.brush.src = this.options.brushSrc;
                } else {
                    createCanvas();
                }
            function createCanvas () {
                var events = ['click','dblclick','mousedown','mouseup', 'mouseenter', 'mouseleave'];
                $.each(element, function () {
                    theCanvas =
                        $('<canvas/>', {'class': MARKER_CLASS, 'id': MARKER_ID + Math.floor(Math.random() * 100000)});
                    /*check for IE8, using excanvas.js*/
                    if (!self.isCanvasSupported() && typeof G_vmlCanvasManager != 'undefined') {
                        G_vmlCanvasManager.initElement(theCanvas[0]);
                    }
                    /*supporting pointer-events for IE*/
                    if(!checkPointerEvent()) {
                        $(element).on(events.join(" "), "canvas.markerCircle", function(e){
                            // peak at the element below
                            var origDisplayAttribute = $(this).css('display');
                            $(this).css('display','none');

                            var underneathElem = document.elementFromPoint(e.clientX, e.clientY);

                            if(origDisplayAttribute)
                                $(this)
                                    .css('display', origDisplayAttribute);
                            else
                                $(this).css('display','');

                            // fire the mouse event on the element below
                            e.target = underneathElem;
                            $(underneathElem).trigger(e);
                            return false;

                        });
                    }
                    /*destroying already existing marker to create a new one*/
                    self.destroy(this);
                    theCanvas.appendTo(this);
                    self.context = theCanvas[0].getContext("2d");
                    self.init(theCanvas[0]);
                });
            }
                function checkPointerEvent() {
                    var a=document.createElement("x");
                    a.style.cssText="pointer-events:auto";
                    return a.style.pointerEvents==="auto";
                }
            },
            init: function (canvas) {
                this.containerHeight = parseInt($(canvas).parent().outerHeight(false));
                this.containerWidth = parseInt($(canvas).parent().outerWidth(false));
                var brushType= this.options.brushType, delta = 20;
                if(brushType === "thick") {
                    delta = 40;
                }
                this.canvasDimension = this.containerHeight > this.containerWidth ? this.containerWidth : this.containerHeight;
                var maxRad = this.canvasDimension / 2;
                var minRad = maxRad - 10;
                /*+delta for handling brush width*/
                this.canvasDimension += delta;
                $(canvas).attr('width', this.canvasDimension).attr('height', this.canvasDimension);
                var centerX = this.canvasDimension / 2;
                var centerY = this.canvasDimension / 2;
                var phase = Math.random() * Math.PI * 2;
                this.drawArc(centerX, centerY, minRad, maxRad, phase, phase + 7);
                this.lastPoint = null;
                this.context.stroke();
                if (this.isCanvasSupported()) {
                    /*stretching the canvas vertically or horizontally based on type of rectangle */
                    if (this.containerHeight > this.containerWidth) {
                        console.log("vertical");
                        $(canvas).css("height", this.containerHeight * Math.sqrt(2));
                        $(canvas).css("width", (this.canvasDimension) * Math.sqrt(2));
                        $(canvas).css({ "left": -(((this.canvasDimension) * Math.sqrt(2) - this.containerWidth) / 2), "top": (((this.canvasDimension) * Math.sqrt(2) - this.containerHeight * Math.sqrt(2)) / 2)
                        });
                    } else {
                        console.log("horizontal");
                        $(canvas).css("width", this.containerWidth * Math.sqrt(2));
                        $(canvas).css("height", (this.canvasDimension) * Math.sqrt(2));
                        $(canvas).css({ "left": -((this.containerWidth * Math.sqrt(2) - this.containerWidth) / 2), "top": -(((this.canvasDimension) * Math.sqrt(2) - this.containerHeight) / 2)});
                    }
                }
            },
            drawArc: function (cx, cy, srad, erad, stheta, etheta) {
                var loopDeg = (etheta - stheta ) * (180 / Math.PI);
                var sthetaInDeg = stheta * (180 / Math.PI);
                var ethetaInDeg = etheta * (180 / Math.PI);
                var rDelta = (srad - erad ) / loopDeg;
                var tol = Math.random() * 5 + 5;
                for (; sthetaInDeg <= ethetaInDeg; sthetaInDeg++) {
                    this.currentPoint = {x: cx + srad * Math.cos(sthetaInDeg * Math.PI / 180), y: cy + srad * Math.sin(sthetaInDeg * Math.PI / 180) };
                    if (!this.lastPoint) {
                        this.lastPoint = this.currentPoint;
                        continue;
                    }
                    srad -= rDelta;
                    var dist = this.distanceBetween(this.lastPoint, this.currentPoint);
                    var angle = this.angleBetween(this.lastPoint, this.currentPoint);
                    for (var i = 0; i < dist; i++) {
                        var   dx = Math.random() * tol * 0.75,
                            dy = Math.random() * tol * 0.75;

                        x = this.lastPoint.x + dx + (Math.sin(angle) * i );
                        y = this.lastPoint.y + dy + (Math.cos(angle) * i );
                        if(this.brush) {
                            this.context.drawImage(this.brush, x, y);
                        } else {
                            this.context.strokeStyle = this.options.lineColor;
                            this.context.lineWidth = this.options.lineWidth;
                            this.context.lineTo(x, y);
                        }
                    }
                    this.lastPoint = this.currentPoint;
                }
            },
            distanceBetween: function (point1, point2) {
                return Math.sqrt(Math.pow(point2.x - point1.x, 2) + Math.pow(point2.y - point1.y, 2));
            },
            angleBetween: function (point1, point2) {
                return Math.atan2(point2.x - point1.x, point2.y - point1.y);
            },
            isCanvasSupported: function () {
                var elem = document.createElement('canvas');
                return !!(elem.getContext && elem.getContext('2d'));
            },
            destroy: function (which) {
                if (typeof which != 'undefined') {
                    $(which).find('canvas.'+ MARKER_CLASS).remove();
                } else {
                    $.each(this.targetDiv, function () {
                        $(this).find('canvas.'+ MARKER_CLASS).remove();
                    });
                }
            }
        };
        marker._create(this);
        return marker;
    }
})(jQuery);

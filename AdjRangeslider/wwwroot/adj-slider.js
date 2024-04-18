var adjRangeSliders = {};

export async function initDraggableWithinBounds(
    dotNetObj,
    parentSelector,
    isHandleLeft,
    isHandleRight,
    stepValue,
    startValue,
    endValue,
    minValue,
    maxValue,
    cssVarList) {


    if (startValue < minValue) startValue = minValue;
    if (endValue > maxValue) endValue = maxValue;

    adjRangeSliders[parentSelector] = {};
    var o = adjRangeSliders[parentSelector];
    initFunctions(o);




    o.dotNetObj = dotNetObj;
    o.parentSelector = parentSelector;
    o.isHandleLeft = isHandleLeft;
    o.isHandleRight = isHandleRight;
    o.stepValue = stepValue;
    o.startValue = startValue;
    o.endValue = endValue;
    o.minValue = minValue;
    o.maxValue = maxValue;
    o.cssVarList = cssVarList;


    o.isHandleMiddle = false;
    o.isHandleInside = false;

    o.rangeLeftAdjustment = 0;
    o.rangeRightAdjustment = 0;


    o.setOHtml();

    o.oParentRect = {};

    o.isHandleLeftAndRight = o.isHandleLeft && o.isHandleRight;
    o.oStepValue = o.stepValue;

    o.oStartValue = o.startValue;
    o.oEndValue = o.endValue;

    o.oMinValue = o.minValue;
    o.oMaxValue = o.maxValue;


    o.oRangeMax = o.oMaxValue - o.oMinValue;
    o.oStartPercent = o.getPercentByVal(o.oStartValue, o.oMinValue, o.oMaxValue);
    o.oEndPercent = o.getPercentByVal(o.oEndValue, o.oMinValue, o.oMaxValue);

    o.oClientEndLeft = 0;
    o.oClientStartLeft = 0;
    o.oEndXClick = 0;
    o.oStartXClick = 0;

    o.oMaxX = 0;
    o.oMaxXEnd = 0;
    o.oMaxXStart = 0;
    o.oDiffValue = 0;

    o.draggingElement;
    o.touchStartClientX = 0;

    o.oParentX = 0;
    o.oClampedX

    o.initPositions();
    o.isRangeSlider = o.isHandleLeft && o.isHandleRight;
    o.isDraggingStart = false;
    o.isDraggingRange = false;
    o.isDraggingRangeBg = false;
    o.isDraggingHasMoved = false;
    o.isDraggingEnd = false;

    o.isMobileDevice = /Mobi|Android/i.test(navigator.userAgent);
    o.isUsesTouchDevice = false;
    // isMobileDevice = true;
    o.offsetX;

    //alert('isMobileDevic4e: ' + isMobileDevice);
    document.addEventListener('mousemove', o.handleMove);
    document.addEventListener('vmousemove', o.handleMove);
    document.addEventListener('mouseup', o.handleMouseUp)

    o.oHtm.childRange.addEventListener('mousedown', o.handleMouseDownRange);
    o.oHtm.childRange.addEventListener('touchmove', o.handleMove);
    o.oHtm.childRange.addEventListener("touchstart", (e) => { o.initTouchStart(e, o.oHtm.childRange); });
    o.oHtm.childRange.addEventListener('touchend', (e) => { o.handleMouseUp(e); var t = 1; });


    o.oHtm.childRangeBg.addEventListener('mousedown', o.handleMouseDownRangeBg);
    o.oHtm.childRangeBg.addEventListener('touchmove', o.handleMove);
    o.oHtm.childRangeBg.addEventListener("touchstart", (e) => { o.initTouchStart(e, o.oHtm.childRangeBg); });
    o.oHtm.childRangeBg.addEventListener('touchend', (e) => { o.handleMouseUp(e); var t = 1; });


    if (o.isHandleLeft) {
        o.oHtm.childStart.addEventListener('mousedown', o.handleMouseDownStart);
        o.oHtm.childStart.addEventListener('touchmove', o.handleMove);
        o.oHtm.childStart.addEventListener("touchstart", (e) => { initTouchStart(e, o.oHtm.childStart); });
        o.oHtm.childStart.addEventListener('touchend', (e) => { o.handleMouseUp(e); var t = 1; });
    }
    if (o.isHandleRight) {
        o.oHtm.childEnd.addEventListener('mousedown', o.handleMouseDownEnd);
        o.oHtm.childEnd.addEventListener('touchmove', o.handleMove);
        o.oHtm.childEnd.addEventListener("touchstart", (e) => { o.initTouchStart(e, o.oHtm.childEnd); });
        o.oHtm.childEnd.addEventListener('touchend', (e) => { o.handleMouseUp(e); var t = 1; });
    }



    o.myObserver = new ResizeObserver(entries => {
        o.initPositions();
    });
    o.myObserver.observe(o.oHtm.parent);


    function initFunctions(o) {
        o.handleMouseDownRange = function (e) {
            o.isDraggingRange = true;
            o.isDraggingHasMoved = false;
            o.draggingElement = o.oHtm.childRange;
            o.offsetX = o.getClientX(e) - o.oHtm.childStart.getBoundingClientRect().left;

        }
        o.handleMouseDownRangeBg = function (e) {
            o.isDraggingRangeBg = true;
            o.isDraggingHasMoved = false;

            o.offsetXBg= o.getClientX(e) - o.oHtm.childRangeBg.getBoundingClientRect().left;
            //o.draggingElement = o.oHtm.childRangeBg;

            
            var offsetStart = o.oHtm.childStart.getBoundingClientRect().left - o.oParentX;
            var offsetEnd = o.oHtm.childEnd.getBoundingClientRect().left - o.oParentX;

            if (o.offsetXBg < offsetStart) {
                o.handleMouseDownStart(e);
            } else {
                o.handleMouseDownEnd(e);
            }
        }
        o.handleMouseDownStart = function (e) {
            o.isDraggingStart = true;
            o.draggingElement = o.oHtm.childStart;
            o.offsetX = o.getClientX(e) - o.draggingElement.getBoundingClientRect().left;
        }
        o.handleMouseDownEnd = function (e) {
            o.isDraggingEnd = true;
            o.draggingElement = o.oHtm.childEnd;
            o.offsetX = o.getClientX(e) - o.oHtm.childEnd.getBoundingClientRect().left;
        }
        o.initTouchStart = function (e, obj) {
            o.isUsesTouchDevice = true;
            var touch = e.touches[0];
            o.draggingElement = obj;
            o.isDraggingStart = obj === o.oHtm.childStart;
            o.isDraggingEnd = obj === o.oHtm.childEnd;
            o.isDraggingRange = obj === o.oHtm.childRange;
            o.isDraggingRangeBg = obj === o.oHtm.childRangeBg;
            o.touchStartClientX = touch.clientX;
            o.offsetX = touch.clientX - o.draggingElement.getBoundingClientRect().left;
        }
        o.handleMouseUp = function (e) {
            o.initMoveRects(e);


            var clickPos = o.getClientX(e) - o.oParentX;
            if (!o.isDraggingHasMoved) {
                if (o.isDraggingRangeBg) {
                    o.isDraggingRange = false; o.isDraggingRangeBg = false;
                    if (clickPos > o.oClientEndLeft && o.isHandleRight) {
                        o.isDraggingEnd = true;
                        o.oClientEndLeft = clickPos;
                        o.oEndXClick = o.offsetX - o.rangeRightAdjustment;//  Math.min(o.getClientX(e) - o.oParentX - o.rangeRightAdjustment, o.oMaxXEnd)
                        o.handleMove(e);
                    }
                    else if (clickPos < o.oClientStartLeft && o.isHandleLeft) {
                        o.isDraggingStart = true;
                        o.oClientStartLeft = clickPos;
                        o.oStartXClick = o.offsetX;// - o.rangeRightAdjustment; //Math.max(0, o.getClientX(e) - o.oParentX - o.oHtm.childStart.offsetWidth + o.rangeLeftAdjustment);
                        o.handleMove(e);
                    }
                } else if (o.isDraggingRange) {
                    o.isDraggingRange = false; o.isDraggingRangeBg = false;
                    var xx = o.oClientStartLeft + ((o.oClientEndLeft - o.oClientStartLeft) / 2);
                    if ((clickPos > xx && o.isHandleLeftAndRight) || (o.isHandleRight && !o.isHandleLeft)) {
                        o.isDraggingEnd = true;
                        o.oEndXClick = clickPos - o.oClientStartLeft - o.oHtm.childStart.offsetWidth;;// + o.rangeRightAdjustment;
                        o.handleMove(e);
                    } else {
                        o.isDraggingStart = true;
                        o.oStartXClick = clickPos - o.oClientStartLeft - o.oHtm.childStart.offsetWidth + o.rangeLeftAdjustment;
                        o.handleMove(e);
                    }
                }
            }
            o.oEndXClick = 0;
            o.oStartXClick = 0;

            o.isDraggingStart = false;
            o.isDraggingEnd = false;
            o.isDraggingRange = false;
            o.draggingElement = null;
            o.dotNetObj.invokeMethodAsync("OnMouseUpCallback", o.floatString(o.oStartValue), o.floatString(o.oEndValue));
        }

        o.handleMove = function (e) {
            if (o.isDraggingRange || o.isDraggingRangeBg) o.isDraggingHasMoved = true;

            if ((o.isDraggingStart && o.isHandleLeft) || (o.isDraggingEnd && o.isHandleRight) || (o.isDraggingRange && o.isHandleLeftAndRight)) {
                o.initMoveRects(e);

                if (o.isDraggingRange) { o.moveDraggingRange(); }
                else if (o.isDraggingStart) { o.moveDraggingStart(); }
                else if (o.isDraggingEnd) { o.moveDraggingEnd(); }


                o.oStartValue = o.getValByPercent(o.oRangeMax, o.oStartPercent, o.oStepValue) + parseFloat(o.oMinValue);

                if (o.isDraggingRange) {
                    o.oEndValue = o.oStartValue + o.oDiffValue;
                    o.oEndPercent = o.getPercentByVal(o.oClientEndLeft - o.oHtm.childStart.offsetWidth, 0, o.oMaxXStart);
                }
                else {
                    o.oEndValue = o.getValByPercent(o.oRangeMax, o.oEndPercent, o.oStepValue) + parseFloat(o.oMinValue);
                }


                o.adjustRange();


                dotNetObj.invokeMethodAsync(
                    "OnMouseMoveCallback",
                    o.floatString(o.oStartValue),
                    o.floatString(o.oEndValue)
                );

            }
        };
        o.floatString = function (n) { return Number.isInteger(n) ? n.toFixed(1) : n.toString(); }

        o.setStartPosition = function () {
            var x = 0;// isHandleMiddle ? o.oHtm.childStart.offsetWidth/2 : 0;
            o.oHtm.childStart.style.left = (o.oClientStartLeft + x) + 'px';
            o.oStartPercent = o.getPercentByVal(o.oClientStartLeft, 0, o.oMaxXStart);
        }
        o.setEndPosition = function () {

            var x = 0;//isHandleMiddle ? o.oHtm.childEnd.offsetWidth / 2 : 0;
            o.oHtm.childEnd.style.left = (o.oClientEndLeft - x) + 'px';
            o.oEndPercent = o.getPercentByVal(o.oClientEndLeft - o.oHtm.childStart.offsetWidth, 0, o.oMaxXStart);
        }


        o.getValByPercent = function (max, percent, step) {
            var val = parseFloat((max * percent / 100).toFixed(1));

            if (step && step > 0) {
                if (percent === 100) val = max;
                else val = Math.floor(val / step) * step;
            }

            return val;
        };
        o.getPercentByVal = function (val, min, max) {
            var percent = parseFloat(((val - min) / (max - min) * 100).toFixed(1));
            return percent;
        }

        o.getClientX = function (e) {
            if (e.clientX) {
                return e.clientX
            } else if (e.touches && e.touches.length > 0) {
                return e.touches[0].clientX;
            } else {
                return touchStartClientX;
            }
            //return e.clientX == undefined ? e.touches[0].clientX : e.clientX;        
        }

        o.initMoveRects = function (e) {
            var newX = o.getClientX(e) - o.offsetX;


            o.oDiffValue = o.oEndValue - o.oStartValue;
            o.oParentRect = o.oHtm.parent.getBoundingClientRect();
            o.oParentX = o.oParentRect.left + window.scrollX;
            o.oMaxXStart = o.oHtm.parent.clientWidth - (o.oHtm.childStart.offsetWidth + o.oHtm.childEnd.offsetWidth);
            o.oMaxXEnd = o.oHtm.parent.clientWidth - (o.oHtm.childEnd.offsetWidth);
            o.oMaxX = o.isDraggingStart ? o.oMaxXStart : o.oMaxXEnd;
            o.oClampedX = Math.max(o.oParentX, Math.min(newX, o.oParentX + o.oMaxX));
        }


        o.moveDraggingRange = function () {
            var start1 = Math.max(0, o.oClampedX - o.oParentX);
            var offset = start1 - o.oClientStartLeft;
            var end1 = o.oClientEndLeft + offset;
            var diff = end1 - start1;

            var outsideRange = end1 > o.oMaxXEnd;// - o.oHtm.childStart.offsetWidth;

            if (outsideRange) {
                end1 = o.oMaxXEnd;// - o.oHtm.childStart.offsetWidth;
                start1 = end1 - diff;
            }

            o.oClientStartLeft = start1;
            o.setStartPosition();

            o.oClientEndLeft = end1;
            o.setEndPosition();
        }
        o.moveDraggingStart = function () {
            o.oClientStartLeft = o.oClampedX - o.oParentX + o.oStartXClick;
            o.setStartPosition();

            if (o.isHandleRight && o.oClientStartLeft + o.oHtm.childStart.offsetWidth > o.oClientEndLeft) {

                o.oClientEndLeft = o.oClientStartLeft + o.oHtm.childStart.offsetWidth;
                o.setEndPosition();
            }
        }
        o.moveDraggingEnd = function () {
            o.oClientEndLeft = Math.max(o.oHtm.childStart.offsetWidth, o.oClampedX - o.oParentX + o.oEndXClick);

            o.setEndPosition(0);

            if (o.isHandleLeft && o.oClientEndLeft < o.oClientStartLeft + o.oHtm.childStart.offsetWidth) {

                o.oClientStartLeft = o.oClientEndLeft - o.oHtm.childStart.offsetWidth;
                o.setStartPosition();
            }
        }


        o.myAlert = function (msg) {
            alert(msg);

        }

        o.setOHtml = function () {
            o.oHtm = {};

            o.oHtm.parentSelector = o.parentSelector;
            o.oHtm.parent = document.querySelector(o.parentSelector);
            o.oHtm.childStart = document.querySelector(o.parentSelector + ' .adj-start');
            o.oHtm.childEnd = document.querySelector(o.parentSelector + ' .adj-end');
            o.oHtm.childRange = document.querySelector(o.parentSelector + ' .adj-range');
            o.oHtm.childRangeBg = document.querySelector(o.parentSelector + ' .adj-range-bg');
            o.oHtm.childRangeBgDiv = document.querySelector(o.parentSelector + ' .adj-range-bg>div');
            
            for (var i = 0; i < o.cssVarList.length; i++) {

                var r = document.querySelector(o.parentSelector);
                r.style.setProperty(cssVarList[i].key, o.cssVarList[i].value);

            }

            var maxHeight = Math.max(o.oHtm.childStart.offsetHeight, o.oHtm.childEnd.offsetHeight);
            if (maxHeight > o.oHtm.childStart.offsetHeight) o.oHtm.childStart.style.marginTop = ((maxHeight - o.oHtm.childStart.offsetHeight) / 2) + 'px';
            if (maxHeight > o.oHtm.childEnd.offsetHeight) o.oHtm.childEnd.style.marginTop = ((maxHeight - o.oHtm.childEnd.offsetHeight) / 2) + 'px';



            o.isHandleMiddle = document.querySelector(parentSelector).classList.contains('adj-move-handle-middle');
            if (o.isHandleMiddle) {
                o.rangeLeftAdjustment = o.oHtm.childStart.offsetWidth / 2;
                o.rangeRightAdjustment = o.oHtm.childEnd.offsetWidth / 2;

                o.oHtm.childRangeBgDiv.style.marginLeft = (o.oHtm.childStart.offsetWidth / 2) + 'px';
                o.oHtm.childRangeBgDiv.style.marginRight = (o.oHtm.childEnd.offsetWidth / 2) + 'px';
                o.oHtm.childRangeBgDiv.style.width = 'auto';
            }

            o.isHandleInside = document.querySelector(parentSelector).classList.contains('adj-move-handle-inside');
            if (o.isHandleInside) o.isHandleMiddle = false;
            if (o.isHandleInside) {
                o.rangeLeftAdjustment = o.oHtm.childStart.offsetWidth;
                o.rangeRightAdjustment = o.oHtm.childEnd.offsetWidth;



                o.oHtm.childRangeBgDiv.style.marginLeft = '0';
                o.oHtm.childRangeBgDiv.style.marginRight = '0';
                o.oHtm.childRangeBgDiv.style.width = 'auto';

                //oHtm.childStart.style.marginLeft = '' + (o.oHtm.childStart.offsetWidth ) + 'px';
                //oHtm.childEnd.style.marginLeft = '-' + (o.oHtm.childEnd.offsetWidth ) + 'px';
            }


        }

        o.adjustRange = function () {
            if (o.isHandleMiddle) {
                var dsad = 0;
            }
            var x = o.isHandleMiddle ? 0 : 0;
            var x1 = o.isHandleMiddle ? 0 : 0;

            x = o.isHandleInside && false ? (o.oHtm.childStart.offsetWidth + o.oHtm.childEnd.offsetWidth) : x;
            x1 = o.isHandleInside && false ? o.oHtm.childStart.offsetWidth : x1;

            var rangeWidth = o.oClientEndLeft - o.oClientStartLeft - o.oHtm.childStart.offsetWidth - x;// + 2;
            var rangeLeft = o.oClientStartLeft + o.oHtm.childStart.offsetWidth + x1;// - 1;


            rangeWidth += o.rangeLeftAdjustment + o.rangeRightAdjustment;
            rangeLeft -= o.rangeLeftAdjustment;

            o.oHtm.childRange.style.left = rangeLeft + 'px';
            o.oHtm.childRange.style.width = rangeWidth + 'px';

        }

        o.initPositions = function () {
            o.oStartXClick = 0;
            o.oEndXClick = 0;

            var maxXRootStart = o.oHtm.parent.clientWidth - o.oHtm.childStart.offsetWidth;
            var maxXRootEnd = o.oHtm.parent.clientWidth - o.oHtm.childEnd.offsetWidth;

            o.oClientStartLeft = o.getValByPercent(maxXRootStart, o.oStartPercent, o.oStepValue);
            o.oClientEndLeft = o.getValByPercent(maxXRootEnd, o.oEndPercent, o.oStepValue);
            o.oParentRect = o.oHtm.parent.getBoundingClientRect();
            o.oParentX = o.oParentRect.left + window.scrollX;

            o.oHtm.childStart.style.left = o.oClientStartLeft + 'px';
            o.oHtm.childEnd.style.left = o.oClientEndLeft + 'px';

            o.adjustRange();
        }



    }


}

export async function updateRange(dotNetObj, parentSelector, startValue, endValue) {

    var o = adjRangeSliders[parentSelector];

    var oldStartValue = o.oStartValue;
    var oldEndValue = o.oEndValue;

    var start = startValue;
    var end = endValue;

    if (start < o.minValue) start = o.minValue;
    if (start > o.maxValue) start = o.maxValue;
    if (end > o.maxValue) end = o.maxValue;
    if (end < o.minValue) end = o.minValue;
    if (start > end) end = start;
    if (oldStartValue == start && oldEndValue == end) return;

    updateRangeWithAnimation(start, end, oldStartValue, oldEndValue);

    //dotNetObj.invokeMethodAsync("OnMouseMoveCallback", o.floatString(o.oStartValue), o.floatString(o.oEndValue));

    function updateRangeWithAnimation(startValue, endValue, oldStartValue, oldEndValue) {
        var steps = 10;
        var timeout = 20;
        var startStep = (startValue - oldStartValue) / steps;
        var endStep = (endValue - oldEndValue) / steps;

        for (var i = 1; i <= steps; i++) {
            var newStartValue = oldStartValue + (startStep * i);
            var newEndValue = oldEndValue + (endStep * i);
            console.log(i);

            setTimeOut(newStartValue, newEndValue, i, timeout, i == steps);
        }
    }
    function setTimeOut(newStartValue, newEndValue, i, timeout, invokeMouseUp) {
        setTimeout(function () { updatePosition(newStartValue, newEndValue, invokeMouseUp); }, timeout * i);

    }
    function updatePosition(start, end, invokeMouseUp) {
        o.oStartValue = start;
        o.oEndValue = end;
        o.oStartPercent = o.getPercentByVal(o.oStartValue, o.oMinValue, o.oMaxValue);
        o.oEndPercent = o.getPercentByVal(o.oEndValue, o.oMinValue, o.oMaxValue);

        o.initPositions();

        if (invokeMouseUp) dotNetObj.invokeMethodAsync("OnMouseMoveCallback", o.floatString(o.oStartValue), o.floatString(o.oEndValue));
        //if (invokeMouseUp)  o.dotNetObj.invokeMethodAsync("OnMouseUpCallback", o.floatString(o.oStartValue), o.floatString(o.oEndValue));
    }

}

var _loadedCss = [];
export async function loadCss(href) {           
    // only load script once
    if (_loadedCss[href]) return Promise.resolve();
    return new Promise(function (resolve, reject) {
        let tag = document.createElement('link');
        tag.rel = 'stylesheet';
        tag.href = href;

        // mark script as loading/loaded
        _loadedCss[href] = true;

        tag.onload = function () {
            resolve();
        }

        tag.onerror = function () {
            console.error('Failed to load script (' + href + ').');
            reject(href);
        }

        document.head.appendChild(tag);
    });
}
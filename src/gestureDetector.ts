import { SwipeDirections } from "./common";

export class GestureDetector extends EventTarget  {

    private static instance: GestureDetector;

    private _touchSurface: HTMLElement;
    private _swipeStartX:number;
    private _swipeStartY:number;
    /**  Required min distance traveled to be considered swipe */
    private _swipeThresholdPx = 150; 
    /** maximum distance allowed at the same time in perpendicular direction */
    private _swipeRestraint = 100;
    /** maximum time allowed to travel that distance */
    private _swipeAllowedTime = 300;
    private _doubleTapTimeoutMs = 300;
    private _tapedOnce = false;
    private _startTime:number;

    private constructor(touchSurface:HTMLElement, doubleTapTimeoutMs:number = 300, swipeThresholdPx:number = 150) {
        super();
        this._touchSurface = touchSurface;
        this._swipeThresholdPx = swipeThresholdPx;
        this._doubleTapTimeoutMs = doubleTapTimeoutMs;
        this._touchSurface.addEventListener('touchstart', (e: TouchEvent) => { this.touchStart(e) }, false);
        this._touchSurface.addEventListener('touchmove', (e: TouchEvent) => { this.touchMove(e) }, false);
        this._touchSurface.addEventListener('touchend', (e: TouchEvent) => { this.touchEnd(e) }, false);
    }

    /**
     * The static method that controls the access to the singleton instance.
     *
     * This implementation let you subclass the Singleton class while keeping
     * just one instance of each subclass around.
     */
    public static getInstance(touchSurface:HTMLElement,): GestureDetector {
        if (!GestureDetector.instance) {
            GestureDetector.instance = new GestureDetector(touchSurface);
        }
        return GestureDetector.instance;
    }

    private touchStart = (e: TouchEvent) => {
        var touch = e.changedTouches[0];
        this._swipeStartX = touch.pageX;
        this._swipeStartY = touch.pageY
        this._startTime = new Date().getTime(); // record time when finger first makes contact with surface
    
        if(!this._tapedOnce) {
            this._tapedOnce = true;
            setTimeout( () => { this._tapedOnce = false; }, this._doubleTapTimeoutMs );
            return false;
        }
        e.preventDefault();
        e.stopPropagation(); 
        // double tapped
        this.dispatchDoubleTapEvent(touch.pageX, touch.pageY);
    }

    /** Dispatch a swipe event */
    private dispatchSwipeEvent(swipeDirection: SwipeDirections, distanceX: number, distanceY: number, elapsedTimeMs: number): boolean {
        return this.dispatchEvent(new CustomEvent<{distanceX: number; distanceY: number; elapsedTimeMs: number;}>(
            "swipe-" + SwipeDirections[swipeDirection].toLowerCase(), { detail: { distanceX: distanceX, distanceY: distanceY, elapsedTimeMs: elapsedTimeMs } }));
    }

    /** Dispatch a double-tap event */
    private dispatchDoubleTapEvent(x: number, y: number): boolean {
        return this.dispatchEvent(new CustomEvent<{x: number; y: number;}>(
                "double-tap", { detail: { x: x, y: y } }));
    }

    private touchMove = (e: TouchEvent) => {
        e.preventDefault(); // prevent scrolling when inside DIV
    }

    private touchEnd = (e: TouchEvent) => {
        var touch = e.changedTouches[0];
        // horizontal distance traveled by finger while in contact with surface
        var swipeDistanceX = touch.pageX - this._swipeStartX; 
        // vertical distance traveled by finger while in contact with surface
        var swipeDistanceY = touch.pageY - this._swipeStartY; 
        var elapsedTime = new Date().getTime() - this._startTime;
        var swipeDirection = SwipeDirections.None;
        if (elapsedTime <= this._swipeAllowedTime) { // first condition for a swipe met
            if (Math.abs(swipeDistanceX) >= this._swipeThresholdPx && Math.abs(swipeDistanceY) <= this._swipeRestraint) { // 2nd condition for horizontal swipe met
                swipeDirection = (swipeDistanceX < 0) ? SwipeDirections.Left : SwipeDirections.Right; // if dist traveled is negative, it indicates left swipe
            } else if (Math.abs(swipeDistanceY) >= this._swipeThresholdPx && Math.abs(swipeDistanceX) <= this._swipeRestraint) { // 2nd condition for vertical swipe met
                swipeDirection = (swipeDistanceY < 0) ? SwipeDirections.Up : SwipeDirections.Down; // if dist traveled is negative, it indicates up swipe
            };
        };
        this.dispatchSwipeEvent(swipeDirection, swipeDistanceX, swipeDistanceY, elapsedTime);
        e.preventDefault();
    }
}

//USAGE:
/*
var el = document.getElementById('someel')
swipedetect(el, function(swipedir){
    swipedir contains either "none", "left", "right", "top", or "down"
    if (swipedir =='left')
        alert('You just swiped left!')
})
*/
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/common.ts":
/*!***********************!*\
  !*** ./src/common.ts ***!
  \***********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Actions": () => (/* binding */ Actions),
/* harmony export */   "AnimationDirections": () => (/* binding */ AnimationDirections),
/* harmony export */   "AnimationPhases": () => (/* binding */ AnimationPhases),
/* harmony export */   "BinaryValues": () => (/* binding */ BinaryValues),
/* harmony export */   "BinaryValuesUtil": () => (/* binding */ BinaryValuesUtil),
/* harmony export */   "RunModes": () => (/* binding */ RunModes),
/* harmony export */   "RunStates": () => (/* binding */ RunStates),
/* harmony export */   "SwipeDirections": () => (/* binding */ SwipeDirections)
/* harmony export */ });
var AnimationPhases;
(function (AnimationPhases) {
    AnimationPhases[AnimationPhases["Standstill"] = 0] = "Standstill";
    AnimationPhases[AnimationPhases["Accelerating"] = 1] = "Accelerating";
    AnimationPhases[AnimationPhases["MaxSpeed"] = 2] = "MaxSpeed";
    AnimationPhases[AnimationPhases["Decelerating"] = 3] = "Decelerating";
    AnimationPhases[AnimationPhases["DigitChanging"] = 4] = "DigitChanging";
})(AnimationPhases || (AnimationPhases = {}));
;
var AnimationDirections;
(function (AnimationDirections) {
    AnimationDirections[AnimationDirections["Left"] = 0] = "Left";
    AnimationDirections[AnimationDirections["Right"] = 1] = "Right";
    AnimationDirections[AnimationDirections["None"] = 2] = "None";
})(AnimationDirections || (AnimationDirections = {}));
;
var RunModes;
(function (RunModes) {
    RunModes[RunModes["SingleStep"] = 0] = "SingleStep";
    RunModes[RunModes["Normal"] = 1] = "Normal";
})(RunModes || (RunModes = {}));
var Actions;
(function (Actions) {
    Actions[Actions["MoveLeft"] = 0] = "MoveLeft";
    Actions[Actions["MoveRight"] = 1] = "MoveRight";
    Actions[Actions["Halt"] = 2] = "Halt";
})(Actions || (Actions = {}));
var BinaryValues;
(function (BinaryValues) {
    BinaryValues[BinaryValues["Zero"] = 0] = "Zero";
    BinaryValues[BinaryValues["One"] = 1] = "One";
})(BinaryValues || (BinaryValues = {}));
class BinaryValuesUtil {
    static opposite(binaryValue) {
        return binaryValue == BinaryValues.Zero ? BinaryValues.One : BinaryValues.Zero;
    }
}
/** RunState */
var RunStates;
(function (RunStates) {
    RunStates[RunStates["Idle"] = 0] = "Idle";
    RunStates[RunStates["Running"] = 1] = "Running";
    RunStates[RunStates["Halted"] = 2] = "Halted";
})(RunStates || (RunStates = {}));
var SwipeDirections;
(function (SwipeDirections) {
    SwipeDirections[SwipeDirections["Up"] = 0] = "Up";
    SwipeDirections[SwipeDirections["Down"] = 1] = "Down";
    SwipeDirections[SwipeDirections["Left"] = 2] = "Left";
    SwipeDirections[SwipeDirections["Right"] = 3] = "Right";
    SwipeDirections[SwipeDirections["None"] = 4] = "None";
})(SwipeDirections || (SwipeDirections = {}));


/***/ }),

/***/ "./src/gestureDetector.ts":
/*!********************************!*\
  !*** ./src/gestureDetector.ts ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "GestureDetector": () => (/* binding */ GestureDetector)
/* harmony export */ });
/* harmony import */ var _common__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./common */ "./src/common.ts");

class GestureDetector extends EventTarget {
    constructor(touchSurface, doubleTapTimeoutMs = 300, swipeThresholdPx = 150) {
        super();
        /**  Required min distance traveled to be considered swipe */
        this._swipeThresholdPx = 150;
        /** maximum distance allowed at the same time in perpendicular direction */
        this._swipeRestraint = 100;
        /** maximum time allowed to travel that distance */
        this._swipeAllowedTime = 300;
        this._doubleTapTimeoutMs = 300;
        this._tapedOnce = false;
        this.touchStart = (e) => {
            var touch = e.changedTouches[0];
            this._swipeStartX = touch.pageX;
            this._swipeStartY = touch.pageY;
            this._startTime = new Date().getTime(); // record time when finger first makes contact with surface
            if (!this._tapedOnce) {
                this._tapedOnce = true;
                setTimeout(() => { this._tapedOnce = false; }, this._doubleTapTimeoutMs);
                return false;
            }
            e.preventDefault();
            e.stopPropagation();
            // double tapped
            this.dispatchDoubleTapEvent(touch.pageX, touch.pageY);
        };
        this.touchMove = (e) => {
            e.preventDefault(); // prevent scrolling when inside DIV
        };
        this.touchEnd = (e) => {
            var touch = e.changedTouches[0];
            // horizontal distance traveled by finger while in contact with surface
            var swipeDistanceX = touch.pageX - this._swipeStartX;
            // vertical distance traveled by finger while in contact with surface
            var swipeDistanceY = touch.pageY - this._swipeStartY;
            var elapsedTime = new Date().getTime() - this._startTime;
            var swipeDirection = _common__WEBPACK_IMPORTED_MODULE_0__.SwipeDirections.None;
            if (elapsedTime <= this._swipeAllowedTime) { // first condition for a swipe met
                if (Math.abs(swipeDistanceX) >= this._swipeThresholdPx && Math.abs(swipeDistanceY) <= this._swipeRestraint) { // 2nd condition for horizontal swipe met
                    swipeDirection = (swipeDistanceX < 0) ? _common__WEBPACK_IMPORTED_MODULE_0__.SwipeDirections.Left : _common__WEBPACK_IMPORTED_MODULE_0__.SwipeDirections.Right; // if dist traveled is negative, it indicates left swipe
                }
                else if (Math.abs(swipeDistanceY) >= this._swipeThresholdPx && Math.abs(swipeDistanceX) <= this._swipeRestraint) { // 2nd condition for vertical swipe met
                    swipeDirection = (swipeDistanceY < 0) ? _common__WEBPACK_IMPORTED_MODULE_0__.SwipeDirections.Up : _common__WEBPACK_IMPORTED_MODULE_0__.SwipeDirections.Down; // if dist traveled is negative, it indicates up swipe
                }
                ;
            }
            ;
            this.dispatchSwipeEvent(swipeDirection, swipeDistanceX, swipeDistanceY, elapsedTime);
            e.preventDefault();
        };
        this._touchSurface = touchSurface;
        this._swipeThresholdPx = swipeThresholdPx;
        this._doubleTapTimeoutMs = doubleTapTimeoutMs;
        this._touchSurface.addEventListener('touchstart', (e) => { this.touchStart(e); }, false);
        this._touchSurface.addEventListener('touchmove', (e) => { this.touchMove(e); }, false);
        this._touchSurface.addEventListener('touchend', (e) => { this.touchEnd(e); }, false);
    }
    /**
     * The static method that controls the access to the singleton instance.
     *
     * This implementation let you subclass the Singleton class while keeping
     * just one instance of each subclass around.
     */
    static getInstance(touchSurface) {
        if (!GestureDetector.instance) {
            GestureDetector.instance = new GestureDetector(touchSurface);
        }
        return GestureDetector.instance;
    }
    /** Dispatch a swipe event */
    dispatchSwipeEvent(swipeDirection, distanceX, distanceY, elapsedTimeMs) {
        return this.dispatchEvent(new CustomEvent("swipe-" + _common__WEBPACK_IMPORTED_MODULE_0__.SwipeDirections[swipeDirection].toLowerCase(), { detail: { distanceX: distanceX, distanceY: distanceY, elapsedTimeMs: elapsedTimeMs } }));
    }
    /** Dispatch a double-tap event */
    dispatchDoubleTapEvent(x, y) {
        return this.dispatchEvent(new CustomEvent("double-tap", { detail: { x: x, y: y } }));
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


/***/ }),

/***/ "./src/rule.ts":
/*!*********************!*\
  !*** ./src/rule.ts ***!
  \*********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Rule": () => (/* binding */ Rule)
/* harmony export */ });
/* harmony import */ var _common__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./common */ "./src/common.ts");

/**
 * @Class
 * Turing machine rule class. This class models a single turing machine rule.
 */
class Rule {
    constructor(ruleDef) {
        /** index of the rule when it is member of a rule set */
        this.index = 0;
        ({ forState: this.forState, whenRead: this.whenRead, transitionToState: this.transitionToState,
            action: this.action, flipTapeValue: this.flipTapeValue } = ruleDef);
    }
}
Rule.prototype.toString = function ruleToString() {
    return `${this.index}: ${this.forState} ${this.whenRead} -> ` +
        `${this.transitionToState} ${_common__WEBPACK_IMPORTED_MODULE_0__.Actions[this.action]} ` +
        `${!this.flipTapeValue ? this.whenRead : _common__WEBPACK_IMPORTED_MODULE_0__.BinaryValuesUtil.opposite(this.whenRead)}`;
};


/***/ }),

/***/ "./src/ruleSet.ts":
/*!************************!*\
  !*** ./src/ruleSet.ts ***!
  \************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "RuleSet": () => (/* binding */ RuleSet)
/* harmony export */ });
/* harmony import */ var _common__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./common */ "./src/common.ts");

/**
 * @Class
 * Rule set class. This class models a set of turing machine rules.
 */
class RuleSet {
    constructor(rules) {
        this._index = {};
        this._list = [];
        // and index them 
        rules.forEach(rule => { this.addRule(rule); });
    }
    addToIndex(rule) {
        rule.index = this._list.length;
        if (rule.whenRead == _common__WEBPACK_IMPORTED_MODULE_0__.BinaryValues.Zero) {
            this._index[rule.forState].zero = rule;
        }
        else if (rule.whenRead == _common__WEBPACK_IMPORTED_MODULE_0__.BinaryValues.One) {
            this._index[rule.forState].one = rule;
        }
    }
    addRule(rule, override = false) {
        if (rule.forState in this._index) {
            if ((!override) &&
                ((rule.whenRead == _common__WEBPACK_IMPORTED_MODULE_0__.BinaryValues.Zero) && (!(this._index[rule.forState].zero == null))) ||
                ((rule.whenRead == _common__WEBPACK_IMPORTED_MODULE_0__.BinaryValues.One) && (!(this._index[rule.forState].one == null)))) {
                throw new Error('Rule for that state and value already defined. Set override to true to force overwrite of existing rule.');
            }
            this.addToIndex(rule);
            this._list.push(rule);
        }
        else {
            this._index[rule.forState] = { zero: null, one: null };
            this.addToIndex(rule);
            this._list.push(rule);
        }
    }
    getRule(state, value) {
        if (!(state in this._index)) {
            return null;
        }
        ;
        if (value == _common__WEBPACK_IMPORTED_MODULE_0__.BinaryValues.Zero) {
            return this._index[state].zero;
        }
        return this._index[state].one;
    }
}


/***/ }),

/***/ "./src/tape.ts":
/*!*********************!*\
  !*** ./src/tape.ts ***!
  \*********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Tape": () => (/* binding */ Tape)
/* harmony export */ });
/* harmony import */ var _common__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./common */ "./src/common.ts");

/**
 * @Class
 * Turing machine tape class. This class models the endless tape used by the turing machine.
 * It has a currentLocationIndex property to mark the place currently exposed to the machine.
 * It may be indexed with both positive and negative indices so that one can move in both directions of the tape.
 * The tape in pre-initialized with zeros at all it's locations.
 */
class Tape extends EventTarget {
    /** Create a new tape instance
     * @param {Array.<Number>} contents The contents of the tape - array of ones and zeroes. it is
     *                         placed on the tape from the location index zero.
     * @param {Number} currentLocationIndex The index of the tape location currently exposed to the
     *                                      turing machine
     */
    constructor(contents = [], currentLocationIndex = 0) {
        super();
        /** is the tape in locked state */
        this._locked = false;
        /** flag indicating tape is in moving state. while moving, tape can not be moved. */
        this._moving = false;
        /** flag indicating move direction. */
        this._movingLeft = false;
        /** set to true if you want the tape to auto complete moves, without need for moveComplete() call. */
        this.autocompleteMove = false;
        if (contents.length == 0) {
            throw new Error('Contents was empty, but required at least one element.');
        }
        this._min_defined_index = 0;
        this._max_defined_index = contents.length - 1;
        console.log("this.contents: " + contents);
        console.log("this.max_defined_index: " + this._max_defined_index);
        /** Array of positive indices */
        this._positiveIndices = contents.map(x => x == 0 ? _common__WEBPACK_IMPORTED_MODULE_0__.BinaryValues.Zero : _common__WEBPACK_IMPORTED_MODULE_0__.BinaryValues.One);
        /** Array of negative indices */
        this._negativeIndices = [];
        /** The index of the tape location currently exposed to the turing machine */
        this._currentLocationIndex = currentLocationIndex;
    }
    /** The current location index setter */
    set currentLocationIndex(location) {
        let oldLocationIndex = this._currentLocationIndex;
        if (oldLocationIndex == location) {
            return;
        }
        this._currentLocationIndex = location;
        this.dispatchTapeEvent("location-changed", oldLocationIndex, location);
    }
    /** The current location index getter */
    get currentLocationIndex() {
        return this._currentLocationIndex;
    }
    /** What is the maximum defined tape index. All tape indices above this one are 0 */
    get maxDefinedIndex() {
        return this._max_defined_index;
    }
    /** What is the minimum defined tape index. All tape indices below this one are 0 */
    get minDefinedIndex() {
        return this._min_defined_index;
    }
    /** Is the tape locked? If so, it can not be moved either left nor right. */
    get isLocked() {
        return this._locked;
    }
    /** Is the tape currently in moving state? If so, it can not be moved either left nor right. */
    get isMoving() {
        return this._moving;
    }
    /** Lock tape for movement. The tape move left and move right methods do not work when tape is locked. */
    lock() {
        this.dispatchTapeEvent("locked", this._currentLocationIndex, this._currentLocationIndex);
        this._locked = true;
    }
    /** Unlock the tape to allow for movement. */
    unlock() {
        this.dispatchTapeEvent("unlocked", this._currentLocationIndex, this._currentLocationIndex);
        this._locked = true;
    }
    /** Moves the tape one position to the left */
    moveLeft() {
        if (this.isLocked || this.isMoving) {
            return;
        }
        this._moving = true;
        this._movingLeft = true;
        this.dispatchTapeEvent("move-started", this._currentLocationIndex, this.currentLocationIndex + 1);
        if (this.autocompleteMove) {
            this.moveComplete();
        }
    }
    /** Moves the tape one position to the right */
    moveRight() {
        if (this.isLocked || this.isMoving) {
            return;
        }
        this._moving = true;
        this._movingLeft = false;
        this.dispatchTapeEvent("move-started", this._currentLocationIndex, this.currentLocationIndex - 1);
        if (this.autocompleteMove) {
            this.moveComplete();
        }
    }
    moveComplete() {
        let c = this._currentLocationIndex;
        if (this._movingLeft == true) {
            this._currentLocationIndex += 1;
        }
        else {
            this._currentLocationIndex -= 1;
        }
        this._moving = false;
        this.dispatchTapeEvent("move-completed", c, this._currentLocationIndex);
    }
    /** The length of the tape with defined (non-zero) values
     * @returns the length of the tape with defined values
     */
    get length() {
        return this._max_defined_index - this._min_defined_index + 1;
    }
    /** Read the contents of the tape at the current location index.
     * @returns {Number} The contents of the tape at the current location index.
     */
    read(index = null) {
        if (index == null) {
            index = this.currentLocationIndex;
        }
        if (index >= 0) {
            return this.readFromArray(this._positiveIndices, index);
        }
        else {
            return this.readFromArray(this._negativeIndices, index);
        }
    }
    /** Write a value to the tape at the current location index.
     * @param {Number} value The value to write - 1 or 0
     */
    write(value, index = null) {
        if (index == null) {
            index = this.currentLocationIndex;
        }
        if (index < this._min_defined_index) {
            this._min_defined_index = index;
        }
        if (index > this._max_defined_index) {
            this._max_defined_index = index;
        }
        if (index >= 0) {
            this._positiveIndices = this.writeToArray(this._positiveIndices, value, index);
        }
        else {
            this._negativeIndices = this.writeToArray(this._negativeIndices, value, index);
        }
    }
    /** Dispatch a tape event */
    dispatchTapeEvent(type, oldLocation, newLocation) {
        return this.dispatchEvent(new CustomEvent(type, { detail: { tape: this, oldLocation: oldLocation, newLocation: newLocation } }));
    }
    /** Read a value from an array - either positive or negative indices
     * @param {Array.<BinaryValues>} anArray array of positive or negative indices to read from
     * @returns the value at the current location index of the given array
     */
    readFromArray(anArray, index) {
        var l = Math.abs(index);
        // check the array bounds
        if (l >= anArray.length) {
            // out of bounds of so far defined positive numbers - therefore presumably 0
            return _common__WEBPACK_IMPORTED_MODULE_0__.BinaryValues.Zero;
        }
        return anArray[l];
    }
    /** Write a value to an array - either positive or negative indices
     * @param {Array.<Boolean>} anArray array of positive or negative indices to write to
     * @param {Number} value value to write - wither 0 or 1
     * @returns {Array.<Boolean>} The resulting array after the operation
     */
    writeToArray(anArray, value, index) {
        var l = Math.abs(index);
        let array_length = anArray.length;
        // is the index within already defined range?
        if (l >= array_length) {
            // if this is negative indices array, we need to pre-append a value (for example 0) at index 0. 
            // this value will never be accessed as by the convention, the positive indices array 0 index
            // is the holder of the 0 index of the combined array            
            if (array_length == 0 && index < 0) {
                anArray.push(0);
            }
            // outside of so far defined numbers
            var difference = l - array_length;
            if (difference > 1) {
                // we will enlarge the array, hopefully there will be enough memory for that 
                anArray = anArray.concat(new Array(difference - 1).fill(false));
            }
            // append the value at the top of the array
            anArray.push(value);
        }
        else {
            // inside of the so far defined numbers - we will update the current value 
            anArray[l] = value;
        }
        return anArray;
    }
}


/***/ }),

/***/ "./src/tapeView.ts":
/*!*************************!*\
  !*** ./src/tapeView.ts ***!
  \*************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "TapeView": () => (/* binding */ TapeView)
/* harmony export */ });
/* harmony import */ var _common__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./common */ "./src/common.ts");
/* harmony import */ var _gestureDetector__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./gestureDetector */ "./src/gestureDetector.ts");


/** single cell width in mm on original (pre-scaled) svg image */
const CELL_WIDTH = 10;
/** single cell height in mm on original (pre-scaled) svg image */
const CELL_HEIGHT = 13;
/** number of cells in a chunk */
const CELLS_IN_CHUNK = 4;
/** width of a single chunk of cells */
const CHUNK_OF_CELLS_WIDTH = CELLS_IN_CHUNK * CELL_WIDTH;
/** the color of the tape frame lines */
const DEFAULT_TAPE_FRAME_COLOR = "rgb(56,56,56)"; // dark gray
/** the color of the digits on the tape */
const DEFAULT_TAPE_DIGIT_COLOR = "rgb(80,80,80)"; // bit less dark gray
/** the color of the tape background */
const DEFAULT_TAPE_BACKGROUND_COLOR = "#D3D3D3";
/** the color of the digit at the current location */
const DEFAULT_CURRENT_DIGIT_COLOR = "rgb(0,0,0)"; // even darker gray
/** the acceleration when starting to move */
const ACCELERATION = 20;
/** the maximum speed at which the acceleration stops */
const MAX_SPEED = 1;
const DEFAULT_VELOCITY = 1 / 10;
/** the minimum speed at which the deceleration stops until a possible top location achieved. */
const MIN_SPEED = 1 / 50;
/** the deceleration speed when the movement is stopping */
const DECELERATION = 20;
/** velocity increase/decrease when speeding up/down */
const VELOCITY_CHANGE_STEP = 0.01;
/**
 * @Class
 * Tape view class handles displaying of the tape on the html canvas
 */
class TapeView extends EventTarget {
    /** Create a new tape view instance
     * @param {Tape} tape tape instance to view
     * @param {CanvasRenderingContext2D} ctx the canvas 2d context to draw on
     */
    constructor(tape, canvas, body) {
        super();
        this.tapeLocationChangedHandler = (e) => {
            // TODO: Implement this use-case with animation
            console.log('old location %s, new location %s', e.detail.oldLocation, e.detail.newLocation);
            //this.tape.__currentLocationIndex = e.detail.oldLocation;
            //this.animationStart(e.detail.oldLocation > e.detail.newLocation ? AnimationDirections.Left : AnimationDirections.Right);
        };
        this.swipeLeftHandler = (e) => {
            this.tape.moveLeft();
        };
        this.swipeRightHandler = (e) => {
            this.tape.moveRight();
        };
        this.swipeUpHandler = (e) => {
            this.increaseVelocity();
        };
        this.swipeDownHandler = (e) => {
            this.decreaseVelocity();
        };
        this.tapeMoveHandler = (e) => {
            this.animationStart(e.detail.oldLocation > e.detail.newLocation ? _common__WEBPACK_IMPORTED_MODULE_0__.AnimationDirections.Right : _common__WEBPACK_IMPORTED_MODULE_0__.AnimationDirections.Left);
        };
        this.keyboardHandler = (k) => {
            if (k.defaultPrevented) {
                return; // Do nothing if the event was already processed
            }
            switch (k.key) {
                case "Up": // IE/Edge specific value
                case "ArrowUp":
                    this.increaseVelocity();
                    break;
                case "Down": // IE/Edge specific value
                case "ArrowDown":
                    this.decreaseVelocity();
                    break;
                case "Left": // IE/Edge specific value
                case "ArrowLeft":
                    /* do nothing if animation already in progress */
                    if (this.animationPhase != _common__WEBPACK_IMPORTED_MODULE_0__.AnimationPhases.Standstill) {
                        k.preventDefault();
                        return;
                    }
                    this.tape.moveRight();
                    break;
                case "Right": // IE/Edge specific value
                case "ArrowRight":
                    /* do nothing if animation already in progress */
                    if (this.animationPhase != _common__WEBPACK_IMPORTED_MODULE_0__.AnimationPhases.Standstill) {
                        k.preventDefault();
                        return;
                    }
                    this.tape.moveLeft();
                    break;
                default:
                    return; // Quit when this doesn't handle the key event.
            }
            k.preventDefault();
        };
        this.tape = tape;
        this.canvas = canvas;
        this.ctx = this.canvas.getContext("2d");
        this.xScale = SCALE_FACTOR;
        this.yScale = SCALE_FACTOR;
        this.digitColor = DEFAULT_TAPE_DIGIT_COLOR;
        this.currentDigitColor = DEFAULT_CURRENT_DIGIT_COLOR;
        this.frameColor = DEFAULT_TAPE_FRAME_COLOR;
        this.backgroundColor = DEFAULT_TAPE_BACKGROUND_COLOR;
        this.animationPhase = _common__WEBPACK_IMPORTED_MODULE_0__.AnimationPhases.Standstill;
        this.currentVelocity = 0;
        this.currentAcceleration = 0.0004;
        this.animationDirection = _common__WEBPACK_IMPORTED_MODULE_0__.AnimationDirections.None;
        this.animationOffset = 0;
        this.velocity = DEFAULT_VELOCITY;
        body.addEventListener('keydown', this.keyboardHandler, true);
        this.tape.addEventListener('location-changed', this.tapeLocationChangedHandler);
        this.tape.addEventListener('move-started', this.tapeMoveHandler);
        let gestureDetector = _gestureDetector__WEBPACK_IMPORTED_MODULE_1__.GestureDetector.getInstance(canvas);
        gestureDetector.addEventListener("swipe-left", this.swipeLeftHandler);
        gestureDetector.addEventListener("swipe-right", this.swipeRightHandler);
        gestureDetector.addEventListener("swipe-up", this.swipeUpHandler);
        gestureDetector.addEventListener("swipe-down", this.swipeDownHandler);
    }
    increaseVelocity() {
        if (this.currentVelocity < MAX_SPEED) {
            this.currentVelocity += VELOCITY_CHANGE_STEP;
        }
    }
    decreaseVelocity() {
        if (this.currentVelocity > MIN_SPEED) {
            this.currentVelocity -= VELOCITY_CHANGE_STEP;
        }
    }
    animationStart(direction) {
        this.dispatchTapeViewEvent("animation-started");
        this.animationPhase = _common__WEBPACK_IMPORTED_MODULE_0__.AnimationPhases.Accelerating;
        this.animationDirection = direction;
    }
    animationStop() {
        this.animationPhase = _common__WEBPACK_IMPORTED_MODULE_0__.AnimationPhases.Standstill;
        this.tape.moveComplete();
        // if (this.animationDirection == AnimationDirections.Left) {
        //     this.tape.moveLeft();
        // } else if (this.animationDirection == AnimationDirections.Right) {
        //     this.tape.moveRight();
        // }
        this.animationDirection = _common__WEBPACK_IMPORTED_MODULE_0__.AnimationDirections.None;
        //this.currentAcceleration = 0;
        this.currentVelocity = 0;
        this.animationOffset = 0;
        this.dispatchTapeViewEvent("animation-completed");
    }
    /** Applies the scale and translate transformations in the 2d context so
     * that we are at the visible chunks top left coordinate */
    moveToVisibleChunksTopLeft() {
        let visibleChunksTopLeft = this.visibleChunksTopLeft;
        this.ctx.scale(this.xScale, this.yScale);
        this.ctx.translate(visibleChunksTopLeft.x, visibleChunksTopLeft.y);
    }
    /** Draw single chunk */
    drawChunk() {
        // #tapeFourCells
        this.ctx.beginPath();
        this.ctx.fillStyle = this.frameColor;
        this.ctx.lineWidth = 0.070004;
        this.ctx.moveTo(1.330369, 15.078956);
        this.ctx.lineTo(1.330369, 15.078956);
        this.ctx.bezierCurveTo(5.281924, 14.837656, 9.231624, 14.569896, 13.184763, 14.354796);
        this.ctx.bezierCurveTo(13.450934, 14.340296, 13.721867, 14.339996, 13.983540, 14.390296);
        this.ctx.bezierCurveTo(14.168484, 14.425696, 14.317709, 14.628416, 14.505034, 14.607786);
        this.ctx.bezierCurveTo(15.135801, 14.538486, 15.716826, 14.199266, 16.347592, 14.130206);
        this.ctx.bezierCurveTo(16.540474, 14.109006, 16.694197, 14.339496, 16.887872, 14.347166);
        this.ctx.bezierCurveTo(18.562155, 14.413566, 20.238820, 14.361466, 21.914157, 14.351166);
        this.ctx.bezierCurveTo(22.093287, 14.350166, 22.277967, 14.361466, 22.450207, 14.312266);
        this.ctx.bezierCurveTo(22.550217, 14.283666, 22.599167, 14.147436, 22.701027, 14.126006);
        this.ctx.bezierCurveTo(22.962177, 14.071006, 23.236287, 14.054806, 23.500607, 14.090806);
        this.ctx.bezierCurveTo(23.775767, 14.128406, 24.017867, 14.367026, 24.294617, 14.343476);
        this.ctx.bezierCurveTo(24.926707, 14.289476, 25.509057, 13.954546, 26.137177, 13.865906);
        this.ctx.bezierCurveTo(26.243537, 13.850806, 26.297517, 14.045556, 26.404937, 14.045296);
        this.ctx.bezierCurveTo(26.597017, 14.044766, 26.760527, 13.853736, 26.952617, 13.864056);
        this.ctx.bezierCurveTo(28.452807, 13.944256, 29.934737, 14.315696, 31.437307, 14.314106);
        this.ctx.bezierCurveTo(31.983407, 14.313316, 32.472087, 13.948716, 33.010517, 13.856906);
        this.ctx.bezierCurveTo(33.365857, 13.796306, 33.734677, 13.811906, 34.091867, 13.860906);
        this.ctx.bezierCurveTo(34.278397, 13.886606, 34.426037, 14.099036, 34.613367, 14.078396);
        this.ctx.bezierCurveTo(35.244127, 14.009096, 35.825157, 13.669876, 36.455917, 13.600826);
        this.ctx.bezierCurveTo(36.648807, 13.579626, 36.802527, 13.806936, 36.996197, 13.817786);
        this.ctx.bezierCurveTo(38.277847, 13.888386, 39.910307, 13.610186, 41.173957, 13.833986);
        this.ctx.bezierCurveTo(41.925257, 11.864776, 41.080457, 3.974236, 41.065197, 1.657736);
        this.ctx.bezierCurveTo(41.049597, -0.711994, 40.714787, 0.162956, 40.346167, 0.136576);
        this.ctx.bezierCurveTo(39.957907, 0.108776, 39.600987, 0.648086, 39.492547, 0.492576);
        this.ctx.bezierCurveTo(39.112617, 0.245356, 38.933947, 0.435076, 38.818327, 0.360686);
        this.ctx.bezierCurveTo(38.152107, 0.420586, 37.486937, 0.253486, 37.486937, 0.253486);
        this.ctx.bezierCurveTo(36.855117, 0.366996, 36.573397, 0.254486, 35.935487, 0.324286);
        this.ctx.bezierCurveTo(34.971877, 0.428796, 33.994767, 0.386486, 33.027447, 0.324026);
        this.ctx.bezierCurveTo(32.838537, 0.311826, 32.690107, 0.139076, 32.504367, 0.102566);
        this.ctx.bezierCurveTo(32.242167, 0.050966, 31.970967, 0.063366, 31.703737, 0.063366);
        this.ctx.bezierCurveTo(31.436507, 0.063366, 31.165317, 0.050966, 30.903107, 0.102566);
        this.ctx.bezierCurveTo(30.717377, 0.139066, 30.566557, 0.292536, 30.379767, 0.324026);
        this.ctx.bezierCurveTo(30.119677, 0.367926, 29.848477, 0.366126, 29.587867, 0.324026);
        this.ctx.bezierCurveTo(29.312967, 0.279526, 29.069017, 0.100976, 28.792267, 0.067376);
        this.ctx.bezierCurveTo(28.355437, 0.014476, 27.906437, -0.004024, 27.471997, 0.067116);
        this.ctx.bezierCurveTo(26.838057, 0.171096, 26.255177, 0.519016, 25.616737, 0.588866);
        this.ctx.bezierCurveTo(24.653127, 0.694436, 23.676017, 0.651066, 22.708707, 0.588606);
        this.ctx.bezierCurveTo(22.519787, 0.576406, 22.369507, 0.412396, 22.185627, 0.367146);
        this.ctx.bezierCurveTo(22.011787, 0.324246, 21.828697, 0.328246, 21.649577, 0.328246);
        this.ctx.bezierCurveTo(21.382347, 0.328246, 21.111147, 0.315546, 20.848947, 0.367146);
        this.ctx.bezierCurveTo(20.663207, 0.403646, 20.514517, 0.574056, 20.325603, 0.588606);
        this.ctx.bezierCurveTo(19.535028, 0.648906, 18.737309, 0.647106, 17.946205, 0.588606);
        this.ctx.bezierCurveTo(17.753059, 0.574306, 17.598807, 0.348096, 17.406455, 0.372176);
        this.ctx.bezierCurveTo(16.860355, 0.440476, 16.374315, 0.794716, 15.827157, 0.853456);
        this.ctx.bezierCurveTo(14.863280, 0.956646, 13.886174, 0.920156, 12.919122, 0.853186);
        this.ctx.bezierCurveTo(12.641309, 0.833886, 12.401597, 0.617706, 12.123520, 0.596546);
        this.ctx.bezierCurveTo(11.244574, 0.530146, 10.360336, 0.583546, 9.478744, 0.592546);
        this.ctx.bezierCurveTo(9.211515, 0.595546, 8.940317, 0.580146, 8.678115, 0.631746);
        this.ctx.bezierCurveTo(8.492378, 0.668246, 8.341301, 0.820126, 8.154769, 0.852936);
        this.ctx.bezierCurveTo(7.978821, 0.883936, 7.792290, 0.864536, 7.619782, 0.818036);
        this.ctx.bezierCurveTo(7.516065, 0.790236, 7.458386, 0.617746, 7.353082, 0.637856);
        this.ctx.bezierCurveTo(6.894294, 0.724656, 6.501917, 1.071246, 6.037574, 1.118076);
        this.ctx.bezierCurveTo(4.897749, 1.233166, 3.744165, 1.186076, 2.600633, 1.117816);
        this.ctx.bezierCurveTo(2.323085, 1.101116, 2.082050, 0.895296, 1.805825, 0.865396);
        this.ctx.bezierCurveTo(1.669829, 0.850596, 1.530923, 0.917296, 1.413977, 0.988696);
        this.ctx.bezierCurveTo(1.315817, 1.048996, 1.229033, 1.140566, 1.183789, 1.246396);
        this.ctx.bezierCurveTo(1.125849, 1.382926, 1.204959, 1.566546, 1.117649, 1.686406);
        this.ctx.bezierCurveTo(0.976097, 1.881136, 0.656480, 1.912356, 0.544297, 2.125346);
        this.ctx.bezierCurveTo(0.299028, 2.590746, 0.114613, 3.111446, 0.089742, 3.636906);
        this.ctx.bezierCurveTo(-0.027468, 6.108646, -0.042285, 8.591236, 0.120172, 11.060326);
        this.ctx.bezierCurveTo(0.200872, 12.285346, 0.462543, 13.501636, 0.816556, 14.677446);
        this.ctx.moveTo(1.681743, 13.693456);
        this.ctx.lineTo(1.681743, 13.693456);
        this.ctx.bezierCurveTo(1.503943, 12.721376, 1.203377, 11.763856, 1.148079, 10.777216);
        this.ctx.bezierCurveTo(1.024783, 8.576686, 1.079819, 6.368206, 1.148343, 4.165286);
        this.ctx.bezierCurveTo(1.154143, 3.976106, 1.324556, 3.826086, 1.369800, 3.642206);
        this.ctx.bezierCurveTo(1.412660, 3.468366, 1.408690, 3.285276, 1.408690, 3.106156);
        this.ctx.bezierCurveTo(1.408690, 2.838926, 1.422180, 2.567466, 1.370060, 2.305526);
        this.ctx.bezierCurveTo(1.349690, 2.203666, 1.119499, 2.115296, 1.197286, 2.046236);
        this.ctx.bezierCurveTo(1.352067, 1.909186, 1.598924, 1.900716, 1.804770, 1.919766);
        this.ctx.bezierCurveTo(2.082317, 1.945466, 2.322295, 2.159216, 2.600636, 2.176146);
        this.ctx.bezierCurveTo(3.744168, 2.245446, 4.895899, 2.274346, 6.037312, 2.176406);
        this.ctx.bezierCurveTo(6.932927, 2.099706, 7.784356, 1.670266, 8.683145, 1.654916);
        this.ctx.bezierCurveTo(9.257027, 1.644916, 10.181216, 1.552786, 10.346052, 2.102596);
        this.ctx.bezierCurveTo(10.697948, 3.276016, 9.909754, 4.527236, 9.911870, 5.752256);
        this.ctx.bezierCurveTo(9.915570, 7.694556, 10.276995, 9.621256, 10.363250, 11.561446);
        this.ctx.bezierCurveTo(10.368050, 11.669396, 10.215612, 11.727606, 10.181745, 11.829996);
        this.ctx.bezierCurveTo(10.152375, 11.918396, 10.151315, 12.021296, 10.181745, 12.109136);
        this.ctx.bezierCurveTo(10.215875, 12.207036, 10.346316, 12.257826, 10.365631, 12.359696);
        this.ctx.bezierCurveTo(10.421991, 12.656556, 10.691598, 13.182286, 10.401081, 13.265096);
        this.ctx.bezierCurveTo(8.738175, 13.738706, 6.968906, 13.703776, 5.243558, 13.818076);
        this.ctx.bezierCurveTo(4.188664, 13.888176, 3.128214, 13.854876, 2.071730, 13.817816);
        this.ctx.moveTo(20.338041, 13.245786);
        this.ctx.lineTo(20.338041, 13.245786);
        this.ctx.bezierCurveTo(18.658731, 13.262686, 16.977304, 13.208186, 15.300375, 13.296586);
        this.ctx.bezierCurveTo(15.022298, 13.311386, 14.782585, 13.530736, 14.504773, 13.553226);
        this.ctx.bezierCurveTo(13.714198, 13.617026, 12.917008, 13.604026, 12.125375, 13.553226);
        this.ctx.bezierCurveTo(11.964243, 13.542926, 11.708127, 13.529426, 11.676641, 13.371196);
        this.ctx.bezierCurveTo(11.385070, 11.909636, 11.276856, 10.413686, 11.202243, 8.925136);
        this.ctx.bezierCurveTo(11.118373, 7.252706, 11.091383, 5.572606, 11.202243, 3.901756);
        this.ctx.bezierCurveTo(11.248813, 3.199816, 11.472648, 2.519046, 11.671614, 1.844356);
        this.ctx.bezierCurveTo(11.694104, 1.768656, 11.775066, 1.687726, 11.853648, 1.693016);
        this.ctx.bezierCurveTo(12.129873, 1.711816, 12.378316, 1.896216, 12.654541, 1.911566);
        this.ctx.bezierCurveTo(13.710493, 1.969766, 14.774648, 2.015546, 15.826895, 1.911826);
        this.ctx.bezierCurveTo(16.551325, 1.840426, 17.224689, 1.478966, 17.947002, 1.390066);
        this.ctx.bezierCurveTo(18.646560, 1.304066, 19.357495, 1.351466, 20.061023, 1.390596);
        this.ctx.bezierCurveTo(20.187493, 1.397596, 20.422443, 1.400896, 20.415300, 1.527126);
        this.ctx.bezierCurveTo(20.384610, 2.068456, 20.086158, 2.561646, 19.964450, 3.089756);
        this.ctx.bezierCurveTo(19.923700, 3.267286, 19.930850, 3.453026, 19.930050, 3.635326);
        this.ctx.bezierCurveTo(19.920550, 5.751196, 19.825275, 7.870246, 19.933450, 9.983466);
        this.ctx.bezierCurveTo(19.987950, 11.050536, 20.285611, 12.091666, 20.417109, 13.151856);
        this.ctx.moveTo(30.129430, 12.983056);
        this.ctx.lineTo(30.129430, 12.983056);
        this.ctx.bezierCurveTo(28.537700, 12.999156, 26.943850, 12.944956, 25.354500, 13.032056);
        this.ctx.bezierCurveTo(25.076420, 13.047356, 24.836970, 13.269646, 24.558900, 13.288696);
        this.ctx.bezierCurveTo(23.634970, 13.351396, 22.175000, 14.113136, 21.780770, 13.275196);
        this.ctx.bezierCurveTo(20.710800, 10.999516, 21.088620, 8.283036, 21.023000, 5.768966);
        this.ctx.bezierCurveTo(20.993100, 4.630466, 21.300550, 3.507306, 21.496340, 2.385476);
        this.ctx.bezierCurveTo(21.555040, 2.048926, 21.586040, 1.679566, 21.785530, 1.402286);
        this.ctx.bezierCurveTo(21.863830, 1.293536, 22.057000, 1.391986, 22.186380, 1.426386);
        this.ctx.bezierCurveTo(22.369200, 1.474786, 22.520020, 1.635666, 22.708660, 1.647046);
        this.ctx.bezierCurveTo(23.764350, 1.710246, 24.833270, 1.789916, 25.881280, 1.647306);
        this.ctx.bezierCurveTo(26.701750, 1.535656, 27.449200, 1.109406, 28.248510, 0.892716);
        this.ctx.bezierCurveTo(28.424190, 0.845116, 28.611250, 0.857816, 28.793280, 0.857816);
        this.ctx.bezierCurveTo(28.975320, 0.857816, 29.166610, 0.831316, 29.337800, 0.893016);
        this.ctx.bezierCurveTo(29.655300, 1.007046, 30.046090, 1.090126, 30.227850, 1.374286);
        this.ctx.bezierCurveTo(30.395860, 1.637546, 30.287950, 2.002146, 30.244550, 2.311446);
        this.ctx.bezierCurveTo(30.218050, 2.499036, 30.068340, 2.650906, 30.023100, 2.834786);
        this.ctx.bezierCurveTo(29.980200, 3.008616, 29.985300, 3.191716, 29.984200, 3.370836);
        this.ctx.bezierCurveTo(29.973600, 5.222656, 29.912200, 7.075796, 29.988200, 8.926026);
        this.ctx.bezierCurveTo(29.999600, 9.204636, 30.225530, 9.443816, 30.244840, 9.721626);
        this.ctx.bezierCurveTo(30.311740, 10.688946, 30.278940, 11.661286, 30.244580, 12.630196);
        this.ctx.moveTo(40.448420, 12.718596);
        this.ctx.lineTo(40.448420, 12.718596);
        this.ctx.bezierCurveTo(38.768580, 12.734696, 37.086890, 12.686096, 35.408900, 12.767596);
        this.ctx.bezierCurveTo(35.219990, 12.776596, 35.069710, 12.943806, 34.885820, 12.989046);
        this.ctx.bezierCurveTo(34.711990, 13.031946, 34.528900, 13.025546, 34.349770, 13.027946);
        this.ctx.bezierCurveTo(33.644660, 13.036946, 32.937430, 13.076046, 32.233900, 13.023946);
        this.ctx.bezierCurveTo(32.071980, 13.012046, 31.830150, 12.994046, 31.783050, 12.838476);
        this.ctx.bezierCurveTo(31.502860, 11.915606, 31.357870, 10.946966, 31.310770, 9.983356);
        this.ctx.bezierCurveTo(31.198850, 7.693656, 31.297770, 5.398396, 31.307770, 3.106046);
        this.ctx.bezierCurveTo(31.308560, 2.923746, 31.294570, 2.736416, 31.342170, 2.560736);
        this.ctx.bezierCurveTo(31.474460, 2.074696, 31.430770, 1.423556, 31.844080, 1.135686);
        this.ctx.bezierCurveTo(32.174810, 0.904976, 32.624870, 1.363236, 33.027300, 1.385986);
        this.ctx.bezierCurveTo(34.083520, 1.445786, 35.145560, 1.451286, 36.201240, 1.381986);
        this.ctx.bezierCurveTo(36.479320, 1.363686, 36.719830, 1.155236, 36.996850, 1.125336);
        this.ctx.bezierCurveTo(37.522570, 1.068736, 38.057030, 1.068736, 38.582490, 1.125336);
        this.ctx.bezierCurveTo(38.859780, 1.155236, 39.102130, 1.343626, 39.378100, 1.381986);
        this.ctx.bezierCurveTo(39.642410, 1.418486, 39.915990, 1.398386, 40.177930, 1.347086);
        this.ctx.bezierCurveTo(40.279800, 1.326986, 40.337210, 1.202896, 40.437220, 1.174316);
        this.ctx.bezierCurveTo(40.473720, 1.163716, 40.519020, 1.209816, 40.524820, 1.247316);
        this.ctx.bezierCurveTo(40.553120, 1.429346, 40.557620, 1.616936, 40.533820, 1.799496);
        this.ctx.moveTo(9.755219, 1.337526);
        this.ctx.lineTo(9.755219, 1.337526);
        this.ctx.bezierCurveTo(9.636421, 1.309726, 9.402264, 1.376426, 9.399089, 1.254426);
        this.ctx.bezierCurveTo(9.396189, 1.133776, 9.633246, 1.139066, 9.750721, 1.166626);
        this.ctx.fill();
        // fill the first cell with tape background color
        this.ctx.save();
        this.ctx.beginPath();
        this.ctx.transform(0.264583, 0.000000, 0.000000, 0.264583, 0.000000, 0.000000);
        this.ctx.fillStyle = this.backgroundColor;
        this.ctx.lineWidth = 0.016785;
        this.ctx.moveTo(34.467867, 6.258842);
        this.ctx.bezierCurveTo(32.658533, 6.256906, 30.837482, 6.370921, 29.088429, 6.867096);
        this.ctx.bezierCurveTo(26.505157, 7.525553, 23.921437, 8.322273, 21.232907, 8.372382);
        this.ctx.bezierCurveTo(17.401370, 8.494923, 13.557678, 8.528086, 9.733334, 8.230513);
        this.ctx.bezierCurveTo(8.768843, 8.110203, 7.929301, 7.527537, 7.009943, 7.295999);
        this.ctx.bezierCurveTo(6.223647, 7.318255, 5.354094, 7.157642, 4.680069, 7.672825);
        this.ctx.bezierCurveTo(4.315389, 7.825605, 4.734953, 8.139480, 4.884354, 8.280949);
        this.ctx.bezierCurveTo(5.462339, 8.728010, 5.212453, 9.536175, 5.288732, 10.160795);
        this.ctx.bezierCurveTo(5.268733, 11.376665, 5.379426, 12.607252, 5.193151, 13.812968);
        this.ctx.bezierCurveTo(4.994020, 14.537806, 4.368641, 15.108933, 4.394100, 15.902718);
        this.ctx.bezierCurveTo(4.164952, 21.270516, 4.101303, 26.645705, 4.124507, 32.018300);
        this.ctx.bezierCurveTo(4.173929, 35.482173, 4.178169, 38.955982, 4.529650, 42.405473);
        this.ctx.bezierCurveTo(4.939525, 45.542286, 5.789851, 48.598272, 6.379276, 51.702296);
        this.ctx.bezierCurveTo(7.086178, 51.929186, 7.769072, 52.284872, 8.531996, 52.211220);
        this.ctx.bezierCurveTo(12.949589, 52.416845, 17.377057, 52.366561, 21.790209, 52.086429);
        this.ctx.bezierCurveTo(27.613526, 51.759703, 33.531999, 51.713972, 39.188823, 50.126868);
        this.ctx.bezierCurveTo(39.769011, 50.046048, 39.831899, 49.381978, 39.720863, 48.918564);
        this.ctx.bezierCurveTo(39.558908, 48.132356, 39.327992, 47.352350, 39.077187, 46.594142);
        this.ctx.bezierCurveTo(38.791875, 46.172681, 38.299512, 45.805791, 38.380231, 45.231579);
        this.ctx.bezierCurveTo(38.281731, 44.592243, 38.912680, 44.245197, 39.139882, 43.733714);
        this.ctx.bezierCurveTo(38.892822, 38.693265, 38.208623, 33.686307, 37.777976, 28.660001);
        this.ctx.bezierCurveTo(37.579889, 26.076655, 37.352922, 23.481717, 37.478566, 20.889497);
        this.ctx.bezierCurveTo(37.704240, 17.800974, 38.932318, 14.896696, 39.313469, 11.835103);
        this.ctx.bezierCurveTo(39.362789, 10.448664, 39.511386, 8.985794, 38.943990, 7.678277);
        this.ctx.bezierCurveTo(38.384038, 6.603054, 37.054285, 6.377576, 35.957430, 6.288455);
        this.ctx.bezierCurveTo(35.461667, 6.255740, 34.964483, 6.254652, 34.467867, 6.258842);
        this.ctx.fill();
        this.ctx.restore();
        // fill the small spot in tape frame with tape background color
        this.ctx.save();
        this.ctx.beginPath();
        this.ctx.transform(0.264583, 0.000000, 0.000000, 0.264583, 0.000000, 0.000000);
        this.ctx.fillStyle = this.backgroundColor;
        this.ctx.lineWidth = 0.016785;
        this.ctx.moveTo(36.240053, 4.410208);
        this.ctx.bezierCurveTo(35.988808, 4.388763, 35.445949, 4.497755, 35.629211, 4.856259);
        this.ctx.bezierCurveTo(35.965327, 5.048036, 36.419261, 5.012958, 36.793529, 4.966037);
        this.ctx.bezierCurveTo(36.950659, 4.828731, 36.784529, 4.581475, 36.788529, 4.408969);
        this.ctx.bezierCurveTo(36.605694, 4.409683, 36.422830, 4.407459, 36.240010, 4.410209);
        this.ctx.fill();
        this.ctx.restore();
        // fill the second cell with tape background color
        this.ctx.save();
        this.ctx.beginPath();
        this.ctx.transform(0.264583, 0.000000, 0.000000, 0.264583, 0.000000, 0.000000);
        this.ctx.fillStyle = this.backgroundColor;
        this.ctx.lineWidth = 0.016785;
        this.ctx.moveTo(70.612391, 5.120916);
        this.ctx.bezierCurveTo(68.647789, 5.099834, 66.684779, 5.383236, 64.817937, 6.001000);
        this.ctx.bezierCurveTo(62.803559, 6.625629, 60.768222, 7.279063, 58.642137, 7.354040);
        this.ctx.bezierCurveTo(55.886527, 7.509637, 53.121671, 7.463954, 50.364025, 7.382331);
        this.ctx.bezierCurveTo(48.992945, 7.280707, 47.558115, 7.398056, 46.268719, 6.832297);
        this.ctx.bezierCurveTo(45.730004, 6.702373, 45.175019, 6.355504, 44.611196, 6.481869);
        this.ctx.bezierCurveTo(44.042765, 6.749669, 44.058287, 7.497476, 43.840023, 8.007488);
        this.ctx.bezierCurveTo(43.074793, 10.488636, 42.428036, 13.027461, 42.312841, 15.633160);
        this.ctx.bezierCurveTo(42.095986, 19.805803, 42.114356, 23.987909, 42.179398, 28.164568);
        this.ctx.bezierCurveTo(42.336176, 34.743675, 42.678956, 41.337012, 43.684528, 47.847272);
        this.ctx.bezierCurveTo(43.872255, 48.811394, 43.953110, 49.815425, 44.282853, 50.741428);
        this.ctx.bezierCurveTo(44.806718, 51.219515, 45.599563, 51.126613, 46.259520, 51.221675);
        this.ctx.bezierCurveTo(48.918469, 51.387207, 51.587489, 51.331460, 54.248257, 51.240385);
        this.ctx.bezierCurveTo(55.480386, 51.274765, 56.490024, 50.443446, 57.667800, 50.246730);
        this.ctx.bezierCurveTo(60.730670, 50.038781, 63.805033, 50.092691, 66.873357, 50.049916);
        this.ctx.bezierCurveTo(70.211998, 50.032356, 73.550669, 50.021096, 76.889323, 50.006306);
        this.ctx.bezierCurveTo(77.310234, 49.591672, 76.970113, 48.981493, 76.958833, 48.481430);
        this.ctx.bezierCurveTo(76.327049, 44.509195, 75.348425, 40.573051, 75.249739, 36.533724);
        this.ctx.bezierCurveTo(75.041807, 30.797328, 75.153969, 25.055065, 75.226419, 19.316989);
        this.ctx.bezierCurveTo(75.277689, 16.833783, 75.287519, 14.344731, 75.364637, 11.865172);
        this.ctx.bezierCurveTo(75.849129, 9.850336, 76.880644, 7.979361, 77.117305, 5.905223);
        this.ctx.bezierCurveTo(77.170732, 5.353462, 76.460906, 5.360233, 76.085935, 5.309992);
        this.ctx.bezierCurveTo(74.265958, 5.164459, 72.437774, 5.118045, 70.612391, 5.120916);
        this.ctx.fill();
        this.ctx.restore();
        // fill the third cell with tape background color
        this.ctx.save();
        this.ctx.beginPath();
        this.ctx.transform(0.264583, 0.000000, 0.000000, 0.264583, 0.000000, 0.000000);
        this.ctx.fillStyle = this.backgroundColor;
        this.ctx.lineWidth = 0.033570;
        this.ctx.moveTo(109.420580, 3.326799);
        this.ctx.bezierCurveTo(107.875340, 3.290394, 106.318140, 3.418320, 104.897870, 4.076908);
        this.ctx.bezierCurveTo(101.730230, 5.241485, 98.513325, 6.568835, 95.073097, 6.495745);
        this.ctx.bezierCurveTo(91.850388, 6.532951, 88.597784, 6.606351, 85.400724, 6.157985);
        this.ctx.bezierCurveTo(84.465271, 5.899340, 83.571825, 5.102688, 82.576972, 5.243085);
        this.ctx.bezierCurveTo(81.585913, 6.275240, 81.610817, 7.875709, 81.279182, 9.196415);
        this.ctx.bezierCurveTo(80.585437, 13.138624, 79.533334, 17.054093, 79.618077, 21.089278);
        this.ctx.bezierCurveTo(79.566287, 27.893418, 79.222459, 34.728848, 79.956908, 41.508859);
        this.ctx.bezierCurveTo(80.371942, 44.532454, 81.113169, 47.573958, 82.532367, 50.290048);
        this.ctx.bezierCurveTo(83.257091, 51.696102, 84.982854, 51.655334, 86.327768, 51.440613);
        this.ctx.bezierCurveTo(88.562859, 51.076627, 90.756129, 50.487380, 92.984835, 50.088086);
        this.ctx.bezierCurveTo(94.307511, 49.704868, 95.566062, 49.011051, 96.989337, 49.142478);
        this.ctx.bezierCurveTo(102.595300, 49.045528, 108.202670, 49.058198, 113.809230, 49.011616);
        this.ctx.bezierCurveTo(114.594250, 46.670220, 114.271230, 44.152920, 114.381910, 41.727598);
        this.ctx.bezierCurveTo(114.308210, 39.809725, 114.497370, 37.833441, 114.016650, 35.960403);
        this.ctx.bezierCurveTo(113.645640, 34.988202, 113.050760, 34.072672, 113.240420, 32.987982);
        this.ctx.bezierCurveTo(113.227820, 25.544754, 113.082930, 18.097518, 113.373590, 10.657651);
        this.ctx.bezierCurveTo(114.191570, 9.121224, 114.812520, 7.242986, 114.306090, 5.513193);
        this.ctx.bezierCurveTo(113.615340, 4.180862, 111.960910, 3.833846, 110.650940, 3.397672);
        this.ctx.bezierCurveTo(110.245960, 3.319715, 109.831070, 3.327136, 109.420580, 3.326799);
        this.ctx.fill();
        this.ctx.restore();
        // fill the fourth cell with tape background color
        this.ctx.save();
        this.ctx.beginPath();
        this.ctx.transform(0.264583, 0.000000, 0.000000, 0.264583, 0.000000, 0.000000);
        this.ctx.fillStyle = this.backgroundColor;
        this.ctx.lineWidth = 0.033570;
        this.ctx.moveTo(142.493550, 4.154720);
        this.ctx.bezierCurveTo(140.870070, 4.125212, 139.254010, 4.365957, 137.765160, 5.035919);
        this.ctx.bezierCurveTo(134.431940, 5.624309, 131.013430, 5.472439, 127.642030, 5.409518);
        this.ctx.bezierCurveTo(126.142110, 5.253425, 124.530430, 5.591566, 123.178400, 4.780859);
        this.ctx.bezierCurveTo(122.188130, 4.333128, 120.761500, 3.682986, 119.943920, 4.789099);
        this.ctx.bezierCurveTo(118.955060, 6.269244, 118.866750, 8.141607, 118.521270, 9.844346);
        this.ctx.bezierCurveTo(118.225370, 14.767302, 118.363220, 19.707501, 118.279910, 24.637636);
        this.ctx.bezierCurveTo(118.328310, 30.732343, 118.032350, 36.873260, 118.935110, 42.922515);
        this.ctx.bezierCurveTo(119.300960, 44.854430, 119.555110, 46.866261, 120.358010, 48.669142);
        this.ctx.bezierCurveTo(121.193130, 49.375816, 122.446320, 49.097901, 123.463220, 49.235192);
        this.ctx.bezierCurveTo(126.263950, 49.276782, 129.098370, 49.249082, 131.875310, 49.033219);
        this.ctx.bezierCurveTo(132.856050, 48.578665, 133.778370, 47.876981, 134.916610, 48.088550);
        this.ctx.bezierCurveTo(140.857190, 48.056410, 146.797770, 48.024270, 152.738360, 47.992130);
        this.ctx.bezierCurveTo(152.978410, 41.904471, 152.897190, 35.807013, 152.982700, 29.715261);
        this.ctx.bezierCurveTo(153.024800, 21.353555, 153.121840, 12.990871, 153.076100, 4.629506);
        this.ctx.bezierCurveTo(152.643740, 4.265509, 152.266210, 5.181598, 151.772140, 5.136518);
        this.ctx.bezierCurveTo(150.073450, 5.562051, 148.285190, 5.320393, 146.709950, 4.580441);
        this.ctx.bezierCurveTo(145.346870, 4.182396, 143.903510, 4.141378, 142.493530, 4.154710);
        this.ctx.fill();
        this.ctx.restore();
    }
    /** Draw digit zero */
    drawZero(color = this.digitColor) {
        this.ctx.beginPath();
        this.ctx.fillStyle = color;
        this.ctx.lineWidth = 0.070004;
        this.ctx.moveTo(2.363241, 7.851807);
        this.ctx.lineTo(2.363241, 7.851807);
        this.ctx.bezierCurveTo(2.647930, 7.656280, 2.973106, 7.509172, 3.217049, 7.264697);
        this.ctx.bezierCurveTo(3.398026, 7.083193, 3.488514, 6.829457, 3.608106, 6.602974);
        this.ctx.bezierCurveTo(3.762884, 6.310080, 3.935660, 6.022742, 4.039906, 5.708418);
        this.ctx.bezierCurveTo(4.243103, 5.095378, 4.514566, 4.478634, 4.525945, 3.832786);
        this.ctx.bezierCurveTo(4.535206, 3.303884, 4.271678, 2.804351, 4.099172, 2.304288);
        this.ctx.bezierCurveTo(3.946508, 1.860847, 3.791727, 1.411055, 3.552543, 1.007565);
        this.ctx.bezierCurveTo(3.421045, 0.785580, 3.231072, 0.585290, 3.005650, 0.459613);
        this.ctx.bezierCurveTo(2.618300, 0.243184, 2.193643, 0.070411, 1.754700, 0.004265);
        this.ctx.bezierCurveTo(1.589335, -0.020605, 1.390897, 0.065649, 1.293266, 0.201380);
        this.ctx.bezierCurveTo(0.967035, 0.654347, 0.742404, 1.176634, 0.536822, 1.695482);
        this.ctx.bezierCurveTo(0.333093, 2.209567, 0.162966, 2.742174, 0.070362, 3.287480);
        this.ctx.bezierCurveTo(-0.004250, 3.726953, -0.027269, 4.183888, 0.039406, 4.624949);
        this.ctx.bezierCurveTo(0.121162, 5.166815, 0.314837, 5.688045, 0.510100, 6.200278);
        this.ctx.bezierCurveTo(0.642391, 6.546353, 0.772831, 6.910949, 1.017835, 7.189026);
        this.ctx.bezierCurveTo(1.285593, 7.492503, 1.642252, 7.716870, 2.005260, 7.895728);
        this.ctx.moveTo(2.298418, 6.832103);
        this.ctx.lineTo(2.298418, 6.832103);
        this.ctx.bezierCurveTo(2.148929, 6.837103, 1.976420, 6.926563, 1.849949, 6.846923);
        this.ctx.bezierCurveTo(1.671091, 6.734472, 1.571872, 6.519895, 1.491968, 6.324632);
        this.ctx.bezierCurveTo(1.230560, 5.685399, 0.972856, 5.036640, 0.833156, 4.360365);
        this.ctx.bezierCurveTo(0.760660, 4.010057, 0.793733, 3.638317, 0.864377, 3.287480);
        this.ctx.bezierCurveTo(0.954070, 2.842715, 1.117054, 2.411974, 1.308347, 2.000811);
        this.ctx.bezierCurveTo(1.416827, 1.767713, 1.541445, 1.514242, 1.756022, 1.372690);
        this.ctx.bezierCurveTo(1.841482, 1.316069, 1.917418, 1.533028, 2.020077, 1.530647);
        this.ctx.bezierCurveTo(2.122735, 1.528267, 2.179356, 1.391740, 2.277516, 1.360784);
        this.ctx.bezierCurveTo(2.366151, 1.332738, 2.476218, 1.314217, 2.556387, 1.361049);
        this.ctx.bezierCurveTo(2.736833, 1.466088, 2.922835, 1.601290, 3.012529, 1.789938);
        this.ctx.bezierCurveTo(3.322618, 2.441872, 3.731931, 3.110738, 3.732195, 3.832786);
        this.ctx.bezierCurveTo(3.732195, 4.638178, 3.360456, 5.412878, 3.013058, 6.139424);
        this.ctx.fill();
    }
    /** Draw digit one */
    drawOne(color = this.digitColor) {
        this.ctx.beginPath();
        this.ctx.fillStyle = color;
        this.ctx.lineWidth = 0.070004;
        this.ctx.moveTo(1.247626, 7.284783);
        this.ctx.lineTo(1.247626, 7.284783);
        this.ctx.bezierCurveTo(1.860666, 7.065713, 2.504926, 6.919393, 3.087006, 6.627293);
        this.ctx.bezierCurveTo(3.158206, 6.591893, 2.955246, 6.507443, 2.955776, 6.428063);
        this.ctx.bezierCurveTo(2.956046, 6.345763, 3.142836, 6.282813, 3.089126, 6.220633);
        this.ctx.bezierCurveTo(2.904716, 6.007113, 2.455716, 6.031453, 2.378986, 5.759993);
        this.ctx.bezierCurveTo(1.861456, 3.928813, 1.758006, 2.003973, 1.370656, 0.140773);
        this.ctx.bezierCurveTo(1.354756, 0.063773, 1.260326, -0.001047, 1.182006, 0.000013);
        this.ctx.bezierCurveTo(1.101606, 0.001013, 1.018236, 0.070413, 0.989396, 0.145533);
        this.ctx.bezierCurveTo(0.631946, 1.076073, 0.267346, 2.010843, 0.036896, 2.980813);
        this.ctx.bezierCurveTo(0.015696, 3.069713, 0.216016, 3.137713, 0.290626, 3.084793);
        this.ctx.bezierCurveTo(0.526636, 2.916783, 0.677716, 2.169863, 0.839106, 2.410373);
        this.ctx.bezierCurveTo(1.246566, 3.017583, 1.189416, 3.833823, 1.279906, 4.559583);
        this.ctx.bezierCurveTo(1.335506, 5.004613, 1.494486, 5.514193, 1.274906, 5.905253);
        this.ctx.bezierCurveTo(1.025676, 6.348953, 0.417926, 6.459553, 0.028196, 6.787373);
        this.ctx.bezierCurveTo(-0.014404, 6.823373, -0.003804, 6.908553, 0.027396, 6.955113);
        this.ctx.bezierCurveTo(0.120796, 7.094813, 0.218956, 7.270763, 0.381416, 7.314683);
        this.ctx.fill();
    }
    /** Draw digit at tape index */
    drawDigit(tapeIndex) {
        // zeros are wider then ones' therefore different offset for each digit
        let color = (tapeIndex == this.tape.currentLocationIndex && this.animationPhase == _common__WEBPACK_IMPORTED_MODULE_0__.AnimationPhases.Standstill) ?
            this.currentDigitColor : this.digitColor;
        if (this.tape.read(tapeIndex) == 0) {
            this.ctx.translate(3, 0);
            this.drawZero(color);
            this.ctx.translate(-3, 0);
        }
        else if (this.tape.read(tapeIndex) == 1) {
            this.ctx.translate(4, 0);
            this.drawOne(color);
            this.ctx.translate(-4, 0);
        }
    }
    /** Draw all the visible chunks */
    drawVisibleChunks() {
        let v = this.numberOfVisibleChunks;
        for (var i = 0; i < v; i++) {
            this.drawChunk();
            this.ctx.translate(CHUNK_OF_CELLS_WIDTH, 0);
        }
    }
    /** Draw all the visible digits */
    drawVisibleDigits() {
        let chunksToTheLeft = this.numberOfChunksToTheLeftOfTheCurrent;
        let v = this.numberOfVisibleChunks;
        // lower the text inside the tape so it will be in the middle 
        this.ctx.translate(0, 3.5);
        let visibleDigits = this.visibleDigitsIndexRange;
        //console.log("start from: %s, endAt: %s, currentLocationIndex: %s, numberOfVisibleChunks: %s, chunksToTheLeft: %s", 
        //    visibleDigits.from, visibleDigits.to, this.tape.currentLocationIndex, v, chunksToTheLeft);
        for (var i = visibleDigits.from; i < visibleDigits.to; i++) {
            this.drawDigit(i);
            this.ctx.translate(CELL_WIDTH, 0);
        }
    }
    /** Dispatch a tape event */
    dispatchTapeViewEvent(type) {
        return this.dispatchEvent(new CustomEvent(type, { detail: { tapeView: this } }));
    }
    /** Number of visible cell chunks, positive integer
     * @returns {number} number of visible cell chunks
     */
    get numberOfVisibleChunks() {
        return Math.ceil(this.ctx.canvas.width / (CHUNK_OF_CELLS_WIDTH * this.xScale)) + 1;
    }
    /** The (four cell) chunk index of the current location tape index, either a positive or negative integer
    * for example:
    * | currentLocationIndex | absolute chunk index |
    * | :--------------- | :------------------ |
    * | -6 | -2 |
    * | -5 | -2 |
    * | -4 | -1 |
    * | -3 | -1 |
    * | -2 | -1 |
    * | -1 | -1 |
    * | 0 | 0 |
    * | 1 | 0 |
    * | 2 | 0 |
    * | 3 | 0 |
    * | 4 | 1 |
    * | 5 | 1 |
    * @returns {number} absolute chunk index
     */
    get currentLocationChunkIndex() {
        let l = this.tape.currentLocationIndex;
        return l >= 0 ? Math.floor(l / CELLS_IN_CHUNK) : -(Math.floor(Math.abs(l + 1) / CELLS_IN_CHUNK) + 1);
    }
    /** Cell index within chunk of the current location index
    * for example:
    * | currentLocationIndex | index within chunk |
    * | :--------------- | :------------------ |
    * | -6 | 2 |
    * | -5 | 3 |
    * | -4 | 0 |
    * | -3 | 1 |
    * | -2 | 2 |
    * | -1 | 3 |
    * | 0 | 0 |
    * | 1 | 1 |
    * | 2 | 2 |
    * | 3 | 3 |
    * | 4 | 0 |
    * | 5 | 1 |
    * | 6 | 2 |
    * @returns {number} cell index within chunk
    */
    get currentLocationIndexWithinChunk() {
        let l = this.tape.currentLocationIndex;
        return l >= 0 ? l % CELLS_IN_CHUNK : (CELLS_IN_CHUNK - 1) - (Math.abs(l + 1) % CELLS_IN_CHUNK);
    }
    /** Determines the x and y coordinates in the original scale (millimeters) of the current
    * absolute chunk. It is positioned in such way that the current location index will be
    * displayed both vertically and horizontally centered on the screen.
    *
    * from half, offset to left half of a single cell so it will be centered,
    * and currentLocationIndexWithinChunk times the scaled cell width so it
    * will be in the correct cell inside the chunk.
    * @returns { x : number, y : number } x and y coordinates of the current absolute chunk
    */
    get currentChunkTopLeft() {
        return {
            x: Math.floor((this.canvas.width / this.xScale) / 2) - Math.floor(CELL_WIDTH / 2) -
                Math.floor(this.currentLocationIndexWithinChunk * CELL_WIDTH),
            y: Math.floor((this.canvas.height / this.yScale) / 2) - Math.floor(CELL_HEIGHT / 2)
        };
    }
    /** How many chunks do we need to draw on the left side of the current chunk?
    * | number of visible cells | chunks to the left |
    * | :--------------- | :------------------ |
    * | 2 | 1 |
    * | 3 | 1 |
    * | 4 | 2 |
    * | 5 | 2 |
    * | 6 | 3 |
    */
    get numberOfChunksToTheLeftOfTheCurrent() {
        return Math.floor(this.numberOfVisibleChunks / 2);
    }
    /** The range of visible tape indices */
    get visibleDigitsIndexRange() {
        let chunksToTheLeft = this.numberOfChunksToTheLeftOfTheCurrent;
        let v = this.numberOfVisibleChunks;
        let startFrom = (this.tape.currentLocationIndex - this.currentLocationIndexWithinChunk) - chunksToTheLeft * CELLS_IN_CHUNK;
        return {
            from: startFrom,
            to: startFrom + v * CELLS_IN_CHUNK // not inclusive
        };
    }
    /** The top left coordinates of the visible portion of the tape */
    get visibleChunksTopLeft() {
        let currentChunkTopLeft = this.currentChunkTopLeft;
        let chunksToTheLeft = this.numberOfChunksToTheLeftOfTheCurrent;
        let direction = this.animationDirection == _common__WEBPACK_IMPORTED_MODULE_0__.AnimationDirections.Left ? -1 : (this.animationDirection == _common__WEBPACK_IMPORTED_MODULE_0__.AnimationDirections.Right ? 1 : 0);
        return {
            x: currentChunkTopLeft.x - chunksToTheLeft * CHUNK_OF_CELLS_WIDTH + direction * this.animationOffset,
            y: currentChunkTopLeft.y
        };
    }
    /** how far from the center should the current tape location  */
    getAnimationOffset(deltaT) {
        if (this.animationOffset >= CELL_WIDTH / 2) {
            if (this.currentVelocity >= MIN_SPEED) {
                this.currentVelocity -= deltaT * this.currentAcceleration;
            }
        }
        else {
            if (this.currentVelocity <= MAX_SPEED) {
                this.currentVelocity += deltaT * this.currentAcceleration;
            }
        }
        //return deltaT * this.velocity;
        return deltaT * this.currentVelocity;
    }
    /** Draw the tape on 2d canvas
     * @param deltaT {number} time that passed from previous call to draw method
     */
    draw(deltaT) {
        console.log("xscale: %s yscale: %s", this.xScale, this.yScale);
        let additionalAnimationOffset = this.getAnimationOffset(deltaT);
        let stopAnimation = false;
        if (this.animationOffset + additionalAnimationOffset >= CELL_WIDTH) {
            stopAnimation = true;
            this.animationOffset = CELL_WIDTH;
        }
        else {
            this.animationOffset += additionalAnimationOffset;
        }
        //this.animationOffset += this.getAnimationOffset(deltaT);
        this.moveToVisibleChunksTopLeft();
        this.ctx.save();
        this.drawVisibleChunks();
        // go back to upper left corner draw the digits
        this.ctx.restore();
        this.drawVisibleDigits();
        if (stopAnimation) {
            this.animationStop();
        }
        ;
    }
}


/***/ }),

/***/ "./src/turingMachine.ts":
/*!******************************!*\
  !*** ./src/turingMachine.ts ***!
  \******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "TuringMachine": () => (/* binding */ TuringMachine)
/* harmony export */ });
/* harmony import */ var _common__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./common */ "./src/common.ts");

/**
 * @Class
 * Turing machine class. This class models a turing machine.
 */
class TuringMachine extends EventTarget {
    /** the getter for running state of the Turing machine - idle, running or halted */
    get runState() {
        return this._runState;
    }
    /** the setter for running state of the Turing machine - idle, running or halted */
    set runState(value) {
        if (value != this._runState) {
            let oldValue = this._runState;
            this._runState = value;
            this.dispatchRunStateChangedEvent(oldValue);
        }
    }
    /** Create an instance of the turing machine class
     *
     * @param ruleSet - the set of rules for the turing machine
     * @param tape - the tape object to be used
     * @param runMode - single step or normal operation mode
     * @param pauseBeforeTapeAlterationMs
     * @param pauseAfterTapeAlterationMs
     */
    constructor(ruleSet, tape, runMode = _common__WEBPACK_IMPORTED_MODULE_0__.RunModes.Normal, pauseBeforeTapeAlterationMs = 500, pauseAfterTapeAlterationMs = 500) {
        super();
        this.tapeMoveCompleted = () => {
            // the assumption is that there is a tapeView mounted over the tape that completes the tape moves.
            // in case there is no tapeView than we should set the tape autocompleteMove flag.
            console.log("tape move completed. run mode %s", this._runMode);
            let running = false;
            if (this._runState == _common__WEBPACK_IMPORTED_MODULE_0__.RunStates.Running) {
                this.runState = _common__WEBPACK_IMPORTED_MODULE_0__.RunStates.Idle;
                running = true;
            }
            if (running && this._runMode == _common__WEBPACK_IMPORTED_MODULE_0__.RunModes.Normal) {
                console.log("schedule next run.");
                setTimeout(() => { this.run(); }, 1);
            }
        };
        this._ruleSet = ruleSet;
        this._tape = tape;
        this._stepsCounter = 0;
        this._state = 0;
        this._runState = _common__WEBPACK_IMPORTED_MODULE_0__.RunStates.Idle;
        this._runMode = runMode;
        this._tape.addEventListener("move-completed", this.tapeMoveCompleted);
        this._pauseAfterTapeAlterationMs = pauseAfterTapeAlterationMs;
        this._pauseBeforeTapeAlterationMs = pauseBeforeTapeAlterationMs;
    }
    /** Run the turing machine. Executes one full cycle of turing machine processing, then either go idle or keep executing steps depending on run mode. */
    run() {
        console.log("BEFORE STEP: Step counter: %s, Status: %s, State: %s", this._stepsCounter, this._runState, this._state);
        if (this._runState == _common__WEBPACK_IMPORTED_MODULE_0__.RunStates.Halted) {
            console.log("Halted");
            return;
        }
        if (this._runState == _common__WEBPACK_IMPORTED_MODULE_0__.RunStates.Running) {
            console.log("Already RUNNING");
            return;
        }
        this.runState = _common__WEBPACK_IMPORTED_MODULE_0__.RunStates.Running;
        this._stepsCounter++;
        let value = this._tape.read();
        let rule = this._ruleSet.getRule(this._state, value);
        if (rule == null) {
            throw new Error('Illegal turing machine state. No rules defined for current state and tape content.');
        }
        if (rule.flipTapeValue) {
            this.dispatchTapeValueChangeEvent(value, _common__WEBPACK_IMPORTED_MODULE_0__.BinaryValuesUtil.opposite(value), "before");
            setTimeout(() => { this.continue_running_before_value_update(value, rule); }, this._pauseBeforeTapeAlterationMs);
        }
        else {
            this.continue_running_after_value_update(value, rule);
        }
    }
    /** Top turing machine execution by going into halted run state. */
    stop() {
        this.runState = _common__WEBPACK_IMPORTED_MODULE_0__.RunStates.Halted;
    }
    /** Reset turing machine - set the run state to Idle and set the state to 0. */
    reset() {
        this.runState = _common__WEBPACK_IMPORTED_MODULE_0__.RunStates.Idle;
        this._state = 0;
    }
    continue_running_before_value_update(value, rule) {
        this._tape.write(_common__WEBPACK_IMPORTED_MODULE_0__.BinaryValuesUtil.opposite(value));
        this.dispatchTapeValueChangeEvent(value, _common__WEBPACK_IMPORTED_MODULE_0__.BinaryValuesUtil.opposite(value), "after");
        setTimeout(() => { this.continue_running_after_value_update(value, rule); }, this._pauseAfterTapeAlterationMs);
    }
    continue_running_after_value_update(value, rule) {
        this._state = rule.transitionToState;
        if (rule.action == _common__WEBPACK_IMPORTED_MODULE_0__.Actions.MoveLeft) {
            this._tape.moveRight();
        }
        else if (rule.action == _common__WEBPACK_IMPORTED_MODULE_0__.Actions.MoveRight) {
            this._tape.moveLeft();
        }
        else {
            this.runState = _common__WEBPACK_IMPORTED_MODULE_0__.RunStates.Halted;
        }
        console.log("AFTER STEP: Step counter: %s, Status: %s, State: %s, last applied rule: %s", this._stepsCounter, this._runState, this._state, rule.toString());
    }
    dispatchRunStateChangedEvent(oldRunState) {
        this.dispatchEvent(new CustomEvent("run-state-changed", { detail: { oldRunState: oldRunState, newRunState: this.runState } }));
    }
    dispatchTapeValueChangeEvent(oldTapeValue, newTapeValue, changeStage) {
        this.dispatchEvent(new CustomEvent(changeStage + "-tape-value-changed", { detail: { oldTapeValue: oldTapeValue, newTapeValue: newTapeValue } }));
    }
}


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "tape": () => (/* binding */ tape)
/* harmony export */ });
/* harmony import */ var _tape__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./tape */ "./src/tape.ts");
/* harmony import */ var _tapeView__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./tapeView */ "./src/tapeView.ts");
/* harmony import */ var _ruleSet__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./ruleSet */ "./src/ruleSet.ts");
/* harmony import */ var _turingMachine__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./turingMachine */ "./src/turingMachine.ts");
/* harmony import */ var _common__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./common */ "./src/common.ts");
/* harmony import */ var _rule__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./rule */ "./src/rule.ts");
/* harmony import */ var _gestureDetector__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./gestureDetector */ "./src/gestureDetector.ts");







// original was in mm for A4 size
window.ORIGINAL_WINDOW_WIDTH = 210;
window.ORIGINAL_WINDOW_HEIGHT = 297;
window.SCALE_FACTOR = window.innerWidth / window.ORIGINAL_WINDOW_WIDTH;
let canvas = null;
let ctx = null;
let previousTime = null;
let tapeView = null;
const DEFAULT_BACKGROUND_COLOR = "#F0F0F0";
let gestureDetector;
let initialWindowInnerWidth = window.innerWidth;
// find the largest common denominator for 12 and 8 using Euclidean algorithm for turing machine with unary number representation
let tape = new _tape__WEBPACK_IMPORTED_MODULE_0__.Tape([1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1]);
// reference for use in tests
window.tape = tape;
let euc1RuleSet = new _ruleSet__WEBPACK_IMPORTED_MODULE_2__.RuleSet([
    new _rule__WEBPACK_IMPORTED_MODULE_5__.Rule({ forState: 0, whenRead: _common__WEBPACK_IMPORTED_MODULE_4__.BinaryValues.Zero, transitionToState: 0, action: _common__WEBPACK_IMPORTED_MODULE_4__.Actions.MoveRight, flipTapeValue: false }),
    new _rule__WEBPACK_IMPORTED_MODULE_5__.Rule({ forState: 0, whenRead: _common__WEBPACK_IMPORTED_MODULE_4__.BinaryValues.One, transitionToState: 1, action: _common__WEBPACK_IMPORTED_MODULE_4__.Actions.MoveLeft, flipTapeValue: false }),
    new _rule__WEBPACK_IMPORTED_MODULE_5__.Rule({ forState: 1, whenRead: _common__WEBPACK_IMPORTED_MODULE_4__.BinaryValues.Zero, transitionToState: 2, action: _common__WEBPACK_IMPORTED_MODULE_4__.Actions.MoveRight, flipTapeValue: true }),
    new _rule__WEBPACK_IMPORTED_MODULE_5__.Rule({ forState: 1, whenRead: _common__WEBPACK_IMPORTED_MODULE_4__.BinaryValues.One, transitionToState: 1, action: _common__WEBPACK_IMPORTED_MODULE_4__.Actions.MoveLeft, flipTapeValue: false }),
    new _rule__WEBPACK_IMPORTED_MODULE_5__.Rule({ forState: 2, whenRead: _common__WEBPACK_IMPORTED_MODULE_4__.BinaryValues.Zero, transitionToState: 10, action: _common__WEBPACK_IMPORTED_MODULE_4__.Actions.MoveRight, flipTapeValue: false }),
    new _rule__WEBPACK_IMPORTED_MODULE_5__.Rule({ forState: 2, whenRead: _common__WEBPACK_IMPORTED_MODULE_4__.BinaryValues.One, transitionToState: 3, action: _common__WEBPACK_IMPORTED_MODULE_4__.Actions.MoveRight, flipTapeValue: true }),
    new _rule__WEBPACK_IMPORTED_MODULE_5__.Rule({ forState: 3, whenRead: _common__WEBPACK_IMPORTED_MODULE_4__.BinaryValues.Zero, transitionToState: 4, action: _common__WEBPACK_IMPORTED_MODULE_4__.Actions.MoveRight, flipTapeValue: false }),
    new _rule__WEBPACK_IMPORTED_MODULE_5__.Rule({ forState: 3, whenRead: _common__WEBPACK_IMPORTED_MODULE_4__.BinaryValues.One, transitionToState: 3, action: _common__WEBPACK_IMPORTED_MODULE_4__.Actions.MoveRight, flipTapeValue: false }),
    new _rule__WEBPACK_IMPORTED_MODULE_5__.Rule({ forState: 4, whenRead: _common__WEBPACK_IMPORTED_MODULE_4__.BinaryValues.Zero, transitionToState: 4, action: _common__WEBPACK_IMPORTED_MODULE_4__.Actions.MoveRight, flipTapeValue: false }),
    new _rule__WEBPACK_IMPORTED_MODULE_5__.Rule({ forState: 4, whenRead: _common__WEBPACK_IMPORTED_MODULE_4__.BinaryValues.One, transitionToState: 5, action: _common__WEBPACK_IMPORTED_MODULE_4__.Actions.MoveRight, flipTapeValue: true }),
    new _rule__WEBPACK_IMPORTED_MODULE_5__.Rule({ forState: 5, whenRead: _common__WEBPACK_IMPORTED_MODULE_4__.BinaryValues.Zero, transitionToState: 7, action: _common__WEBPACK_IMPORTED_MODULE_4__.Actions.MoveLeft, flipTapeValue: false }),
    new _rule__WEBPACK_IMPORTED_MODULE_5__.Rule({ forState: 5, whenRead: _common__WEBPACK_IMPORTED_MODULE_4__.BinaryValues.One, transitionToState: 6, action: _common__WEBPACK_IMPORTED_MODULE_4__.Actions.MoveLeft, flipTapeValue: false }),
    new _rule__WEBPACK_IMPORTED_MODULE_5__.Rule({ forState: 6, whenRead: _common__WEBPACK_IMPORTED_MODULE_4__.BinaryValues.Zero, transitionToState: 6, action: _common__WEBPACK_IMPORTED_MODULE_4__.Actions.MoveLeft, flipTapeValue: false }),
    new _rule__WEBPACK_IMPORTED_MODULE_5__.Rule({ forState: 6, whenRead: _common__WEBPACK_IMPORTED_MODULE_4__.BinaryValues.One, transitionToState: 1, action: _common__WEBPACK_IMPORTED_MODULE_4__.Actions.MoveLeft, flipTapeValue: false }),
    new _rule__WEBPACK_IMPORTED_MODULE_5__.Rule({ forState: 7, whenRead: _common__WEBPACK_IMPORTED_MODULE_4__.BinaryValues.Zero, transitionToState: 7, action: _common__WEBPACK_IMPORTED_MODULE_4__.Actions.MoveLeft, flipTapeValue: false }),
    new _rule__WEBPACK_IMPORTED_MODULE_5__.Rule({ forState: 7, whenRead: _common__WEBPACK_IMPORTED_MODULE_4__.BinaryValues.One, transitionToState: 8, action: _common__WEBPACK_IMPORTED_MODULE_4__.Actions.MoveLeft, flipTapeValue: false }),
    new _rule__WEBPACK_IMPORTED_MODULE_5__.Rule({ forState: 8, whenRead: _common__WEBPACK_IMPORTED_MODULE_4__.BinaryValues.Zero, transitionToState: 9, action: _common__WEBPACK_IMPORTED_MODULE_4__.Actions.MoveLeft, flipTapeValue: false }),
    new _rule__WEBPACK_IMPORTED_MODULE_5__.Rule({ forState: 8, whenRead: _common__WEBPACK_IMPORTED_MODULE_4__.BinaryValues.One, transitionToState: 8, action: _common__WEBPACK_IMPORTED_MODULE_4__.Actions.MoveLeft, flipTapeValue: false }),
    new _rule__WEBPACK_IMPORTED_MODULE_5__.Rule({ forState: 9, whenRead: _common__WEBPACK_IMPORTED_MODULE_4__.BinaryValues.Zero, transitionToState: 2, action: _common__WEBPACK_IMPORTED_MODULE_4__.Actions.MoveRight, flipTapeValue: false }),
    new _rule__WEBPACK_IMPORTED_MODULE_5__.Rule({ forState: 9, whenRead: _common__WEBPACK_IMPORTED_MODULE_4__.BinaryValues.One, transitionToState: 1, action: _common__WEBPACK_IMPORTED_MODULE_4__.Actions.MoveLeft, flipTapeValue: false }),
    new _rule__WEBPACK_IMPORTED_MODULE_5__.Rule({ forState: 10, whenRead: _common__WEBPACK_IMPORTED_MODULE_4__.BinaryValues.Zero, transitionToState: 0, action: _common__WEBPACK_IMPORTED_MODULE_4__.Actions.Halt, flipTapeValue: false }),
    new _rule__WEBPACK_IMPORTED_MODULE_5__.Rule({ forState: 10, whenRead: _common__WEBPACK_IMPORTED_MODULE_4__.BinaryValues.One, transitionToState: 10, action: _common__WEBPACK_IMPORTED_MODULE_4__.Actions.MoveRight, flipTapeValue: false }),
]);
let turingMachine = new _turingMachine__WEBPACK_IMPORTED_MODULE_3__.TuringMachine(euc1RuleSet, tape, _common__WEBPACK_IMPORTED_MODULE_4__.RunModes.Normal);
function animate() {
    console.log("animate start: canvas width: %s height: %s, window inner width %s height %s", ctx.canvas.width, ctx.canvas.height, window.innerWidth, window.innerHeight);
    // record the time at the beginning of the animation
    let currentTime = new Date();
    // recalculate the scale-factor based on the current window inner width
    SCALE_FACTOR = initialWindowInnerWidth / window.ORIGINAL_WINDOW_WIDTH;
    //ctx.canvas.width = initialWindowInnerWidth;
    ctx.canvas.width = window.innerWidth;
    ctx.canvas.height = window.innerHeight;
    //ctx.scale(SCALE_FACTOR, SCALE_FACTOR);
    tapeView.xScale = SCALE_FACTOR;
    tapeView.yScale = SCALE_FACTOR;
    // clear the whole canvas
    //ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.fillStyle = DEFAULT_BACKGROUND_COLOR;
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    // draw this animation iteration image
    if (previousTime != null) {
        let deltaT = currentTime.getTime() - previousTime.getTime();
        console.log("previous time was %s", deltaT);
        tapeView.draw(deltaT);
    }
    else {
        console.log("previous time was null");
        tapeView.draw(0);
    }
    // if required, schedule further animation iteration
    if (tapeView.animationPhase != _common__WEBPACK_IMPORTED_MODULE_4__.AnimationPhases.Standstill) {
        previousTime = new Date();
        window.requestAnimationFrame(animate);
    }
    else {
        previousTime = null;
    }
    console.log("animate end: canvas width: %s height: %s, window inner width %s height %s", ctx.canvas.width, ctx.canvas.height, window.innerWidth, window.innerHeight);
}
let keyboardHandler = (k) => {
    if (k.defaultPrevented) {
        return; // Do nothing if the event was already processed
    }
    switch (k.key) {
        case "R":
        case "r":
            runStateChangeCommandHandler();
            break;
        default:
            return; // Quit when this doesn't handle the key event.
    }
    k.preventDefault();
};
function runStateChangeCommandHandler() {
    if (turingMachine.runState == _common__WEBPACK_IMPORTED_MODULE_4__.RunStates.Running) {
        turingMachine.stop();
    }
    else if (turingMachine.runState == _common__WEBPACK_IMPORTED_MODULE_4__.RunStates.Halted) {
        turingMachine.reset();
    }
    else {
        turingMachine.run();
    }
}
let doubleTapHandler = (e) => {
    if (e.defaultPrevented) {
        return; // Do nothing if the event was already processed
    }
    e.preventDefault();
    runStateChangeCommandHandler();
    animationStartedHandler();
};
function animationStartedHandler() {
    window.requestAnimationFrame(animate);
}
document.addEventListener("keydown", keyboardHandler);
// trigger drawing when the document loading has finished
document.addEventListener("DOMContentLoaded", function (event) {
    canvas = document.getElementById("canvas");
    console.log("canvas is %s", canvas);
    ctx = canvas.getContext("2d");
    tapeView = new _tapeView__WEBPACK_IMPORTED_MODULE_1__.TapeView(tape, canvas, document.body);
    tapeView.addEventListener('animation-started', animationStartedHandler);
    tapeView.addEventListener('animation-completed', animationStartedHandler);
    animationStartedHandler();
    addEventListener("resize", (event) => { animationStartedHandler(); });
    gestureDetector = _gestureDetector__WEBPACK_IMPORTED_MODULE_6__.GestureDetector.getInstance(canvas);
    gestureDetector.addEventListener("double-tap", doubleTapHandler);
    //turingMachine.run();
    ctx.canvas.width = window.innerWidth;
    ctx.canvas.height = window.innerHeight;
    turingMachine.addEventListener("before-tape-value-changed", animationStartedHandler);
    turingMachine.addEventListener("after-tape-value-changed", animationStartedHandler);
});

})();

/******/ })()
;
//# sourceMappingURL=main.f59d9d1a7874b1b1848c.js.map
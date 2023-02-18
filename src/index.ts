import { Tape } from './tape';
import { TapeView }from './tapeView';
import { RuleSet }from './ruleSet';
import { TuringMachine }from './turingMachine';
import { RunModes, AnimationPhases, BinaryValues, Actions, RunStates } from './common';
import { Rule } from './rule';
import { GestureDetector } from './gestureDetector';

// original was in mm for A4 size
window.ORIGINAL_WINDOW_WIDTH = 210; 
window.ORIGINAL_WINDOW_HEIGHT = 297;
window.SCALE_FACTOR = window.innerWidth/window.ORIGINAL_WINDOW_WIDTH;
let canvas = null;
let ctx: CanvasRenderingContext2D = null;
let previousTime : Date = null;
let tapeView : TapeView = null;
const DEFAULT_BACKGROUND_COLOR = "#F0F0F0";
let gestureDetector:GestureDetector;
let initialWindowInnerWidth = window.innerWidth;

// find the largest common denominator for 12 and 8 using Euclidean algorithm for turing machine with unary number representation
export let tape = new Tape([ 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1 ]);
// reference for use in tests
(window as any).tape = tape;
let euc1RuleSet = new RuleSet([
  new Rule({ forState: 0, whenRead: BinaryValues.Zero, transitionToState: 0, action: Actions.MoveRight, flipTapeValue: false }),
  new Rule({ forState: 0, whenRead: BinaryValues.One, transitionToState: 1, action: Actions.MoveLeft, flipTapeValue: false }),
  new Rule({ forState: 1, whenRead: BinaryValues.Zero, transitionToState: 2, action: Actions.MoveRight, flipTapeValue: true }),
  new Rule({ forState: 1, whenRead: BinaryValues.One, transitionToState: 1, action: Actions.MoveLeft, flipTapeValue: false }),
  new Rule({ forState: 2, whenRead: BinaryValues.Zero, transitionToState: 10, action: Actions.MoveRight, flipTapeValue: false }),
  new Rule({ forState: 2, whenRead: BinaryValues.One, transitionToState: 3, action: Actions.MoveRight, flipTapeValue: true }),
  new Rule({ forState: 3, whenRead: BinaryValues.Zero, transitionToState: 4, action: Actions.MoveRight, flipTapeValue: false }),
  new Rule({ forState: 3, whenRead: BinaryValues.One, transitionToState: 3, action: Actions.MoveRight, flipTapeValue: false }),
  new Rule({ forState: 4, whenRead: BinaryValues.Zero, transitionToState: 4, action: Actions.MoveRight, flipTapeValue: false }),
  new Rule({ forState: 4, whenRead: BinaryValues.One, transitionToState: 5, action: Actions.MoveRight, flipTapeValue: true }),
  new Rule({ forState: 5, whenRead: BinaryValues.Zero, transitionToState: 7, action: Actions.MoveLeft, flipTapeValue: false }),
  new Rule({ forState: 5, whenRead: BinaryValues.One, transitionToState: 6, action: Actions.MoveLeft, flipTapeValue: false }),
  new Rule({ forState: 6, whenRead: BinaryValues.Zero, transitionToState: 6, action: Actions.MoveLeft, flipTapeValue: false }),
  new Rule({ forState: 6, whenRead: BinaryValues.One, transitionToState: 1, action: Actions.MoveLeft, flipTapeValue: false }),
  new Rule({ forState: 7, whenRead: BinaryValues.Zero, transitionToState: 7, action: Actions.MoveLeft, flipTapeValue: false }),
  new Rule({ forState: 7, whenRead: BinaryValues.One, transitionToState: 8, action: Actions.MoveLeft, flipTapeValue: false }),
  new Rule({ forState: 8, whenRead: BinaryValues.Zero, transitionToState: 9, action: Actions.MoveLeft, flipTapeValue: false }),
  new Rule({ forState: 8, whenRead: BinaryValues.One, transitionToState: 8, action: Actions.MoveLeft, flipTapeValue: false }),
  new Rule({ forState: 9, whenRead: BinaryValues.Zero, transitionToState: 2, action: Actions.MoveRight, flipTapeValue: false }),
  new Rule({ forState: 9, whenRead: BinaryValues.One, transitionToState: 1, action: Actions.MoveLeft, flipTapeValue: false }),
  new Rule({ forState: 10, whenRead: BinaryValues.Zero, transitionToState: 0, action: Actions.Halt, flipTapeValue: false }),
  new Rule({ forState: 10, whenRead: BinaryValues.One, transitionToState: 10, action: Actions.MoveRight, flipTapeValue: false }),
]);
let turingMachine = new TuringMachine(euc1RuleSet, tape, RunModes.Normal);

function animate() {
    console.log("animate start: canvas width: %s height: %s, window inner width %s height %s", ctx.canvas.width, ctx.canvas.height, window.innerWidth, window.innerHeight);
    // record the time at the beginning of the animation
    let currentTime = new Date();

    // recalculate the scale-factor based on the current window inner width
    SCALE_FACTOR = initialWindowInnerWidth/window.ORIGINAL_WINDOW_WIDTH;
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
    } else {
        console.log("previous time was null");
        tapeView.draw(0);
    }

    // if required, schedule further animation iteration
    if (tapeView.animationPhase != AnimationPhases.Standstill) {
        previousTime = new Date();
        window.requestAnimationFrame(animate);
    } else {
        previousTime = null;
    }
    console.log("animate end: canvas width: %s height: %s, window inner width %s height %s", ctx.canvas.width, ctx.canvas.height, window.innerWidth, window.innerHeight);
}

let keyboardHandler = (k: KeyboardEvent): void => {
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
}

function runStateChangeCommandHandler() {
    if (turingMachine.runState == RunStates.Running) {
        turingMachine.stop();
    } else if (turingMachine.runState == RunStates.Halted) {
        turingMachine.reset();
    } else {
        turingMachine.run();
    }
}

let doubleTapHandler = (e: any): void => {
    if (e.defaultPrevented) {
        return; // Do nothing if the event was already processed
    }    
    e.preventDefault();
    runStateChangeCommandHandler();
    animationStartedHandler();
}

function animationStartedHandler() {
    window.requestAnimationFrame(animate); 
}

document.addEventListener("keydown", keyboardHandler);
// trigger drawing when the document loading has finished
document.addEventListener("DOMContentLoaded", function(event) { 
    canvas = document.getElementById("canvas") as HTMLCanvasElement;
    console.log("canvas is %s", canvas);
    ctx = canvas.getContext("2d");
    tapeView = new TapeView(tape, canvas, document.body as HTMLBodyElement);
    tapeView.addEventListener('animation-started', animationStartedHandler);
    tapeView.addEventListener('animation-completed', animationStartedHandler);
    animationStartedHandler();
    addEventListener("resize", (event) => { animationStartedHandler(); });
    gestureDetector = GestureDetector.getInstance(canvas);
    gestureDetector.addEventListener("double-tap", doubleTapHandler);
    //turingMachine.run();
    ctx.canvas.width  = window.innerWidth;
    ctx.canvas.height = window.innerHeight;
    turingMachine.addEventListener("before-tape-value-changed", animationStartedHandler);
    turingMachine.addEventListener("after-tape-value-changed", animationStartedHandler);
});
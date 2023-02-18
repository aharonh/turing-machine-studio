import { RunModes, Actions, RunStates, BinaryValues, BinaryValuesUtil } from './common';
import { Rule } from './rule';
import { RuleSet } from './ruleSet';
import { Tape } from './tape';

/**
 * @Class
 * Turing machine class. This class models a turing machine. 
 */
export class TuringMachine extends EventTarget {

    /** the set of rules the turing machine actions are based on */
    private _ruleSet: RuleSet;
    /** the endless tape turing machine acts upon */
    private _tape: Tape;
    /** the state of the turing machine */
    private _state: number;
    /**  */
    private _runMode: RunModes;
    /** how many steps the turing machine performed since instantiation */
    private _stepsCounter: number;
    /** indicator of the turing machine life-cycle phase - idle, running and halted */
    private _runState: RunStates;
    /**  */
    private _pauseBeforeTapeAlterationMs: number;
    /**  */
    private _pauseAfterTapeAlterationMs: number;

    /** the getter for running state of the Turing machine - idle, running or halted */
    public get runState(): RunStates {
        return this._runState;
    }

    /** the setter for running state of the Turing machine - idle, running or halted */
    public set runState(value: RunStates) {
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
    constructor(ruleSet: RuleSet, tape: Tape, runMode: RunModes = RunModes.Normal, 
                pauseBeforeTapeAlterationMs: number = 500, pauseAfterTapeAlterationMs: number = 500) {
        super();
        this._ruleSet = ruleSet;
        this._tape = tape;
        this._stepsCounter = 0;
        this._state = 0;
        this._runState = RunStates.Idle;
        this._runMode = runMode;
        this._tape.addEventListener("move-completed", this.tapeMoveCompleted);
        this._pauseAfterTapeAlterationMs = pauseAfterTapeAlterationMs;
        this._pauseBeforeTapeAlterationMs = pauseBeforeTapeAlterationMs;
    }

    /** Run the turing machine. Executes one full cycle of turing machine processing, then either go idle or keep executing steps depending on run mode. */
    run(): void {
        console.log("BEFORE STEP: Step counter: %s, Status: %s, State: %s", 
        this._stepsCounter, this._runState, this._state);

        if (this._runState == RunStates.Halted) {
            console.log("Halted");
            return;
        }
        if (this._runState == RunStates.Running) {
            console.log("Already RUNNING");
            return;
        }
        
        this.runState = RunStates.Running;
        this._stepsCounter++;
        let value = this._tape.read();
        let rule = this._ruleSet.getRule(this._state, value);
        if (rule == null) {
            throw new Error('Illegal turing machine state. No rules defined for current state and tape content.');
        }
        if (rule.flipTapeValue) {
            this.dispatchTapeValueChangeEvent(value, BinaryValuesUtil.opposite(value), "before");
            setTimeout(() => { this.continue_running_before_value_update(value, rule); }, this._pauseBeforeTapeAlterationMs);
        } else {
            this.continue_running_after_value_update(value, rule);
        }
    }

    /** Top turing machine execution by going into halted run state. */
    stop(): void {
        this.runState = RunStates.Halted;
    }

    /** Reset turing machine - set the run state to Idle and set the state to 0. */
    reset(): void {
        this.runState = RunStates.Idle;
        this._state = 0;
    }

    private continue_running_before_value_update(value: number, rule: Rule): void {
        this._tape.write(BinaryValuesUtil.opposite(value));
        this.dispatchTapeValueChangeEvent(value, BinaryValuesUtil.opposite(value), "after");
        setTimeout(() => { this.continue_running_after_value_update(value, rule); }, this._pauseAfterTapeAlterationMs);
    }

    private continue_running_after_value_update(value: number, rule: Rule): void {
        this._state = rule.transitionToState;
        if (rule.action == Actions.MoveLeft) {
            this._tape.moveRight();
        } else if (rule.action == Actions.MoveRight) {
            this._tape.moveLeft();
        } else {
            this.runState = RunStates.Halted;
        }

        console.log("AFTER STEP: Step counter: %s, Status: %s, State: %s, last applied rule: %s", 
            this._stepsCounter, this._runState, this._state, rule.toString());
    }

    private tapeMoveCompleted = (): void => {
        // the assumption is that there is a tapeView mounted over the tape that completes the tape moves.
        // in case there is no tapeView than we should set the tape autocompleteMove flag.
        console.log("tape move completed. run mode %s", this._runMode);
        let running = false;
        if (this._runState == RunStates.Running) {
            this.runState = RunStates.Idle;
            running = true;
        }
        if (running && this._runMode == RunModes.Normal) {
            console.log("schedule next run.");
            setTimeout(() => { this.run(); }, 1);
        }
    }

    private dispatchRunStateChangedEvent(oldRunState: RunStates): void {
        this.dispatchEvent(new CustomEvent<{oldRunState: RunStates; newRunState: RunStates;}>(
            "run-state-changed", { detail: { oldRunState: oldRunState, newRunState: this.runState } }));
    }

    private dispatchTapeValueChangeEvent(oldTapeValue: BinaryValues, newTapeValue: BinaryValues, changeStage: string): void {
        this.dispatchEvent(new CustomEvent<{oldTapeValue: BinaryValues; newTapeValue: BinaryValues;}>(
            changeStage + "-tape-value-changed", { detail: { oldTapeValue: oldTapeValue, newTapeValue: newTapeValue } }));
    }
}

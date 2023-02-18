import { Actions, BinaryValues, BinaryValuesUtil, RunStates } from './common';
/**
 * @Class
 * Turing machine rule class. This class models a single turing machine rule. 
 */
export class Rule {
    /** for what internal state of the turing machine does the rule applies */
    forState: number; 
    /** in what of the two cases of tape content read this rule applies */
    whenRead: BinaryValues;
    /** rule's turing machine action - move in what direction */
    action: Actions;
    /** rule's turing machine action - the new state to transition to */
    transitionToState: number;
    /** rule's turing machine action - shall the tape content be altered? */
    flipTapeValue: boolean;
    /** index of the rule when it is member of a rule set */
    index: number = 0;

    constructor(ruleDef: { forState: number, whenRead: BinaryValues, transitionToState: number, 
                            action: Actions, flipTapeValue: boolean } ) {
        ({ forState: this.forState, whenRead: this.whenRead, transitionToState: this.transitionToState,
         action: this.action, flipTapeValue: this.flipTapeValue } = ruleDef);
    }
}

Rule.prototype.toString = function ruleToString() {
    return `${this.index}: ${this.forState} ${this.whenRead} -> ` + 
        `${this.transitionToState} ${Actions[this.action]} ` + 
        `${ !this.flipTapeValue ? this.whenRead : BinaryValuesUtil.opposite(this.whenRead) }`;
};
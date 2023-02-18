import { BinaryValues } from './common';
import { Rule } from './rule';

/**
 * @Class
 * Rule set class. This class models a set of turing machine rules. 
 */
export class RuleSet {

    private _index: { [state: number]: { zero: Rule, one: Rule }; } = {};

    private _list: Rule[] = [];

    constructor(rules: Rule[]) {
        // and index them 
        rules.forEach(rule => { this.addRule(rule); }); 
    }

    private addToIndex(rule: Rule): void {
        rule.index = this._list.length;
        if (rule.whenRead == BinaryValues.Zero) {
            this._index[rule.forState].zero = rule;
        } else if (rule.whenRead == BinaryValues.One) {
            this._index[rule.forState].one = rule;
        }
    }

    addRule(rule: Rule, override: boolean = false): void {
        if (rule.forState in this._index) {
            if ((! override) && 
                ((rule.whenRead == BinaryValues.Zero) &&  (!(this._index[rule.forState].zero == null))) ||
                ((rule.whenRead == BinaryValues.One) &&  (!(this._index[rule.forState].one == null)))
            ) {
                throw new Error('Rule for that state and value already defined. Set override to true to force overwrite of existing rule.');
            }
            this.addToIndex(rule);
            this._list.push(rule);
        } else {
            this._index[rule.forState] = { zero: null, one: null};
            this.addToIndex(rule);
            this._list.push(rule);
        }
    }

    getRule(state: number, value: BinaryValues): Rule {
        if (!(state in this._index)) {
            return null;
        };
        if (value == BinaryValues.Zero) {
            return this._index[state].zero;
        } 
        return this._index[state].one;
    }
}

import { BinaryValues } from "./common";
/**
 * @Class
 * Turing machine tape class. This class models the endless tape used by the turing machine. 
 * It has a currentLocationIndex property to mark the place currently exposed to the machine.
 * It may be indexed with both positive and negative indices so that one can move in both directions of the tape.
 * The tape in pre-initialized with zeros at all it's locations. 
 */
export class Tape extends EventTarget {
    /** array keeping positive location index defined values */
    private _positiveIndices: BinaryValues[];
    /** array keeping negative location index defined values */
    private _negativeIndices: BinaryValues[];
    /** the current location index */
    _currentLocationIndex: number;
    /** minimal tape location index that was defined. either positive or negative number. 
     * all indices less than that one are assumed to be 0. */
    private _min_defined_index: number;
    /** minimal tape location index that was defined */
    private _max_defined_index: number;
    /** is the tape in locked state */
    private _locked: boolean = false;
    /** flag indicating tape is in moving state. while moving, tape can not be moved. */
    private _moving: boolean = false;
    /** flag indicating move direction. */
    private _movingLeft: boolean = false;
    /** set to true if you want the tape to auto complete moves, without need for moveComplete() call. */
    public autocompleteMove: boolean = false;

    /** Create a new tape instance
     * @param {Array.<Number>} contents The contents of the tape - array of ones and zeroes. it is 
     *                         placed on the tape from the location index zero.
     * @param {Number} currentLocationIndex The index of the tape location currently exposed to the 
     *                                      turing machine
     */
    constructor(contents: Array<number> = [], currentLocationIndex: number = 0) {
        super();
        if (contents.length == 0) {
            throw new Error('Contents was empty, but required at least one element.');
        }

        this._min_defined_index = 0
        this._max_defined_index = contents.length - 1;
        console.log("this.contents: " + contents);
        console.log("this.max_defined_index: " + this._max_defined_index);
        
        /** Array of positive indices */ 
        this._positiveIndices = contents.map(x => x==0 ? BinaryValues.Zero : BinaryValues.One);
        /** Array of negative indices */ 
        this._negativeIndices = [];
        /** The index of the tape location currently exposed to the turing machine */
        this._currentLocationIndex = currentLocationIndex;
    }

    /** The current location index setter */
    set currentLocationIndex(location: number) {
        let oldLocationIndex = this._currentLocationIndex;
        if (oldLocationIndex == location){
            return;
        }
        this._currentLocationIndex = location;
        this.dispatchTapeEvent("location-changed", oldLocationIndex, location);
    }

    /** The current location index getter */
    get currentLocationIndex(): number {
        return this._currentLocationIndex;
    }

    /** What is the maximum defined tape index. All tape indices above this one are 0 */
    get maxDefinedIndex(): number {
        return this._max_defined_index;
    }

    /** What is the minimum defined tape index. All tape indices below this one are 0 */
    get minDefinedIndex(): number {
        return this._min_defined_index;
    }

    /** Is the tape locked? If so, it can not be moved either left nor right. */
    get isLocked(): boolean {
        return this._locked;
    }

    /** Is the tape currently in moving state? If so, it can not be moved either left nor right. */
    get isMoving(): boolean {
        return this._moving;
    }

    /** Lock tape for movement. The tape move left and move right methods do not work when tape is locked. */
    lock(): void {
        this.dispatchTapeEvent("locked", this._currentLocationIndex, this._currentLocationIndex);
        this._locked = true;
    }

    /** Unlock the tape to allow for movement. */
    unlock(): void {
        this.dispatchTapeEvent("unlocked", this._currentLocationIndex, this._currentLocationIndex);
        this._locked = true;
    }

    /** Moves the tape one position to the left */
    moveLeft():void {
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
    moveRight():void {
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

    moveComplete():void {
        let c = this._currentLocationIndex;
        if (this._movingLeft == true) {
            this._currentLocationIndex += 1;
        } else {
            this._currentLocationIndex -= 1;
        }
        this._moving = false;
        this.dispatchTapeEvent("move-completed", c, this._currentLocationIndex);
    }

    /** The length of the tape with defined (non-zero) values
     * @returns the length of the tape with defined values
     */
    get length(): number {
        return this._max_defined_index - this._min_defined_index + 1;
    }

    /** Read the contents of the tape at the current location index. 
     * @returns {Number} The contents of the tape at the current location index.
     */
    read(index: number = null): number {
        if (index == null) {
            index = this.currentLocationIndex;
        }
        if (index >= 0) {
            return this.readFromArray(this._positiveIndices, index);
        } else {
            return this.readFromArray(this._negativeIndices, index);
        }
    }

    /** Write a value to the tape at the current location index.
     * @param {Number} value The value to write - 1 or 0
     */
    write(value: BinaryValues, index: number = null): void {
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
        } else {
            this._negativeIndices = this.writeToArray(this._negativeIndices, value, index);
        }
    }

    /** Dispatch a tape event */
    private dispatchTapeEvent(type: string, oldLocation: number, newLocation: number): boolean {
        return this.dispatchEvent(new CustomEvent<{tape: Tape; oldLocation: number; newLocation: number;}>(
                type, { detail: { tape: this, oldLocation: oldLocation, newLocation: newLocation } }));
    }
    
    /** Read a value from an array - either positive or negative indices
     * @param {Array.<BinaryValues>} anArray array of positive or negative indices to read from
     * @returns the value at the current location index of the given array
     */
    private readFromArray(anArray: Array<BinaryValues>, index: number): BinaryValues {
        var l = Math.abs(index);
        // check the array bounds
        if (l >= anArray.length) {
            // out of bounds of so far defined positive numbers - therefore presumably 0
            return BinaryValues.Zero;
        }
        return anArray[l];
    }

    /** Write a value to an array - either positive or negative indices
     * @param {Array.<Boolean>} anArray array of positive or negative indices to write to
     * @param {Number} value value to write - wither 0 or 1
     * @returns {Array.<Boolean>} The resulting array after the operation
     */
    private writeToArray(anArray: Array<BinaryValues>, value: BinaryValues, index: number): Array<BinaryValues> {
        var l = Math.abs(index);
        let array_length = anArray.length
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
        } else {
            // inside of the so far defined numbers - we will update the current value 
            anArray[l] = value;
        }
        return anArray;
    }
}



import { Tape } from '../src/tape';
import { BinaryValues } from '../src/common';

let t = new Tape([ 1 ]);

console.log("Current location index is %s", t.currentLocationIndex);


test('tape min defined index is 0', () => {
    expect(t.minDefinedIndex).toBe(0);
});

test('tape max defined index is 0', () => {
    expect(t.maxDefinedIndex).toBe(0);
});

test('tape has one content length', () => {
    expect(t.length).toBe(1);
});


let q = new Tape([ 1, 2 ]);
test('tape has two content length', () => {
    expect(q.length).toBe(2);
});

// can not test as not running in browser and it raises CustomEvent
// q.moveLeft();
// test('after moveLeft from zero, index should be -1 ', () => {
//     expect(q.currentLocationIndex).toBe(-1);
// });

q.write(BinaryValues.One);

test('current value should be 1 ', () => {
    expect(q.read()).toBe(1);
});





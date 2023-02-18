# Turing Machine Studio

## Introduction

This project was inspired by the classic popular science book by Sir Roger Penrose *"The Emperor's New Mind: Concerning Computers, Minds, and the Laws of Physics"*. Specifically, in the chapter on turing machines, there are multiple algorithms listed for the simplest possible variation of Turing Machine that he defined in the book. When I saw the simplicity of the **EUC-1** implementation the **Euclidean algorithm** for finding the **greatest common divisor** as well as the universal turing machine implementation, I decided I want to visualize its execution and try to gain the insights required to understand it's operation. For now, the repo has only the **EUC-1** implementation and I hope to add more algorithms later on including the above mentioned universal turing machine.

## Operation instructions

The tool is quite simple. It displays the endless tape of the turing machine with turing machine positioned (but not drawn) in the center of the tape. You can use cursor move *left* and *right* keys (or swipe left or right if browsing on mobile devices) to move the tape in both directions. If you do not edit the code, the machine will have loaded two numbers 12 and 8 and will run the EUC-1 algorithm on them when you run it. Once you press the *r* key (or double-tap if browsing on mobile devices), the turing machine starts executing it's rules and you can see the animation of the computation progress. You may move/swipe up/down to speed up the tape move animations. Once a *halt* instruction is reached, the turing machine stops the execution and the result may be read to the left of the turing machine (the center of the screen).

A screenshot of the start position of the tape is shown below:

![turing machine studio initial view](resources/png/screenshot-1.png "Initial screen")

The 22 rules of the EUC-1 algorithm are outlined below:

```javascript
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
```

## License information

The project is licensed under the Apache license, version 2.0. The full license text may be seen [here](LICENSE.txt). 

## Development Information

If you are interested in checking out the code, you may find the info [here](DEVELOPMENT.md) useful to start.

## Support

If you learned something from this project and you want like to say thanks, you can buy Sir Roger Penrose book *"The Emperor's New Mind: Concerning Computers, Minds, and the Laws of Physics" using this [link](https://amzn.to/3lGK9tB) and I will get a small associate fee from amazon from that transaction.

## Other interesting related resources

I found the following interesting related resources:

- https://www.aturingmachine.com/ - site containing a video of an actual physical turing machine ;), explanations and sample algorithms 
- https://www.cl.cam.ac.uk/projects/raspberrypi/tutorials/turing-machine/ - raspberry pi based turing machine implementation with some background and algorithms.

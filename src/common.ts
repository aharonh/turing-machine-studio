export enum AnimationPhases {
    Standstill,
    Accelerating,
    MaxSpeed,
    Decelerating,
    DigitChanging
};

export enum AnimationDirections {
    Left,
    Right,
    None
};

export enum RunModes {
    SingleStep,
    Normal
}

export enum Actions {
    MoveLeft,
    MoveRight,
    Halt
}

export enum BinaryValues {
    Zero,
    One
}


export class BinaryValuesUtil {
    public static opposite(binaryValue: BinaryValues) {
        return binaryValue == BinaryValues.Zero ? BinaryValues.One : BinaryValues.Zero;
    }
}

/** RunState */
export enum RunStates {
    Idle,
    Running,
    Halted
}

export enum SwipeDirections {
    Up,
    Down,
    Left,
    Right,
    None
}


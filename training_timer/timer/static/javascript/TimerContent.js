class TimerContent {

    constructor(parentLayer, defaultCoordinate) {
        this.topLeftCoordinate = defaultCoordinate;

        console.log("content layer rect top left: " + [this.topLeftCoordinate[0], this.topLeftCoordinate[1]]);

        this.contentLayer = parentLayer.layer();
        // this.contentLayer.setPosition(this.topLeftCoordinate[0], this.topLeftCoordinate[1]);

        console.log("content layer top left: " + [this.contentLayer.getAbsoluteX(), this.contentLayer.getAbsoluteY()]);

        this.durationSec = DefaultDuration;
        this.repeatNum = DefaultRepeatNum;
        this.boolSuspendingMode = BoolDefaultSuspendingMode;

        this.repeatInput = new NumericInput(this.contentLayer, this.repeatNum, false, this._getRepeatInputTopCenterCoordinate());

        console.log("content layer top left after input created: " + [this.contentLayer.getAbsoluteX(), this.contentLayer.getAbsoluteY()]);

        // minとsec一緒にしたclassつくるか
        this.durationMinInput;
        this.durationSecInput;
    }

    _getRepeatInputTopCenterCoordinate() {
        let x = this.topLeftCoordinate[0] + TimerRectSize[0] / 2;
        let y = this.topLeftCoordinate[1] + ContentTopMargin;

        return [x, y];
    }

    setTopLeftCoordinate(newCoordinate) {
        this.topLeftCoordinate = newCoordinate;

        console.log("content layer set before: " + [this.contentLayer.getAbsoluteX(), this.contentLayer.getAbsoluteY()]);

        console.log("content layer top left setto: " + [newCoordinate[0], newCoordinate[1]]);

        this.contentLayer.setPosition(newCoordinate[0], newCoordinate[1]);

        console.log("content layer set after: " + [this.contentLayer.getAbsoluteX(), this.contentLayer.getAbsoluteY()]);

        this.repeatInput.setTopCenterCoordinate(this._getRepeatInputTopCenterCoordinate());
    }
}
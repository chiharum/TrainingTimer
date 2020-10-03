class TimerContent {

    constructor(parentLayer, defaultCoordinate) {
        this.topLeftCoordinate = defaultCoordinate;

        this.contentLayer = parentLayer.layer();

        this.durationSec = DefaultDuration;
        this.repeatNum = DefaultRepeatNum;
        this.boolSuspendingMode = BoolDefaultSuspendingMode;

        this.repeatInput = new NumericInput(this.contentLayer, this.repeatNum, false, this._getRepeatInputTopCenterCoordinate());

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
        this.repeatInput.setTopCenterCoordinate(this._getRepeatInputTopCenterCoordinate());
    }
}
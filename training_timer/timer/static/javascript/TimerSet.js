class CircleButtonItem extends CircleButton {

    constructor(index, parentLayer, defaultCenterCoordinate, onClick) {
        super(parentLayer, defaultCenterCoordinate, CircleRadius, ColorLightBlue, onClick, CircleZIndex);

        this.index = index;
    }

    get index() {
        return this._index;
    }

    set index(newIndex) {
        this._index = newIndex;
    }
}

class TimerSet {

    constructor() {
        this.timerStageDiv = document.getElementById('timer_stage');

        this.timerList = [];
        this.plusButtonList = [];
        this.cancelButtonList = [];

        this.timerStage = acgraph.create('timer_stage');

        this.rectLayer = this.timerStage.layer();
        this.rectLayer.zIndex(TimerRectZIndex);

        this.plusButtonSetLayer = this.timerStage.layer();
        this.plusButtonSetLayer.zIndex(CircleZIndex);

        this.cancelButtonSetLayer = this.timerStage.layer();
        this.cancelButtonSetLayer.zIndex(CircleZIndex);

        this._createNewTimer(0);
        this._createNewCancelButton(0);

        this._createNewPlusButton(0);
        this._createNewPlusButton(1);
    }

    _resetTimerStageDivWidth() {
        let divWidth = FirstRectTopLeftCoordinate[0] + (SingleTimerWidth * this.timerList.length) + TimerMargin;
        this.timerStageDiv.style.width = divWidth.toString() + "px";
    }

    _calcTimerTopLeftCoordinate(index) {
        let x = FirstRectTopLeftCoordinate[0] + (TimerRectSize[0] + TimerMargin) * index;
        let y = FirstRectTopLeftCoordinate[1];

        return [x, y];
    }

    _resetEveryTimerPosition() {
        for (let index = 0; index < this.timerList.length; ++index) {
            this.timerList[index].setTopLeftCoordinate(this._calcTimerTopLeftCoordinate(index));
        }
    }

    _calcCancelButtonCenterCoordinate(index) {
        let x = this._calcTimerTopLeftCoordinate(index)[0] + TimerRectSize[0] - DifTopRightCircleCenterAndRectCorner;
        let y = FirstRectTopLeftCoordinate[1] + DifTopRightCircleCenterAndRectCorner;
        return [x, y];
    }

    _resetEveryCancelButtonPosition() {
        for (let index = 0; index < this.cancelButtonList.length; ++index) {
            this.cancelButtonList[index].index = index;
            this.cancelButtonList[index].setCenterCoordinate(this._calcCancelButtonCenterCoordinate(index));
        }
    }

    _calcPlusButtonCenterCoordinate(index) {
        let x = FirstRectTopLeftCoordinate[0] - (TimerMargin / 2) + (TimerRectSize[0] + TimerMargin) * index;
        let y = FirstRectTopLeftCoordinate[1] + TimerRectSize[1] / 2;

        return [x, y];
    }

    _resetEveryPlusButtonPosition() {
        for (let index = 0; index < this.plusButtonList.length; ++index) {
            this.plusButtonList[index].index = index;
            this.plusButtonList[index].setCenterCoordinate(this._calcPlusButtonCenterCoordinate(index));
        }
    }

    _eraseTimer(erasingIndex) {
        if (this.timerList.length > 1) {
            this.timerList[erasingIndex].eraseSingleTimer();

            this.timerList.splice(erasingIndex, 1);

            this._resetEveryTimerPosition();
            this._resetTimerStageDivWidth();
        }
    }

    _eraseCancelButton(erasingIndex) {
        if (this.cancelButtonList.length > 1) {
            this.cancelButtonList[erasingIndex].circle.dispose();

            this.cancelButtonList.splice(erasingIndex, 1);

            this._resetEveryCancelButtonPosition();
        }
    }

    _erasePlusButton(erasingIndex) {
        if (this.plusButtonList.length > 2) {
            this.plusButtonList[erasingIndex].circle.dispose();

            this.plusButtonList.splice(erasingIndex, 1);

            this._resetEveryPlusButtonPosition();
        }
    }

    _createNewTimer(newIndex) {
        let newSingleTimer = new SingleTimer(this.rectLayer, this._calcTimerTopLeftCoordinate(newIndex));

        this.timerList.splice(newIndex, 0, newSingleTimer);

        this._resetTimerStageDivWidth();
        this._resetEveryTimerPosition();
    }

    _createNewCancelButton(newIndex) {

        let newCancelButtonItem = new CircleButtonItem(newIndex, this.cancelButtonSetLayer, this._calcCancelButtonCenterCoordinate(newIndex), () => {
            let index = newCancelButtonItem.index;
            this._eraseTimer(index);
            this._erasePlusButton(index + 1);
            this._eraseCancelButton(index);
        });

        this.cancelButtonList.splice(newIndex, 0, newCancelButtonItem);
        this._resetEveryCancelButtonPosition();
    }

    _createNewPlusButton(newIndex) {

        let newPlusCircleButton = new CircleButtonItem(newIndex, this.plusButtonSetLayer, this._calcPlusButtonCenterCoordinate(newIndex), () => {
            let index = newPlusCircleButton.index;
            this._createNewTimer(index);
            this._createNewPlusButton(index);
            this._createNewCancelButton(index);
        });

        this.plusButtonList.splice(newIndex, 0, newPlusCircleButton);
        this._resetEveryPlusButtonPosition();
    }
}
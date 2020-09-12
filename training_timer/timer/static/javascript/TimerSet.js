class TimerSet {

    constructor() {
        this.timerStageDiv = document.getElementById('timer_stage');

        this.timerList = [];
        this.plusButtonList = [];

        this.timerStage = acgraph.create('timer_stage');

        this.rectSetLayer = this.timerStage.layer();
        this.rectSetLayer.zIndex(TimerRectZIndex);

        this.plusButtonSetLayer = this.timerStage.layer();
        this.plusButtonSetLayer.zIndex(CircleZIndex);

        this.cancelButtonSetLayer = this.timerStage.layer();
        this.cancelButtonSetLayer.zIndex(CircleZIndex);

        this._createNewTimer(0);

        this._createNewPlusButton(0);
        this._createNewPlusButton(1);
    }

    _resetTimerStageDivWidth() {
        let divWidth = FirstRectTopLeftCoordinate[0] + (SingleTimerWidth * this.timerList.length) + TimerMargin;
        this.timerStageDiv.style.width = divWidth.toString() + "px";
    }

    _calcTopLeftCoordinate(index) {
        let x = FirstRectTopLeftCoordinate[0] + (TimerRectSize[0] + TimerMargin) * index;
        let y = FirstRectTopLeftCoordinate[1];

        return [x, y];
    }

    _eraseTimer(erasingTimerIndex) {
        if (this.timerList.length > 1) {
            this.timerList.splice(erasingTimerIndex, 1);

            this._resetEveryTimerPosition();
            this._resetTimerStageDivWidth();
        }
    }

    _calcCancelButtonCenterCoordinate(index) {
        
    }

    _createNewCancelButton(newIndex) {
        let newCircle = new Circle(this.cancelButtonSetLayer, [0, 0], CircleRadius, ColorLightBlue, () => {
        });
    }

    _resetEveryTimerPosition() {
        for (let index = 0; index < this.timerList.length; ++index) {
            this.timerList[index].setTopLeftCoordinate(this._calcTopLeftCoordinate(index));
        }
    }

    _createNewTimer(newIndex) {
        let newSingleTimer = new SingleTimer(this.rectSetLayer, this._calcTopLeftCoordinate(newIndex));

        this.timerList.splice(newIndex, 0, newSingleTimer);

        this._resetTimerStageDivWidth();
        this._resetEveryTimerPosition();
    }

    _calcPlusButtonCenterCoordinate(index) {
        let x = FirstRectTopLeftCoordinate[0] - (TimerMargin / 2) + (TimerRectSize[0] + TimerMargin) * index;
        let y = FirstRectTopLeftCoordinate[1] + TimerRectSize[1] / 2;

        return [x, y];
    }

    _resetEveryPlusButtonCoordinate() {
        for (let index = 0; index < this.plusButtonList.length; ++index) {
            this.plusButtonList[index].setCenterCoordinate(this._calcPlusButtonCenterCoordinate(index));
        }
    }

    _createNewPlusButton(newIndex) {
        let newCircle = new Circle(this.plusButtonSetLayer, this._calcPlusButtonCenterCoordinate(newIndex), CircleRadius, ColorLightBlue, () => {
            this._createNewTimer(newIndex);
            this._createNewPlusButton(newIndex + 1);
        });

        this.plusButtonList.splice(newIndex, 0, newCircle);
        this._resetEveryPlusButtonCoordinate();
    }
}
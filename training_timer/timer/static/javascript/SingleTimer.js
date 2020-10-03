class SingleTimer {

    constructor(parentLayer, defaultTopLeftCoordinate) {
        this.topLeftCoordinate = defaultTopLeftCoordinate;

        this.timerLayer = parentLayer.layer();

        this._drawTimerRect();

        this.timerContent = new TimerContent(parentLayer, [0, 0]);
    }

    getTopLeftCoordinate() {
        return this.topLeftCoordinate;
    }

    setTopLeftCoordinate(newCoordinate) {
        this.topLeftCoordinate = newCoordinate;
        this.timerLayer.setPosition(newCoordinate[0], newCoordinate[1]);
        this.timerContent.setTopLeftCoordinate(newCoordinate);
    }

    _drawTimerRect() {
        // const timerBaseRect = new acgraph.math.Rect(this.topLeftCoordinate[0], this.topLeftCoordinate[1], TimerRectSize[0], TimerRectSize[1]);
        const timerBaseRect = new acgraph.math.Rect(this.topLeftCoordinate[0], this.topLeftCoordinate[1], TimerRectSize[0], TimerRectSize[1]);
        let timerRect = this.timerLayer.roundedRect(timerBaseRect, TimerRectCornerRadius);
        timerRect.fill(ColorLightGreen);
        timerRect.stroke(0);
    }
}
class SingleTimer {

    constructor(parentLayer, defaultTopLeftCoordinate) {
        this.topLeftCoordinate = defaultTopLeftCoordinate;

        this.timerLayer = acgraph.layer();
        this.timerLayer.parent(parentLayer);
        this.timerLayer.setPosition(this.topLeftCoordinate[0], this.topLeftCoordinate[1]);

        this._drawTimerRect();

        this.timerContent = new TimerContent(this.timerLayer, this.topLeftCoordinate);
    }

    get timerLayer() {
        return this._timerLayer;
    }

    set timerLayer(newLayer) {
        this._timerLayer = newLayer;
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
        const timerRectBaseRect = new acgraph.math.Rect(this.topLeftCoordinate[0], this.topLeftCoordinate[1], TimerRectSize[0], TimerRectSize[1]);
        let timerRect = acgraph.vector.primitives.roundedRect(this.timerLayer, timerRectBaseRect, TimerRectCornerRadius);
        timerRect.fill(ColorLightGreen);
        timerRect.stroke(0);
        this.timerLayer.addChild(timerRect);
    }
}
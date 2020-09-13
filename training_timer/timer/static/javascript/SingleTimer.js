class SingleTimer {

    constructor(parentLayer, defaultTopLeftCoordinate) {
        this.topLeftCoordinate = defaultTopLeftCoordinate;

        let groupRect = new acgraph.rect(this.topLeftCoordinate[0], this.topLeftCoordinate[1], TimerRectSize[0], TimerRectSize[1]);
        this.rectLayer = acgraph.layer().clip(groupRect);
        this.rectLayer.parent(parentLayer);

        this._drawTimerRect();

        // this.timerContent = new TimerContent(this.rectLayer, this);
    }

    getTopLeftCoordinate() {
        return this.topLeftCoordinate;
    }

    setTopLeftCoordinate(newCoordinate) {
        this.topLeftCoordinate = newCoordinate;
        this.rectLayer.setPosition(newCoordinate[0], newCoordinate[1]);
    }

    _drawTimerRect() {
        let thisTimerId = this.timerId;

        const timerRectBaseRect = new acgraph.math.Rect(this.topLeftCoordinate[0], this.topLeftCoordinate[1], TimerRectSize[0], TimerRectSize[1]);
        let timerRect = acgraph.vector.primitives.roundedRect(this.rectLayer, timerRectBaseRect, TimerRectCornerRadius);
        timerRect.fill(ColorLightGreen);
        timerRect.stroke(0);
        this.rectLayer.addChild(timerRect);

        // if (timerSet.timerList.length == 0) {
        //     let leftPlusButton = this.drawCircle([this.topLeftCoordinate[0] - TimerMargin / 2, this.topLeftCoordinate[1] + TimerRectSize[1] / 2], leftPlusButtonLayer);

        //     leftPlusButton.listen('click', () => {
        //         timerSet.timerList[0].circlePushedAnimation(leftPlusButton, function () {
        //             timerStage.suspend();

        //             timerSet._createNewTimer(MostLeftTimerLeftId);

        //             timerStage.resume();
        //         });
        //     });
        //     this.setAsButton(leftPlusButton)
        // }

        // let cancelButton = this.drawCircle([this.topLeftCoordinate[0] + TimerRectSize[0] - DifCircleCenterAndRectCorner, this.topLeftCoordinate[1] + DifCircleCenterAndRectCorner], this.rectLayer);
        // cancelButton.listen('click', () => {
        //     timerSet.getTimerById(thisTimerId).circlePushedAnimation(cancelButton, function () {

        //         timerStage.suspend();

        //         timerSet._eraseTimer(thisTimerId);

        //         timerStage.resume();
        //     });
        // });

        // let rightPlusButton = this.drawCircle([this.topLeftCoordinate[0] + TimerRectSize[0] + TimerMargin / 2, this.topLeftCoordinate[1] + TimerRectSize[1] / 2], this.rectLayer);
        // rightPlusButton.listen('click', () => {

        //     let thisTimer = timerSet.getTimerById(thisTimerId);

        //     thisTimer.circlePushedAnimation(rightPlusButton, function () {

        //         timerStage.suspend();

        //         timerSet._createNewTimer(thisTimerId);

        //         timerStage.resume();
        //     });
        // });
        // this.setAsButton(rightPlusButton);

        // let rightBottomButton = this.drawCircle([this.topLeftCoordinate[0] + TimerRectSize[0] - DifCircleCenterAndRectCorner, this.topLeftCoordinate[1] + TimerRectSize[1] - DifCircleCenterAndRectCorner], this.rectLayer);
        // rightBottomButton.listen('click', () => {
        //     let thisTimer = timerSet.getTimerById(this.timerId);
        //     thisTimer.circlePushedAnimation(rightBottomButton, function () { });
        // });
    }
}
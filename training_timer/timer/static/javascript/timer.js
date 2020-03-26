// sizes and lengths
const TimerRectSize = [300, 300];
const TimerRectCornerRadius = 50;
const TimerMargin = 24;
const CircleRadius = 25;
const DistanceCircleRectRound = 10;
const DifCircleCenterAndRectCorner = TimerRectCornerRadius - (TimerRectCornerRadius - CircleRadius - DistanceCircleRectRound) * Math.sin(45 * Math.PI / 180);
const SingleTimerWidth = TimerRectSize[0] + TimerMargin;
// position coordinates
const FirstLayerStartCoordinate = [TimerMargin * 2, 50];
// timings
const PushedScaleInterval = 5;
// others
const TimerRectZIndex = 0;
const CircleZIndex = 1;
const firstTimerId = 0;
const MostLeftTimerLeftId = firstTimerId - 1;

let timerStageDiv = document.getElementById('timer_stage');
let timerStage = acgraph.create('timer_stage');
let leftPlusButtonLayer = timerStage.layer();
let nextNewTimerId = 1;

function renewTimerStageDivWidth() {
    let divWidth = FirstLayerStartCoordinate[0] + (SingleTimerWidth * userTimerList.timerList.length) + (CircleRadius - (TimerMargin / 2));
    timerStageDiv.style.width = divWidth.toString() + "px";

    console.log(userTimerList.timerList.length);
}

class TimerSet {

    constructor() {
        this.timerList = [];
    }

    getIndexFromId(timerId) {
        let isFound = false;
        let index = 0;
        let timerListLength = this.timerList.length;

        for (let i = 0; i < timerListLength; ++i) {
            if (this.timerList[i].timerId == timerId) {
                isFound = true;
                index = i;
                break;
            }
        }

        if (!isFound) {
            throw new Error("Timer with 'timerId' = " + timerId.toString() + " was not found");
        } else {
            return index;
        }
    }

    getTimerById(timerId) {
        let index = this.getIndexFromId(timerId);
        return this.timerList[index];
    }

    getNewTimerStartCoordinate(leftTimerId) {
        let leftTimerNum = this.getIndexFromId(leftTimerId);
        let x = FirstLayerStartCoordinate[0] + (TimerRectSize[0] + TimerMargin) * leftTimerNum;
        let y = FirstLayerStartCoordinate[1];
        return [x, y];
    }

    setEveryTimerZIndex() {
        let zIndex = 0;

        for (let i = 0; i < this.timerList.length; ++i) {
            this.timerList[i].timerLayer.zIndex(zIndex);
            zIndex += 1;
        }
    }

    setEveryTimerPosition() {
        let nextCoordinate = FirstLayerStartCoordinate;

        for (let index = 0; index < this.timerList.length; ++index) {
            let movingTimer = userTimerList.timerList[index];

            movingTimer.setStartCoordinate([nextCoordinate[0], nextCoordinate[1]]);

            nextCoordinate = [nextCoordinate[0] + SingleTimerWidth, nextCoordinate[1]];
        }
    }

    createNewTimer(leftTimerId) {
        let newSingleTimer;

        if (leftTimerId == MostLeftTimerLeftId) {
            newSingleTimer = new SingleTimer(nextNewTimerId, FirstLayerStartCoordinate);

            this.timerList.unshift(newSingleTimer);
        } else {
            newSingleTimer = new SingleTimer(nextNewTimerId, this.getNewTimerStartCoordinate(leftTimerId));

            try {
                let index = this.getIndexFromId(leftTimerId);

                this.timerList.splice(index, 0, newSingleTimer);
            } catch{
                console.log(e.name + ": " + e.message);
            }
        }

        ++nextNewTimerId;

        renewTimerStageDivWidth();
        this.setEveryTimerPosition();
        this.setEveryTimerZIndex();

        return newSingleTimer;
    }

    eraseTimer(erasingTimerId) {
        let isIdValid = true;
        let index;

        try {
            index = this.getIndexFromId(erasingTimerId);
        } catch (e) {
            isIdValid = false;
            console.log(e.name + ": " + e.message);
        }

        if (isIdValid) {
            this.timerList.splice(index, 1);
        }

        this.setEveryTimerPosition();
        this.timerList.setEveryTimerZIndex();
    }

    getLeftTimerId(timerId) {
        try {
            let thisTimerIndex = this.getIndexFromId(timerId);

            if (thisTimerIndex == 0) {
                return MostLeftTimerLeftId;
            } else {
                return this.timerList[i - 1].timerId;
            }
        } catch (e) {
            console.log(e.name + ": " + e.message);
        }
    }

    createFirstTimer() {
        this.createNewTimer(MostLeftTimerLeftId);
    }
}

let userTimerList = new TimerSet();

class SingleTimer {

    constructor(timer_id, group_start_coordinate) {
        this.timerId = timer_id;
        this.startCoordinate = group_start_coordinate;

        this.timerLayer = timerStage.layer();
        this.drawTimer();

        this.timerContent = new TimerContent(this);
    }

    // get timerId() {
    //     return this.timerId;
    // }

    // get leftTimerId() {
    //     return this.leftTimerId;
    // }

    // get rightTimerId() {
    //     return this.rightTimerId;
    // }

    // get startCoordinate() {
    //     return this.startCoordinate;
    // }

    // get timerLayer() {
    //     return this.timerLayer;
    // }

    // set timerId(timer_id) {
    //     this.timerId = timer_id;
    // }

    // set rightTimerId(new_right_id) {
    //     this.rightTimerId = new_right_id;
    // }

    // set leftTimerId(new_left_id) {
    //     this.leftTimerId = new_left_id;
    // }

    setStartCoordinate(new_coordinate) {
        this.startCoordinate = new_coordinate;
        this.timerLayer.setPosition(new_coordinate[0], new_coordinate[1]);
        this.timerContent.resetContentCoordinate();
    }

    circlePushedAnimation(single_circle, callback) {

        let present_radius = CircleRadius;
        let deflated = false;
        let inflated = false;

        function animateCircle(animationTimer, callback) {
            if (present_radius > CircleRadius * 0.9 && !deflated) {
                present_radius -= 0.2;
                single_circle.setRadius(present_radius, present_radius);
            } else if (present_radius < CircleRadius && !inflated) {
                if (!deflated) {
                    deflated = true;
                }
                present_radius += 0.2;
                single_circle.setRadius(present_radius, present_radius);
            } else if (deflated && present_radius >= CircleRadius && !inflated) {
                inflated = true;
                clearInterval(animationTimer);

                callback();
            }
        }
        let animationTimer = setInterval(animateCircle, PushedScaleInterval, animationTimer, callback);
    }

    drawCircle(center_coordinate, layer) {
        let single_circle = acgraph.circle(center_coordinate[0], center_coordinate[1], CircleRadius);
        single_circle.fill(color_light_blue);
        single_circle.stroke(0);
        single_circle.zIndex(CircleZIndex);
        layer.addChild(single_circle);

        return single_circle;
    }

    setAsButton(button) {
        button.listen('mouseover', function () {
            timerStageDiv.style.cursor = "pointer";
        });
        button.listen('mouseout', function () {
            timerStageDiv.style.cursor = "default";
        });
    }

    drawTimer() {
        let thisTimerId = this.timerId;

        let groupRect = new acgraph.math.Rect(this.startCoordinate[0], this.startCoordinate[1], TimerRectSize[0] + CircleRadius * 2, TimerRectSize[1]);
        this.timerLayer.clip(groupRect);

        const timerRectBaseRect = new acgraph.math.Rect(this.startCoordinate[0], this.startCoordinate[1], TimerRectSize[0], TimerRectSize[1]);
        let timerRect = acgraph.vector.primitives.roundedRect(timerStage, timerRectBaseRect, TimerRectCornerRadius);
        timerRect.fill(color_light_green);
        timerRect.stroke(0);
        timerRect.zIndex(TimerRectZIndex);
        this.timerLayer.addChild(timerRect);

        if (userTimerList.timerList.length == 0) {
            let leftPlusButton = this.drawCircle([this.startCoordinate[0] - TimerMargin / 2, this.startCoordinate[1] + TimerRectSize[1] / 2], leftPlusButtonLayer);

            leftPlusButton.listen('click', function () {
                userTimerList.timerList[0].circlePushedAnimation(leftPlusButton, function () {
                    timerStage.suspend();

                    userTimerList.createNewTimer(MostLeftTimerLeftId);

                    timerStage.resume();
                });
            });
            this.setAsButton(leftPlusButton)
        }

        let cancelButton = this.drawCircle([this.startCoordinate[0] + TimerRectSize[0] - DifCircleCenterAndRectCorner, this.startCoordinate[1] + DifCircleCenterAndRectCorner], this.timerLayer);
        cancelButton.listen('click', function (e) {
            userTimerList.getTimerById(thisTimerId).circlePushedAnimation(cancelButton, function () {

                timerStage.suspend();

                userTimerList.eraseTimer(thisTimerId);

                timerStage.resume();
            });
        });
        this.setAsButton(cancelButton);

        let rightPlusButton = this.drawCircle([this.startCoordinate[0] + TimerRectSize[0] + TimerMargin / 2, this.startCoordinate[1] + TimerRectSize[1] / 2], this.timerLayer);
        rightPlusButton.listen('click', function () {

            let thisTimer = userTimerList.getTimerById(thisTimerId);

            thisTimer.circlePushedAnimation(rightPlusButton, function () {

                timerStage.suspend();

                userTimerList.createNewTimer(thisTimerId);

                timerStage.resume();
            });
        });
        this.setAsButton(rightPlusButton);

        let rightBottomButton = this.drawCircle([this.startCoordinate[0] + TimerRectSize[0] - DifCircleCenterAndRectCorner, this.startCoordinate[1] + TimerRectSize[1] - DifCircleCenterAndRectCorner], this.timerLayer);
        rightBottomButton.listen('click', function (e) {
            let thisTimer = userTimerList.getTimerById(thisTimerId);
            thisTimer.circlePushedAnimation(rightBottomButton, function () { });
        });
        this.setAsButton(rightBottomButton);
    }
}

userTimerList.createFirstTimer();

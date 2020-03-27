// TimerSet & SingleTimer
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

// TimerContent
// size
const InputFontSize = 30;
const UpDownTriangleHeight = 35;
const UpDownTriangleLineLen = UpDownTriangleHeight * 2 / Math.sqrt(3);
const InputUnderbarHeight = 3;
const TimesTextFontSize = 20;
const DurationDotFontSize = InputFontSize;
// margin
const ContentTopMargin = 10;
const ButtonInputMargin = 10;
const InputTextMargin = 5;
// value
const DefaultDuration = 0;
const DefaultRepeatNum = 1;
const BoolDefaultSuspendingMode = false;
const StringTimesText = "×";
const StringDurationDot = ":";
const PathPushedAnimationLimitFactor = 0.8;
const PathPushedAnimationSingleScaleDiffFactor = 0.05;
const PathPushedAnimationInterval = 0.1;
// other
const CssPositionUnit = "px";

let timerStageDiv = document.getElementById('timer_stage');
let timerStage = acgraph.create('timer_stage');
let leftPlusButtonLayer = timerStage.layer();
let nextNewTimerId = 1;

function renewTimerStageDivWidth() {
    let divWidth = FirstLayerStartCoordinate[0] + (SingleTimerWidth * userTimerList.timerList.length) + (CircleRadius - (TimerMargin / 2));
    timerStageDiv.style.width = divWidth.toString() + "px";
}

function getTrianglePointSet(start_coordinate, bool_is_up) {
    let x1 = start_coordinate[0];
    let y1 = start_coordinate[1];
    let x2 = start_coordinate[0] - UpDownTriangleLineLen / 2;
    let y2 = start_coordinate[1] + ((bool_is_up ? 1 : -1) * UpDownTriangleHeight);
    let x3 = x2 + UpDownTriangleLineLen;
    let y3 = y2;
    return [[x1, y1], [x2, y2], [x3, y3]];
}

function animatePathObject(path_object, callback) {
    let presentSize = 1.0;
    let deflated = false;
    let animationTimer = setInterval(function (timer, callback) {
        if (!deflated && presentSize >= PathPushedAnimationLimitFactor) {
            path_object.scaleByAnchor(1 - PathPushedAnimationSingleScaleDiffFactor, 1 - PathPushedAnimationSingleScaleDiffFactor, 'center');
            presentSize *= (1 - PathPushedAnimationSingleScaleDiffFactor);
        } else if (!deflated) {
            deflated = true;
        } else if (presentSize <= 1) {
            path_object.scaleByAnchor(1 + PathPushedAnimationSingleScaleDiffFactor, 1 + PathPushedAnimationSingleScaleDiffFactor, 'center');
            presentSize *= (1 + PathPushedAnimationSingleScaleDiffFactor);
        } else {
            path_object.scaleByAnchor(1 / presentSize, 1 / presentSize, 'center');
            clearInterval(timer);

            callback();
        }
    }, PathPushedAnimationInterval, animationTimer, callback);
}

class SingleInput {

    constructor(valueStr, topCenterCoordinate) {
        this.valueInStr = valueStr;

        this.input = this.drawNewInput(this.valueInStr);

        this.topCenterCoordinate = topCenterCoordinate;

        const startCoordinate = this.getStartCoordinate();
        const inputLayerRect = acgraph.rect(startCoordinate[0], startCoordinate[1], this.input.clientWidth, InputFontSize);

        this.singleInputLayer = acgraph.layer();
        this.singleInputLayer.clip(inputLayerRect);
        this.singleInputLayer.parent(timerStage);

        this.underbar = this.drawNewInputUnderbar(this.input.clientWidth);
    }

    // get singleInputLayer() {
    //     return this.singleInputLayer;
    // }

    // get startCoordinate() {
    //     return this.startCoordinate;
    // }

    // get input() {
    //     return this.input;
    // }

    // get valueInStr() {
    //     return this.valueInStr;
    // }

    // get topCenterCoordinate() {
    //     return this.topCenterCoordinate;
    // }

    // get underbar() {
    //     return this.underbar;
    // }

    // set startCoordinate(new_start_coordinate) {
    //     this.startCoordinate = new_start_coordinate;
    // }

    setValueInStr(newValueStr) {
        this.setInputStyle(this.input, this.getStartCoordinate(), newValueStr);
        this.valueInStr = newValueStr;
    }

    setTopCenterCoordinate(newTopCenterCoordinate) {
        this.topCenterCoordinate = newTopCenterCoordinate;
        this.setInputStyle(this.input, this.getStartCoordinate(), this.valueInStr);

        this.underbar.setPosition(this.getUnderbarStartCoordinate[0], this.getUnderbarStartCoordinate[1]);
    }

    getStartCoordinate() {
        let input_width = this.input.clientWidth;
        return [this.topCenterCoordinate[0] - (input_width / 2), this.topCenterCoordinate[1]];
    }

    getUnderbarStartCoordinate() {
        let startCoordinate = this.getStartCoordinate();
        return [startCoordinate[0], startCoordinate[1] + InputFontSize];
    }

    getInputTextStyle(start_coordinate, value) {
        let style = "position:absolute;"
            + "left:" + (start_coordinate == undefined ? 0 : start_coordinate[0]) + CssPositionUnit + ";"
            + "top:" + (start_coordinate == undefined ? 0 : start_coordinate[1]) + CssPositionUnit + ";"
            + "height:" + InputFontSize + CssPositionUnit + ";"
            + "width:" + (value.toString(10).length * InputFontSize).toString(10) + CssPositionUnit + ";"
            + "font-size:" + InputFontSize + CssPositionUnit + ";"
            + "text-align: center; border: none; background: none;";

        return style;
    }

    setInputStyle(input, start_coordinate, value) {
        input.style.cssText = this.getInputTextStyle(start_coordinate, value);
    }

    drawNewInputUnderbar(inputTextWidth) {
        let underbarRectSize = [inputTextWidth, InputUnderbarHeight];
        let underbar = acgraph.rect(this.getStartCoordinate[0], this.getStartCoordinate[1] + InputFontSize, underbarRectSize[0], underbarRectSize[1]);
        underbar.stroke(0);
        underbar.fill(input_bar_gray);
        underbar.parent(this.singleInputLayer);

        return underbar;
    }

    drawNewInput(valueStr) {
        let new_input = document.createElement('input');
        document.getElementById("text_layer_in_timer_stage").appendChild(new_input);
        new_input.type = "text";
        new_input.value = valueStr;
        this.setInputStyle(new_input, undefined, valueStr);

        return new_input;
    }
}

class InputAndButton {

    constructor(inputNum, keepTwoDigits, topCenterCoordinate) {
        this.inputNum = inputNum;
        this.keepTwoDigits = keepTwoDigits;

        this.inputTextStr = this.getPresentInputTextStr();

        this.topCenterCoordinate = topCenterCoordinate;

        this.singleInput = new SingleInput(this.inputTextStr, this.getSingleInputTopCenterCoordinate);

        const layerRect = new acgraph.rect(this.topCenterCoordinate[0] - UpDownTriangleLineLen / 2, this.topCenterCoordinate[1], UpDownTriangleLineLen, UpDownTriangleHeight * 2 + ButtonInputMargin * 2 + InputFontSize);
        this.upDownButtonLayer = acgraph.layer().clip(layerRect);
        this.upDownButtonLayer.parent(timerStage);

        this.drawUpDownTriangle();
    }

    // get upDownButtonLayer() {
    //     return this.upDownButtonLayer;
    // }

    // get inputNum() {
    //     return this.inputNum;
    // }

    // get keepTwoDigits() {
    //     return this.keepTwoDigits;
    // }

    // get inputTextStr() {
    //     return this.inputTextStr;
    // }

    getPresentInputTextStr() {
        try {
            if (this.inputNum == undefined) {
                throw new Error("'inputNum' is undefined");
            }

            if (this.keepTwoDigits && this.inputNum <= 9) {
                return '0' + this.inputNum.toString();
            } else {
                return this.inputNum.toString();
            }
        } catch (e) {
            console.log(e.name + ": " + e.message);
        }
    }

    getInputTextWidth() {
        return this.inputText.clientWidth;
    }

    getWidth() {
        return Math.max(this.getInputTextWidth, UpDownTriangleLineLen);
    }

    setTopCenterCoordinate(newTopCenterCoordinate) {
        this.topCenterCoordinate = newTopCenterCoordinate;

        this.upDownButtonLayer.setPosition(newTopCenterCoordinate[0] - UpDownTriangleLineLen / 2, newTopCenterCoordinate[1]);
        this.singleInput.setTopCenterCoordinate(newTopCenterCoordinate);
    }

    getSingleInputTopCenterCoordinate() {
        return [this.topCenterCoordinate[0], this.topCenterCoordinate[1] + UpDownTriangleHeight + InputTextMargin];
    }

    getDownButtonTriangleTopCoordinate() {
        const singleInputTopCenterCoordinate = this.getSingleInputTopCenterCoordinate();

        return [singleInputTopCenterCoordinate[0], singleInputTopCenterCoordinate[1] + ButtonInputMargin + UpDownTriangleHeight];
    }

    drawTriangle(top_coordinate, is_upward) {
        const trianglePointsSet = getTrianglePointSet(top_coordinate, is_upward);
        let triangle = acgraph.path();
        triangle.stroke(0);
        triangle.moveTo(trianglePointsSet[0][0], trianglePointsSet[0][1]);
        triangle.lineTo(trianglePointsSet[1][0], trianglePointsSet[1][1]);
        triangle.lineTo(trianglePointsSet[2][0], trianglePointsSet[2][1]);
        triangle.close();
        triangle.fill(color_light_blue);
        triangle.parent(this.upDownButtonLayer);

        return triangle;
    }

    drawUpDownTriangle() {
        let upButtonTriangle = this.drawTriangle(this.topCenterCoordinate, true);
        let downButtonTriangle = this.drawTriangle(this.getDownButtonTriangleTopCoordinate(), false);

        upButtonTriangle.listen('click', function () {
            // アニメーション & inputの変化
        });

        downButtonTriangle.listen('click', function () {
            // アニメーション & inputの変化
        });
    }
}

class TimerContent {

    constructor(parentSingleTimer) {
        this.parentTimer = parentSingleTimer;
        this.durationSec = DefaultDuration;
        this.repeatNum = DefaultRepeatNum;
        this.boolSuspendingMode = BoolDefaultSuspendingMode;

        const contentLayerRect = acgraph.rect(this.parentTimer.startCoordinate[0], this.parentTimer.startCoordinate[1], TimerRectSize[0], TimerRectSize[1]);
        this.contentLayer = acgraph.layer().clip(contentLayerRect);

        this.repeatInput = new InputAndButton(this.repeatNum, false, this.getPresentRepeatInputCoordinate());

        // minとsec一緒にしたclassつくるか
        this.durationMinInput;
        this.durationSecInput;
    }

    // get contentLayer() {
    //     return this.contentLayer;
    // }

    // get repeatNum() {
    //     return this.repeatNum;
    // }

    // // いらない
    // getMinAndSecString() {
    //     let min = this.durationSec / 60;
    //     let sec = this.durationSec % 60;
    //     let min_string = (min < 10 ? '0' + min.toString(10) : min.toString(10));
    //     let sec_string = (sec < 10 ? '0' + sec.toString(10) : sec.toString(10));
    //     return [min_string, sec_string];
    // }

    // get repeatInput() {
    //     return this.repeatInput;
    // }

    // get durationMinInput() {
    //     return this.durationMinInput;
    // }

    // get durationSecInput() {
    //     return this.durationSecInput;
    // }

    // set repeatInput(new_repeat_input) {
    //     this.repeatInput = new_repeat_input;
    // }

    // 以下二つ不要
    setDurationMinInput(duration_min_input) {
        this.durationMinInput = duration_min_input;
    }

    setDurationSecInput(duration_sec_input) {
        this.durationSecInput = duration_sec_input;
    }
    // 以上二つ不要

    resetContentCoordinate() {
        this.contentLayer.setPosition(this.parentTimer.startCoordinate[0], this.parentTimer.startCoordinate[1]);

        this.repeatInput.setTopCenterCoordinate(this.parentTimer.startCoordinate[0] + (TimerRectSize[0] / 2), this.parentTimer.startCoordinate[1]);
    }

    getPresentRepeatInputCoordinate() {
        let x = this.parentTimer.startCoordinate[0] + TimerRectSize[0] / 2;
        let y = this.parentTimer.startCoordinate[1] + ContentTopMargin;

        return [x, y];
    }

    /*
    以下不要かも～
    */
    // getContentLayerCoordinate() {
    //     let parent_single_timer_coordinate = this.parentTimer.getCoordinate;
    //     let x = parent_single_timer_coordinate[0];
    //     let y = parent_single_timer_coordinate[1];
    //     return [x, y];
    // }

    // getRepeatInputUpStartCoordinate() {
    //     let x = this.parentTimer.getCoordinate[0] + TimerRectSize[0] / 2;
    //     let y = this.parentTimer.getCoordinate[1] + ContentTopMargin;
    //     return [x, y];
    // }

    // getRepeatInputTextStartCoordinate() {
    //     let repeat_num_digit = this.repeatNum.toString(10).length;
    //     let x = this.parentTimer.getCoordinate[0] + (TimerRectSize[0] / 2) - (repeat_num_digit * InputFontSize / 2);
    //     let y = this.parentTimer.getCoordinate[1] + ContentTopMargin + UpDownTriangleHeight + ButtonInputMargin;
    //     return [x, y];
    // }

    // getRepeatInputTimesTextCoordinate(repeat_input_start_coordinate) {
    //     let x = repeat_input_start_coordinate[0] - InputTextMargin - (TimesTextFontSize * StringTimesText.length);
    //     let y = repeat_input_start_coordinate[1] + (InputFontSize - TimesTextFontSize) / 2;
    //     return [x, y];
    // }

    // getRepeatInputDownStartCoordinate() {
    //     let x = this.parentTimer.getCoordinate[0] + TimerRectSize[0] / 2;
    //     let y = this.getRepeatInputTextStartCoordinate()[1] + InputFontSize + InputUnderbarHeight + ButtonInputMargin + UpDownTriangleHeight;
    //     return [x, y];
    // }

    // getDurationDotTextStartTopCoordinate(duration_dot_width, repeat_input_down_start_coordinate) {
    //     let x = this.parentTimer.getCoordinate[0] + (TimerRectSize[0] / 2) - (duration_dot_width / 2);
    //     let y = repeat_input_down_start_coordinate[1] + ContentTopMargin + UpDownTriangleHeight + ButtonInputMargin + (InputFontSize - DurationDotFontSize) / 2;
    //     return [x, y];
    // }

    // setDurationDotTextStartCoordinate(duration_dot_text, coordinate) {
    //     duration_dot_text.setPosition(coordinate[0], coordinate[1]);
    // }

    // getDurationMinInputStartCoordinate(min_input_width, duration_dot_text_start_coordinate) {
    //     let x = duration_dot_text_start_coordinate[0] - InputTextMargin - min_input_width;
    //     let y = this.getRepeatInputDownStartCoordinate()[1] + ContentTopMargin + UpDownTriangleHeight + ButtonInputMargin;
    //     return [x, y];
    // }

    // getDurationInputMinUpTriangleStartCoordinate(min_input_width, duration_min_input_start_coordinate) {
    //     let min_text_start_coordinate_x = duration_min_input_start_coordinate[0];
    //     let min_text_end_coordinate_x = min_text_start_coordinate_x + min_input_width;
    //     let x = (min_text_start_coordinate_x + min_text_end_coordinate_x) / 2;
    //     let y = duration_min_input_start_coordinate[1] - ButtonInputMargin - UpDownTriangleHeight;
    //     return [x, y];
    // }

    // getDurationInputMinDownTriangleStartCoordinate(duration_min_input_up_triangle_start_coordinate) {
    //     let x = duration_min_input_up_triangle_start_coordinate[0];
    //     let y = duration_min_input_up_triangle_start_coordinate[1] + UpDownTriangleHeight + ButtonInputMargin + InputFontSize + ButtonInputMargin + UpDownTriangleHeight;
    //     return [x, y];
    // }

    // getDurationSecInputStartCoordinate(duration_dot_text_start_coordinate, duration_min_input_start_coordinate, duration_dot_text_width) {
    //     let x = duration_dot_text_start_coordinate[0] + duration_dot_text_width + InputTextMargin;
    //     let y = duration_min_input_start_coordinate[1];
    //     return [x, y];
    // }

    // getDurationSecInputUpTriangleStartCoordinate(duration_sec_input_start_coordinate, duration_sec_input_width) {
    //     let x = duration_sec_input_start_coordinate[0] + (duration_sec_input_width / 2);
    //     let y = duration_sec_input_start_coordinate[1] - ButtonInputMargin - UpDownTriangleHeight;
    //     return [x, y];
    // }

    // getDurationSecInputDownTriangleStartCoordinate(duration_sec_input_up_triangle_start_coordinate) {
    //     let x = duration_sec_input_up_triangle_start_coordinate[0];
    //     let y = duration_sec_input_up_triangle_start_coordinate[1] + UpDownTriangleHeight + ButtonInputMargin + InputFontSize + ButtonInputMargin + UpDownTriangleHeight;
    //     return [x, y];
    // }

    // drawTriangle(start_coordinate, bool_is_up) {
    //     const triangle_point_set = getTrianglePointSet(start_coordinate, bool_is_up);
    //     let triangle = acgraph.path();
    //     triangle.stroke(0);
    //     triangle.moveTo(triangle_point_set[0][0], triangle_point_set[0][1]);
    //     triangle.lineTo(triangle_point_set[1][0], triangle_point_set[1][1]);
    //     triangle.lineTo(triangle_point_set[2][0], triangle_point_set[2][1]);
    //     triangle.close();
    //     triangle.fill(color_light_blue);
    //     triangle.parent(this.contentLayer);

    //     return triangle;
    // }

    // getInputTextStyle(start_coordinate, value) {
    //     let style = "position:absolute;"
    //         + "left:" + start_coordinate[0] + CssPositionUnit + ";"
    //         + "top:" + start_coordinate[1] + CssPositionUnit + ";"
    //         + "height:" + InputFontSize + CssPositionUnit + ";"
    //         + "width:" + (value.toString(10).length * InputFontSize).toString(10) + CssPositionUnit + ";"
    //         + "font-size:" + InputFontSize + CssPositionUnit + ";"
    //         + "text-align: center; border: none; background: none;";

    //     return style;
    // }

    // drawInput(start_coordinate, default_value) {
    //     let input_text = document.createElement('input');
    //     document.getElementById("text_layer_in_timer_stage").appendChild(input_text);
    //     input_text.type = "text";
    //     input_text.value = default_value;
    //     input_text.style.cssText = this.getInputTextStyle(start_coordinate, default_value);    // font-size: 100%;

    //     return input_text;
    // }

    // drawInputUnderbar(input_text_start_coordinate, input_text_width) {
    //     let underbar_size = [input_text_width, InputUnderbarHeight];
    //     let underbar = acgraph.rect(input_text_start_coordinate[0], input_text_start_coordinate[1] + InputFontSize, underbar_size[0], underbar_size[1]);
    //     underbar.stroke(0);
    //     underbar.fill(input_bar_gray);
    //     underbar.parent(this.contentLayer);

    //     return underbar;
    // }

    // setInputCoordinate(input, start_coordinate, set_value) {
    //     input.style.cssText = this.getInputTextStyle(start_coordinate, set_value);
    // }

    // setAllInputCoordinate() {
    //     let repeat_input = this.repeatInput;
    //     let repeat_input_start_coordiante = this.getRepeatInputTextStartCoordinate();
    //     this.setInputCoordinate(repeat_input, repeat_input_start_coordiante, this.repeatNum);

    //     let duration_min_input = this.durationMinInput;
    //     let duration_min_width = duration_min_input.clientWidth;
    //     let duration_min_input_start_coordinate = this.getDurationMinInputStartCoordinate(duration_min_width)
    // }

    // setContentLayerCoordinate() {
    //     let content_layer = this.contentLayer;
    //     let parent_single_timer_coordinate = this.parentTimer.getCoordinate;
    //     content_layer.setPosition(parent_single_timer_coordinate[0], parent_single_timer_coordinate[1]);
    // }

    // drawContent() {
    //     let content_layer_coordinate = this.getContentLayerCoordinate();
    //     let content_layer_rect = acgraph.rect(content_layer_coordinate[0], content_layer_coordinate[1], TimerRectSize[0], TimerRectSize[1]);
    //     this.contentLayer.clip(content_layer_rect);

    //     // repeat input up triangle
    //     const repeat_input_up_triangle_start_coordinate = this.getRepeatInputUpStartCoordinate();
    //     let repeat_input_up_triangle = this.drawTriangle(repeat_input_up_triangle_start_coordinate, true);

    //     // repeat input
    //     let repeat_input_start_coordiante = this.getRepeatInputTextStartCoordinate();
    //     let repeat_input = this.drawInput(repeat_input_start_coordiante, this.repeatNum);
    //     let repeat_input_width = repeat_input.clientWidth;
    //     this.setRepeatInput(repeat_input);

    //     // repeat input underbar
    //     this.drawInputUnderbar(repeat_input_start_coordiante, repeat_input_width);

    //     // times text
    //     const repeat_input_times_text_coordinate = this.getRepeatInputTimesTextCoordinate(repeat_input_start_coordiante);
    //     let repeat_input_times_text = acgraph.text(repeat_input_times_text_coordinate[0], repeat_input_times_text_coordinate[1], StringTimesText);
    //     repeat_input_times_text.fontSize(TimesTextFontSize);
    //     repeat_input_times_text.parent(this.contentLayer);

    //     // repeat input down triangle
    //     const repeat_input_down_triangle_start_coordinate = this.getRepeatInputDownStartCoordinate();
    //     let repeat_input_down_triangle = this.drawTriangle(repeat_input_down_triangle_start_coordinate, false);

    //     // duration dot
    //     let duration_dot_text = acgraph.text(0, 0, StringDurationDot);
    //     duration_dot_text.fontSize(DurationDotFontSize);
    //     duration_dot_text.parent(this.contentLayer);
    //     let duration_dot_text_width = duration_dot_text.getWidth();
    //     const duration_dot_text_start_coordinate = this.getDurationDotTextStartTopCoordinate(duration_dot_text_width, repeat_input_down_triangle_start_coordinate);
    //     this.setDurationDotTextStartCoordinate(duration_dot_text, duration_dot_text_start_coordinate);

    //     // duration min input
    //     let duration_min_input = this.drawInput([0, 0], this.getMinAndSecString[0]);
    //     let duration_min_input_width = duration_min_input.clientWidth;
    //     const duration_min_input_start_coordinate = this.getDurationMinInputStartCoordinate(duration_min_input_width, duration_dot_text_start_coordinate);
    //     this.setInputCoordinate(duration_min_input, duration_min_input_start_coordinate, this.getMinAndSecString[0]);
    //     this.setDurationMinInput(duration_min_input);

    //     // duration min input bar
    //     let duration_min_input_underbar = this.drawInputUnderbar(duration_min_input_start_coordinate, duration_min_input_width);

    //     // duration min input up triangle
    //     const duration_input_min_up_triangle_start_coordinate = this.getDurationInputMinUpTriangleStartCoordinate(duration_min_input_width, duration_min_input_start_coordinate);
    //     let duration_input_min_up_triangle = this.drawTriangle(duration_input_min_up_triangle_start_coordinate, true);

    //     // duration min input down triangle
    //     const duration_input_min_down_triangle_start_coordinate = this.getDurationInputMinDownTriangleStartCoordinate(duration_input_min_up_triangle_start_coordinate);
    //     let duration_input_min_down_triangle = this.drawTriangle(duration_input_min_down_triangle_start_coordinate, false);

    //     // duration sec input
    //     const duration_input_sec_start_coordinate = this.getDurationSecInputStartCoordinate(duration_dot_text_start_coordinate, duration_min_input_start_coordinate, duration_dot_text_width);
    //     let duration_sec_input = this.drawInput(duration_input_sec_start_coordinate, this.getMinAndSecString[1]);
    //     let duration_sec_input_width = duration_sec_input.clientWidth;
    //     this.setDurationSecInput(duration_sec_input);

    //     // duration sec input underbar
    //     let duration_sec_input_underbar = this.drawInputUnderbar(duration_input_sec_start_coordinate, duration_sec_input_width);

    //     // duration sec input up triangle
    //     const duration_sec_input_up_triangle_start_coordinate = this.getDurationSecInputUpTriangleStartCoordinate(duration_input_sec_start_coordinate, duration_sec_input_width);
    //     let duration_sec_input_up_triangle = this.drawTriangle(duration_sec_input_up_triangle_start_coordinate, true);

    //     // duration sec input down triangle
    //     const duration_sec_input_down_triangle_start_coordinate = this.getDurationSecInputDownTriangleStartCoordinate(duration_sec_input_up_triangle_start_coordinate);
    //     let duration_sec_input_down_triangle = this.drawTriangle(duration_sec_input_down_triangle_start_coordinate, false);
    // }
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

    constructor(timerId, startCoordinate) {
        this.timerId = timerId;
        this.startCoordinate = startCoordinate;

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

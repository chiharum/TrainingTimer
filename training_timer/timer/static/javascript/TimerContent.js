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

    constructor(value_in_str, top_center_coordinate) {
        this.singleInputLayer = acgraph.layer();
        this.valueInStr = value_in_str;

        this.input = this.drawNewInput(this.valueInStr);

        this.topCenterCoordinate = top_center_coordinate;
        this.startCoordinate = this.getStartCoordinate();

        this.underbar = this.drawNewInputUnderbar(this.startCoordinate, this.input.clientWidth);
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

    setValueInStr(new_val_str) {
        this.setInputStyle(this.input, this.getStartCoordinate(), new_val_str);
        this.valueInStr = new_val_str;
    }

    setTopCenterCoordinate(new_top_center_coordinate) {
        this.topCenterCoordinate = new_top_center_coordinate;
        this.startCoordinate = this.getStartCoordinate();
        this.setInputStyle(this.input, this.startCoordinate, this.valueInStr);

        this.underbar.setPosition(this.getUnderbarStartCoordinate[0], this.getUnderbarStartCoordinate[1]);
    }

    getStartCoordinate() {
        let input_width = this.input.clientWidth;
        return [this.topCenterCoordinate[0] - (input_width / 2), this.topCenterCoordinate[1]];
    }

    getUnderbarStartCoordinate() {
        return [this.startCoordinate[0], this.startCoordinate[1] + InputFontSize];
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

    drawNewInputUnderbar(input_text_start_coordinate, input_text_width) {
        let underbar_rect_size = [input_text_width, InputUnderbarHeight];
        let underbar = acgraph.rect(input_text_start_coordinate[0], input_text_start_coordinate[1] + InputFontSize, underbar_rect_size[0], underbar_rect_size[1]);
        underbar.stroke(0);
        underbar.fill(input_bar_gray);
        underbar.parent(this.singleInputLayer);

        return underbar;
    }

    drawNewInput(value_in_str) {
        let new_input = document.createElement('input');
        document.getElementById("text_layer_in_timer_stage").appendChild(new_input);
        new_input.type = "text";
        new_input.value = value_in_str;
        this.setInputStyle(new_input, undefined, value_in_str);

        return new_input;
    }
}

class SingleInputAndButton {

    constructor(input_num, keep_two_digits, top_center_coordinate) {
        this.inputNum = input_num;
        this.keepTwoDigits = keep_two_digits;

        this.inputTextStr = this.getPresentInputTextStr();

        this.topCenterCoordinate = top_center_coordinate;

        this.singleInput = new SingleInput(this.inputTextStr, this.getSingleInputTopCenterCoordinate);

        this.upDownButtonLayer = acgraph.layer();
        const layerRect = new acgraph.rect(this.topCenterCoordinate[0] - UpDownTriangleLineLen / 2, this.topCenterCoordinate[1], UpDownTriangleLineLen, UpDownTriangleHeight * 2 + ButtonInputMargin * 2 + InputFontSize);
        this.upDownButtonLayer.clip(layerRect);
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
        if (this.keepTwoDigits && this.inputNum <= 9) {
            return '0' + toString(this.inputNum);
        } else {
            return toString(this.inputNum);
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
        let downButtonTriangle = this.drawTriangle(this.getDownButtonTriangleTopCoordinate, false);

        upButtonTriangle.listen('click', function () {
            // アニメーション & inputの変化
        });

        downButtonTriangle.listen('click', function () {
            // アニメーション & inputの変化
        });
    }

    // 一回TimerContentに組み込んでバグとれや
}

class TimerContent {

    constructor(parent_single_timer) {
        this.parentTimer = parent_single_timer;

        this.durationSec = DefaultDuration;

        this.repeatNum = DefaultRepeatNum;

        this.boolSuspendingMode = BoolDefaultSuspendingMode;
        this.contentLayer = acgraph.layer();

        this.repeatInput = new SingleInputAndButton(this.repeatNum, false, this.getPresentRepeatInputCoordinate);

        // minとsec一緒にしたclassつくるか
        this.durationMinInput = new SingleInputAndButton();
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

    setContentCoordinate(newCoordinate) {
        this.contentLayer.setPosition(newCoordinate[0], newCoordinate[1]);

        this.repeatInput.setTopCenterCoordinate(newCoordinate[0], newCoordinate[1]);
    }

    getPresentRepeatInputCoordinate() {
        let contentStartCoordinate = this.parentTimer.groupStartCoordinate;
        let x = contentStartCoordinate[0] + TimerRectSize[0] / 2;
        let y = contentStartCoordinate[1] + ContentTopMargin;

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
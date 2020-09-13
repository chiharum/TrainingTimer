class TimerContent {

    constructor(parentLayer, defaultCoordinate) {
        this.topLeftCoordinate = defaultCoordinate;

        const contentLayerRect = acgraph.rect(this.topLeftCoordinate[0], this.topLeftCoordinate[1], TimerRectSize[0], TimerRectSize[1]);
        this.contentLayer = acgraph.layer().clip(contentLayerRect);
        this.contentLayer.parent(parentLayer);

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

        this.contentLayer.setPosition(newCoordinate[0], newCoordinate[1]);

        this.repeatInput.setTopCenterCoordinate(this._getRepeatInputTopCenterCoordinate());

        console.log("top left: " + this.topLeftCoordinate);
        console.log("top center: " + this._getRepeatInputTopCenterCoordinate());
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
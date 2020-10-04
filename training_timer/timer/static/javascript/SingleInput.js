class SingleInput {

    constructor(parentLayer, defaultValue, topCenterCoordinate, topCenterCoordinateRelative) {
        this.inputTopCenterCoordinate = topCenterCoordinate;
        this.topCenterCoordinateRelative = topCenterCoordinateRelative;

        this.input = this._makeNewInput(defaultValue);
        this._resetInputStyle();

        this.inputLayer = parentLayer.layer();

        this.underbar = this._drawNewInputUnderbar(this.input.clientWidth);
    }

    _getUnderbarTopLeftCoordinate() {
        let topLeftCoordinate = [this.inputTopCenterCoordinate[0] - (this.input.clientWidth / 2), this.inputTopCenterCoordinate[1]];
        return [topLeftCoordinate[0], topLeftCoordinate[1] + InputFontSize];
    }

    _resetUnderbarPosition() {
        let underbarTopLeftCoordinate = this._getUnderbarTopLeftCoordinate();

        this.underbar.setPosition(underbarTopLeftCoordinate[0], underbarTopLeftCoordinate[1]);
    }

    _resetInputStyle() {
        let width = Math.min(this.input.value.length * InputFontSize, TimerRectSize[0]);

        let topLeftCoordinate = [this.inputTopCenterCoordinate[0] - (width / 2), this.inputTopCenterCoordinate[1]];

        this.input.style.cssText = "position:absolute;"
            + "left:" + topLeftCoordinate[0] + CssPositionUnit + ";"
            + "top:" + topLeftCoordinate[1] + CssPositionUnit + ";"
            + "height:" + InputFontSize + CssPositionUnit + ";"
            + "width:" + width + CssPositionUnit + ";"
            + "font-size:" + InputFontSize + CssPositionUnit + ";"
            + "text-align: center; border: none; background: none;";
    }

    _resetValue() {
        this._resetInputStyle();
        this._resetUnderbarPosition();
        this.underbar.setWidth(this.input.clientWidth);
    }

    _drawNewInputUnderbar(inputTextWidth) {
        const underbarRectSize = [inputTextWidth, InputUnderbarHeight];
        const underbarStartCoordinate = this._getUnderbarTopLeftCoordinate();
        let underbar = acgraph.rect(underbarStartCoordinate[0], underbarStartCoordinate[1], underbarRectSize[0], underbarRectSize[1]);
        underbar.stroke(0);
        underbar.fill(InputBarGray);
        underbar.parent(this.inputLayer);

        return underbar;
    }

    _makeNewInput(valueStr) {
        let newInput = document.createElement('input');
        document.getElementById("text_layer_in_timer_stage").appendChild(newInput);
        newInput.type = "text";
        newInput.value = valueStr;
        newInput.addEventListener("input", () => {
            this._resetValue();
        });

        return newInput;
    }

    setTopCenterCoordinate(newTopCenterCoordinate) {
        this.inputTopCenterCoordinate = newTopCenterCoordinate;

        this._resetInputStyle();

        this._resetUnderbarPosition();
    }

    eraseInput() {
        this.input.remove();
    }
}
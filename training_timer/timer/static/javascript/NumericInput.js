class NumericInput {

    constructor(parentLayer, defaultNum, keepTwoDigits, defaultTopCenterCoordinate) {
        this.inputNum = defaultNum;
        this.keepTwoDigits = keepTwoDigits;

        this.topCenterCoordinate = defaultTopCenterCoordinate;

        this.singleInput = new SingleInput(parentLayer, this._getPresentInputStr(), this._getSingleInputTopCenterCoordinate());

        this.buttonLayer = parentLayer.layer();

        this._drawUpDownTriangle();
    }

    _getPresentInputStr() {
        try {
            if (this.inputNum == undefined) {
                throw new Error("'inputNum' is undefined");
            } else if (this.keepTwoDigits && this.inputNum <= 9) {
                return '0' + this.inputNum.toString();
            } else {
                return this.inputNum.toString();
            }
        } catch (e) {
            console.log(e.name + ": " + e.message);
        }
    }

    _getInputWidth() {
        return this.inputText.clientWidth;
    }

    _getLargerWidth() {
        return Math.max(this._getInputWidth, UpDownTriangleLineLen);
    }

    _getSingleInputTopCenterCoordinate() {
        return [this.topCenterCoordinate[0], this.topCenterCoordinate[1] + UpDownTriangleHeight + InputTextMargin];
    }

    _getDownButtonTriangleTopCoordinate() {
        const singleInputTopCenterCoordinate = this._getSingleInputTopCenterCoordinate();

        return [singleInputTopCenterCoordinate[0], singleInputTopCenterCoordinate[1] + ButtonInputMargin + InputFontSize + InputUnderbarHeight + UpDownTriangleHeight];
    }

    setTopCenterCoordinate(newTopCenterCoordinate) {
        this.topCenterCoordinate = newTopCenterCoordinate;

        // setPositionとtranslateの違いを検証した方がよさそう
        this.buttonLayer.setPosition(this.topCenterCoordinate[0] - UpDownTriangleLineLen / 2, this.topCenterCoordinate[1]);
        this.singleInput.setTopCenterCoordinate(this._getSingleInputTopCenterCoordinate());
    }

    _getTrianglePointSet(start_coordinate, bool_is_up) {
        let x1 = start_coordinate[0];
        let y1 = start_coordinate[1];
        let x2 = start_coordinate[0] - UpDownTriangleLineLen / 2;
        let y2 = start_coordinate[1] + ((bool_is_up ? 1 : -1) * UpDownTriangleHeight);
        let x3 = x2 + UpDownTriangleLineLen;
        let y3 = y2;
        return [[x1, y1], [x2, y2], [x3, y3]];
    }

    _drawTriangle(topPointCoordinate, isUpward) {
        const trianglePointsSet = this._getTrianglePointSet(topPointCoordinate, isUpward);
        let triangle = acgraph.path();
        triangle.stroke(0);
        triangle.moveTo(trianglePointsSet[0][0], trianglePointsSet[0][1]);
        triangle.lineTo(trianglePointsSet[1][0], trianglePointsSet[1][1]);
        triangle.lineTo(trianglePointsSet[2][0], trianglePointsSet[2][1]);
        triangle.close();
        triangle.fill(ColorLightBlue);
        triangle.parent(this.buttonLayer);

        return triangle;
    }

    _drawUpDownTriangle() {
        let upButtonTriangle = this._drawTriangle(this.topCenterCoordinate, true);
        let downButtonTriangle = this._drawTriangle(this._getDownButtonTriangleTopCoordinate(), false);

        upButtonTriangle.listen('click', function () {
            // アニメーション & inputの変化
        });

        downButtonTriangle.listen('click', function () {
            // アニメーション & inputの変化
        });
    }

    eraseNumericInput() {
        this.singleInput.eraseInput();
    }
}
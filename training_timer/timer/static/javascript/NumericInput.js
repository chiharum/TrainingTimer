class NumericInput {

    constructor(parentLayer, defaultNum, keepTwoDigits, topCenterCoordinate) {
        this.inputNum = defaultNum;
        this.keepTwoDigits = keepTwoDigits;

        this.inputTopCenterCoordinate = topCenterCoordinate;

        this.singleInput = new SingleInput(parentLayer, this._getPresentInputStr(), this._getSingleInputTopCenterCoordinate());

        const buttonLayerRect = new acgraph.rect(this.inputTopCenterCoordinate[0] - UpDownTriangleLineLen / 2, this.inputTopCenterCoordinate[1], UpDownTriangleLineLen, UpDownTriangleHeight * 2 + ButtonInputMargin * 2 + InputFontSize);
        this.buttonLayer = acgraph.layer().clip(buttonLayerRect);
        this.buttonLayer.parent(parentLayer);

        this.drawUpDownTriangle();
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
        return [this.inputTopCenterCoordinate[0], this.inputTopCenterCoordinate[1] + UpDownTriangleHeight + InputTextMargin];
    }

    _getDownButtonTriangleTopCoordinate() {
        const singleInputTopCenterCoordinate = this._getSingleInputTopCenterCoordinate();

        return [singleInputTopCenterCoordinate[0], singleInputTopCenterCoordinate[1] + ButtonInputMargin + InputFontSize + InputUnderbarHeight + UpDownTriangleHeight];
    }

    setTopCenterCoordinate(newTopCenterCoordinate) {
        this.inputTopCenterCoordinate = newTopCenterCoordinate;

        console.log("button layer position: " + [newTopCenterCoordinate[0] - UpDownTriangleLineLen / 2, newTopCenterCoordinate[1]]);

        // setPositionとtranslateの違いを検証した方がよさそう
        this.buttonLayer.setPosition(newTopCenterCoordinate[0] - UpDownTriangleLineLen / 2, newTopCenterCoordinate[1]);
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

    drawTriangle(top_coordinate, is_upward) {
        const trianglePointsSet = this._getTrianglePointSet(top_coordinate, is_upward);
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

    drawUpDownTriangle() {
        let upButtonTriangle = this.drawTriangle(this.inputTopCenterCoordinate, true);
        let downButtonTriangle = this.drawTriangle(this._getDownButtonTriangleTopCoordinate(), false);

        upButtonTriangle.listen('click', function () {
            // アニメーション & inputの変化
        });

        downButtonTriangle.listen('click', function () {
            // アニメーション & inputの変化
        });
    }
}
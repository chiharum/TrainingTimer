function animatePathObject(path_object, callback) {
    let presentSize = 1.0;
    let deflated = false;
    let animationTimer = setInterval(function (callback) {
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
            clearInterval(animationTimer);

            callback();
        }
    }, PathPushedAnimationInterval, callback);
}

class Circle {

    constructor(parentLayer, defaultCenterCoordinate, radius, color, onClick, zIndex) {
        this.centerCoordinate = defaultCenterCoordinate;
        this.radius = radius;
        this.color = color;
        this.zIndex = zIndex;
        this.parentLayer = parentLayer;

        console.log("Circle center: " + this.centerCoordinate);

        this.circle = this._drawCircle();

        this.circle.listen('click', () => {
            animatePathObject(this.circle, onClick);
        });
        this.circle.listen('mouseover', function () {
            document.body.style.cursor = "pointer";
        });
        this.circle.listen('mouseout', function () {
            document.body.style.cursor = "default";
        });
    }

    _drawCircle() {
        let circle = acgraph.circle(this.centerCoordinate[0], this.centerCoordinate[1], this.radius);
        circle.fill(this.color);
        circle.stroke(0);
        circle.zIndex(this.zIndex);
        this.parentLayer.addChild(circle);

        return circle;
    }

    setCenterCoordinate(newCenterCoordinate) {
        this.centerCoordinate = newCenterCoordinate;
        this.circle.setPosition(newCenterCoordinate[0] - this.radius, newCenterCoordinate[1] - this.radius);
    }
}
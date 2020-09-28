let stage = acgraph.create("stageDiv");

let layer1 = stage.layer();

let layer2 = stage.layer();

layer1.rect(0, 0, 50, 50);

let layer2Rect = layer2.rect(10, 10, 50, 50);

// console.log("(1) layer2 top left: " + [layer2.getX(), layer2.getY()]);
console.log("(1) layer2 top left absolute: " + [layer2.getAbsoluteX(), layer2.getAbsoluteY()]);

// console.log("(1) layer2-rect top left: " + [layer2Rect.getX(), layer2Rect.getY()]);
// console.log("(1) layer2-rect top left absolute: " + [layer2Rect.getAbsoluteX(), layer2Rect.getAbsoluteY()]);

layer2.setPosition(25, 25);

// console.log("(2) layer2 top left: " + [layer2.getX(), layer2.getY()]);
console.log("(2) layer2 top left absolute: " + [layer2.getAbsoluteX(), layer2.getAbsoluteY()]);

// console.log("(2) layer2-rect top left: " + [layer2Rect.getX(), layer2Rect.getY()]);
// console.log("(2) layer2-rect top left absolute: " + [layer2Rect.getAbsoluteX(), layer2Rect.getAbsoluteY()]);

// console.log("(3) layer2 top left: " + [layer2.getX(), layer2.getY()]);
// console.log("(3) layer2 top left absolute: " + [layer2.getAbsoluteX(), layer2.getAbsoluteY()]);

// console.log("(3) layer2-rect top left: " + [layer2Rect.getX(), layer2Rect.getY()]);
// console.log("(3) layer2-rect top left absolute: " + [layer2Rect.getAbsoluteX(), layer2Rect.getAbsoluteY()]);
let stage = acgraph.create("stageDiv");
let layer1 = stage.layer();
let layer2 = layer1.layer();
layer2.parent(layer1);

layer1.rect(0, 0, 50, 50);

console.log("layer2 top left absolute: " + [layer2.getAbsoluteX(), layer2.getAbsoluteY()]);

let layer2Rect = layer2.rect(25, 25, 50, 50);

console.log("layer2 top left absolute: " + [layer2.getAbsoluteX(), layer2.getAbsoluteY()]);

let layer2Rect2 = layer2.rect(50, 50, 50, 50);

console.log("layer2 top left absolute: " + [layer2.getAbsoluteX(), layer2.getAbsoluteY()]);

layer1.setPosition(50, 50);

console.log("layer2 top left absolute: " + [layer2.getAbsoluteX(), layer2.getAbsoluteY()]);

// layer2.setPosition(5, 5);

// layer2.translate(25 - layer2.getAbsoluteX(), 25 - layer2.getAbsoluteY());

// console.log("layer2 top left absolute: " + [layer2.getAbsoluteX(), layer2.getAbsoluteY()]);

// console.log("(2) layer2 top left absolute: " + [layer2.getAbsoluteX(), layer2.getAbsoluteY()]);
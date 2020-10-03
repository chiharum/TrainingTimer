let stage = acgraph.create("stageDiv");
let layer1 = stage.layer();
let layer2 = layer1.layer();

layer1.rect(0, 0, 50, 50);

layer1.setPosition(50, 50);

let layer2Rect = layer2.rect(25, 25, 50, 50);

console.log("(1) layer2 top left absolute: " + [layer2.getAbsoluteX(), layer2.getAbsoluteY()]);

// console.log("(2) layer2 top left absolute: " + [layer2.getAbsoluteX(), layer2.getAbsoluteY()]);
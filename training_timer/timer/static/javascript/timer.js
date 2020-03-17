// sizes and lengths
const timer_rect_size = [300, 300];
const timer_rect_corner_radius = 50;
const timer_margin = 24;
const circle_radius = 25;
const distance_circle_rect_round = 10;
const dif_circle_center_and_rect_corner = timer_rect_corner_radius - (timer_rect_corner_radius - circle_radius - distance_circle_rect_round) * Math.sin(45 * Math.PI / 180);
const single_timer_width = timer_rect_size[0] + timer_margin;
// position coordinates
const first_layer_start_coordinate = [timer_margin * 2, 50];
// timings
const pushed_scale_interval = 5;
// others
const timer_rect_zIndex = 0;
const circle_zIndex = 1;

let div_timer_stage = document.getElementById('timer_stage');

function renewDivTimerStageWidth() {
    let div_width = first_layer_start_coordinate[0] + (single_timer_width * timer_num) + (circle_radius - (timer_margin / 2));
    div_timer_stage.style.width = div_width + "px";
}

let timer_stage = acgraph.create('timer_stage');

let left_plus_button_layer = timer_stage.layer();

let timer_list = [];

let timer_num = 0;

let next_new_timer_id = 1;

// let new_timer_requested = false;

class SingleTimer {

    constructor(timer_id, left_timer_id, right_timer_id, group_start_coordinate) {
        this.timer_id = timer_id;
        this.left_timer_id = left_timer_id;
        this.right_timer_id = right_timer_id;
        this.group_start_coordinate = group_start_coordinate;
        this.timer_layer;
        this.timer_content = new TimerContent(this);
    }

    get getId() {
        return this.timer_id;
    }

    get getLeftId() {
        return this.left_timer_id;
    }

    get getRightId() {
        return this.right_timer_id;
    }

    get getCoordinate() {
        return this.group_start_coordinate;
    }

    get getTimerLayer() {
        return this.timer_layer;
    }

    get getMinAndSec() {
        return [this.timer_duration / 60, this.timer_duration % 60];
    }

    get getTimerDurationString() {
        let min_and_sec_set = this.getMinAndSec;
        let min = min_and_sec_set[0];
        let sec = min_and_sec_set[1]
        let min_string = String(min);
        let sec_string = (sec >= 10 ? String(sec) : '0' + String(sec));
        return min_string + ':' + sec_string;
    }

    setRightId(new_right_id) {
        this.right_timer_id = new_right_id;
    }

    setLeftId(new_left_id) {
        this.left_timer_id = new_left_id;
    }

    setGroupStartCoordinate(new_coordinate) {
        this.group_start_coordinate = new_coordinate;
        this.timer_layer.setPosition(new_coordinate[0], new_coordinate[1]);
        this.timer_content.setContentLayerCoordinate();
    }

    static setEveryTimerZIndex() {
        let zIndex = 0;
        let thisTimer = SingleTimer.getMostRightTimer();
        let isFinished = false;
        while (!isFinished) {
            thisTimer.getTimerLayer.zIndex(zIndex);
            zIndex += 1;

            if (thisTimer.getLeftId == 0) {
                isFinished = true;
                left_plus_button_layer.zIndex(zIndex);
                break;
            } else {
                thisTimer = SingleTimer.getNeighborTimer(thisTimer.getId, false);
            }
        }
    }

    static getMostLeftTimer() {
        for (let i = 0; i < timer_list.length; i++) {
            if (timer_list[i].getLeftId == 0) {
                return timer_list[i];
            }
        }
    }

    static getMostRightTimer() {
        for (let i = 0; i < timer_list.length; i++) {
            if (timer_list[i].getRightId == 0) {
                return timer_list[i];
            }
        }
    }

    static getNeighborTimer(timer_id, bool_get_right) {
        for (let i = 0; i < timer_list.length; i++) {
            if (bool_get_right) {
                if (timer_list[i].getLeftId == timer_id) {
                    return timer_list[i];
                }
            } else {
                if (timer_list[i].getRightId == timer_id) {
                    return timer_list[i];
                }
            }
        }
        return -1;
    }

    static moveEveryRightTimerPosition(start_timer_id, bool_move_to_right) {

        let start_timer = SingleTimer.getTimerById(start_timer_id);

        if (start_timer != -1) {

            if (bool_move_to_right) {
                start_timer.setGroupStartCoordinate([start_timer.getCoordinate[0] + single_timer_width, start_timer.getCoordinate[1]]);
            } else {
                start_timer.setGroupStartCoordinate([start_timer.getCoordinate[0] - single_timer_width, start_timer.getCoordinate[1]]);
            }

            if (start_timer.getRightId != 0) {
                this.moveEveryRightTimerPosition(start_timer.getRightId, bool_move_to_right);
            }
        }

        return -1;
    }

    static getTimerById(timer_id) {
        for (let i = 0; i < timer_list.length; i++) {
            if (timer_list[i].getId == timer_id) {
                return timer_list[i];
            }
        }
        return -1;
    }

    static countLeftTimer(left_timer_id) {
        for (let i = 0; i < timer_list.length; i++) {
            if (timer_list[i].getId == left_timer_id) {
                return 1 + SingleTimer.countLeftTimer(timer_list[i].getLeftId);
            }
        }
        return 0;
    }

    static getNewLayerCoordinate(left_timer_id) {
        let left_timer_num = SingleTimer.countLeftTimer(left_timer_id);
        let x = first_layer_start_coordinate[0] + (timer_rect_size[0] + timer_margin) * left_timer_num;
        let y = first_layer_start_coordinate[1];
        return [x, y];
    }

    circlePushedAnimation(single_circle, callback) {

        let present_radius = circle_radius;
        let deflated = false;
        let inflated = false;

        function animateCircle(animation_timer, callback) {
            if (present_radius > circle_radius * 0.9 && !deflated) {
                present_radius -= 0.2;
                single_circle.setRadius(present_radius, present_radius);
            } else if (present_radius < circle_radius && !inflated) {
                if (!deflated) {
                    deflated = true;
                }
                present_radius += 0.2;
                single_circle.setRadius(present_radius, present_radius);
            } else if (deflated && present_radius >= circle_radius && !inflated) {
                inflated = true;
                clearInterval(animation_timer);

                callback();
            }
        }
        let animation_timer = setInterval(animateCircle, pushed_scale_interval, animation_timer, callback);
    }

    drawCircle(center_coordinate, layer) {
        let single_circle = acgraph.circle(center_coordinate[0], center_coordinate[1], circle_radius);
        single_circle.fill(color_light_blue);
        single_circle.stroke(0);
        single_circle.zIndex(circle_zIndex);
        layer.addChild(single_circle);

        return single_circle;
    }

    static createNewTimer(left_timer_id, right_timer_id) {
        let new_timer = new SingleTimer(next_new_timer_id, left_timer_id, right_timer_id, SingleTimer.getNewLayerCoordinate(left_timer_id));
        new_timer.drawTimer();
        timer_list.push(new_timer);

        return new_timer;
    }

    createNextTimer(left_timer_id, right_timer_id) {

        const new_timer = SingleTimer.createNewTimer(left_timer_id, right_timer_id);

        if (right_timer_id != 0) {
            SingleTimer.moveEveryRightTimerPosition(right_timer_id, true);
        }

        return new_timer;
    }

    centerize_text_x(text) {
        text.setPosition(this.group_start_coordinate[0] + (timer_rect_size[0] - text.getWidth()) / 2, text.getAbsoluteY());
    }

    centerize_text_y(text) {
        text.setPosition(text.getAbsoluteX(), this.group_start_coordinate[1] + (timer_rect_size[1] - text.getHeight()) / 2);
    }

    delete_timer(deleting_timer_id) {

        if (timer_num > 1) {
            const deleting_timer = SingleTimer.getTimerById(deleting_timer_id);
            const left_timer_id = deleting_timer.getLeftId;
            const right_timer_id = deleting_timer.getRightId;

            if (left_timer_id != 0) {
                SingleTimer.getTimerById(left_timer_id).setRightId(right_timer_id);
            }
            if (right_timer_id != 0) {
                SingleTimer.getTimerById(right_timer_id).setLeftId(left_timer_id);
            }

            deleting_timer.getTimerLayer.remove();

            for (let i = 0; i < timer_list.length; i++) {
                if (timer_list[i].getId == deleting_timer_id) {
                    timer_list.splice(i, 1);
                }
            }

            timer_num--;

            renewDivTimerStageWidth();

            SingleTimer.moveEveryRightTimerPosition(SingleTimer.getTimerById(right_timer_id).getId, false);
        }
    }

    setAsButton(button) {
        button.listen('mouseover', function () {
            div_timer_stage.style.cursor = "pointer";
        });
        button.listen('mouseout', function () {
            div_timer_stage.style.cursor = "default";
        });
    }

    drawTimer() {

        let this_timer_id = this.timer_id;

        let timer_layer = timer_stage.layer();
        let group_rect = new acgraph.math.Rect(this.group_start_coordinate[0], this.group_start_coordinate[1], timer_rect_size[0] + circle_radius * 2, timer_rect_size[1]);
        timer_layer.clip(group_rect);

        this.timer_layer = timer_layer;

        let timer_rect_base = new acgraph.math.Rect(this.group_start_coordinate[0], this.group_start_coordinate[1], timer_rect_size[0], timer_rect_size[1]);
        let timer_rect = acgraph.vector.primitives.roundedRect(timer_stage, timer_rect_base, timer_rect_corner_radius);
        timer_rect.fill(color_light_green);
        timer_rect.stroke(0);
        timer_rect.zIndex(timer_rect_zIndex);
        timer_layer.addChild(timer_rect);

        if (timer_num == 0) {
            let left_plus_button = this.drawCircle([this.group_start_coordinate[0] - timer_margin / 2, this.group_start_coordinate[1] + timer_rect_size[1] / 2], left_plus_button_layer);

            left_plus_button.listen('click', function () {

                let this_timer = SingleTimer.getMostLeftTimer();

                this_timer.circlePushedAnimation(left_plus_button, function () {
                    timer_stage.suspend();

                    let new_timer = this_timer.createNextTimer(0, this_timer.getId);
                    this_timer.setLeftId(new_timer.getId);

                    SingleTimer.setEveryTimerZIndex();

                    timer_stage.resume();
                });
            });
            this.setAsButton(left_plus_button)
        }

        let cancel_button = this.drawCircle([this.group_start_coordinate[0] + timer_rect_size[0] - dif_circle_center_and_rect_corner, this.group_start_coordinate[1] + dif_circle_center_and_rect_corner], timer_layer);
        cancel_button.listen('click', function (e) {

            let this_timer = SingleTimer.getTimerById(this_timer_id);

            this_timer.circlePushedAnimation(cancel_button, function () {

                timer_stage.suspend();

                this_timer.delete_timer(this_timer_id);

                SingleTimer.setEveryTimerZIndex();

                timer_stage.resume();
            });
        });
        this.setAsButton(cancel_button);

        let right_plus_button = this.drawCircle([this.group_start_coordinate[0] + timer_rect_size[0] + timer_margin / 2, this.group_start_coordinate[1] + timer_rect_size[1] / 2], timer_layer);
        right_plus_button.listen('click', function () {

            let this_timer = SingleTimer.getTimerById(this_timer_id);

            console.log("test!");

            this_timer.circlePushedAnimation(right_plus_button, function () {

                timer_stage.suspend();

                let original_right_timer_id = this_timer.getRightId;

                let new_timer = this_timer.createNextTimer(this_timer_id, this_timer.getRightId);

                this_timer.setRightId(new_timer.getId);
                if (original_right_timer_id != 0) {
                    SingleTimer.getTimerById(original_right_timer_id).setLeftId(new_timer.getId);
                }

                SingleTimer.setEveryTimerZIndex();

                timer_stage.resume();
            });
        });
        this.setAsButton(right_plus_button);

        let right_bottom_button = this.drawCircle([this.group_start_coordinate[0] + timer_rect_size[0] - dif_circle_center_and_rect_corner, this.group_start_coordinate[1] + timer_rect_size[1] - dif_circle_center_and_rect_corner], timer_layer);
        right_bottom_button.listen('click', function (e) {
            let this_timer = SingleTimer.getTimerById(this_timer_id);
            this_timer.circlePushedAnimation(right_bottom_button, function () { });
        });
        this.setAsButton(right_bottom_button);

        this.timer_content.drawContent();
        this.timer_content.getContentLayer.parent(timer_layer);

        timer_num++;

        renewDivTimerStageWidth();

        next_new_timer_id++;
    }
}

timer_stage.suspend();
let timer = SingleTimer.createNewTimer(0, 0);
SingleTimer.setEveryTimerZIndex();
timer_stage.resume();

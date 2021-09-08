class StrokeList {
    constructor() {
        this.stroke_list = [[]];
    }

    add_pt (pt) {
        this.stroke_list.at(-1).push(pt)
    }

    clear () {
        this.stroke_list = [[]];
    }

    erase (erase_pos,radius) {
        let old_stroke_list = this.stroke_list.slice()
        this.stroke_list = [[]]
        for (const stroke of old_stroke_list) {
            for (const pt of stroke) {
                if (Point.distance(erase_pos,pt) < radius) {this.new_stroke();}
                else {this.stroke_list.at(-1).push(pt);}
            }
            this.new_stroke();
        }
        this.new_stroke();
    }

    new_stroke () {
        if (!this.stroke_list.length || this.stroke_list.at(-1).length) {
            this.stroke_list.push([]);
        }
    }

    draw (context) {
        context.lineJoin = "round";
        context.strokeStyle = "magenta";
        context.shadowColor = "magenta";
        context.shadowBlur = 10;
        context.lineWidth = 5;
        for (const stroke of this.stroke_list) {
            if (stroke.length) {
                context.beginPath()
                context.moveTo(stroke[0].x, stroke[0].y);
                for (const pt of stroke.slice(1)) {
                    context.lineTo(pt.x, pt.y);
                }
                context.stroke();
            }
        }
    }

    download () {
        return new Blob([JSON.stringify(this.stroke_list.flat(), null, 2)], {type: "text/plain"});
    }
}
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
        this.filter((index,pt) => (Point.distance(erase_pos,pt) > radius))
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
                context.beginPath();
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

    filter (criterion) {
        /*
        criterion is a function (index,element) => bool which tells wether element at a given index
        should be kept 
        */
        let old_stroke_list = this.stroke_list.slice();
        this.stroke_list = [[]];
        const n = old_stroke_list.length;
        let count = 0
        for (let k = 0; k < n; k++) {
            let n_k = old_stroke_list[k].length;
            for (let i = 0; i < n_k; i++) {
                if (criterion(count,old_stroke_list[k][i])) {this.add_pt(old_stroke_list[k][i]);}
                else {this.new_stroke();}
                count++;
            }
            this.new_stroke();
        }
        this.new_stroke();
    }

    // Use a DL on the sequence to predict wether the user wanted to draw or not
    async predict () {
        let data = this.stroke_list.slice().flat();
        data = data.map(x => {return [x.x,x.y];})
        data = transformData(data);

        const session = await ort.InferenceSession.create('../models/lstm_1_82_57.onnx');
        const tensor = new ort.Tensor('float32',data.flat(),[data.length,6]);
        const feed = {'input': tensor};
        const result = await session.run(feed);

        const output = result.output.data;
        this.filter((index,pt) => (output[index] > 0.5));
    }
}

// Takes an array of 2D coordinates and returns an array of 6D values (vx,vy,v,ax,ay,a)
function transformData(data) {
    let new_data = [[0.,0.,0.,0.,0.,0.]];
    let n = data.length;
    for (let k = 1; k < n; k++) {
        vx = data[k][0] - data[k-1][0];
        vy = data[k][1] - data[k-1][1];
        v = Math.hypot(vx,vy);
        ax = vx - new_data.at(-1)[0];
        ay = vy - new_data.at(-1)[1];
        a = Math.hypot(ax,ay);
        new_data.push([vx,vy,v,ax,ay,a]);
    }
    return new_data;
}
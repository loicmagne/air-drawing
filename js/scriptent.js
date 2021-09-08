const fingers = {
    index1: 8,
    index2: 7,
    index3: 6,
    index4: 5,
    middle1: 12,
    middle2: 11,
    middle3: 10,
    middle4: 9,
    ring1: 16,
    ring2: 15,
    ring3: 14,
    ring4: 13,
    little1: 20,
    little2: 19,
    little3: 18,
    little4: 17,
    thumb1: 4,
    thumb2: 3,
    thumb3: 2,
    thumb4: 1,
    thumb5: 0
}

const finger_state = {
    landmarks: undefined,
    index: false,
    middle: false,
    ring: false,
    little: false
}

function gesture() {
    /*
        0 : nothing
        1 : index up, drawing state
        2 : index and middle up, eraser state
    */
    if (finger_state.index && !finger_state.middle && !finger_state.ring && !finger_state.little) {return 1;}
    if (finger_state.index && finger_state.middle && !finger_state.ring && !finger_state.little) {return 2;}
    return 0;
}

function download_points(stroke_list) {
    const a = document.createElement("a");
    const file = stroke_list.download();
    a.href = URL.createObjectURL(file);
    a.download = "data.txt";
    a.click();
}

class Point {
    constructor(x,y) {
        this.x = x;
        this.y = y;
    }

    static distance(a,b) {
        return Math.hypot(a.x-b.x,a.y-b.y);
    }
}

function init() {
    const download = document.querySelector('#download')
    const video = document.querySelector('video');
    const canvas = document.querySelector('canvas');
    const context = canvas.getContext('2d');

    const width = canvas.width;
    const height = canvas.height;

    const erase_radius = 40.;

    const draw_icon = new Image();
    const erase_icon = new Image();
    draw_icon.src = 'assets/draw.png';
    erase_icon.src = 'assets/erase.png';

    let stroke_list = new StrokeList();
    let previous_pt = null;
    download.onclick = () => download_points(stroke_list);

    async function process() {
        context.save();

        // draw video stream
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.drawImage(video, 0, 0, canvas.width, canvas.height);

        // draw hands
        await hands.send({image: video});

        let gest = gesture();

        // draw icons
        
        if (gest == 1) {
            // the user is drawing
            context.globalAlpha = 1;
            context.drawImage(draw_icon,width-166,height-100);
            // register point
            index_pos = finger_state.landmarks[fingers.index1];
            new_pt = new Point(index_pos.x*width,index_pos.y*height);
            stroke_list.add_pt(new_pt);
            previous_pt = new_pt;
        } else {
            if (previous_pt !== null) {
                stroke_list.new_stroke();
                previous_pt = null;
            }
            context.globalAlpha = 0.2;
            context.drawImage(draw_icon,width-166,height-100);
        }

        if (gest == 2) {
            // the user is erasing
            context.globalAlpha = 1;
            context.drawImage(erase_icon,width-166,height-200);
            // register erase
            idx = finger_state.landmarks[fingers.index1];
            mdl = finger_state.landmarks[fingers.middle1];
            erase_pos = new Point(width*(idx.x+mdl.x)/2.,height*(idx.y+mdl.y)/2.);
            // filter erased points
            stroke_list.erase(erase_pos,erase_radius);
            // draw eraser
            context.lineWidth = 5;
            context.strokeStyle = 'salmon';
            context.beginPath();
            context.arc(erase_pos.x, erase_pos.y, erase_radius, 0, 2*Math.PI);
            context.stroke()
        } else {
            context.globalAlpha = 0.2;
            context.drawImage(erase_icon,width-166,height-200);
        }
        context.restore();

        context.save();
        stroke_list.draw(context);
        context.restore();
    }

    function processHands(results) {
        if (results.multiHandLandmarks) {
            for (const landmarks of results.multiHandLandmarks) {
                drawConnectors(context, landmarks, HAND_CONNECTIONS,{color: '#00FF00', lineWidth: 5});
                drawLandmarks(context, landmarks, {color: '#FF0000', lineWidth: 2});

                // update fingers state
                finger_state.landmarks = landmarks;
                finger_state.index = landmarks[fingers.index1].y < landmarks[fingers.index3].y;
                finger_state.middle = landmarks[fingers.middle1].y < landmarks[fingers.middle3].y;
                finger_state.ring = landmarks[fingers.ring1].y < landmarks[fingers.ring3].y;
                finger_state.little = landmarks[fingers.little1].y < landmarks[fingers.little3].y;
            }
        }
    }

    const hands = new Hands({locateFile: (file) => {
        return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
    }});
    hands.setOptions({
        selfieMode: false,
        maxNumHands: 1,
        minDetectionConfidence: 0.5,
        minTrackingConfidence: 0.5
    });
    hands.onResults(processHands);

    const camera = new Camera(video, {
        onFrame: process,
        width: 1920,
        height: 1080
    });
    camera.start();
}

window.onload = init
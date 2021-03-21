const HANDPOSE_WIDTH = 640;
const HANDPOSE_HEIGHT = 480;

function detectSkin(r,g,b) {
  Y =  0.2990*r + 0.5870*g + 0.1140*b;
  Cb = -0.1687*r - 0.3313*g + 0.5000*b + 128;
  Cr =  0.5000*r - 0.4187*g - 0.0813*b + 128;
  return ((77 <= Cb) && (Cb <= 127) && (133 <= Cr) && (Cr <= 173))?255:0
}

function changeScale(x,y) {
  return [(x/HANDPOSE_WIDTH)*WIDTH, (y/HANDPOSE_HEIGHT)*HEIGHT];
}

const fingerJoints = {
  thumb: [0, 1, 2, 3, 4],
  indexFinger: [0, 5, 6, 7, 8],
  middleFinger: [0, 9, 10, 11, 12],
  ringFinger: [0, 13, 14, 15, 16],
  pinky: [0, 17, 18, 19, 20],
};

function drawFingerTips(predictions, ctx) {
  if (predictions.length > 0) {
    predictions.forEach((prediction) => {
      const landmarks = prediction.landmarks;
      for (let j = 0; j < Object.keys(fingerJoints).length; j++) {
        let finger = Object.keys(fingerJoints)[j];
        finger = fingerJoints[finger][4];
        const [x,y] = changeScale(landmarks[finger][0],landmarks[finger][1]);
        ctx.beginPath();
        ctx.arc(x, y, 5, 0, 3 * Math.PI);

        ctx.fillStyle = "gold";
        ctx.fill();
      }
    });
  }
}

function drawIndex(predictions, ctx) {
  if (predictions.length > 0) {
    predictions.forEach((prediction) => {
      const landmarks = prediction.landmarks;
      const index = fingerJoints['indexFinger'][4];
      const [x,y] = changeScale(landmarks[index][0],landmarks[index][1]);
      ctx.beginPath();
      ctx.arc(x, y, 5, 0, 2 * Math.PI);
      ctx.fillStyle = "gold";
      ctx.fill();
    });
  }
}

function drawFullHand(predictions, ctx) {
  if (predictions.length > 0) {
    predictions.forEach((prediction) => {
      const landmarks = prediction.landmarks;
      for (let j = 0; j < Object.keys(fingerJoints).length; j++) {
        let finger = Object.keys(fingerJoints)[j];
        for (let k = 0; k < fingerJoints[finger].length - 1; k++) {
          const firstJointIndex = fingerJoints[finger][k];
          const secondJointIndex = fingerJoints[finger][k + 1];

          const begin = changeScale(landmarks[firstJointIndex][0],landmarks[firstJointIndex][1]);
          const end = changeScale(landmarks[secondJointIndex][0],landmarks[secondJointIndex][1]);

          ctx.beginPath();
          ctx.moveTo(begin[0],begin[1]);
          ctx.lineTo(end[0],end[1]);
          ctx.strokeStyle = "plum";
          ctx.lineWidth = 4;
          ctx.stroke();
        }
      }

      for (let i = 0; i < landmarks.length; i++) {
        const [x,y] = changeScale(landmarks[i][0],landmarks[i][1]);
        ctx.beginPath();
        ctx.arc(x, y, 6, 0, 3 * Math.PI);

        ctx.fillStyle = "gold";
        ctx.fill();
      }
    });
  }
};

function drawBoundingBox(predictions, ctx) {
  if (predictions.length > 0) {
    predictions.forEach((prediction) => {
      const boundingBox = prediction.boundingBox;
      const [x,y] = changeScale(boundingBox.topLeft[0],boundingBox.topLeft[1]);
      const [bottomX,bottomY] = changeScale(boundingBox.bottomRight[0],boundingBox.bottomRight[1]);
      
      const w = bottomX-x;
      const h = bottomY-y;
      ctx.beginPath();
      ctx.rect(x, y, w, h);
      ctx.strokeStyle = "plum";
      ctx.stroke();
    });
  }
}

async function processImage(video, image, context, model) {
  data = image.data;
  const predictions = await model.estimateHands(video);
  
  displayStyles = [drawFullHand,drawBoundingBox,drawFingerTips,drawIndex]
  displayStyle = document.querySelector('input[name="display"]:checked').value-1;
  displayStyles[displayStyle](predictions, context);
  
  /* Skin filter
  for (let i = 0; i<data.length; i+=4) {
    r = data[i];
    g = data[i+1];
    b = data[i+2];
    data[i] = data[i+1] = data[i+2] = detectSkin(r,g,b);
  }
  image.data = data;
  context.putImageData(image, 0, 0);
  */
}

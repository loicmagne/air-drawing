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

async function drawImage(context, mats, flow) {
  cv.imshow('canvas', mats.new_rgb);
  
  // Draw Circle
  context.beginPath();
  context.arc(flow.new_pts.data32F[0], flow.new_pts.data32F[1],
              5, 0, 3 * Math.PI);
  context.fillStyle = "gold";
  context.fill();
  context.beginPath();
  context.arc(flow.new_pts.data32F[0], flow.new_pts.data32F[1],
              3, 0, 3 * Math.PI);
  context.fillStyle = "blue";
  context.fill();
}

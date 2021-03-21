const WIDTH = 800;
const HEIGHT = 600;
const FRAMERATE = 60;

function initVideo() {
  const video = document.querySelector('video');
  const canvas = document.querySelector('canvas');
  canvas.width  = WIDTH;
  canvas.height = HEIGHT;
  navigator.mediaDevices.getUserMedia({
    video: {
      width: canvas.width,
      height: canvas.height,
      frameRate: FRAMERATE
    }
  })
  .then(function(stream) {
    video.srcObject = stream;
    video.onloadedmetadata = function(e) {
      video.play();
    };
  })
  .catch(function(err) {
    console.log(err.name+": "+err.message);
  });

  video.addEventListener('play', function() {
    let context = canvas.getContext('2d');
    const onnxYolo = new onnx.InferenceSession();
    // load the ONNX model file
    onnxYolo.loadModel("../yolov5/best.onnx").then(() => {
      drawCanvas(video, canvas, context, FRAMERATE, onnxYolo);
    })
  }, false);
}
  
function drawCanvas(video, canvas, context, frameRate, yolo) {
  context.drawImage(video, 0, 0, canvas.width, canvas.height);
  currentImage = context.getImageData(0,0,canvas.width,canvas.height);
  processImage(currentImage,context,yolo);
  // End of loop
  setTimeout(drawCanvas, 1/frameRate, video, canvas, context, frameRate);
}

window.onload = initVideo

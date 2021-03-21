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

  video.addEventListener('play', async () => {
    let context = canvas.getContext('2d');
    const model = await handpose.load(); 
       
    drawCanvas(video, canvas, context, FRAMERATE, model);
  }, false);
}
  
function drawCanvas(video, canvas, context, frameRate, model) {
  context.drawImage(video, 0, 0, canvas.width, canvas.height);
  currentImage = context.getImageData(0,0,canvas.width,canvas.height);
  processImage(video,currentImage,context,model);
  
  // End of loop
  window.requestAnimationFrame(() => drawCanvas(video,canvas,context,frameRate,model));
}

window.onload = initVideo

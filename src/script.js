const WIDTH = 800;
const HEIGHT = 600;
const FRAMERATE = 60;

function init() {
  const video = document.querySelector('video');
  const canvas = document.querySelector('canvas');
  canvas.width  = WIDTH;
  canvas.height = HEIGHT;
  video.width = WIDTH;
  video.height = HEIGHT;
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
    
    // Initialize Optical Flow parameters
    let flow_param = {
      old_pts: cv.matFromArray(2, 1, cv.CV_32FC2, [100,100]),
      new_pts: new cv.Mat(),
      st: new cv.Mat(),
      err: new cv.Mat(),
      winSize: new cv.Size(21, 21),
      maxLevel: 2,
      criteria: new cv.TermCriteria(cv.TERM_CRITERIA_EPS | cv.TERM_CRITERIA_COUNT, 10, 0.03)
    }
    
    // Initialize all Mat needed
    let mats = {
      old_gray: new cv.Mat(),
      new_gray: new cv.Mat(),
      new_rgb: new cv.Mat(HEIGHT, WIDTH, cv.CV_8UC4)
    }
    let cap = new cv.VideoCapture(video);
    
    // Initiate the old gray Mat
    cap.read(mats.new_rgb);
    cv.cvtColor(mats.new_rgb, mats.old_gray, cv.COLOR_RGB2GRAY, 0);
    
    const model = await handpose.load(); 
    
    drawCanvas(video, canvas, context, model, mats, cap, flow_param, 0);
  }, false);
}
  
function drawCanvas(video, canvas, context, model, mats, cap, flow, frame) {
  cap.read(mats.new_rgb);
  cv.cvtColor(mats.new_rgb, mats.new_gray, cv.COLOR_RGB2GRAY, 0);
  
  processImage(video,context,model,mats,flow,frame);
  
  /* KEYPOINTS
  let gray_mat = new cv.Mat();
  cv.cvtColor(mat, gray_mat, cv.COLOR_RGB2GRAY, 0);
  let dest = new cv.Mat();
  let keypoints = new cv.KeyPointVector(); // out param
  let orb = new cv.AKAZE();
  let kp = new cv.KeyPointVector();
  // find the keypoints with ORB
  orb.detect(gray_mat, kp);
  
  cv.drawKeypoints(mat,kp,dest)
  */
  // End of loop
  mats.old_gray = mats.new_gray.clone();
  window.requestAnimationFrame(() => drawCanvas(video,canvas,context, model, mats, cap, flow, (frame+1)%FRAMERATE));
}

window.onload = init

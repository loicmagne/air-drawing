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
      old_pts: new cv.Mat(),
      new_pts: new cv.Mat(),
      st: new cv.Mat(),
      err: new cv.Mat(),
      winSize: new cv.Size(21, 21),
      maxLevel: 2,
      criteria: new cv.TermCriteria(cv.TERM_CRITERIA_EPS | cv.TERM_CRITERIA_COUNT, 10, 0.03)
    }
    
    // Tools needed
    let misc = {
      kernel: cv.Mat.ones(5, 5, cv.CV_8U) // Kernel for Dilation/Erosion
    }

    // Initialize all Mat needed
    let mats = {
      old_gray: new cv.Mat(),
      new_gray: new cv.Mat(),

      old_masked_gray: new cv.Mat(),
      new_masked_gray: new cv.Mat(),

      new_rgb: new cv.Mat(HEIGHT, WIDTH, cv.CV_8UC4),
      new_ycrcb: new cv.Mat(),

      mask_skin: new cv.Mat() // Mask for skin segmentation
    }
    let cap = new cv.VideoCapture(video);
    
    // Initiate the old gray Mat
    cap.read(mats.new_rgb);
    cv.cvtColor(mats.new_rgb, mats.old_gray, cv.COLOR_RGBA2GRAY, 0);
    cv.cvtColor(mats.new_rgb, mats.old_masked_gray, cv.COLOR_RGBA2GRAY, 0);
    
    const model = await handpose.load(); 
    
    drawCanvas(video, canvas, context, cap, model, mats, flow_param, misc, 0);
  }, false);
}
  
function drawCanvas(video, canvas, context, cap, model, mats, flow, misc) {
  cap.read(mats.new_rgb);
  cv.cvtColor(mats.new_rgb, mats.new_gray, cv.COLOR_RGBA2GRAY, 0);
  cv.cvtColor(mats.new_rgb, mats.new_ycrcb, cv.COLOR_RGB2YCrCb, 0);

  processImage(video, context, model, mats, flow, misc);
  drawImage(context, mats, flow);
  
  /* KEYPOINTS
  let orb = new cv.AKAZE();
  let kp = new cv.KeyPointVector();
  orb.detect(gray_mat, kp);
  cv.drawKeypoints(mat,kp,dest)
  */
  // End of loop
  mats.new_gray.copyTo(mats.old_gray);
  mats.new_masked_gray.copyTo(mats.old_masked_gray);

  // mats.old_gray = mats.new_gray.clone();
  // mats.old_masked_gray = mats.new_masked_gray.clone();
  window.requestAnimationFrame(() => drawCanvas(video, canvas, context, cap, model, mats, flow, misc));
}

window.onload = init
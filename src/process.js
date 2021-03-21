function detectSkin(r,g,b) {
  Y =  0.2990*r + 0.5870*g + 0.1140*b;
  Cb = -0.1687*r - 0.3313*g + 0.5000*b + 128;
  Cr =  0.5000*r - 0.4187*g - 0.0813*b + 128;
  return ((77 <= Cb) && (Cb <= 127) && (133 <= Cr) && (Cr <= 173))?255:0
}

function processImage(image, context,yolo) {
  data = image.data;
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

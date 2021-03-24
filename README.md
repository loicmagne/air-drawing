# air-drawing

[loicmagne.github.io/air-drawing](https://loicmagne.github.io/air-drawing/)


# Method

The current version is using the [TensorFlow.js Handpose model](https://github.com/tensorflow/tfjs-models/tree/master/handpose) for hand pose estimation, and fingertips tracking. This method is not very accurate on dynamic poses (it works quite well for static poses), and it runs at only ~15fps, so it is not very relevant for this application.

Ideas for improvement:
* Use a custom trained models such ad [YoloV5](https://github.com/ultralytics/yolov5). I have trained it on the [EgoHands dataset](http://vision.soic.indiana.edu/projects/egohands/) but struggling to integrate it in Javascript (ONNX.js doesn't seem to work, PyTorch -> ONNX -> TensorFlow -> TensorFlow.js should work but is quite cumbersome)
* Probably the best way, use only classic techniques :

  - Skin segmentation combined with convex hull detection, to get a fast and accurate over time fingertip detection, but this would require to know where the hand is in the screen beforehand (because there could be confusion with the face)
  - Optical Flow would solve the problem because it would only detect the moving parts, but there might be complications (how to differentiate the moving hand and a slight movement of the body for instance)

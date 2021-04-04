# air-drawing

[loicmagne.github.io/air-drawing](https://loicmagne.github.io/air-drawing/)


# Method

The current version is using the [TensorFlow.js Handpose model](https://github.com/tensorflow/tfjs-models/tree/master/handpose) with some skin color segmentation to detect the hand, and then optical flow to track the finger. It runs quite smoothly, but there are several problems :
* Optical Flow sometimes fails, and the pointer ends up going to another place of the hand
* It's hard to distinguish the face from the hand, and tracking often fails when the hand goes over the face. Background subtraction didn't seem to work very well as well, and using face detection wouldn't help much when the hand is in front of the face

Ideas for improvement:
* Since I know where the hand is with the TFJS model, I could use some convex shape analysis to get more accurate position of the finger (this would fail when the hand is in front of the head)
* Make hand detection faster with a custom trained models such ad [YoloV5](https://github.com/ultralytics/yolov5) on [EgoHands dataset](http://vision.soic.indiana.edu/projects/egohands/)

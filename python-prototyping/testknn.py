import numpy as np
import cv2

cap = cv2.VideoCapture(0)
cv2.namedWindow('frame')
backSub = cv2.createBackgroundSubtractorKNN()

while True:
  ret, frame = cap.read()
  if not ret:
    print("Can't receive frame (stream end?). Exiting ...")
    break
  
  fgMask = backSub.apply(frame)
  cv2.imshow('frame', fgMask)

  if (cv2.waitKey(1) & 0xFF) == ord(' '):
    old_gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
    break

mask = np.zeros_like(frame)
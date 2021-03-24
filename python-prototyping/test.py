import numpy as np
import cv2

def onMouse(event,x,y,flags,param):
	if event == cv2.EVENT_LBUTTONDOWN:
	  param['x'],param['y'],param['clicked'] = x,y,True


param = {'clicked':False,'x':0,'y':0}
cap = cv2.VideoCapture(0)
cv2.namedWindow('frame')
cv2.setMouseCallback('frame', onMouse, param)


while True:
  ret, frame = cap.read()
  if not ret:
    print("Can't receive frame (stream end?). Exiting ...")
    break
      
  cv2.imshow('frame', frame)
  if (cv2.waitKey(1) & 0xFF) == ord(' ') or param['clicked']:
    old_gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
    break


old_pts = np.array([[param['x'],param['y']]], dtype="float32").reshape(-1,1,2)
mask = np.zeros_like(frame)

while True:
  _, frame2 = cap.read()

  new_gray = cv2.cvtColor(frame2, cv2.COLOR_BGR2GRAY)

  new_pts,status,err = cv2.calcOpticalFlowPyrLK(old_gray, 
                                                new_gray, 
                                                old_pts, 
                                                None, maxLevel=0,
                                                criteria=(cv2.TERM_CRITERIA_EPS | cv2.TERM_CRITERIA_COUNT, 15, 0.08))

  cv2.circle(mask, (new_pts.ravel()[0] ,new_pts.ravel()[1]), 2, (0,255,0), 2)
  combined = cv2.addWeighted(frame2, 0.7, mask, 0.3, 0.1)

  cv2.imshow('frame', cv2.flip(combined, 1))

  old_gray = new_gray.copy()
  old_pts = new_pts.copy()

  if (cv2.waitKey(1) & 0xFF) == ord(' '):
    break

cap.release()
cv2.destroyAllWindows()

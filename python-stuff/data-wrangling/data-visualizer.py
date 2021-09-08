import pandas as pd
import numpy as np
import cv2


df = pd.read_csv('data/unlabeled_csv/thinking.csv',index_col=0)
pts = df.to_numpy().astype(int)

black_img = np.zeros((720,1280), dtype=np.uint8)

n = len(pts)
counter = 0

while True:
    img = np.copy(black_img)
    img[pts[:counter].T[1],pts[:counter].T[0]]=255
    img = cv2.flip(img, 1)

    cv2.imshow('frame', img)
    key = cv2.waitKey(1)
    if key == ord('q'):
        break
    if key == ord('b'):
        counter = max(counter-1,0)
        print(counter-1)
    if key == ord('n'):
        counter = min(counter+1,n)
        print(counter-1)
    if key == ord('z'):
        counter = 0
        print(counter-1)

cv2.destroyAllWindows()
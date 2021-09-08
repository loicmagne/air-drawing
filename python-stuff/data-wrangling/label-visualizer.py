import pandas as pd
import numpy as np
import cv2
from os import listdir


df = pd.read_csv('data/raw_labeled/reveil.csv',index_col=0)
good_points = df.loc[df['label'] == True][['x','y']]
pts = good_points.to_numpy().astype(int)

img = np.zeros((720,1280), dtype=np.uint8)
img[pts.T[1],pts.T[0]]=255
img = cv2.flip(img, 1)

cv2.imshow('frame', img)
key = cv2.waitKey(0)
cv2.destroyAllWindows()
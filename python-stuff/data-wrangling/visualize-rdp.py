import pandas as pd
import numpy as np
import cv2
from rdp import rdp
from os import listdir


df = pd.read_csv('data/raw_labeled/euler_sum.csv',index_col=0)
points = df[['x','y']].to_numpy().astype(int)
points_rdp = rdp(points,1.)
print(len(points))
print(len(points_rdp))

img = np.zeros((720,1280), dtype=np.uint8)
img[points.T[1],points.T[0]]=255
img = cv2.flip(img, 1)

cv2.imshow('frame', img)
key = cv2.waitKey(0)
cv2.destroyAllWindows()

img = np.zeros((720,1280), dtype=np.uint8)
img[points_rdp.T[1],points_rdp.T[0]]=255
img = cv2.flip(img, 1)

cv2.imshow('frame', img)
key = cv2.waitKey(0)
cv2.destroyAllWindows()
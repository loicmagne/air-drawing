import pandas as pd
import numpy as np
import cv2


data_file = 'wheel.csv'

"""
labels must be a list of segments where the time serie class is true 
(i.e. the list of segments where the drawer has "hands down")
"""

labels = [(97,210),(255,394),(426,457),(486,525),(563,594),(630,673)]

df = pd.read_csv('data/unlabeled_csv/'+data_file,index_col=0)
df["label"] = False

for interval in labels:
    start,end = interval
    df.loc[start:end,"label"] = True

df.to_csv('data/raw_labeled/'+data_file)

good_points = df.loc[df['label'] == True][['x','y']]
pts = good_points.to_numpy().astype(int)

img = np.zeros((720,1280), dtype=np.uint8)
img[pts.T[1],pts.T[0]]=255
img = cv2.flip(img, 1)

cv2.imshow('frame', img)
key = cv2.waitKey(0)
cv2.destroyAllWindows()
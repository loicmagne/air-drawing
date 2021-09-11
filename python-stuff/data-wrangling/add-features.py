import pandas as pd
import numpy as np
from os import listdir
from tqdm import tqdm

raw_folder = "data/raw_labeled/"
output_folder = "data/processed_labeled/"

# We intentionnaly drop some points to have a smoother drawing
# interval define the step between each kept points

for interval in [1,2,3,4]:
    for f in tqdm(listdir(raw_folder)):
        df_raw = pd.read_csv(raw_folder+f,index_col=0)
        df = df_raw.iloc[::interval].copy().reset_index(drop=True)

        df["vx"] = 0.
        df["vy"] = 0.
        df["v"] = 0.
        df["ax"] = 0.
        df["ay"] = 0.
        df["a"] = 0.
        df["dist_left"] = 0.
        df["dist_right"] = 0.
        df["dist"] = 0.
        n = df.shape[0]
        
        # add speed
        for k in range(1,n):
            vx = df.loc[k,'x'] - df.loc[k-1,'x']
            vy = df.loc[k,'y'] - df.loc[k-1,'y']
            v = np.sqrt(vx*vx + vy*vy)
            df.loc[k,'vx'] = vx
            df.loc[k,'vy'] = vy
            df.loc[k,'v'] = v

        # add acceleration
        for k in range(1,n):
            ax = df.loc[k,'vx'] - df.loc[k-1,'vx']
            ay = df.loc[k,'vy'] - df.loc[k-1,'vy']
            a = np.sqrt(ax*ax + ay*ay)
            df.loc[k,'ax'] = ax
            df.loc[k,'ay'] = ay
            df.loc[k,'a'] = a

        # distance to swap starting from the right side
        dist_right = 0.
        for k in range(1,n):
            dist_right += 1.
            current = n-k-1
            previous = n-k
            if df.loc[current,'label'] != df.loc[previous,'label']:
                dist_right = 0.
            df.loc[current,'dist_right'] = dist_right

        # distance to swap starting from the left side
        dist_left = 0.
        for k in range(1,n):
            dist_left += 1.
            current = k
            previous = k-1
            if df.loc[current,'label'] != df.loc[previous,'label']:
                dist_left = 0.
            df.loc[current,'dist_left'] = dist_left
        
        # min distance to a swap
        for k in range(1,n):
            df.loc[k,'dist'] = min(df.loc[k,'dist_left'],df.loc[k,'dist_right'])

        df.to_csv(f'{output_folder}{interval}_{f}')
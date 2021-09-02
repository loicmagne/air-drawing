import pandas as pd
import numpy as np
from os import listdir

raw_folder = "data/raw_labeled/"
output_folder = "data/processed_labeled/"

# We intentionnaly drop some points to have a smoother drawing
# interval define the step between each kept points
interval = 3

for f in listdir(raw_folder):
    df_raw = pd.read_csv(raw_folder+f,index_col=0)
    df = df_raw.iloc[::interval].copy().reset_index(drop=True)

    df["vx"] = 0.
    df["vy"] = 0.
    df["v"] = 0.
    df["ax"] = 0.
    df["ay"] = 0.
    df["a"] = 0.
    df["ttf"] = 0.
    n = df.shape[0]
    
    # add speed
    for k in range(1,n):
        vx = df.loc[k-1,'x'] - df.loc[k,'x']
        vy = df.loc[k-1,'y'] - df.loc[k,'y']
        v = np.sqrt(vx*vx + vy*vy)
        df.loc[k,'vx'] = vx
        df.loc[k,'vy'] = vy
        df.loc[k,'v'] = v

    # add acceleration
    for k in range(1,n):
        ax = df.loc[k-1,'vx'] - df.loc[k,'vx']
        ay = df.loc[k-1,'vy'] - df.loc[k,'vy']
        a = np.sqrt(ax*ax + ay*ay)
        df.loc[k,'ax'] = ax
        df.loc[k,'ay'] = ay
        df.loc[k,'a'] = a

    # add time to failure
    ttf = 0.
    for k in range(1,n):
        ttf += 1.
        current = n-k-1
        previous = n-k
        if df.loc[current,'label'] != df.loc[previous,'label']:
            ttf = 0.
        df.loc[current,'ttf'] = ttf
    
    df.to_csv(output_folder+f)
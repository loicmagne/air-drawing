import json
import pandas as pd
from os import listdir

txt_folder = "data/unlabeled_txt/"
csv_folder = "data/unlabeled_csv/"

for file in listdir(txt_folder):
    with open(txt_folder+file) as f:
        data = json.load(f)
        x = []
        y = []
        for pt in data:
            x.append(pt['x'])
            y.append(pt['y'])
        df = pd.DataFrame(data={'x': x,'y': y})
        df.to_csv(csv_folder+file[:-3]+'csv')
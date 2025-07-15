# For profit prediction involving regular products

import sys
import json
import joblib
import pandas as pd

# Load regular model
pipeline = joblib.load('profit_api/profit_margin_pipeline.pkl')

# Parse input
input_data = json.loads(sys.argv[1])
df_input = pd.DataFrame([input_data])

# Predict
prediction = pipeline.predict(df_input)[0]
print(prediction)
from fastapi import FastAPI, HTTPException
import xarray as xr
import numpy as np

app = FastAPI()

@app.get("/api/get_data")
def getTheHighestWave(longitude: str, latitude: str):
  try:
    lngNum = float(longitude)
    latNum = float(latitude)

    if lngNum < -180 or lngNum >= 180 or latNum < -60 or latNum > 70:
      raise Exception

  except:
    raise HTTPException(status_code=400, detail="Invalid coordinates requested")
  
  waves_data = xr.load_dataset("api/waves_2019-01-01.nc")

  waves_on_point = waves_data.sel(longitude=float(longitude), latitude=float(latitude), method="nearest", tolerance=0.35)
  max_wave = np.nanmax(waves_on_point["hmax"].values)

  if np.isnan(max_wave):
    raise HTTPException(status_code=400, detail="No data found")

  return {"max_wave": float(max_wave)}

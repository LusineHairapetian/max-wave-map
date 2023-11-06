from fastapi import FastAPI
import xarray as xr
import numpy as np

app = FastAPI()

@app.get("/api/get_data")
def getTheHighestWave(longitude: str, latitude: str):
  waves_data = xr.load_dataset("api/waves_2019-01-01.nc")
  waves_on_point = waves_data.sel(longitude=float(longitude), latitude=float(latitude), method="nearest", tolerance=0.35)
  max_wave = np.nanmax(waves_on_point["hmax"].values)
  max_wave_valid = 0 if np.isnan(max_wave) else float(max_wave)
  return {max_wave_valid}

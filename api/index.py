from fastapi import FastAPI
import xarray as xr
import numpy as np

app = FastAPI()

@app.get("/api/get_data")
def getTheHighestWave(longitude: str, latitude: str):
  wavesData = xr.open_dataset("api/waves_2019-01-01.nc")
  wavesOnPoint = wavesData.interp(longitude=float(longitude), latitude=float(latitude))
  maxWave = np.nanmax(wavesOnPoint["hmax"].values)
  maxWaveValid = 0 if np.isnan(maxWave) else maxWave
  return {maxWaveValid}

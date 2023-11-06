'use client'

import { useState } from 'react'
import { Inter } from 'next/font/google'
import Map, { MarkersStateProperties } from '../components/Map'

const inter = Inter({ subsets: ['latin'] })

type ClickDataType = MarkersStateProperties & {
  maxWave: number
}

export default function Home() {
  const [clickData, setClickData] = useState<ClickDataType[]>([]);

  async function getClickCoordinatesHandler({longitude, latitude}: MarkersStateProperties) {
    const coordinatesStringified = {
      longitude: longitude.toString(), 
      latitude: latitude.toString()
    };
    const response = await fetch(`/api/get_data?${new URLSearchParams(coordinatesStringified)}`);
    const maxWave = await response.json();
    setClickData([...clickData, {longitude, latitude, maxWave}])
  }

  return (
    <main
      className={`flex justify-between p-20 h-screen ${inter.className}`}
    >
      <Map getClickCoordinates={getClickCoordinatesHandler} />
      <div className="p-5 border bg-white text-sm flex flex-col overflow-hidden">
        <div className="p-5 border bg-amber-100 leading-4 text-sm">
          <h6 className="font-bold">About the map</h6><br/>
          <p>🔴 The red dots on the map show data points</p><br/>
          <p className="text-xs">The closer you click to them the more accurate result data will be</p><br/>
          <p>➕ The plus sign on the map shows all marked points</p>
        </div>
        <div className="p-5 border leading-4 text-sm overflow-y-auto">
          <h6 className="font-bold">Listing the waves</h6><br/>
          {clickData.length && clickData.map(({longitude, latitude, maxWave}, i) => <p key={i} className="text-xs bg-slate-100 mb-1">
            {i+1}. On [{longitude},{latitude}] highest wave was around {maxWave} meters
          </p>)}
        </div>
      </div>
    </main>
  )
}

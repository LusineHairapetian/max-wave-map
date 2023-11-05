import "mapbox-gl/dist/mapbox-gl.css"
import { useMemo, useState } from 'react'
import Map, { Source, Layer, Marker } from 'react-map-gl'
import type { CircleLayer } from 'react-map-gl'
import type { FeatureCollection } from 'geojson'

export interface MarkersStateProperties {
    longitude: number;
    latitude: number;
}

export type InteractiveMapProps = {
    getClickCoordinates: (coordinates: MarkersStateProperties) => void
}

export default function InteractiveMap(props: InteractiveMapProps) {
    const geojson = useMemo((): any => {
        const geoJson = {
            type: 'FeatureCollection',
            features: [{
                type: 'Feature',
                properties: {},
                geometry: {
                    type: 'Point', 
                    coordinates: [180, 70]
                }
            }]
        }
        for (let lng = -180; lng < 180; lng += 0.5) {
            for (let lat = -60; lat <70; lat += 0.5) {
                geoJson.features.push({
                    type: 'Feature',
                    properties: {},
                    geometry: {
                        type: 'Point', 
                        coordinates: [lng, lat]
                    }
                })
            }
        }
        return geoJson;
    }, [])

    const [markers, setMarkers] = useState<MarkersStateProperties[]>([])

    function handleClick({ lngLat }: mapboxgl.MapLayerMouseEvent) {
        const {lng, lat} = lngLat
        setMarkers([...markers, { longitude: lng, latitude: lat }])
        props.getClickCoordinates({ longitude: lng, latitude: lat })
    }
    
    const layerStyle: CircleLayer = {
        id: 'point',
        type: 'circle',
        paint: {
          'circle-radius': 1,
          'circle-color': 'red'
        }
    }

    return (
        <Map
            mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}
            initialViewState={{
                longitude: 11,
                latitude: 60,
                zoom: 10,
            }}
            onClick={handleClick}
            minZoom={3}
            renderWorldCopies={false}
            style={{ width: "800px", height: "100%" }}
            mapStyle="mapbox://styles/mapbox/streets-v9"
        >
            <Source id="my-data" type="geojson" data={geojson}>
                <Layer {...layerStyle} />
            </Source>
            {markers.length && markers.map((marker, i) => (
                <Marker {...marker} key={i}>{i+1}+</Marker>
            ))}
        </Map>
    )
}
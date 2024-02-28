import React, { useEffect, useState, useRef } from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
  ZoomableGroup,
  Line,
  Marker,
} from "react-simple-maps";
import usamap from "../assets/geomap-usa.json";
import worldmap from "../assets/geomap-world.json";
import { makeMapPoints } from "../helpers/makeMapPoint";
import DiscTrackerAPI from "../api";

export default function MapChart({ numCountries, discId }) {
  const [checkins, setCheckins] = useState(null);

  useEffect(() => {
    async function getCheckins() {
      const res = await DiscTrackerAPI.getAllCheckinsForDisc(discId);
      setCheckins(res);
    }
    try {
      getCheckins();
    } catch (err) {
      console.err(err);
    }
  }, []);
  const coordinates = checkins ? makeMapPoints(checkins) : null;
  const map = numCountries > 1 ? worldmap : usamap;

  return (
    <ComposableMap
      projection={numCountries > 1 ? "geoMercator" : "geoAlbersUsa"}
      projectionConfig={{
        scale: numCountries > 1 ? 150 : 1000,
      }}
    >
      <ZoomableGroup zoom={1}>
        <Geographies geography={map}>
          {({ geographies }) =>
            geographies.map(geo => (
              <Geography
                key={geo.rsmKey}
                geography={geo}
                stroke="#EEE"
                style={{
                  default: {
                    fill: "#2B2B2B",
                    outline: "none",
                  },
                  pressed: {
                    fill: "#2B2B2B",
                    outline: "none",
                  },
                  hover: {
                    fill: "#2B2B2B",
                    outline: "none",
                  },
                }}
              />
            ))
          }
        </Geographies>
        {coordinates && (
          <Line coordinates={coordinates} stroke="#006D75" strokeWidth={1} />
        )}
        {coordinates &&
          coordinates.map(c => (
            <Marker key={crypto.randomUUID()} coordinates={c} fill="#006D75">
              <circle r={1} fill="#006D75" />
            </Marker>
          ))}
      </ZoomableGroup>
    </ComposableMap>
  );
}

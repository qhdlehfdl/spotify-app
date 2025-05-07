import React from "react";
import "../styles/ArtistPage.css";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

//툴팁 이미지 효과
function CustomTooltip({ active, payload, label }) {
    if (active && payload && payload.length) {
        const artist = payload[0].payload;

        return (
        <div className="custom-tooltip">
            <strong>{artist.name}</strong>
            <br />
            <img className="custom-tooltip-img"
                src={artist.images?.[0]?.url}
                alt={artist.name}
            />
            <div className="custom-tooltip-popularity">Popularity: {artist.popularity}</div>
        </div>
        );
    }
    
    return null;
}

function PopularityBarchart({ artists }) {
    const chartData = artists.map((artist) => ({
        name: artist.name,
        popularity: artist.popularity,
        images:artist.images
    }));

    return (
      <div style={{ width: "100%", height: 400 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 20, right: 30, left: 20, bottom: 70 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" angle={-30} textAnchor="end" interval={0} />
            <YAxis domain={[0, 100]} />
            <Tooltip
              content={<CustomTooltip />}
              cursor={{ fill: "transparent" }}
            />
            <Bar
              dataKey="popularity"
              fill="#FFFFFF"
              activeBar={{ fill: "#0D6EFD" }}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    );
}
export default PopularityBarchart;

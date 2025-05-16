import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

function ArtistBarChart({ artists, onArtistClick }) {
  if (!artists || artists.length === 0) {
    return <p>아티스트 데이터가 없습니다.</p>;
  }

  artists = artists.slice(0, 200);

  // 바 크기와 마진을 고려한 동적 높이 계산
  const barSize = 40;
  const chartHeight = artists.length * barSize + 60; // 상하 마진 포함

  return (
    <div
      style={{
        height: "600px", // Fixed height for the chart container
        overflowY: "auto", // Enable vertical scrolling
        position: "relative",
      }}
    >
      <ResponsiveContainer width="100%" height={chartHeight}>
        <BarChart
          layout="vertical"
          data={artists}
          margin={{ top: 20, right: 30, left: 0, bottom: 20 }}
        >
          <XAxis
            type="number"
            domain={[0, (dataMax) => Math.ceil(dataMax * 1.05)]}
          />
          <YAxis dataKey="artistName" type="category" width={120} />
          <Tooltip
            formatter={(value) => value.toLocaleString()}
            cursor={{ fill: "transparent" }}
            itemStyle={{ color: "#0D6EFD" }}
          />
          <Bar
            dataKey="streams"
            fill="#FFFF"
            activeBar={{ fill: "#0D6EFD" }}
            onClick={(data) => onArtistClick(data)}
          >
            {artists.map((entry, index) => (
              <Cell key={`cell-${index}`} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default ArtistBarChart;
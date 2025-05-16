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

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length > 0) {
    const song = payload[0].payload;

    return (
      <div
        className="custom-tooltip"
        style={{
          background: "#fff",
          border: "1px solid #ccc",
          padding: "10px",
          borderRadius: "8px",
          display: "flex",
          alignItems: "center",
        }}
      >
        <img
          src={song.imageURL}
          alt={song.songName}
          style={{
            width: 50,
            height: 50,
            marginRight: 10,
            objectFit: "cover",
            borderRadius: "4px",
          }}
        />
        <div>
          <p style={{ margin: 0, fontWeight: "bold", color: "#000" }}>
            {song.songName}
          </p>
          <p style={{ margin: 0, color: "#0D6EFD" }}>
            streams : {song.streaming.toLocaleString()}
          </p>
        </div>
      </div>
    );
  }

  return null;
};

const SongBarChart = ({ songs, onSongClick }) => {
  // 바 크기와 마진을 고려한 동적 높이 계산
  const barSize = 40;
  const chartHeight = songs.length * barSize + 60; // 상하 마진 포함

  return (
    <div className="song-bar-chart">
      <ResponsiveContainer width="100%" height={chartHeight}>
        <BarChart
          data={songs}
          layout="vertical"
          margin={{ top: 10, right: 20, left: 0, bottom: 10 }}
        >
          <XAxis type="number" domain={[0, (dataMax) => Math.ceil(dataMax * 1.05)]} />
          <YAxis dataKey="songName" type="category" width={150} />
          <Tooltip
            cursor={{ fill: "transparent" }}
            content={<CustomTooltip />}
          />
          <Bar dataKey="streaming" activeBar={{ fill: "#0D6EFD" }}
            onClick={(data) => {
              if (onSongClick) {
                onSongClick(data);
              }
            }}>
            {songs.map((entry, index) => (
              <Cell key={index} fill="#FFFF" />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SongBarChart;

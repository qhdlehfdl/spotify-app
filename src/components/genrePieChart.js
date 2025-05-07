import React from "react";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import "../styles/ArtistPage.css";

// 색상 배열 (필요시 확장)
const COLORS = [
  "#0A58CA", // 톤다운된 파란색 (기존 #0D6EFD보다 어두움)
  "#57B76C", // 톤다운된 연두 (기존 #6DD47E보다 차분함)
  "#14A49C", // 톤다운된 청록
  "#CC8133", // 차분한 오렌지
  "#D6A507", // 따뜻한 머스타드
  "#A970E5", // 톤다운된 보라
  "#D04F76", // 어두운 핑크레드
];

//툴팁 이미지 효과
function CustomTooltip({ active, payload }) {
    if (active && payload && payload.length > 0) {
      const genre = payload[0].payload;
      return (
        <div className="custom-tooltip">
          <p className="label">
            <strong>{genre.name}</strong>
          </p>
          <p className="desc">
            {genre.percent}%
          </p>
        </div>
      );
    }
    return null;
}

const GenrePieChart = ({ genres, countryName }) => {
  // 장르 데이터를 [{ name, value }, ...] 형식으로 변환
  const total = Object.values(genres).reduce((sum, count) => sum + count, 0);

  const data = Object.entries(genres).map(([genre, count]) => ({
    name: genre,
    value: count,
    percent: ((count / total) * 100).toFixed(1), // 퍼센트 계산
  }));

  return (
    <div className="card top-section" style={{ alignItems: "center" }}>
      <h2 className="section-title">{countryName} - Genres</h2>
      <PieChart width={600} height={400}>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          label={({ name, percent }) => `${name}: ${percent}%`}
          outerRadius={130}
          fill="#8884d8"
          dataKey="value"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip
          // formatter={(value, name, props) => [
          //   `${value} (${props.payload.percent}%)`,
          //   name,
          // ]}
          content={<CustomTooltip />}
        />
        <Legend />
      </PieChart>
    </div>
  );
};

export default GenrePieChart;

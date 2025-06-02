import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

function StreamingLineChart({ data }) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart
        data={data}
        margin={{ top: 10, right: 30, bottom: 10, left: 0 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" tick={{ fill: "white" }} />
        <YAxis
          tickFormatter={(value) => {
            if (value >= 1000000) return (value / 1000000).toFixed(1) + "M";
            if (value >= 1000) return (value / 1000).toFixed(1) + "K";
            return value;
          }}
          tick={{ fill: "white" }}
        />
        <Tooltip
          formatter={(value) => value.toLocaleString()}
          labelStyle={{ color: "#0D6EFD" }}
          itemStyle={{ color: "#0D6EFD" }}
        />
        <Line
          type="monotone"
          dataKey="streaming"
          stroke="#FFFF"
          activeDot={{ r: 6, fill: "#0D6EFD" }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

export default StreamingLineChart;

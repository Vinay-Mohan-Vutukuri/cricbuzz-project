import React from "react";
import {
  ComposedChart,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  Area,
  Bar,
  Line,
} from "recharts";

const ChartComponent = (props) => {
  const data = props.bat_graph;

  const getColor = (value) => {
    if (value < 20) {
      return "red";
    } else if (value < 30) {
      return "lightgreen";
    } else if (value < 50) {
      return "blue";
    } else {
      return "green";
    }
  };

  const CustomBar = (props) => {
    const { x, y, width, height, value, data } = props;
    const notOut = data[props.index].not_out == 0;

    return (
      <g>
        <rect
          x={x}
          y={y}
          width={width}
          height={height}
          fill={getColor(value)}
        />
        {notOut && (
          <text
            x={x + width / 2}
            y={y - 10}
            fill="black"
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize={12}
          >
            *
          </text>
        )}
      </g>
    );
  };
  const colorRanges = [
    { range: "< 20", color: "red" },
    { range: "20 - 29", color: "lightgreen" },
    { range: "30 - 49", color: "blue" },
    { range: "> 50", color: "green" },
  ];

  const legendPayload = colorRanges.map((range, index) => {
    return {
      id: `color-${index}`,
      value: range.range,
      type: "rect",
      color: range.color,
    };
  });

  return (
    <div>
      <ComposedChart width={1000} height={450} data={data}>
        <XAxis dataKey="match_id" />
        <YAxis />
        <Tooltip />
        <Legend
          payload={legendPayload}
          formatter={(value) => <span style={{ color: value }}>{value}</span>}
        />
        <CartesianGrid stroke="#f5f5f5" />
        <Bar
          dataKey="runs_scored"
          barSize={20}
          shape={<CustomBar data={data} />}
        />
        <Line type="linear" dataKey="average" stroke="#ff7300" />
      </ComposedChart>
    </div>
  );
};

export default ChartComponent;

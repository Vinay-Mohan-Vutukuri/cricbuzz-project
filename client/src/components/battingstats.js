import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Line,
  LineChart,
} from "recharts";

const data = [
  {
    match_id: 501203,
    runs_scored: "27",
    balls_faced: "16",
    fours_in_match: "1",
    sixes_in_match: "2",
    not_out: "1",
  },
  // ... (rest of the data)
];

const CustomBar = (props) => {
  let color;
  const runs = parseInt(props.payload.runs_scored);

  if (runs < 20) {
    color = "#ff0000"; // red
  } else if (runs >= 20 && runs < 30) {
    color = "#ffff00"; // yellow
  } else if (runs >= 30 && runs < 50) {
    color = "#00ff00"; // green
  } else {
    color = "#0000ff"; // blue
  }

  return <Bar {...props} fill={color} />;
};

const Graph = () => {
  // Calculate the running average
  const runningAverageData = [];
  let totalRuns = 0;
  let totalOuts = 0;

  data.forEach((entry, index) => {
    const runs = parseInt(entry.runs_scored);
    const notOut = entry.not_out === "1";
    totalRuns += runs;
    totalOuts += notOut ? 0 : 1;
    const average = totalOuts === 0 ? 0 : totalRuns / totalOuts;
    runningAverageData.push({ match_id: entry.match_id, average });
  });

  return (
    <div>
      <LineChart width={600} height={300} data={runningAverageData}>
        <Line type="monotone" dataKey="average" stroke="#000000" />
        <BarChart width={600} height={300} data={data} barGap={-10}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="match_id" />
          <YAxis yAxisId="left" />
          <YAxis yAxisId="right" orientation="right" />
          <Tooltip />
          <Bar
            dataKey="runs_scored"
            fill="#8884d8"
            yAxisId="left"
            shape={<CustomBar />}
          />
        </BarChart>
      </LineChart>
    </div>
  );
};

export default Graph;

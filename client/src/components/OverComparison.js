import React from "react";
import { Line } from "react-chartjs-2";

const OverComparison = ({ over1, over2, match_info }) => {
  const generateChartData = () => {
    const teamARuns = over1.reduce((acc, over) => {
      const runs = over.runs_in_over ? parseInt(over.runs_in_over, 10) : 0;
      acc.push((acc.length > 0 ? acc[acc.length - 1] : 0) + runs);
      return acc;
    }, []);

    const teamBRuns = over2.reduce((acc, over) => {
      const runs = over.runs_in_over ? parseInt(over.runs_in_over, 10) : 0;
      acc.push((acc.length > 0 ? acc[acc.length - 1] : 0) + runs);
      return acc;
    }, []);

    const wicketsInOver1 = over1
      .filter((over) => over.wickets_in_over > 0)
      .map((over) => over.over_id);

    const wicketsInOver2 = over2
      .filter((over) => over.wickets_in_over > 0)
      .map((over) => over.over_id);

    const wicketsOver1Circles = over1.map((over) =>
      wicketsInOver1.includes(over.over_id) ? 3 : 0
    );

    const wicketsOver2Circles = over2.map((over) =>
      wicketsInOver2.includes(over.over_id) ? 3 : 0
    );
    return {
      labels: over1.map((over) => over.over_id),
      datasets: [
        {
          label: match_info.team1_name,
          data: teamARuns,
          fill: false,
          borderColor: "rgba(75,192,192,1)",
          pointRadius: wicketsOver1Circles,
          tension: 0.1,
        },
        {
          label: match_info.team2_name,
          data: teamBRuns,
          fill: false,
          borderColor: "rgba(192,75,192,1)",
          pointRadius: wicketsOver2Circles,
          tension: 0.1,
        },
      ],
    };
  };

  const chartData = generateChartData();

  return (
    <div>
      <h2>Over Comparison</h2>
      <Line
        data={chartData}
        options={{
          responsive: true,
          title: {
            display: true,
            text: "Score Comparison",
          },
          scales: {
            x: {
              display: true,
              title: {
                display: true,
                text: "Overs",
              },
            },
            y: {
              display: true,
              title: {
                display: true,
                text: "Runs",
              },
            },
          },
        }}
      />
    </div>
  );
};

export default OverComparison;

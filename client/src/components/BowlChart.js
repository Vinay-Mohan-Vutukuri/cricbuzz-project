import React, { useEffect, useRef } from "react";
import ApexCharts from "apexcharts";

const ChartComponent = (props) => {
  const chartRef = useRef(null);
  const bowl_graph = props.bowl_graph;

  useEffect(() => {
    if (bowl_graph.length > 0) {
      const options = {
        series: [
          {
            name: "Runs Given",
            type: "column",
            data: bowl_graph.map((m) => m.runs_scored),
          },
          {
            name: "Wickets Taken",
            type: "line",
            data: bowl_graph.map((m) => m.wickets),
          },
        ],
        chart: {
          height: 350,
          type: "line",
        },
        stroke: {
          width: [0, 4],
        },
        title: {
          text: "Bowling Stats",
        },
        dataLabels: {
          enabled: true,
          enabledOnSeries: [1],
        },
        labels: Array.from(bowl_graph, (_, index) => index + 1),
        xaxis: {
          type: "datetime",
        },
        yaxis: [
          {
            title: {
              text: "Runs Given in a match",
            },
          },
          {
            opposite: true,
            title: {
              text: "Wickets taken in a match",
            },
          },
        ],
      };

      const chart = new ApexCharts(chartRef.current, options);
      chart.render();

      return () => {
        chart.destroy();
      };
    }
  }, [bowl_graph]);

  return <div id="chart" ref={chartRef} />;
};

export default ChartComponent;

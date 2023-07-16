import React from "react";
import { Fragment, useEffect, useState } from "react";
import PieChart from "./PieChart";
import {
  BrowserRouter as Router,
  Link,
} from "react-router-dom/cjs/react-router-dom.min";
import { Line } from "react-chartjs-2";

const VenueId = (props) => {
  const venue_id = props.venue_id;

  const [venue_info, setVenueInfo] = useState([]);
  const [basic_info, setBasicInfo] = useState({});
  const [average_first_innings, setAvg] = useState([]);

  const chartData = {
    labels: ["Team batting 1st won", "Team batting 2nd won", "Draw"], //Object.keys(pie1_data)
    datasets: [
      {
        label: "percentage won ",
        data: [],
        backgroundColor: ["blue", "red", "yellow"],
        borderColor: "black",
        borderWidth: 2,
      },
    ],
  };

  //console.log(average_first_innings);
  const LineData = {
    labels: average_first_innings.map((x) => x.year),
    datasets: [
      {
        label: basic_info.venue_name,
        data: average_first_innings.map((x) => x.average),
        fill: false,
        borderColor: "rgba(75,192,192,1)",
        tension: 0.1,
      },
    ],
  };
  let x = [venue_info.batting_won, venue_info.bowling_won, venue_info.drawn];
  chartData.datasets[0].data = x;

  const getVenueInfo = async () => {
    try {
      const result = await fetch(`http://localhost:8000/venues/${venue_id}`);
      const res = await result.json();
      setVenueInfo(res);
      setBasicInfo(res.basic_info[0]);
      setAvg(res.average_first_season);
      console.log(res);
    } catch (err) {
      console.error(err.message);
    }
  };
  //console.log(basic_info.venue_name);
  //console.log(venue_info);
  useEffect(() => {
    getVenueInfo();
    //console.log(venue_info);
  }, []);
  return (
    <Fragment>
      <h1 className="text-center my-5">VENUE STATISTICS</h1>
      {/* <Router> */}
      <Link to="/venues"> back</Link>
      {/* </Router> */}
      <h2 className="text-center my-5">{basic_info.venue_name}</h2>
      <br></br>
      <h3>(A)Basic Information:</h3>
      <b>Venue Name: </b> {basic_info.venue_name} <br></br>
      <b>Address: </b> {basic_info.city_name}, {basic_info.country_name}{" "}
      <br></br>
      <b>Capacity: </b> {basic_info.capacity} <br></br>
      <b>Total Matches Played: </b> {basic_info.matches_played} <br></br>
      <b>Highest total recorded: </b> {venue_info.highest_total} <br></br>
      <b>Lowest Total recorder: </b> {venue_info.lowest_total} <br></br>
      <b>Highest Score chased: </b> {venue_info.highest_total_chased} <br></br>
      <br></br>
      <h3>(B) Outline of Matches</h3>
      <div style={{ width: 500 }}>
        <PieChart chartData={chartData}></PieChart>
      </div>
      <br></br> <br></br>
      <h3>(C) Average First Innings Score: </h3>
      {/* <div style={{ width: 1000 }}> */}
      <Line
        data={LineData}
        options={{
          title: {
            display: true,
            text: "Average First Innings Score",
          },
          scales: {
            x: {
              display: true,
              title: {
                display: true,
                text: "Year",
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
      ></Line>
      {/* </div> */}
    </Fragment>
  );
};

export default VenueId;

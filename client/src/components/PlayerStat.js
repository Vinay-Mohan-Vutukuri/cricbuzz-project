import React, { Fragment, useState, useEffect } from "react";
import Graph from "./battingstats";
import { Bar } from "react-chartjs-2";
import ChartComponent from "./BowlChart";
import BatChart from "./BatChart";
const PlayerStat = (props) => {
  const player_id = props.player_id;
  const [info, setInfo] = useState([]);
  const [basic_info, setBasicInfo] = useState({});
  const [bat_graph, setBatGraph] = useState([]);
  const [bowl_graph, setBallGraph] = useState([]);

  const calculateBackgroundColor = (dataValue) => {
    if (dataValue < 20) {
      return "red";
    } else if (dataValue >= 20 && dataValue < 30) {
      return "yellow";
    } else if (dataValue >= 30 && dataValue < 50) {
      return "green";
    } else {
      return "blue";
    }
  };

  const Bat_Data = {
    labels: bat_graph.map((m) => m.match_id), //Object.keys(pie1_data)
    datasets: [
      {
        label: "Runs Scored in a match",
        data: [],
        backgroundColor: bat_graph.map((m) =>
          calculateBackgroundColor(m.runs_scored)
        ),
        borderColor: "black",
        borderWidth: 2,
      },
    ],
  };

  Bat_Data.datasets[0].data = bat_graph.map((m) => m.runs_scored);
  const getPlayerInfo = async () => {
    try {
      const res = await fetch(`http://localhost:8000/players/${player_id}`);
      const ress = await res.json();
      setBasicInfo(ress.basic_info[0]);
      setInfo(ress);
      setBatGraph(ress.graph_data);
      setBallGraph(ress.bowl_graph);
    } catch (err) {
      console.log(err.message);
    }
  };

  useEffect(() => {
    getPlayerInfo();
  }, []);
  return (
    <Fragment>
      <h1 className="text-center my-5">PlayerStatistics</h1>
      <h2 className="text-center my-5">{basic_info.player_name}</h2>
      <h3>(A) Basic Information: </h3>
      <b>Player Name: </b> {basic_info.player_name} <br></br>
      <b>Country Name: </b> {basic_info.country_name} <br></br>
      <b>Batting Style: </b> {basic_info.batting_hand} <br></br>
      <b> Bowling Style: </b> {basic_info.bowling_skill} <br></br>
      <br></br>
      <h3>(B) Batting Statistics: </h3>
      <table className="table mt-5">
        <thead>
          <tr>
            <th>Matches</th>
            <th>Runs</th>
            <th>Fours</th>
            <th>Sixes</th>
            <th>Fifty</th>
            <th>Highest Score</th>
            <th>Strike Rate</th>
            <th>Average</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{info.total_matches}</td>
            <td>{info.total_runs}</td>
            <td>{info.fours}</td>
            <td>{info.sixes}</td>
            <td>{info.fifty}</td>
            <td>{info.HS}</td>
            <td>{info.strikerate}</td>
            <td>{info.average}</td>
          </tr>
        </tbody>
      </table>{" "}
      <br></br>
      <BatChart bat_graph={bat_graph} />
      <br></br>
      <h3>(C) BOWLING STATISTICS</h3>
      <table className="table mt-5">
        <thead>
          <tr>
            <th>Matches</th>
            <th>Runs</th>
            <th>Wickets</th>
            <th>Overs</th>
            <th>Balls</th>
            <th>Economy</th>
            <th>Five Wicket hauls</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{info.total_matches}</td>
            <td>{info.Total_runs_Given}</td>
            <td>{info.Total_Overs}</td>
            <td>{info.Total_balls_Bowled}</td>
            <td>{info.Total_wickets}</td>
            <td>{info.Economy}</td>
            <td>{info.Five_fers}</td>
          </tr>
        </tbody>
      </table>{" "}
      <br></br>
      <ChartComponent bowl_graph={bowl_graph} />
    </Fragment>
  );
};

export default PlayerStat;

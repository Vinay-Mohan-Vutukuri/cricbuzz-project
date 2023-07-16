import React, { Fragment, useState, useEffect } from "react";
import { Link } from "react-router-dom/cjs/react-router-dom.min";
import OverComparison from "./OverComparison";
import Chart from "chart.js/auto";
import { CategoryScale } from "chart.js";
import PieChart from "./PieChart";

Chart.register(CategoryScale);

const MatchInfo = (props) => {
  const match_id = props.matchId;
  const [activeTab, setActiveTab] = useState("scorecard");
  const [batting1, setBatting1] = useState([]);
  const [batting2, setBatting2] = useState([]);
  const [bowling1, setBowling1] = useState([]);
  const [bowling2, setBowling2] = useState([]);
  const [extra1, setExtra1] = useState([]);
  const [extra2, setExtra2] = useState([]);
  const [match_info, setMatchInfo] = useState([]);
  const [pie1_data, setPie1Data] = useState({});
  const [pie2_data, setPie2Data] = useState({});
  const [over1, setOver1] = useState([]);
  const [over2, setOver2] = useState([]);

  const [chart1Data, setChart1Data] = useState({
    labels: [
      "runs_as4",
      "runs_as6",
      "runs_as1",
      "runs_as2",
      "runs_as3",
      "runs_asextra",
    ], //Object.keys(pie1_data)
    datasets: [
      {
        label: "Runs Scored ",
        data: [], //Object.values(pie1_data)
        backgroundColor: ["blue", "green", "yellow", "red", "black", "purple"],
        borderColor: "black",
        borderWidth: 2,
      },
    ],
  });

  chart1Data.datasets[0].data = Object.values(pie1_data).map(Number);

  const [chart2Data, setChart2Data] = useState({
    labels: [
      "runs_as4",
      "runs_as6",
      "runs_as1",
      "runs_as2",
      "runs_as3",
      "runs_asextra",
    ], //Object.keys(pie1_data)
    datasets: [
      {
        label: "Runs Scored ",
        data: [], //Object.values(pie1_data)
        backgroundColor: ["blue", "green", "yellow", "red", "black", "purple"],
        borderColor: "black",
        borderWidth: 2,
      },
    ],
  });

  chart2Data.datasets[0].data = Object.values(pie2_data).map(Number);

  let bowlingData1 = [...bowling1];
  bowlingData1.sort((a, b) => {
    if (parseInt(a.wickets) !== parseInt(b.wickets)) {
      return parseInt(b.wickets) - parseInt(a.wickets);
    } else if (parseInt(a.runs_given) !== parseInt(b.runs_given)) {
      return parseInt(a.runs_given) - parseInt(b.runs_given);
    } else {
      return a.bowler_name.localeCompare(b.bowler_name);
    }
  });
  const topThreeBowlers1 = bowlingData1
    .filter((item) => parseInt(item.wickets) > 0)
    .slice(0, 3);

  let bowlingData2 = [...bowling2];
  bowlingData2.sort((a, b) => {
    if (parseInt(a.wickets) !== parseInt(b.wickets)) {
      return parseInt(b.wickets) - parseInt(a.wickets);
    } else if (parseInt(a.runs_given) !== parseInt(b.runs_given)) {
      return parseInt(a.runs_given) - parseInt(b.runs_given);
    } else {
      return a.bowler_name.localeCompare(b.bowler_name);
    }
  });
  const topThreeBowlers2 = bowlingData2
    .filter((item) => parseInt(item.wickets) > 0)
    .slice(0, 3);

  let battingData1 = [...batting1];
  battingData1.sort((a, b) => {
    if (parseInt(a.runs) !== parseInt(b.runs)) {
      return parseInt(b.runs) - parseInt(a.runs);
    } else if (parseInt(a.balls_faced) !== parseInt(b.balls_faced)) {
      return parseInt(a.balls_faced) - parseInt(b.balls_faced);
    } else {
      return a.striker_name.localeCompare(b.striker_name);
    }
  });
  const topThreeBatters1 = battingData1
    .filter((item) => parseInt(item.runs) > 0)
    .slice(0, 3);

  let battingData2 = [...batting2];
  battingData2.sort((a, b) => {
    if (parseInt(a.runs) !== parseInt(b.runs)) {
      return parseInt(b.runs) - parseInt(a.runs);
    } else if (parseInt(a.balls_faced) !== parseInt(b.balls_faced)) {
      return parseInt(a.balls_faced) - parseInt(b.balls_faced);
    } else {
      return a.striker_name.localeCompare(b.striker_name);
    }
  });
  const topThreeBatters2 = battingData2
    .filter((item) => parseInt(item.runs) > 0)
    .slice(0, 3);

  const handleTabChange = (tabName) => {
    setActiveTab(tabName);
  };

  const extractInfo = async () => {
    const res = await fetch(`http://localhost:8000/matches/${match_id}`);
    const info = await res.json();
    setBatting1(info.batting1);
    setBatting2(info.batting2);
    setBowling1(info.bowling1);
    setBowling2(info.bowling2);
    setExtra1(info.extra1);
    setExtra2(info.extra2);
    setMatchInfo(info.match_info);
    setPie1Data(info.pie1[0]);
    setPie2Data(info.pie2[0]);
    setOver1(info.over1);
    setOver2(info.over2);
  };

  useEffect(() => {
    extractInfo();
  }, []);

  return (
    <Fragment>
      <h1>
        {" "}
        {match_id}, {match_info.team1_name} VS {match_info.team2_name},{" "}
        {match_info.season_year}
      </h1>
      <button onClick={() => handleTabChange("scorecard")}>Scorecard</button>
      <button onClick={() => handleTabChange("score_comparison")}>
        Score Comparison
      </button>
      <button onClick={() => handleTabChange("summary")}> Summary </button>

      <div>
        {activeTab === "scorecard" && (
          <Fragment>
            <h2>SCORECARD</h2>
            {/*****************Innings:1*****************************/}
            <h3>INNINGS: 1({match_info.team1_name})</h3>
            {/*****batting scorecard: 1*************/}
            <b>{match_info.team1_name}</b>
            <table className="table mt-5">
              <thead>
                <tr>
                  <th>Batter</th>
                  <th>Runs</th>
                  <th>Balls Faced</th>
                  <th>Fours</th>
                  <th>Sixes</th>
                </tr>
              </thead>
              <tbody>
                {batting1.map((batter) => {
                  return (
                    <tr key={batter.striker}>
                      <td>
                        <Link to={`/players/${batter.striker}`}>
                          {batter.striker_name}
                        </Link>
                      </td>

                      <td>{batter.runs}</td>
                      <td>{batter.balls_faced}</td>
                      <td>{batter.fours}</td>
                      <td>{batter.sixes}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {/***********total, extras: 1******************* */}
            {extra1.map((extra) => {
              return (
                <Fragment>
                  Extras:
                  {extra.extra_runs_1} <br></br>
                  Total:
                  {extra.total_runs}/{extra.total_wickets}
                </Fragment>
              );
            })}{" "}
            <br></br>
            {/**************bowling: 1************************* */}
            <b>{match_info.team2_name}</b>
            <table className="table mt-5">
              <thead>
                <tr>
                  <th>Bowler</th>
                  <th>Balls Bowled</th>
                  <th>Runs Given</th>
                  <th>Wickets</th>
                </tr>
              </thead>
              <tbody>
                {bowling1.map((bowler) => {
                  return (
                    <tr key={bowler.bowler}>
                      <td>
                        <Link to={`/players/${bowler.bowler}`}>
                          {bowler.bowler_name}
                        </Link>
                      </td>
                      <td>{bowler.balls_bowled}</td>
                      <td>{bowler.runs_given}</td>
                      <td>{bowler.wickets}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {/***************************Innings2************************ */}
            <h3>INNINGS: 2({match_info.team2_name})</h3>
            {/*****batting scorecard: 2*************/}
            <b>{match_info.team2_name}</b>
            <table className="table mt-5">
              <thead>
                <tr>
                  <th>Batter</th>
                  <th>Runs</th>
                  <th>Balls Faced</th>
                  <th>Fours</th>
                  <th>Sixes</th>
                </tr>
              </thead>
              <tbody>
                {batting2.map((batter) => {
                  return (
                    <tr key={batter.striker}>
                      <td>
                        <Link to={`/players/${batter.striker}`}>
                          {batter.striker_name}
                        </Link>
                      </td>
                      <td>{batter.runs}</td>
                      <td>{batter.balls_faced}</td>
                      <td>{batter.fours}</td>
                      <td>{batter.sixes}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {/***********total, extras: 2******************* */}
            {extra2.map((extra) => {
              return (
                <Fragment>
                  Extras:
                  {extra.extra_runs_2} <br></br>
                  Total:
                  {extra.total_runs}/{extra.total_wickets}
                </Fragment>
              );
            })}
            <br></br>
            {/**************bowling: 2************************* */}
            <b>{match_info.team1_name}</b>
            <table className="table mt-5">
              <thead>
                <tr>
                  <th>Bowler</th>
                  <th>Balls Bowled</th>
                  <th>Runs Given</th>
                  <th>Wickets</th>
                </tr>
              </thead>
              <tbody>
                {bowling2.map((bowler) => {
                  return (
                    <tr key={bowler.bowler}>
                      <td>
                        <Link to={`/players/${bowler.bowler}`}>
                          {bowler.bowler_name}
                        </Link>
                      </td>
                      <td>{bowler.balls_bowled}</td>
                      <td>{bowler.runs_given}</td>
                      <td>{bowler.wickets}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {/*************Match INFO***************************** */}
            <h3>MATCH INFORMATION</h3>
            <Fragment>
              <b>Match:</b> {match_id}, {match_info.team1_name} VS{" "}
              {match_info.team2_name}, {match_info.season_year} <br></br>
              <b>Venue:</b> {match_info.venue_name}, {match_info.venue_location}{" "}
              <br></br>
              <b>Umpires:</b> {match_info.umpire_names} <br></br>
              <b>{match_info.team1_name}( Playing XI):</b>{" "}
              {match_info.team1_playing11}
              <br></br>
              <b>{match_info.team2_name}( Playing XI):</b>{" "}
              {match_info.team2_playing11}
            </Fragment>
          </Fragment>
        )}
        {activeTab === "summary" && (
          <Fragment>
            <h2>SUMMARY</h2>
            <h3>
              {match_id}, {match_info.team1_name} VS {match_info.team2_name},
              IPL, {match_info.season_year}
            </h3>
            <br></br>
            <b>
              INNINGS: 01 &emsp; {match_info.team1_name}&emsp;&emsp; Total:{" "}
              {extra1[0].total_runs}/{extra1[0].total_wickets}
            </b>{" "}
            <table className="table mt-5">
              <thead>
                <tr>
                  <th>Batting</th>
                  <th>Bowling</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    {topThreeBatters1[0].striker_name} &emsp;{" "}
                    {topThreeBatters1[0].runs}({topThreeBatters1[0].balls_faced}
                    )
                  </td>
                  <td>
                    {topThreeBowlers1[0].bowler_name} &emsp;{" "}
                    {topThreeBowlers1[0].wickets}/
                    {topThreeBowlers1[0].balls_bowled}
                  </td>
                </tr>
                <tr>
                  <td>
                    {topThreeBatters1[1].striker_name} &emsp;{" "}
                    {topThreeBatters1[1].runs}({topThreeBatters1[1].balls_faced}
                    )
                  </td>
                  <td>
                    {topThreeBowlers1[1].bowler_name} &emsp;{" "}
                    {topThreeBowlers1[1].wickets}/
                    {topThreeBowlers1[1].balls_bowled}
                  </td>
                </tr>
                <tr>
                  <td>
                    {topThreeBatters1[2].striker_name} &emsp;{" "}
                    {topThreeBatters1[2].runs}({topThreeBatters1[0].balls_faced}
                    )
                  </td>
                  <td>
                    {topThreeBowlers1[2].bowler_name} &emsp;{" "}
                    {topThreeBowlers1[2].wickets}/
                    {topThreeBowlers1[2].balls_bowled}
                  </td>
                </tr>
              </tbody>
            </table>
            <br></br>
            <br></br>
            <b>
              INNINGS: 02 &emsp;{match_info.team2_name}&emsp;&emsp; Total:{" "}
              {extra2[0].total_runs}/{extra2[0].total_wickets}
            </b>
            <table className="table mt-5">
              <thead>
                <tr>
                  <th>Batting</th>
                  <th>Bowling</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    {topThreeBatters2[0].striker_name} &emsp;{" "}
                    {topThreeBatters2[0].runs}({topThreeBatters2[0].balls_faced}
                    )
                  </td>
                  <td>
                    {topThreeBowlers2[0].bowler_name} &emsp;{" "}
                    {topThreeBowlers2[0].wickets}/
                    {topThreeBowlers2[0].balls_bowled}
                  </td>
                </tr>
                <tr>
                  <td>
                    {topThreeBatters2[1].striker_name} &emsp;{" "}
                    {topThreeBatters2[1].runs}({topThreeBatters2[1].balls_faced}
                    )
                  </td>
                  <td>
                    {topThreeBowlers2[1].bowler_name} &emsp;{" "}
                    {topThreeBowlers2[1].wickets}/
                    {topThreeBowlers2[1].balls_bowled}
                  </td>
                </tr>
                <tr>
                  <td>
                    {topThreeBatters2[2].striker_name} &emsp;{" "}
                    {topThreeBatters2[2].runs}({topThreeBatters2[0].balls_faced}
                    )
                  </td>
                  <td>
                    {topThreeBowlers2[2].bowler_name} &emsp;{" "}
                    {topThreeBowlers2[2].wickets}/
                    {topThreeBowlers2[2].balls_bowled}
                  </td>
                </tr>
              </tbody>
            </table>
            <br></br>
            <div style={{ width: 500 }}>
              <h3>Innings: 1({match_info.team1_name})</h3>
              <PieChart chartData={chart1Data}></PieChart>

              <h3>Innings: 2({match_info.team2_name})</h3>
              <PieChart chartData={chart2Data}></PieChart>
            </div>
          </Fragment>
        )}
        {activeTab === "score_comparison" && (
          <div>
            {/* Comparison section */}
            <h2>Comparison</h2>
            <OverComparison
              over1={over1}
              over2={over2}
              match_info={match_info}
            />
            <Fragment>
              {match_info.match_winner} Won By {match_info.win_margin}
              {match_info.win_type}
            </Fragment>
            {/* Content for comparison */}
          </div>
        )}
      </div>
    </Fragment>
  );
};

export default MatchInfo;

const express = require("express");
const app = express();
const cors = require("cors");
const pool = require("./db");

//middleware
app.use(express.json());
app.use(cors());

//ROUTES

// to get all the matches

app.get("/matches", async (req, res) => {
  const skip = parseInt(req.query.skip);
  const limit = parseInt(req.query.limit);
  try {
    const query = {
      text: "SELECT * FROM match ORDER BY match_id OFFSET $1 LIMIT $2",
      values: [Number(skip), Number(limit)],
    };

    let result = await pool.query(query);

    const num_rows = result.rows.length;

    for (let i = 0; i < num_rows; i++) {
      let ind_res = result.rows[i];

      const venue_res = await pool.query(
        //query to get info about venue
        "SELECT * FROM venue WHERE venue_id = $1",
        [ind_res.venue_id]
      );

      const t1 = await pool.query("SELECT * FROM team WHERE team_id = $1", [
        ind_res.team1,
      ]);
      const t2 = await pool.query("SELECT * FROM team WHERE team_id = $1", [
        ind_res.team2,
      ]);
      const t_win = await pool.query("SELECT * FROM team WHERE team_id = $1", [
        ind_res.match_winner,
      ]);

      ind_res = { ...venue_res.rows[0], ...ind_res };
      ind_res.team1_name = t1.rows[0].team_name;
      ind_res.team2_name = t2.rows[0].team_name;
      ind_res.winner_name = t_win.rows[0].team_name;
      result.rows[i] = ind_res;

      //console.log(result.rows[i]);
    }
    console.log(result.rows.length);
    res.json(result.rows);
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ error: "An error occurred" });
  }
});

app.get("/matches/:match_id", async (req, res) => {
  try {
    const { match_id } = req.params;

    //----------------------------------------------------------------//
    // Calculating Inning 1 scorecard
    const batting1_query = {
      text: "SELECT bb.striker, SUM(bb.runs_scored) AS runs, SUM(CASE WHEN bb.runs_scored = 4 THEN 1 ELSE 0 END) AS fours, SUM(CASE WHEN bb.runs_scored = 6 THEN 1 ELSE 0 END) AS sixes, COUNT(*) AS balls_faced FROM ball_by_ball AS bb WHERE bb.match_id = $1 AND bb.innings_no = $2 GROUP BY bb.striker;",
      values: [Number(match_id), 1],
    };

    let bat_1 = await pool.query(batting1_query);

    let num_rows = bat_1.rows.length;

    for (let i = 0; i < num_rows; i++) {
      let ind_res = bat_1.rows[i];
      const b_name = await pool.query(
        "SELECT * FROM player WHERE player_id=$1",
        [ind_res.striker]
      );
      bat_1.rows[i].striker_name = b_name.rows[0].player_name;
      //console.log(b_name.rows);
    }

    const extra_runs_1 = {
      text: "SELECT SUM(extra_runs) as extra_runs_1, SUM(runs_scored + extra_runs) as total_runs, SUM(CASE WHEN out_type IS NOT NULL THEN 1 ELSE 0 END) AS total_wickets FROM ball_by_ball WHERE innings_no = $1 AND match_id = $2",
      values: [1, Number(match_id)],
    };

    const e_1 = await pool.query(extra_runs_1);

    const wicket_1 = {
      text: "SELECT COUNT(*) AS total_wickets FROM ball_by_ball WHERE match_id = $1 AND innings_no = $2 AND out_type IS NOT NULL;",
      values: [Number(match_id), 1],
    };

    const w_1 = await pool.query(wicket_1);

    const bowling_1 = {
      text: "SELECT bb.bowler, SUM(bb.runs_scored + bb.extra_runs) AS runs_given, COUNT(*) AS balls_bowled, SUM(CASE WHEN bb.out_type != 'run out' THEN 1 ELSE 0 END) AS wickets FROM ball_by_ball AS bb WHERE match_id = $1 AND innings_no = $2 GROUP BY bb.bowler",
      values: [Number(match_id), 1],
    };

    const bowl_1 = await pool.query(bowling_1);

    num_rows = bowl_1.rows.length;

    for (let i = 0; i < num_rows; i++) {
      let ind_res = bowl_1.rows[i];
      const bl_name = await pool.query(
        "SELECT * FROM player WHERE player_id=$1",
        [ind_res.bowler]
      );
      bowl_1.rows[i].bowler_name = bl_name.rows[0].player_name;
    }

    const over_1 = {
      text: "SELECT bb.over_id, SUM(bb.runs_scored + bb.extra_runs) AS runs_in_over, SUM(CASE WHEN bb.out_type IS NOT NULL THEN 1 ELSE 0 END) AS wickets_in_over FROM ball_by_ball AS bb WHERE match_id = $1 AND innings_no = $2 GROUP BY bb.over_id ORDER BY bb.over_id ASC",
      values: [Number(match_id), 1],
    };

    const o_1 = await pool.query(over_1);

    //--------------------------------------------------------------
    //end of Innings1

    //-------------------------------------------------------------
    // Calculating Innings 2 scorecard
    const batting2_query = {
      text: "SELECT bb.striker, SUM(bb.runs_scored) AS runs, SUM(CASE WHEN bb.runs_scored = 4 THEN 1 ELSE 0 END) AS fours, SUM(CASE WHEN bb.runs_scored = 6 THEN 1 ELSE 0 END) AS sixes, COUNT(*) AS balls_faced FROM ball_by_ball AS bb WHERE bb.match_id = $1 AND bb.innings_no = $2 GROUP BY bb.striker;",
      values: [Number(match_id), 2],
    };
    let bat_2 = await pool.query(batting2_query);

    let num_rows_2 = bat_2.rows.length;

    for (let i = 0; i < num_rows_2; i++) {
      let ind_res = bat_2.rows[i];
      const b_name = await pool.query(
        "SELECT * FROM player WHERE player_id=$1",
        [ind_res.striker]
      );
      bat_2.rows[i].striker_name = b_name.rows[0].player_name;
      //console.log(b_name.rows);
    }

    const extra_runs_2 = {
      text: "SELECT SUM(extra_runs) as extra_runs_2, SUM(runs_scored + extra_runs) as total_runs, SUM(CASE WHEN out_type IS NOT NULL THEN 1 ELSE 0 END) AS total_wickets FROM ball_by_ball WHERE innings_no = $1 AND match_id = $2",
      values: [2, Number(match_id)],
    };

    const e_2 = await pool.query(extra_runs_2);

    const wicket_2 = {
      text: "SELECT COUNT(*) AS total_wickets FROM ball_by_ball WHERE match_id = $1 AND innings_no = $2 AND out_type IS NOT NULL;",
      values: [Number(match_id), 2],
    };

    const w_2 = await pool.query(wicket_2);

    const bowling_2 = {
      text: "SELECT bb.bowler, SUM(bb.runs_scored + bb.extra_runs) AS runs_given, COUNT(*) AS balls_bowled, SUM(CASE WHEN bb.out_type != 'run out' THEN 1 ELSE 0 END) AS wickets FROM ball_by_ball AS bb WHERE match_id = $1 AND innings_no = $2 GROUP BY bb.bowler",
      values: [Number(match_id), 2],
    };

    const bowl_2 = await pool.query(bowling_2);

    num_rows_2 = bowl_2.rows.length;

    for (let i = 0; i < num_rows_2; i++) {
      let ind_res = bowl_2.rows[i];
      const bl_name = await pool.query(
        "SELECT * FROM player WHERE player_id=$1",
        [ind_res.bowler]
      );
      bowl_2.rows[i].bowler_name = bl_name.rows[0].player_name;
    }

    const over_2 = {
      text: "SELECT bb.over_id, SUM(bb.runs_scored + bb.extra_runs) AS runs_in_over, SUM(CASE WHEN bb.out_type IS NOT NULL THEN 1 ELSE 0 END) AS wickets_in_over FROM ball_by_ball AS bb WHERE match_id = $1 AND innings_no = $2 GROUP BY bb.over_id ORDER BY bb.over_id ASC",
      values: [Number(match_id), 2],
    };

    const o_2 = await pool.query(over_2);

    //--------------------------------------------------------------
    //end of Inning 2

    const match_info_query = {
      text: "SELECT m.match_id, m.season_year, m.toss_name, m.win_type,m.win_margin, t1.team_name AS team1_name, t2.team_name AS team2_name, tw.team_name AS toss_winner, win.team_name AS match_winner, string_agg(DISTINCT CONCAT(p1.player_name, ' (', p1.batting_hand, ')'), ', ') AS team1_playing11, string_agg(DISTINCT CONCAT(p2.player_name, ' (', p2.batting_hand, ')'), ', ') AS team2_playing11, string_agg(DISTINCT u1.umpire_name, ', ') AS umpire_names, v.venue_name, CONCAT(v.city_name, ', ', v.country_name) AS venue_location FROM match m INNER JOIN team t1 ON m.team1 = t1.team_id INNER JOIN team t2 ON m.team2 = t2.team_id INNER JOIN team tw ON m.toss_winner = tw.team_id INNER JOIN team win ON m.match_winner = win.team_id INNER JOIN player_match pm1 ON m.match_id = pm1.match_id AND t1.team_id = pm1.team_id INNER JOIN player p1 ON pm1.player_id = p1.player_id INNER JOIN player_match pm2 ON m.match_id = pm2.match_id AND t2.team_id = pm2.team_id INNER JOIN player p2 ON pm2.player_id = p2.player_id INNER JOIN umpire_match um ON m.match_id = um.match_id INNER JOIN umpire u1 ON um.umpire_id = u1.umpire_id INNER JOIN venue v ON m.venue_id = v.venue_id WHERE m.match_id = $1 GROUP BY m.match_id, t1.team_name, t2.team_name, tw.team_name, win.team_name, v.venue_name, v.city_name, v.country_name;",
      values: [match_id],
    };

    const match_info = await pool.query(match_info_query);
    //-----------------------------------------------------------------

    const pie1_query = {
      text: "SELECT SUM(CASE WHEN runs_scored = 4 THEN 4 ELSE 0 END) AS runs_as4,SUM(CASE WHEN runs_scored = 6 THEN 6 ELSE 0 END) AS runs_as6,SUM(CASE WHEN runs_scored = 1 THEN 1 ELSE 0 END) AS runs_as1,SUM(CASE WHEN runs_scored = 2 THEN 2 ELSE 0 END) AS runs_as2,SUM(CASE WHEN runs_scored = 3 THEN 3 ELSE 0 END) AS runs_as3,SUM(CASE WHEN extra_runs !=0 THEN extra_runs ELSE 0 END) AS runs_asextra FROM ball_by_ball WHERE match_id = $1 AND innings_no = $2;",
      values: [match_id, 1],
    };

    const pie1 = await pool.query(pie1_query);

    const pie2_query = {
      text: "SELECT SUM(CASE WHEN runs_scored = 4 THEN 4 ELSE 0 END) AS runs_as4,SUM(CASE WHEN runs_scored = 6 THEN 6 ELSE 0 END) AS runs_as6,SUM(CASE WHEN runs_scored = 1 THEN 1 ELSE 0 END) AS runs_as1,SUM(CASE WHEN runs_scored = 2 THEN 2 ELSE 0 END) AS runs_as2,SUM(CASE WHEN runs_scored = 3 THEN 3 ELSE 0 END) AS runs_as3,SUM(CASE WHEN extra_runs !=0 THEN extra_runs ELSE 0 END) AS runs_asextra FROM ball_by_ball WHERE match_id = $1 AND innings_no = $2;",
      values: [match_id, 2],
    };

    const pie2 = await pool.query(pie2_query);

    let score_card = {
      batting1: bat_1.rows,
      batting2: bat_2.rows,
      extra1: e_1.rows,
      bowling1: bowl_1.rows,
      wicket1: w_1.rows,
      extra2: e_2.rows,
      bowling2: bowl_2.rows,
      wicket2: w_2.rows,

      over1: o_1.rows,
      over2: o_2.rows,

      match_info: match_info.rows[0],

      pie1: pie1.rows,
      pie2: pie2.rows,
    };

    console.log(score_card);
    res.json(score_card);
  } catch (err) {
    console.error(err.message);
  }
});

app.get("/pointstable/:year", async (req, res) => {
  try {
    console.log("request accepted");
    const { year } = req.params;

    //----------finding pointstable without NRR-----------------//

    const pt_query = {
      text: "SELECT t.team_id, t.team_name, COUNT(DISTINCT m.match_id) AS Mat, SUM(CASE WHEN m.match_winner = t.team_id THEN 1 ELSE 0 END) AS Won, SUM(CASE WHEN m.match_winner <> t.team_id THEN 1 ELSE 0 END) AS Lost, COUNT(CASE WHEN m.win_type = 'Tied' THEN 1 END) AS Tied, COUNT(CASE WHEN m.win_type = 'NR' THEN 1 END) AS NR, SUM(CASE WHEN m.match_winner = t.team_id THEN 2 ELSE 0 END) AS pts FROM team t LEFT JOIN match m ON t.team_id IN (m.team1,m.team2) WHERE m.season_year = $1 GROUP BY t.team_id, t.team_name, m.season_year ORDER BY Won DESC;",
      values: [year],
    };
    let pt = await pool.query(pt_query);

    const nrr_query = {
      text: "SELECT t.team_id, t.team_name, SUM(CASE WHEN b.striker = pm.player_id THEN (b.runs_scored + b.extra_runs) END) AS Runs_Scored, SUM(CASE WHEN b.bowler = pm.player_id THEN (b.runs_scored + b.extra_runs) END) AS Runs_Against, ROUND(SUM(CASE WHEN b.striker = pm.player_id THEN 1::decimal/6 END), 2) AS Balls_played, ROUND(SUM(CASE WHEN b.bowler = pm.player_id THEN 1::decimal/6 END), 2) AS Balls_played_Against FROM team t INNER JOIN match m ON t.team_id IN (m.team1,m.team2) INNER JOIN ball_by_ball b ON m.match_id = b.match_id INNER JOIN player_match pm ON m.match_id = pm.match_id AND t.team_id = pm.team_id WHERE m.season_year = $1 GROUP BY t.team_id, t.team_name;",
      values: [year],
    };

    let nrr = await pool.query(nrr_query);
    for (let i = 0; i < nrr.rows.length; i++) {
      nrr.rows[i].nrr = (
        nrr.rows[i].runs_scored / nrr.rows[i].balls_played -
        nrr.rows[i].runs_against / nrr.rows[i].balls_played_against
      ).toFixed(3);
    }

    for (let i = 0; i < nrr.rows.length; i++) {
      for (let j = 0; j < nrr.rows.length; j++) {
        if (pt.rows[i].team_id === nrr.rows[j].team_id) {
          pt.rows[i].nrr = nrr.rows[j].nrr;
        }
      }
    }

    pt.rows.sort((a, b) => {
      if (parseInt(a.pts) !== parseInt(b.pts)) {
        return parseInt(b.pts) - parseInt(a.pts); // Sort by pts in descending order
      } else {
        return parseFloat(b.nrr) - parseFloat(a.nrr); // Sort by nrr in descending order
      }
    });

    console.log(pt.rows);
    res.json(pt.rows);
  } catch (err) {
    console.error(err.message);
  }
});

app.get("/venues", async (req, res) => {
  try {
    const query = "SELECT venue_name, venue_id FROM venue;";
    const result = await pool.query(query);

    console.log(result.rows);
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
  }
});

app.get("/venues/:venue_id", async (req, res) => {
  try {
    const venue_id = req.params.venue_id;
    const basic_query = {
      text: "SELECT * FROM venue v  WHERE v.venue_id =$1",
      values: [venue_id],
    };
    const basic = await pool.query(basic_query);

    let basic_info = basic.rows;

    const score_query = {
      text: "SELECT m.match_id, m.season_year,m.win_type, COUNT(DISTINCT m.match_id) AS matches_played, SUM(CASE WHEN b.innings_no = 1 THEN (b.runs_scored + b.extra_runs) END) AS first_innings, SUM(CASE WHEN b.innings_no = 2 THEN (b.runs_scored + b.extra_runs) END) AS second_innings FROM venue v INNER JOIN match m ON v.venue_id = m.venue_id INNER JOIN ball_by_ball b ON m.match_id = b.match_id WHERE v.venue_id = $1 GROUP BY m.match_id;",
      values: [venue_id],
    };

    const score = await pool.query(score_query);

    let score_info = score.rows;
    let batting_won = 0;
    let bowling_won = 0;
    let drawn = 0;
    let highest_total = 0;
    let highest_total_chased = -1;
    let lowest_total = 9999;

    const matches_played = score_info.length;
    basic_info[0].matches_played = matches_played;

    for (let i = 0; i < score_info.length; i++) {
      if (score_info[i].win_type === "runs") {
        batting_won = batting_won + 1;
      } else if (score_info[i].win_type === "wickets") {
        bowling_won = bowling_won + 1;
      } else {
        drawn = drawn + 1;
      }
    }

    for (let i = 0; i < matches_played; i++) {
      if (score_info[i].first_innings > highest_total) {
        highest_total = score_info[i].first_innings;
      } else if (score_info[i].second_innings > highest_total) {
        highest_total = score_info[i].second_innings;
      }

      if (score_info[i].first_innings < lowest_total) {
        lowest_total = score_info[i].first_innings;
      } else if (score_info[i].second_innings < lowest_total) {
        lowest_total = score_info[i].second_innings;
      }

      if (
        score_info[i].win_type === "wickets" &&
        score_info[i].first_innings > highest_total_chased
      ) {
        highest_total_chased = score_info[i].first_innings;
      }
    }

    const x = {};

    for (let i = 0; i < score_info.length; i++) {
      const match = score_info[i];
      const year = match.season_year;
      const firstInningsScore = parseInt(match.first_innings);

      if (x[year]) {
        x[year].total += firstInningsScore;
        x[year].count += 1;
      } else {
        x[year] = {
          total: firstInningsScore,
          count: 1,
        };
      }
    }
    for (const year in x) {
      const average = x[year].total / x[year].count;
      x[year].average = average;
    }

    let y = [];
    for (let i = 0; i < Object.keys(x).length; i++) {
      y[i] = {};
      y[i].year = Object.keys(x)[i];
      y[i].average = x[Object.keys(x)[i]].average;
    }

    console.log(y);
    const total_info = {
      basic_info: basic_info,
      batting_won: batting_won,
      bowling_won: bowling_won,
      drawn: drawn,
      highest_total: highest_total,
      lowest_total: lowest_total,
      highest_total_chased: highest_total_chased,
      average_first_season: y,
    };
    //console.log(score_info);
    // console.log(total_info);
    res.json(total_info);
  } catch (err) {
    console.error(err.message);
  }
});

app.get("/players/:player_id", async (req, res) => {
  try {
    const player_id = req.params.player_id;

    const basic_query = {
      text: "SELECT * FROM player p WHERE p.player_id = $1; ",
      values: [player_id],
    };

    const basic = await pool.query(basic_query);

    const graph_query = {
      text: "SELECT m.match_id, SUM(CASE WHEN ba.match_id = m.match_id THEN ba.runs_scored ELSE 0 END) AS Runs_scored, SUM(CASE WHEN ba.match_id = m.match_id THEN 1 ELSE 0 END) AS Balls_faced, SUM(CASE WHEN (ba.runs_scored = 4 AND ba.match_id = m.match_id) THEN 1 ELSE 0 END) AS fours_in_match, SUM(CASE WHEN (ba.runs_scored = 6 AND ba.match_id = m.match_id) THEN 1 ELSE 0 END) AS sixes_in_match, SUM(CASE WHEN (ba.match_id = m.match_id AND ba.out_type IS NOT NULL) THEN 1 ELSE 0 END ) AS not_out FROM player p INNER JOIN player_match pm ON p.player_id = pm.player_id INNER JOIN match m ON pm.match_id = m.match_id INNER JOIN ball_by_ball ba ON p.player_id = ba.striker WHERE p.player_id = $1 GROUP BY m.match_id ORDER BY m.match_id;",
      values: [player_id],
    };

    let graph = await pool.query(graph_query);
    const matches_played = graph.rows.length;
    let Total_runs = 0;
    let Total_balls = 0;
    let Total_fours = 0;
    let Total_sixes = 0;
    let Outs = 0;
    let HS = 0;
    for (let i = 0; i < matches_played; i++) {
      let x = graph.rows[i];
      Total_runs = parseInt(Total_runs) + parseInt(x.runs_scored);
      Total_balls = parseInt(Total_balls) + parseInt(x.balls_faced);
      Total_fours = parseInt(Total_fours) + parseInt(x.fours_in_match);
      Total_sixes = parseInt(Total_sixes) + parseInt(x.sixes_in_match);
      if (x.not_out == 1) {
        Outs = Outs + 1;
      }
      if (x.runs_scored > HS) {
        HS = parseInt(x.runs_scored);
      }
      x.match_id = x.match_id.toString();
    }

    for (let i = 0; i < matches_played; i++) {
      let runs = 0;
      let wic = 0;
      for (let j = 0; j <= i; j++) {
        runs = runs + parseInt(graph.rows[j].runs_scored);
        if (graph.rows[j].not_out == 1) {
          wic = wic + 1;
        }
      }
      if (wic != 0) {
        graph.rows[i].average = (runs / wic).toFixed(2);
      }
    }

    let Strikerate = ((Total_runs * 100) / Total_balls).toFixed(2);
    let Average = (Total_runs / Outs).toFixed(2);

    const bowl_query = {
      text: "SELECT m.match_id, SUM(CASE WHEN ba.match_id = m.match_id THEN ba.runs_scored ELSE 0 END) AS Runs_scored, SUM(CASE WHEN ba.match_id = m.match_id THEN 1 ELSE 0 END) AS Balls_Bowled, SUM(CASE WHEN ba.match_id = m.match_id AND ba.out_type IS NOT NULL AND ba.out_type <> 'run_out' THEN 1 ELSE 0 END) AS wickets FROM player p INNER JOIN player_match pm ON p.player_id = pm.player_id INNER JOIN match m ON pm.match_id = m.match_id INNER JOIN ball_by_ball ba ON p.player_id = ba.bowler WHERE p.player_id = $1 GROUP BY m.match_id ORDER BY m.match_id;",
      values: [player_id],
    };

    const bowl_data = await pool.query(bowl_query);
    let bowl_graph = bowl_data.rows;
    let Total_runs_Given = 0;
    let Total_balls_Bowled = 0;
    let Total_Overs = 0;
    let Total_wickets = 0;
    let Five_fers = 0;
    let Economy = 0;
    for (let i = 0; i < bowl_graph.length; i++) {
      Total_runs_Given = Total_runs_Given + parseInt(bowl_graph[i].runs_scored);
      Total_balls_Bowled =
        Total_balls_Bowled + parseInt(bowl_graph[i].balls_bowled);
      if (bowl_graph[i].wickets == 5) {
        Five_fers = Five_fers + 1;
      }
      Total_wickets = Total_wickets + parseInt(bowl_graph[i].wickets);
    }

    Total_Overs =
      Math.floor(Total_balls_Bowled / 6) +
      ((Total_balls_Bowled / 6 - Math.floor(Total_balls_Bowled / 6)) * 6) / 10;

    Economy = (Total_runs_Given * 6) / Total_balls_Bowled;
    const total_info = {
      basic_info: basic.rows,
      total_runs: Total_runs,
      total_matches: matches_played,
      fours: Total_fours,
      sixes: Total_sixes,
      strikerate: Strikerate,
      average: Average,
      HS: HS,
      graph_data: graph.rows,
      bowl_graph: bowl_graph,
      Total_runs_Given: Total_runs_Given,
      Total_balls_Bowled: Total_balls_Bowled,
      Total_Overs: Total_Overs,
      Total_wickets: Total_wickets,
      Five_fers: Five_fers,
      Economy: Economy,
    };
    console.log(total_info);
    res.json(total_info);
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ error: "An error occurred" });
  }
});

app.post("/venue_entry", async (req, res) => {
  try {
    //console.log(req.body);
    const input = req.body;
    console.log(input);

    const new_query = {
      text: "INSERT INTO venue(venue_name, city_name, country_name, capacity) VALUES ($1, $2, $3, $4) RETURNING *",
      values: [input.venue, input.city, input.country, input.capacity],
    };

    const new_venue = await pool.query(new_query);
    res.json(new_venue.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "An error occurred" });
  }
});
app.listen(8000, () => {
  console.log("server listening on port 8000");
});

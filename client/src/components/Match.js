import React, { Fragment, useState, useEffect } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { Link } from "react-router-dom";

const Match = () => {
  const [matches, setmatches] = useState([]);
  const [skip, setSkip] = useState(0);
  const limit = 10;

  useEffect(() => {
    async function getMatches() {
      const res = await fetch(
        `http://localhost:8000/matches?skip=${skip}&limit=${limit}`
      );

      const matchArray = await res.json();
      setmatches(matchArray);
    }
    getMatches();
  }, [skip]);

  const handleNextPage = () => {
    setSkip(skip + limit);
  };
  const handlePrevPage = () => {
    if (skip > limit) {
      setSkip(skip - limit);
    }
  };

  return (
    <Fragment>
      <h1 className="text-centre my-5">Matches</h1>
      <table className="table mt-5">
        <thead>
          <tr>
            <th>Matches</th>
          </tr>
        </thead>
        <tbody>
          {matches.map((match) => {
            return (
              <tr key={match.match_id}>
                <td>
                  {/* <Router> */}
                  <Link to={`/matches/${match.match_id}`}>
                    {match.team1_name} VS {match.team2_name} <br></br>
                    {match.venue_name}, {match.city_name} <br></br>
                    {match.winner_name} won by {match.win_margin}{" "}
                    {match.win_type}
                  </Link>
                  {/* </Router> */}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <button onClick={handleNextPage}>next page</button>
      <button onClick={handlePrevPage}>prev page</button>
    </Fragment>
  );
};

export default Match;

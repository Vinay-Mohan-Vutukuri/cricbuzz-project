import React, { Fragment, useEffect, useState } from "react";

const PointsTable = (props) => {
  const season_year = props.season_year;
  const [pointstable, setPointstable] = useState([]);
  const getPointstable = async () => {
    const res = await fetch(`http://localhost:8000/pointstable/${season_year}`);
    const pt = await res.json();
    setPointstable(pt);
    console.log(pointstable);
  };
  useEffect(() => {
    getPointstable();
  }, []);
  return (
    <Fragment>
      <h1 className="text-center my-5">POINTSTABLE OF YEAR {season_year}</h1>

      <table className="table mt-5">
        <thead>
          <tr>
            <th>Team_Name</th>
            <th>Matches Played</th>
            <th>Won</th>
            <th>Lost</th>
            <th>Tied</th>
            <th>NR</th>
            <th>Net Run Rate</th>
            <th>Points</th>
          </tr>
        </thead>
        <tbody>
          {pointstable.map((t, index) => {
            return (
              <tr key={index}>
                <td>{t.team_name}</td>
                <td>{t.mat}</td>
                <td>{t.won}</td>
                <td>{t.lost}</td>
                <td>{t.tied}</td>
                <td>{t.nr}</td>
                <td>{t.nrr}</td>
                <td>{t.pts}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </Fragment>
  );
};

export default PointsTable;

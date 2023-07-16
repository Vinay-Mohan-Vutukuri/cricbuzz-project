import React from "react";
import { Fragment, useState, useEffect } from "react";
import { BrowserRouter as Router, Link } from "react-router-dom";
const Venues = () => {
  const [ven, setVen] = useState([]);

  const getInfoVenues = async () => {
    const result = await fetch("http://localhost:8000/venues");
    const info = await result.json();

    //console.log(info);
    setVen(info);
    //console.log(Ven);
  };
  useEffect(() => {
    getInfoVenues();
  }, []);

  return (
    <Fragment>
      <h1 className="text-center my-5">VENUES</h1>

      <table className="table mt-5">
        <thead>
          <tr>
            <th>Venues</th>
          </tr>
        </thead>
        <tbody>
          {ven.map((t, index) => {
            return (
              <tr key={index}>
                <td>
                  {/* <Router> */}
                  <Link to={`/venues/${t.venue_id}`}>{t.venue_name}</Link>
                  {/* </Router> */}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </Fragment>
  );
};
export default Venues;

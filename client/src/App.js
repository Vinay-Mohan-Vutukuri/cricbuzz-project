import "./App.css";
import React, { Fragment, useState, useEffect } from "react";
import Match from "./components/Match";
import MatchInfo from "./components/MatchInfo";

import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import PointsTable from "./components/PointsTable";
import Venues from "./components/Venues";
import VenueId from "./components/VenueId";
import PlayerStat from "./components/PlayerStat";
import VenueEntry from "./components/VenueEntry";

function App() {
  return (
    <Fragment>
      <Router>
        <div className="container">
          <Switch>
            <Route exact path="/matches" render={(props) => <Match />} />

            <Route
              exact
              path="/matches/:id"
              render={(props) => (
                <MatchInfo matchId={props.match.params.id} {...props} />
              )}
            />

            <Route
              exact
              path="/pointstable/:year"
              render={(props) => (
                <PointsTable season_year={props.match.params.year} {...props} />
              )}
            />

            <Route exact path="/venues" render={(props) => <Venues />} />

            <Route
              exact
              path="/venues/:venue_id"
              render={(props) => (
                <VenueId venue_id={props.match.params.venue_id} {...props} />
              )}
            />

            <Route
              exact
              path="/players/:player_id"
              render={(props) => (
                <PlayerStat
                  player_id={props.match.params.player_id}
                  {...props}
                />
              )}
            />

            <Route
              exact
              path="/venue_entry"
              render={(props) => <VenueEntry />}
            />
          </Switch>
        </div>
      </Router>
    </Fragment>
  );
}

export default App;

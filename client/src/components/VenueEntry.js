import React, { Fragment, useState, useEffect } from "react";

const VenueEntry = () => {
  const [inputs, setInputs] = useState({
    venue_name: "",
    city_name: "",
    country_name: "",
    capacity: "",
  });

  const { venue, city, country, capacity } = inputs;

  const onChange = (e) => {
    setInputs({ ...inputs, [e.target.name]: e.target.value });
  };

  const onSubmitForm = async (e) => {
    //e.preventDefault(); //prevents refreshing the register page

    try {
      const body = { venue, city, country, capacity };
      const response = await fetch("http://localhost:8000/venue_entry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const parseRes = await response.json();
    } catch (err) {
      console.error(err.message);
    }
  };

  return (
    <Fragment>
      {" "}
      <h1 className="text-center my-5">VenueEntry</h1>
      <form className="d-flex flex-column" onSubmit={onSubmitForm}>
        <input
          type="text"
          name="venue"
          placeholder="venue name"
          className="form-control my-3"
          value={venue}
          onChange={(e) => {
            onChange(e);
          }}
        />
        <input
          type="text"
          name="city"
          placeholder="city name"
          className="form-control my-3"
          value={city}
          onChange={(e) => {
            onChange(e);
          }}
        />
        <input
          type="text"
          name="country"
          placeholder="country name"
          className="form-control my-3"
          value={country}
          onChange={(e) => {
            onChange(e);
          }}
        />
        <input
          type="text"
          name="capacity"
          placeholder="capacity"
          className="form-control my-3"
          value={capacity}
          onChange={(e) => {
            onChange(e);
          }}
        />
        <button
          type="submit"
          className="btn btn-success btn-sm"
          style={{ fontSize: "12px", padding: "5px 10px" }}
        >
          Submit
        </button>
      </form>
    </Fragment>
  );
};

export default VenueEntry;

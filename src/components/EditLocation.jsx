import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import GeneratedForm from "./Form";
import {AuthFetch} from "../services/authServices";

function NewLocation({ history }) {
  const [details, setDetails] = useState({
    name: "",
    category: "",
    description: "",
    address: "",
    water: "",
    food: "",
    toilets: "",
    parking: "",
    offLead: "",
  });
  const { id } = useParams();

  useEffect(() => {
    AuthFetch(`process.env.REACT_APP_BACKEND_URL}/locations/${id}`, "GET")
      .then((res) => res.json())
      .then((location) => {
        setDetails({
          ...location,
        });
      });
  }, [id]);

  async function handleSubmit(e) {
    // POST request on submit, then redirect to locations pg.
    try {
      e.preventDefault();
      await fetch(`${process.env.REACT_APP_BACKEND_URL}/locations/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          location: {
            
            location_type_id: 1,
            name: details.name,
            description: details.description,
            address: details.address,
          },
        }),
      });
      history.push("/locations");
    } catch (err) {
      console.log(err.message);
    }
  }

  const handleFormChange = (e) => {
    setDetails({
      ...details,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <>
      <h1>Edit Location</h1>
      <GeneratedForm
        details={details}
        handleFormChange={handleFormChange}
        handleSubmit={handleSubmit}
      />
    </>
  );
}

export default NewLocation;

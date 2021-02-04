import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import GeneratedForm from "./Form";
import { useGlobalState } from "../utils/context";
import { getLocation, getStaticAssets } from "../services/locationServices";

function EditLocation({ history }) {
  // Inbound info from static assets
  const { store, dispatch } = useGlobalState();
  const { staticAssets } = store;
  const {
    location_types: locationTypes,
    location_facilities: facilityTypes,
  } = staticAssets;

  const { id } = useParams();
  const { loggedInAdmin } = store;

  // Initiates state as empty object (with keys so inputs are always controlled)
  const [details, setDetails] = useState({
    name: "",
    location_type: "",
    description: "",
    address: "",
    location_facilities_attributes: [],
  });

  // If statis assets don't exist, fetch call to get them and saves in global state.
  // Assets to display types and facilities.
  useEffect(() => {
    !staticAssets.location_types &&
      getStaticAssets()
        .then((assets) => {
          dispatch({ type: "setStaticAssets", data: assets });
        })
        .catch((error) => console.log(error));
  }, [dispatch, staticAssets.location_types]);

  // Gets existing data and prefills it
  useEffect(() => {
    getLocation(id)
      .then((details) => setDetails(details))
      .catch((error) => console.log(error));
  }, [id]);

  async function handleSubmit(e) {
    // POST request on submit, then redirect to locations pg.
    e.preventDefault();
    const body = JSON.stringify({
      location_type_id: 1,
      name: details.name,
      description: details.description,
      address: details.address,
    });
    try {
      await fetch(`${process.env.REACT_APP_BACKEND_URL}/locations/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: body,
      });
      history.push("/");
      // If not admin will get a prompt that mailer sent to admin
      !loggedInAdmin &&
        alert("Your request has been sent to our admin team for edit approval");
    } catch (err) {
      console.log(err.message);
    }
  }

  // Form change of details
  const handleFormChange = (e) => {
    setDetails({
      ...details,
      [e.target.name]: e.target.value,
    });
  };

  // Form change for checkboxes
  const handleCheckChange = (e) => {
    setDetails({
      ...details,
      location_facilities_attributes: [
        ...details.location_facilities_attributes,
        e.target.value,
      ],
    });
  };

  return (
    <>
      <h1>Edit Location</h1>
      <GeneratedForm
        details={details}
        locationTypes={locationTypes}
        facilityTypes={facilityTypes}
        handleCheckChange={handleCheckChange}
        handleFormChange={handleFormChange}
        handleSubmit={handleSubmit}
      />
    </>
  );
}

export default EditLocation;

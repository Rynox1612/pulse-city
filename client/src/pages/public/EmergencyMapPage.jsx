import { useState, useEffect } from "react";
import { getAllHospitals } from "../../services/hospitalService";

export default function EmergencyMapPage() {
  const [hospitals, setHospitals] = useState([]);

  useEffect(() => {
    getAllHospitals()
      .then((data) => {
        console.log("Hospital data:", data); // check this in console
        setHospitals(data.data);
      })
      .catch((err) => {
        console.error("Error:", err); // check this in console
      });
  }, []);

  return (
    <div>
      <h1>Emergency Map</h1>
      <ul>
        {hospitals.map((hospital) => (
          <li key={hospital._id}>{hospital.name}</li>
        ))}
      </ul>
    </div>
  );
}

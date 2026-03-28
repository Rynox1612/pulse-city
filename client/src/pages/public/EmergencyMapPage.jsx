import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { getAllHospitals } from "../../services/hospitalService";
import L from "leaflet";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

// Fix Leaflet default icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const MUMBAI_CENTER = [19.076, 72.8777];

const hospitalIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const userIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const FitBounds = ({ hospitals, userLocation }) => {
  const map = useMap();

  useEffect(() => {
    const points = [];
    if (userLocation) points.push([userLocation.lat, userLocation.lng]);

    hospitals.forEach((h) => {
      if (h.location?.coordinates?.length === 2) {
        points.push([h.location.coordinates[1], h.location.coordinates[0]]);
      } else if (h.coordinates?.lat && h.coordinates?.lng) {
        points.push([h.coordinates.lat, h.coordinates.lng]);
      }
    });

    if (points.length > 0) {
      const bounds = L.latLngBounds(points);
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 15 });
    }
  }, [hospitals, userLocation, map]);

  return null;
};

const EmergencyMapPage = () => {
  const [hospitals, setHospitals] = useState([]);
  const [userLocation, setUserLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHospitals = async () => {
      try {
        const response = await getAllHospitals();
        console.log(
          "First hospital:",
          JSON.stringify(response.data[0], null, 2),
        );
        if (response?.success && Array.isArray(response.data)) {
          setHospitals(response.data);
        } else {
          setError("Failed to fetch hospitals");
        }
      } catch (err) {
        console.error("Error fetching hospitals:", err);
        setError("Error connecting to the server");
      } finally {
        setLoading(false);
      }
    };

    fetchHospitals();
  }, []);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (err) => console.error("Location error:", err),
      );
    }
  }, []);

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
        }}
      >
        <p>Locating nearest hospitals...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
        }}
      >
        <p style={{ color: "red" }}>{error}</p>
      </div>
    );
  }

  return (
    <div style={{ padding: "2rem" }}>
      <div style={{ marginBottom: "2rem" }}>
        <h1 style={{ fontSize: "1.875rem", fontWeight: "bold" }}>
          Emergency Hospital Map
        </h1>
        <p style={{ color: "#6b7280", marginTop: "0.5rem" }}>
          Find real-time help near your location.
        </p>
      </div>

      <div style={{ height: "600px", width: "100%" }}>
        <MapContainer
          center={MUMBAI_CENTER}
          zoom={12}
          style={{ height: "600px", width: "100%" }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {userLocation && (
            <Marker
              position={[userLocation.lat, userLocation.lng]}
              icon={userIcon}
            >
              <Popup>
                <strong>📍 You are here</strong>
              </Popup>
            </Marker>
          )}

          {hospitals.map((hospital) => {
            let lat, lng;

            if (hospital.location?.coordinates?.length === 2) {
              [lng, lat] = hospital.location.coordinates;
            } else if (hospital.coordinates?.lat && hospital.coordinates?.lng) {
              lat = hospital.coordinates.lat;
              lng = hospital.coordinates.lng;
            } else {
              return null;
            }

            return (
              <Marker
                key={hospital._id}
                position={[lat, lng]}
                icon={hospitalIcon}
              >
                <Popup>
                  <div style={{ minWidth: "200px" }}>
                    <h3 style={{ fontWeight: "bold", marginBottom: "4px" }}>
                      {hospital.name}
                    </h3>
                    <p
                      style={{
                        fontSize: "12px",
                        color: "#6b7280",
                        marginBottom: "8px",
                      }}
                    >
                      📍 {hospital.address}
                    </p>
                    <p style={{ fontSize: "11px", marginBottom: "8px" }}>
                      {hospital.emergencyAvailable ? (
                        <span style={{ color: "green", fontWeight: "bold" }}>
                          ✅ Emergency Ready
                        </span>
                      ) : (
                        <span style={{ color: "gray" }}>
                          ❌ No Emergency Service
                        </span>
                      )}
                    </p>
                    <button
                      onClick={() =>
                        window.open(
                          `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`,
                        )
                      }
                      style={{
                        width: "100%",
                        backgroundColor: "#2563eb",
                        color: "white",
                        border: "none",
                        padding: "6px 12px",
                        borderRadius: "6px",
                        cursor: "pointer",
                        fontSize: "12px",
                        fontWeight: "bold",
                      }}
                    >
                      Get Directions →
                    </button>
                  </div>
                </Popup>
              </Marker>
            );
          })}

          <FitBounds hospitals={hospitals} userLocation={userLocation} />
        </MapContainer>
      </div>
    </div>
  );
};

export default EmergencyMapPage;

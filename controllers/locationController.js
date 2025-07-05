import axios from "axios";
import triggerOmniCall from "../CallFunction/triggerOmniCall.js";

export const getUserLocation = async (req, res) => {
  try {
    
    const { lat, lon, name } = req.body;

    // const lat = 28.6139;  // New Delhi latitude (for testing)
    // const lon = 77.2090;  // New Delhi longitude (for testing)

    if (!lat || !lon) {
      return res.status(400).json({ message: "Latitude and longitude are required." });
    }

    const apiKey = "a960fef2c86248ae81b0cc4d61479182"; // OpenCage API key

    const response = await axios.get("https://api.opencagedata.com/geocode/v1/json", {
      params: {
        key: apiKey,
        q: `${lat},${lon}`,
        pretty: 1,
      },
    });

    const data = response.data;

    if (!data || !data.results || data.results.length === 0) {
      return res.status(404).json({ message: "No location found for the provided coordinates." });
    }

    const location = data.results[0].components;

    res.json({
      city: location.city || location.town || location.village || "Unknown",
      region: location.state || "Unknown",
      country: location.country || "Unknown",
      postalCode: location.postcode || "Unknown",
      lat,
      lon,
      formatted: data.results[0].formatted,
    });
  } catch (error) {
    console.error("Error fetching location from OpenCage:", error.message);
    res.status(500).json({ message: "Server error while fetching location." });
  }
};


export const triggerCallAgent = async (req, res) => {
  const { userNumber, lat, lon } = req.body;

  console.log(userNumber, lat, lon)

  const result = await triggerOmniCall({
    userNumber,
    customJsonVariables: {
      lat,
      lon
    }
  });

  if (result) {
    res.status(200).json({ message: "Call triggered", data: result });
  } else {
    res.status(500).json({ message: "Failed to trigger call" });
  }
};

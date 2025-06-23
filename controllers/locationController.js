import axios from "axios";

export const getUserLocation = async (req, res) => {
  try {
    const { lat, lon } = req.body;

    if (!lat || !lon) {
      return res.status(400).json({ message: "Latitude and longitude are required." });
    }

    const response = await axios.get("https://nominatim.openstreetmap.org/reverse", {
      params: {
        format: "json",
        lat,
        lon,
      },
      headers: {
        "User-Agent": "YourAppName/1.0", // required by Nominatim
      },
    });

    const data = response.data;

    res.json({
      city: data.address.city || data.address.town || data.address.village || "Unknown",
      region: data.address.state || "Unknown",
      country: data.address.country || "Unknown",
      displayName: data.display_name,
      lat: lat,
      lon: lon,
    });
  } catch (error) {
    console.error("Error during reverse geocoding:", error.message);
    res.status(500).json({ message: "Failed to fetch location details." });
  }
};
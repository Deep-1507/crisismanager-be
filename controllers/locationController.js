import axios from "axios";

export const getUserLocation = async (req, res) => {
  try {
    
    const { lat, lon } = req.body;

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

// omniCall.js

export async function triggerOmniCall({
  userNumber = "",
  botId = 1854,
  customJsonVariables = {},
  onSuccess = () => {},
  onError = () => {}
} = {}) {
  if (!userNumber || !botId) {
    console.error("Missing required parameters.");
    return;
  }

  try {
    const response = await fetch("https://www.omnidim.io/api/bot/dispatch/call", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Origin": "https://www.omnidim.io", // optional
        "Referer": `https://www.omnidim.io/agent/${botId}` // optional
      },
      body: JSON.stringify({
        user_number: userNumber,
        bot_id: botId,
        custom_json_variables: customJsonVariables
      }),
      credentials: "include" // in case cookies are needed
    });

    if (!response.ok) {
      throw new Error(`API call failed with status ${response.status}`);
    }

    const data = await response.json();

    console.log("📞 Omni call response received:", data);
    onSuccess(data); // callback to send result to UI
    return data;
  } catch (error) {
    console.error("❌ Error triggering Omni call:", error);
    onError(error); // callback for error handling
    return null;
  }
}

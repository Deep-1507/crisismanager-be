export default async function triggerOmniCall({
  userNumber = "",
  botId = 1854,
  customJsonVariables = {},
  onSuccess = () => {},
  onError = () => {}
} = {}) {
  if (!userNumber) {
    console.error("Missing required parameters.");
    return;
  }
  try {
    console.log("Calling Omni API with:", {
  user_number: userNumber,
  bot_id: botId,
  custom_json_variables: customJsonVariables
});
    const response = await fetch("https://www.omnidim.io/api/bot/dispatch/call", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "Cookie": "session_id=22defdd3a9f3a454a35d86d3b85c3aa53fd7bf33", // ← Add actual session cookie here
  },
  body: JSON.stringify({
    user_number: userNumber,
    bot_id: botId,
    custom_json_variables: customJsonVariables
  }),
});


    if (!response.ok) {
      throw new Error(`API call failed with status ${response.status}`);
    }

    const data = await response.json();
    console.log("📞 Omni call response received:", data);
    onSuccess(data);
    return data;

  } catch (error) {
    console.error("❌ Error triggering Omni call:", error);
    onError(error);
    return null;
  }
}
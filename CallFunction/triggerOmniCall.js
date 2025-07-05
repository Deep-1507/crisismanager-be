export default async function triggerOmniCall({
  to_number = "",
  agent_id = 1854,
  call_context = {},
  onSuccess = () => {},
  onError = () => {}
} = {}) {
  if (!userNumber) {
    console.error("Missing required parameters.");
    return;
  }
  try {
    console.log("Calling Omni API with:", {
  to_number: userNumber,
  agent_id: botId,
  call_context: customJsonVariables
});
    const response = await fetch("https://backend.omnidim.io/api/v1/calls/dispatch", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "Authorization": "Bearer -GnXoMmbzHFDNL3mt7FhVFf7fW6Crp-YKwY-Z_htyQU",
  },
  body: JSON.stringify({
    agent_id: 1854,
    to_number: "+917005755245",
    call_context: {
      lat: "24.7198",
      lon: "78.6342",
      name: "Arvush Singh"
    }
  })
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

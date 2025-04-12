exports.handler = async (event) => {
  try {
    const { name, latitude, longitude, accuracy, type, deviceId } = JSON.parse(event.body);

    const baseId = "appRs0OLbQJLYspf5"; // <-- il tuo Base ID di Airtable
    const tableName = "REGISTRO DELLE PRESENZE";
    const airtableKey = process.env.AIRTABLE_API_KEY;

    const airtableResponse = await fetch(
      `https://api.airtable.com/v0/${baseId}/${encodeURIComponent(tableName)}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${airtableKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fields: {
            "Name/ID": name,
            "Latitude": latitude,
            "Longitude": longitude,
            "Accuracy (m)": accuracy,
            "Tipo timbratura": type,
            "ID Dispositivo": deviceId
          },
        }),
      }
    );

    const contentType = airtableResponse.headers.get("content-type");
    let data = null;
    if (contentType && contentType.includes("application/json")) {
      data = await airtableResponse.json();
    }

    if (!airtableResponse.ok) {
      return {
        statusCode: airtableResponse.status,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          success: false,
          error: data?.error?.message || "Errore Airtable",
        }),
      };
    }

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        success: true,
        data: data,
      }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        success: false,
        error: err.message,
      }),
    };
  }
};


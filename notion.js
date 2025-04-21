// notion.js
let NOTION_API_KEY = null;
let NOTION_DATABASE_ID = null;


chrome.storage.local.get(["notionApiKey", "notionDatabaseId"], (result) => {
  NOTION_API_KEY = result.notionApiKey;
  NOTION_DATABASE_ID = result.notionDatabaseId;

  if (!NOTION_API_KEY || !NOTION_DATABASE_ID) {
    console.warn("⚠️ Clé API Notion ou ID de base de données manquant dans chrome.storage.local");
  } else {
    console.log("🔐 Clés Notion chargées depuis storage");
  }
});


chrome.storage.onChanged.addListener((changes, area) => {
  if (area === "local") {
    if (changes.notionApiKey) NOTION_API_KEY = changes.notionApiKey.newValue;
    if (changes.notionDatabaseId) NOTION_DATABASE_ID = changes.notionDatabaseId.newValue;

    console.log("🔄 Mise à jour des clés Notion depuis storage");
  }
});


async function addRowToNotion(payload) {
  if (await doesUrlAlreadyExistInDb(payload.jobUrl)) {
    throw new Error("Cette offre a déjà été enregistrée");
  } else {
    const response = await fetch("https://api.notion.com/v1/pages", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${NOTION_API_KEY}`,
        "Notion-Version": "2022-06-28",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        parent: { database_id: NOTION_DATABASE_ID },
        properties: {
          "Titre du poste": {
            title: [
              {
                text: {
                  content: payload.jobTitle,
                },
              },
            ],
          },
          Entreprise: {
            rich_text: [
              {
                text: {
                  content: payload.companyName,
                },
              },
            ],
          },
          "Statut de l'offre": {
            select: {
              name: "Postulé",
            },
          },
          "URL de l'offre": {
            url: payload.jobUrl,
          },
          "Compétences requises": {
            rich_text: [
              {
                text: {
                  content: payload.skills.join(", "),
                },
              },
            ],
          },
          Lieu: {
            rich_text: [
              {
                text: {
                  content: payload.location,
                },
              },
            ],
          },
          "Date de postulation": {
            date: {
              start: new Date().toISOString(),
            },
          },
        },
      }),
    });

    if (!response.ok) {
      const err = await response.json();
      console.error("❌ Notion API error:", err);
      throw new Error(err.message || "Erreur lors de la requête Notion");
    }

    const data = await response.json();
    console.log("✅ Notion API success:", data);
  }
}

async function doesUrlAlreadyExistInDb(url) {
  const response = await fetch(
    `https://api.notion.com/v1/databases/${NOTION_DATABASE_ID}/query`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${NOTION_API_KEY}`,
        "Notion-Version": "2022-06-28",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        filter: {
          property: "URL de l'offre",
          url: {
            equals: url,
          },
        },
      }),
    }
  );

  const data = await response.json();
  return data.results?.length > 0;
}

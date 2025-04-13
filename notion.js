// notion.js
const NOTION_API_KEY=""
const NOTION_DATABASE_ID=""

async function addRowToNotion(payload) {
  const response = await fetch("https://api.notion.com/v1/pages", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${NOTION_API_KEY}`,
      "Notion-Version": "2022-06-28",
      "Content-Type": "application/json"
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
          "Lieu": {
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
    })
  });

  if (!response.ok) {
    const err = await response.json();
    console.error("❌ Notion API error:", err);
    throw new Error(err.message || "Erreur lors de la requête Notion");
  }

  const data = await response.json();
  console.log("✅ Notion API success:", data);
}

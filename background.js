importScripts("notion.js");

/*
*
  Lors de la première installation, récupération des identifiants d'api Notion
*
*/
chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.get(["notionApiKey", "notionDatabaseId"], (result) => {
    if (!result.notionApiKey || !result.notionDatabaseId) {
      chrome.runtime.openOptionsPage();
    }
  });
});


/*
*
  Gestion de l'évènement pour le tracking de l'offre
*
*/

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log("📥 Message reçu dans background :", message);

  if (message.action === "saveToTracker") {
    console.log("📦 Lancement de addRowToNotion");

    addRowToNotion(message.payload)
      .then(() => {
        console.log("✅ Enregistrement envoyé !");
        sendResponse({ success: true });
      })
      .catch(err => {
        console.error("❌ Échec :", err);
        sendResponse({ success: false, error: err.message });
      });

    // 👉 Indispensable pour signaler qu'on va répondre plus tard
    return true;
  }
});

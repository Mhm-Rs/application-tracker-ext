const style = document.createElement("style");
style.textContent = `
  .spinner {
    border: 2px solid white;
    border-top: 2px solid transparent;
    border-radius: 50%;
    width: 16px;
    height: 16px;
    animation: spin 0.7s linear infinite;
    margin: 0 auto;
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;
document.head.appendChild(style);


function showAlert(message, type = "warning", duration = 3000) {
  const alertBox = document.getElementById("customAlert");
  if (!alertBox) return;

  alertBox.classList.remove("alert-success", "alert-error", "alert-warning");

  alertBox.classList.add(`alert-${type}`);
  alertBox.textContent = message;
  alertBox.style.display = "block";

  setTimeout(() => {
    alertBox.style.display = "none";
  }, duration);
}

const saveBtn = document.getElementById("saveBtn");

// Ajout d'un event listener pour le bouton de sauvegarde
saveBtn.addEventListener("click", async function () {
  const apiKey = document.getElementById("apiKey").value;
  const databaseId = document.getElementById("databaseId").value;

  if (apiKey && databaseId) {
    const originalContent = saveBtn.innerHTML;
    saveBtn.disabled = true;
    saveBtn.innerHTML = `<div class="spinner"></div>`;
    const result = await testNotionCredentials(apiKey, databaseId);
    if (result.success) {
        chrome.storage.local.set(
            { notionApiKey: apiKey, notionDatabaseId: databaseId },
            () => {
                saveBtn.disabled = false;
                saveBtn.innerHTML = "✅ Succès";
              showAlert("✅ Clés sauvegardées !", "success");
              setTimeout(() => {
                window.close();
              }, 3000);
            }
          );
    } else {
        saveBtn.disabled = false;
        saveBtn.innerHTML = originalContent;
        showAlert("❌ Erreur d'identifiant : " + result.error)

    }
  } else {
    showAlert("⚠️ Veuillez remplir toutes les informations.", "warning");
  }
});

async function testNotionCredentials(apiKey, databaseId) {
    try {
      const response = await fetch(`https://api.notion.com/v1/databases/${databaseId}`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Notion-Version": "2022-06-28",
          "Content-Type": "application/json"
        }
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Erreur inconnue");
      }
  
      const data = await response.json();
      return { success: true, database: data };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }
  
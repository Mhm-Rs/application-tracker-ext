/*
*
  Gestion de l'autotrack pour enregistrer les offres quand on clique sur le bouton Postuler
*
*/

function setupAutoTrack() {
  document.body.addEventListener("click", (event) => {
    const selector = websiteSelectors[getSiteName(window.location.hostname)];
    const applyBtn = event.target.closest(selector.applyBtn);
    
    if (applyBtn) {
      console.log("✅ Détection clic sur bouton de candidature");
      sendToTracker(extractJobDetails())
    }
  });
}


/*
*
  Gestion du reload pour supprimer/afficher le widget, compatible SPA
*
*/

function observeUrlChanges() {
  let lastUrl = location.href;

  setInterval(() => {
    const currentUrl = location.href;
    if (currentUrl !== lastUrl) {
      console.log("🔄 URL changée :", currentUrl);

      // Supprimer l’ancien widget s’il existe
      document.querySelector("#application-tracker-widget")?.remove();
      lastUrl = currentUrl;

      if (shouldInjectWidget(currentUrl)) {
        setTimeout(() => {
          createWidget();
        }, 1000);
      }
    }
  }, 500); // vérifie deux fois par seconde
}

function shouldInjectWidget(url) {
  for (const pattern of authorizedUrls) {
    // Utiliser un simple test de correspondance avec un regex
    const regex = new RegExp("^" + pattern.replace(/\*/g, ".*") + "$");
    if (regex.test(url)) {
      return true;
    }
  }
  return false;
}

/*
*
  Spinner pour le widget
*
*/

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

/*
*
  Gestion du widget
*
*/

function createWidget() {
  // Supprimer un widget existant s’il est déjà présent
  const existingWidget = document.querySelector("#application-tracker-widget");
  if (existingWidget) existingWidget.remove();

  const container = document.createElement("div");
  container.id = "application-tracker-widget";
  container.style.position = "fixed";
  container.style.top = "20px";
  container.style.right = "20px";
  container.style.width = "220px";
  container.style.backgroundColor = "#f4f4f4";
  container.style.border = "1px solid #ccc";
  container.style.borderRadius = "10px";
  container.style.boxShadow = "0px 4px 12px rgba(0, 0, 0, 0.2)";
  container.style.padding = "15px";
  container.style.zIndex = "10000";
  container.style.fontFamily = "Arial, sans-serif";

  const title = document.createElement("div");
  title.textContent = "Candidatrack";
  title.style.fontWeight = "bold";
  title.style.marginBottom = "10px";
  title.style.fontSize = "16px";
  title.style.color = "#333";

  const button = document.createElement("button");
  button.textContent = "Save to Tracker";
  button.style.width = "100%";
  button.style.padding = "10px";
  button.style.backgroundColor = "#28a745"; // vert
  button.style.color = "white";
  button.style.border = "none";
  button.style.borderRadius = "6px";
  button.style.cursor = "pointer";
  button.style.fontSize = "14px";

  // 💬 Disclaimer pour Monster
  const siteName = getSiteName(window.location.hostname);
  if (siteName === "monster") {
    const disclaimer = document.createElement("div");
    disclaimer.textContent =
      "⚠️ Le mode automatique n’est pas disponible sur ce site. Cliquez sur le bouton ci-dessous pour enregistrer.";
    disclaimer.style.fontSize = "12px";
    disclaimer.style.color = "#a00";
    disclaimer.style.marginBottom = "10px";
    container.appendChild(disclaimer);
  }

  button.addEventListener("click", () => {
    const jobDetails = extractJobDetails();
    console.log("The job details I got : ", jobDetails);

    sendToTracker(jobDetails, button)
  });

  container.appendChild(title);
  container.appendChild(button);
  document.body.appendChild(container);
}

function showPopup(message, isError = false, isExtended = false) {
  const popup = document.createElement("div");
  popup.textContent = message;
  popup.style.position = "fixed";
  popup.style.top = "100px";
  popup.style.right = "20px";
  popup.style.backgroundColor = isError ? "#dc3545" : "#001F3F"; // rouge ou bleu foncé
  popup.style.color = "white";
  popup.style.padding = "10px 14px";
  popup.style.borderRadius = "8px";
  popup.style.boxShadow = "0px 2px 10px rgba(0,0,0,0.3)";
  popup.style.zIndex = "10001";
  popup.style.fontSize = "14px";
  popup.style.opacity = "0";
  popup.style.transition = "opacity 0.3s";

  document.body.appendChild(popup);
  requestAnimationFrame(() => {
    popup.style.opacity = "1";
  });

  setTimeout(() => {
    popup.style.opacity = "0";
    setTimeout(() => popup.remove(), 300);
  }, isExtended ? 3000 : 2000);
}

function sendToTracker(jobDetails, button = null) {
  const originalContent = button?.innerHTML;

  if (button) {
    button.disabled = true;
    button.innerHTML = `<div class="spinner"></div>`;
  }

  chrome.runtime.sendMessage(
    { action: "saveToTracker", payload: jobDetails },
    (response) => {
      if (chrome.runtime.lastError) {
        console.error("❌ Erreur de message :", chrome.runtime.lastError.message);
        if (button) button.textContent = "Erreur !";
        showPopup(
          "Erreur du navigateur : " + handleErrorMessage(chrome.runtime.lastError.message),
          true
        );
      } else if (response.success) {
        showPopup("Ajouté à Notion ✅");
      } else {
        if (button) button.textContent = "Erreur !";
        showPopup("❌ Erreur : " + handleErrorMessage(response.error), true);
      }

      if (button) {
        button.style.backgroundColor = "#1e7e34";
        setTimeout(() => {
          button.disabled = false;
          button.style.backgroundColor = "#28a745";
          button.innerHTML = originalContent;
        }, 2500);
      }
    }
  );
}

/*
*
  Fonctions utilitaires
*
*/

function extractJobDetails() {
  const selector = websiteSelectors[getSiteName(window.location.hostname)];

  const jobTitle = document
    .querySelector(selector.jobTitle)
    ?.textContent.trim();
  const companyName = document
    .querySelector(selector.companyName)
    ?.textContent.trim();
  const location = document
    .querySelector(selector.location)
    ?.textContent.trim();
  const jobDescription = document
    .querySelector(selector.jobDescription)
    ?.textContent.trim();
  const jobUrl = window.location.href;

  // Extraire les compétences mentionnées
  const skillsRegex = new RegExp(skillsData.skills.join("|"), "gi");
  let skills = jobDescription?.match(skillsRegex) || [];

  // Enlever les doublons
  if (skills && skills.length > 0) {
    const normalizedSkills = [
      ...new Set(skills.map((skill) => skill.toLowerCase())),
    ];

    // Capitaliser
    skills = normalizedSkills.map(
      (skill) => skill.charAt(0).toUpperCase() + skill.slice(1)
    );
  } else if (skills.length == 0) {
    skills = ["No skill found."];
  }

  return {
    jobTitle,
    companyName,
    location,
    skills,
    jobUrl,
  };
}

function getSiteName(hostname) {
  const parts = hostname.split(".");
  if (parts.length >= 2) {
    return parts[parts.length - 2];
  }
  return hostname;
}


/*
*
  Gestion des erreurs
*
*/

function handleErrorMessage(errorMessage) {
  console.log("Message d'erreur reçu : " + errorMessage);
  if (errorMessage.match("body failed validation")) {
    return "Les informations de l'offre n'ont pas pu être récupérées.";
  } else if (
    errorMessage.match("is not a property that exists") ||
    errorMessage.match("is expected to be")
  ) {
    return "La base de données Notion utilisée n'est pas compatible.";
  } else {
    return errorMessage;
  }
}

/*
*
  Page principale
*
*/

observeUrlChanges();
setupAutoTrack();

if (shouldInjectWidget(location.href)) {
  createWidget();
}

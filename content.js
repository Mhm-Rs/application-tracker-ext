function observeUrlChanges() {
  let lastUrl = location.href;

  setInterval(() => {
    const currentUrl = location.href;
    if (currentUrl !== lastUrl) {
      lastUrl = currentUrl;
      console.log("🔄 URL changée :", currentUrl);

      // Supprimer l’ancien widget s’il existe
      document.querySelector("#application-tracker-widget")?.remove();

      // On attend un peu que le contenu se charge avant d’appeler createWidget
      setTimeout(() => {
        createWidget();
      }, 1000);
    }
  }, 500); // vérifie deux fois par seconde
}

observeUrlChanges();


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
  title.textContent = "Application Tracker";
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

  button.addEventListener("click", () => {
    const jobDetails = extractJobDetails();
    console.log("The job details I got : ",jobDetails)
    
    chrome.runtime.sendMessage({ action: "saveToTracker", payload: jobDetails}, (response) => {
      if (chrome.runtime.lastError) {
        console.error("❌ Erreur de message :", chrome.runtime.lastError.message);
        showPopup("Erreur : " + chrome.runtime.lastError.message, true);
      } else if (response.success) {
        showPopup("Ajouté à Notion ✅");
      } else {
        showPopup("Erreur : " + response.error, true);
      }

    button.disabled = true;
    button.style.backgroundColor = "#1e7e34"; // vert plus foncé
    button.textContent = "✓ Enregistré !";


      setTimeout(() => {
        button.disabled = false;
        button.style.backgroundColor = "#28a745";
        button.textContent = "Save to Tracker";
      }, 1500);
    });
  });

  container.appendChild(title);
  container.appendChild(button);
  document.body.appendChild(container);
}

function showPopup(message, isError = false) {
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
  }, 2000);
}


function extractJobDetails() {
  const selector = websiteSelectors[getSiteName(window.location.hostname)];

  const jobTitle = document.querySelector(selector.jobTitle)?.textContent.trim();
  const companyName = document.querySelector(selector.companyName)?.textContent.trim();
  const location = document.querySelector(selector.location)?.textContent.trim();
  const jobDescription = document.querySelector(selector.jobDescription)?.textContent.trim();
  const jobUrl = window.location.href;

  // Extraire les compétences mentionnées
  const skillsRegex = new RegExp(skillsData.skills.join("|"), "gi");
  // Utilisation de la regex pour extraire les compétences
  let skills = jobDescription?.match(skillsRegex) || [];

  // Enlever les doublons
  if (skills.length > 0) {
    skills = [...new Set(skills)]; 
  }

  return {
    jobTitle,
    companyName,
    location,
    skills,
    jobUrl
  };
}

function getSiteName(hostname) {
  const parts = hostname.split('.');
  if (parts.length >= 2) {
    return parts[parts.length - 2]; // "indeed" ou "linkedin"
  }
  return hostname;
}


createWidget();

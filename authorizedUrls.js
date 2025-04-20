// These URLs must be the same as those present in the host_permissions and content_scripts.matches objects in manifest.json
const authorizedUrls = [
      "https://fr.indeed.com/viewjob*",
      "https://fr.indeed.com/jobs*",

      "https://www.linkedin.com/jobs*",

      "https://www.glassdoor.fr/Emploi*",
      "https://www.glassdoor.fr/job-listing*",

       // different than the one in manifest.json because https://www.welcometothejungle.com/fr/companies should not display widget
      "https://www.welcometothejungle.com/fr/companies/*/jobs*",

      "https://www.monster.fr/emploi/recherche*",
      "https://www.monster.fr/offres-demploi*",

      "https://www.hellowork.com/fr-fr/emplois*"
]
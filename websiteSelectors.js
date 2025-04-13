const websiteSelectors = {
    indeed: {
        jobTitle:"h2[data-testid='simpler-jobTitle']",
        companyName:".jobsearch-JobInfoHeader-companyNameSimple, .jobsearch-JobInfoHeader-companyNameLink",
        location:"#jobLocationText > div > span",
        jobDescription:"#jobDescriptionText"
    },
    linkedin: {
        jobTitle:"h1[class='t-24 t-bold inline']",
        companyName:"div[class='job-details-jobs-unified-top-card__company-name'] > a",
        location:"div[class='t-black--light mt2 job-details-jobs-unified-top-card__tertiary-description-container'] > span > span:nth-child(1)",
        jobDescription:"#job-details"
    },
};
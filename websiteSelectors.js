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
    glassdoor:{
        jobTitle:"h1[id*='jd-job-title']",
        companyName:"div[class*='EmployerProfile_employerNameHeading'] > h4",
        location:"div[data-test='location']",
        jobDescription:"div[class*='JobDetails_jobDescription']",
    },
    welcometothejungle:{
        jobTitle:"h2.wui-text",
        companyName:"#the-company-section > div > div:nth-child(2) > div:nth-child(1) > a > div > span",
        location:"#the-company-section > div > div:nth-child(2) > div:nth-child(7) > a > span, #the-company-section > div > div:nth-child(2) > div:nth-child(7) > a > span, a[href*='http://maps.google.com/'] > span.wui-text > span",
        jobDescription:"div[data-testid='job-section-description']",
    },
    monster:{
        jobTitle:"h2[data-testid='jobTitle']",
        companyName:"li[data-testid='company']",
        location:"li[data-testid='jobDetailLocation']",
        jobDescription:"div[data-testid='svx-description-container-inner'] > div",
    },
};
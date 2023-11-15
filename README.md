****** ECHO *******


LINK to Deployed version: https://main.d11izrd17dq8t7.amplifyapp.com/


## Frontend Localhost Setup Guide ##

Summary:

This is a setup guide on how to run the frontend application on your localhost.


1. Prerequisites

    a. NODE.JS. If not installed, download from here: https://nodejs.org/en/download

    b. npm packet manager. If not installed, install following this guide: https://docs.npmjs.com/downloading-and-installing-node-js-and-npm

    c. Your code editor of choice (We have used Visual Studio Code. VS Code can be downloaded at: https://code.visualstudio.com/download )


2. Running the web app locally

    The frontend of Echo relies heavily on API calls from our endpoints. If running the project locally follow these steps:

    a. Make sure the pre-requisites specified above are met

    b. Run the backend app (follow the backend setup guide provided)

    c. Open the .env file in your code editor and ensure that the REACT_APP_BASEURL variable is set to http://localhost:4000/, and the other options is commented out.

    d. Run the command 'npm install' to install any missing dependency

    e. Run the command 'npm start' to run the app
    
    e. The app will be running locally on port 3000

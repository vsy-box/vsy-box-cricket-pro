const axios = require('axios');

async function test() {
    try {
        console.log("Fetching rules...");
        // Since we are running outside the browser without a token, we might get 401. 
        // We can just bypass Auth or test mongoose directly again?
    } catch(e) {}
}
test();

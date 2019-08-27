// FetchJobcards.js

const URI = 'http://localhost:8000';

export default {
    async fetchJobcards() {
        try {
                let response = await fetch(URI + '/api/jobcards');
                let responseJsonData = await response.json();
                return responseJsonData;
            }
        catch(e) {}
    }
}
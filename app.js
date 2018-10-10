(function() {

    //// Http request for top stories list
    let topStoriesUrl = 'https://cors-anywhere.herokuapp.com/https://hacker-news.firebaseio.com/v0/topstories.json'

    fetch(topStoriesUrl)
    .then(handleError)
    .then(parseJSON)
    .then(requestArticles)
    .catch(displayError)

    function handleError(response) {
        if(!response.ok) {
            throw Error(response.status);;
        }
        return response;
    };

    function parseJSON(response) {
        return response.json();
    };

    function requestArticles(data) {
        console.log(data);
        
    };

    function displayError(error) {
        console.log(error + ' from displayError function.');
    };

})();
    

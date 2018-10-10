
// Tempo
const data = {};

(function() {


    //// Http request for top stories list
    let topStoriesUrl = 'https://cors-anywhere.herokuapp.com/https://hacker-news.firebaseio.com/v0/topstories.json'

    fetch(topStoriesUrl)
    .then(handleError)
    .then(parseJSON)
    .then(saveArticleIDs)
    .then(requestArticle)
    .catch(displayError)

    function requestArticle(list, startIdx = 0, endIdx = 5) {
        
        for(var i = startIdx; i < endIdx; i++) {
            let articleUrl = `
                https://cors-anywhere.herokuapp.com/https://hacker-news.firebaseio.com/v0/item/${data.IDs[i]}.json?print=pretty
                `;

            // For the reference in the future
            if(!data.articles[data.IDs[i]]) {
                data.articles[data.IDs[i]] = null;
            }

            fetch(articleUrl)
            .then(handleError)
            .then(parseJSON)
            .then(saveArticles)

        }

    };

    //// reusable functions
    function handleError(response) {
        if(!response.ok) {
            throw Error(response.status);;
        }
        return response;
    };

    function parseJSON(response) {
        return response.json();
    };

    function displayError(error) {
        console.log(error + ' from displayError function.');
    };

    //// request for top-stories
    function saveArticleIDs(ids) {
        data.IDs = ids;
        data.articles = {};
        data.htmlStr = {};
        return data.IDs;
    };

    //// request for separate articles
    function saveArticles(article) {
        data.articles[article.id] = article;
    }


})();
    

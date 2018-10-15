
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

    let start, end;
    function requestArticle(list, startIdx = 0, endIdx = 5) {
        start = startIdx;
        end = endIdx;

        renderLoader();

        for(var i = startIdx; i < endIdx; i++) {
            let articleUrl = `
                https://cors-anywhere.herokuapp.com/https://hacker-news.firebaseio.com/v0/item/${data.IDs[i]}.json?print=pretty
                `;

            fetch(articleUrl)
            .then(handleError)
            .then(parseJSON)
            .then(saveArticles)
            .then(createHtmlStr)
            .then(renderArticles)

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

    function renderLoader(type) {
        let position;
        if(type === 'small') { type = 'loader-small'; position = '.buttons'} 
        else { type = 'loader'; position = '.articles-container'}

        const loader = `
            <div class="${type}">
                <svg>
                    <use href="img/icons.svg#icon-cw"></use>
                </svg>
            </div>`;
        
        document.querySelector(position).innerHTML = loader;
    };

    //// request for top-stories
    function saveArticleIDs(ids) {
        data.IDs = ids;
        data.articles = {};
        data.htmlStr = [];
        return data.IDs;
    };

    //// request for separate articles
    function saveArticles(article) {
        let idx = data.IDs.indexOf(article.id);
        data.articles[article.id] = article;
        data.articles[article.id].idx = idx;
        return article;
    };

    function createHtmlStr(article) {
        data.htmlStr[article.idx] = `
            <div class="article">
                <div class="title">
                    <span class="ranking">${article.idx + 1}.</span>
                    <a href="#" class="arrow"></a>
                    <a href="${article.url}"><h3 class="article-title">${article.title}</h3></a>
                    <div class="link">(<span class="url">${article.url}</span>)</div>
                </div>
                <div class="extra-info">
                    <span class="point">${article.score} points</span>
                    <span class="by">by ${article.by} </span>
                    <span class="time">${article.time} |</span>
                    hide |
                    <span class="comments">${article.descendants} comments </span> 
                </div>
            </div>`;
    };

    function renderArticles() {
        let htmlContent;
        if(data.htmlStr.length === end) {
            htmlContent = data.htmlStr.slice(start, end).reduce((acc,cur) => {
                return acc + cur;
            });

            document.querySelector('.articles-container').innerHTML = htmlContent;
        }
    };

})();
    

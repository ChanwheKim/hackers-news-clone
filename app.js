const data = {};

(function() {

    //// Http request for top stories list
    let topStoriesUrl = 'https://hacker-news.firebaseio.com/v0/topstories.json'

    axios(topStoriesUrl)
    .then(saveArticleIDs)
    .then(requestArticle)
    .catch(handleErrors)

    renderLoader();
    
    let start, end, requestSent = true, count = 0;

    function requestArticle(list, startIdx = 0, endIdx = 30) {
        start = startIdx;
        end = startIdx + endIdx;

        for(let i = start; i < end; i++) {
            let articleUrl = `
                https://hacker-news.firebaseio.com/v0/item/${data.IDs[i]}.json?print=pretty
                `;

            axios(articleUrl)
            .then(saveArticles)
            .then(createHtmlStr)
            .then(renderArticles)

        }
    };

    //// reusable functions
    function handleErrors(err) {
        if(err.response) {
            console.log('Error with Response', err.response.status);
        } else if(err.request) {
            console.log('Error with Request ');
        } else {
            console.log('Error', err.message);
        }
        alert('Something wrong with network!');
        console.log(err);
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

    function clearLoader() {
        let loader = document.querySelector(".loader");
        if(!loader) {loader = document.querySelector(".loader-small");}
        if(loader) {loader.parentElement.removeChild(loader);}
    };

    //// request for top-stories
    function saveArticleIDs(ids) {
        data.IDs = ids.data;
        data.articles = {};
        data.htmlStr = [];
        return data.IDs;
    };

    //// request for separate articles
    function saveArticles(response) {
        let article = response.data;
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
                    <div class="link">(<span class="url">${formatURL(article.url)}</span>)</div>
                </div>
                <div class="extra-info">
                    <span class="point">${article.score} points</span>
                    <span class="by">by ${article.by} </span>
                    <span class="time">${formatTime(article.time)} |</span>
                    hide |
                    <span class="comments">${article.descendants} comments </span> 
                </div>
            </div>`;
    };

    function renderArticles() {
        let htmlContent;
        count++;

        if(data.htmlStr.length === end && count === end) {
            console.log('Appending', data);
            htmlContent = data.htmlStr.slice(start, end).reduce((acc,cur) => {
                return acc + cur;
            });

            clearLoader();
            
            document.querySelector('.articles-container').insertAdjacentHTML('beforeend',htmlContent);

            if(!requestSent) {requestSent = true;}
        }
    };

    function formatURL(str) {
        if(!str) return '---';
        return str.replace('http://', '').replace('https://', '').replace('www.', '').split('/')[0];
    };

    function formatTime(unix) {
        let time = new Date() - new Date(unix * 1000);
        let hour = 1000 * 60 * 60;
        let minutes = 1000 * 60;

        if(time >= hour) {
            const hours = Math.floor(time / hour);
            return hours === 1? `${hours} hour ago` : `${hours} hours ago`
        } else if(time < hour) {
            const min = Math.floor(time / minutes);
            return min === 1? `${min} minute ago` : `${min} minutes ago`
        }
    };

    document.addEventListener('scroll', function() {
        let contentHeight = document.querySelector('.articles-container').offsetHeight;
        let yOffset = window.pageYOffset;
        let vpheight = window.innerHeight;
        let paginationHeight = contentHeight - vpheight - 100 - 30;

        if(yOffset > 200 && yOffset >= paginationHeight) {
            renderLoader('small');
            if(requestSent) {
                requestSent = false;
                requestArticle(data.IDs, end, 7);
                console.log('extra request sent!!');
            }
        }
    })

})();
    

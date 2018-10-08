(function() {

    topStoriesRequest(15);

    function topStoriesRequest(num) {

        let url = 'https://cors-anywhere.herokuapp.com/https://hacker-news.firebaseio.com/v0/topstories.json'
        
        let req = new XMLHttpRequest();
        req.onreadystatechange = function() {
            if(req.readyState === 4 && req.status === 200) {
                let IDs = JSON.parse(req.responseText);
                let startIdx = 0;
                let articles = {};

                requestArticles(startIdx, num);
                
                function requestArticles(start, add) {
                    let endIdx = start + add;

                    for(var i = start; i < endIdx; i++) {

                        let reqArticle = new XMLHttpRequest();
                        reqArticle.onreadystatechange = function() {
                            if(reqArticle.readyState === 4 && reqArticle.status === 200) {
                                let article = JSON.parse(reqArticle.responseText);
                        
                                // Save articles into data
                                articles[article.id] = article;

                                if(Object.keys(articles).length === endIdx) {
                                    let htmlContent = '';
                                    
                                    // Create html articles
                                    for(let i = startIdx; i < endIdx; i++) {
                                        htmlContent += createArticle(articles[IDs[i]], i);
                                    }

                                    // Prepare UI for rendering
                                    document.querySelector('.articles').classList.add('active');
                                    document.querySelector('.footer').classList.add('active');
                                    document.querySelector('.btn-inline').classList.remove('in-active');
                                    clearLoader();
                    
                                    // Render articles
                                    document.querySelector('.btn-inline').insertAdjacentHTML('beforebegin', htmlContent);

                                    // Update startIdx as endIdx
                                    startIdx = endIdx;
                                }

                            }
                        };
    
                        reqArticle.onerror = function(err) {
                            console.log('Error ', err);
                        };
    
                        reqArticle.open('GET', `https://cors-anywhere.herokuapp.com/https://hacker-news.firebaseio.com/v0/item/${IDs[i]}.json?print=pretty`);
                        reqArticle.send();

                    }
                };
                document.querySelector('.btn-inline').addEventListener('click', function(e) {
                    e.currentTarget.classList.add('in-active');
                    renderLoader('small');
                    requestArticles(startIdx, 5);
                });
            }
        };

        req.onerror = function(err) {
            console.log('Error! ', err);
        };

        req.open('GET', url);
        req.send();
        renderLoader();

    }

    function createArticle(article, idx) {
        return `
            <div class="article">
                <div class="title">
                    <span class="ranking">${idx + 1}.</span>
                    <a href="#" class="arrow"></a>
                    <a href="${article.url}"><h3 class="article-title">${article.title}</h3></a>
                    <div class="link">(<span class="url">${formatUrl(article.url)}</span>)</div>
                </div>
                <div class="extra-info">
                    <span class="point">${article.score} points</span>
                    <span class="by">by ${article.by} </span>
                    <span class="time">${formatTime(article.time)} |</span>
                    hide |
                    <span class="comments">${article.descendants} comments </span> 
                </div>
            </div>`
    };

    function formatUrl(str) {
        if(str === undefined) {return '---';}
        let url = str.replace('http://', '');
        url = url.replace('https://', '');
        url = url.split('/')[0];
        if(url.split('.')[0] === 'www') {
            url = url.split('.').slice(1).join('.');
        }
        return url;
    };

    function formatTime(unix) {
        let time = new Date() - new Date(unix * 1000);
        if(time >= 1000 * 60 * 60) {
            const hours = Math.floor(time / (1000 * 60 * 60));
            return hours === 1? `${hours} hour ago` : `${hours} hours ago`
        } else if(time < 1000 * 60 * 60) {
            const min = Math.floor(time / (1000 * 60));
            return min === 1? `${min} minute ago` : `${min} minutes ago`
        }
    };

    function renderLoader(type) {
        var position;
        if(type === 'small') {
            type = 'loader-small';
            position = 'beforeend';
        } else {
            type = 'loader';
            position = 'afterend';
        }
    
        const loader = `
            <div class="${type}">
                <svg>
                    <use href="img/icons.svg#icon-cw"></use>
                </svg>
            </div>`;
    
        document.querySelector('.articles').insertAdjacentHTML(position, loader);
    };

    function clearLoader() {
        let loader = document.querySelector(".loader");
        if(!loader) {
            loader = document.querySelector(".loader-small");
        }
        loader.parentElement.removeChild(loader);
    };

})();
    

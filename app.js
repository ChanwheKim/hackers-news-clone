(function() {

    topStoriesRequest(5);

    function topStoriesRequest(num) {

        let url = 'https://cors-anywhere.herokuapp.com/https://hacker-news.firebaseio.com/v0/topstories.json'
        
        let req = new XMLHttpRequest();
        req.onreadystatechange = function() {
            if(req.readyState === 4 && req.status === 200) {
                let IDs = JSON.parse(req.responseText);
                let startIdx = 0;

                requestArticles(startIdx, num);
                
                function requestArticles(start, add) {
                    let endIdx = start + add;

                    for(var i = start; i < endIdx; i++) {

                        let reqArticle = new XMLHttpRequest();
                        reqArticle.onreadystatechange = function() {
                            if(reqArticle.readyState === 4 && reqArticle.status === 200) {
                                console.log(reqArticle.responseText);
                            }
                        };
    
                        reqArticle.onerror = function(err) {
                            console.log('Error ', err);
                        };
    
                        reqArticle.open('GET', `https://cors-anywhere.herokuapp.com/https://hacker-news.firebaseio.com/v0/item/${IDs[i]}.json?print=pretty`);
                        reqArticle.send();

                    }
                };
            }
        };

        req.onerror = function(err) {
            console.log('Error! ', err);
        };

        req.open('GET', url);
        req.send();

    }

})();
    

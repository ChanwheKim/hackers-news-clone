(function() {

    topStoriesRequest();

    function topStoriesRequest() {

        var url = 'https://cors-anywhere.herokuapp.com/https://hacker-news.firebaseio.com/v0/topstories.json'
        
        var req = new XMLHttpRequest();
        req.onreadystatechange = function() {
            if(req.readyState === 4 && req.status === 200) {

                console.log(JSON.parse(req.responseText));

            }
        };

        req.onerror = function(err) {
            console.log('Error! ', err);
        };

        req.open('GET', url);
        req.send();

    }

})();
    

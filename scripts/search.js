const baseUrl = "https://baas.kinvey.com/";
const appId = "kid_BJxMVzffl";
const username = "az";
const userpass = "123";
const base64 = btoa(username + ":" + userpass);
const authHeaders = {"Authorization":"Basic " + base64};

// let buttonClose = $('<div id="close"><button id="closeButton" type="button" onclick="closeResults(this)">X</button></div>');
// $('#results').prepend(buttonClose);

$(document).ready(function () {

    $('#results').hide();
    $('#closeButton').hide();
});


function search() {
    $('#results').hide();

    let wordForSearch = $('input[name=keyword]').val();
    let valid = validateWord(wordForSearch);

    if(valid){
        $('#results').fadeIn(4000);
        $('#closeButton').fadeIn(4000);
        let loadingDiv = $('<div class="loading">Loading</div>');
        $('#results').append(loadingDiv);


        $.ajax({
            method: "GET",
            //url: baseUrl + "appdata/" + appId + `/books/?query={"title":"${wordForSearch}"}`,
            url: baseUrl + "appdata/" + appId + `/books/?query={"$or":[{"title":{"$regex":"^${wordForSearch}"}},{"description":{"$regex":"^${wordForSearch}"}},{"author":{"$regex":"^${wordForSearch}"}}]}`,
            headers: authHeaders,
            success: listPosts,
            error: listErrors

        });


        function listPosts(searchResult) {

            $('#results').empty();
            let container = $('#results');

            searchResult.sort((a,b) => a._kmd.lmt - b._kmd.lmt);
            renderView(searchResult, container);
        }

    }





}


    function listErrors(responseError) {
        let divNoResults = $('<div class="nothingFound"></div>').text(responseError.statusText);
        $('#results').empty();
        $('#results').append(divNoResults);
    }



    function renderView(searchResult, container) {
        if(searchResult.length == 0){
            let divNoResults = $('<div class="nothingFound"></div>').text("Sorry :( Nothing found. Try another word");
                container.append(divNoResults);


        }
        for(let obj of searchResult){

            let post = $('<div class="resultDiv">');

            // let divNoResults = $('<div class="nothingFound"></div>').text("Sorry :( Nothing found. Try another word");
            // container.append(divNoResults);


            let title = obj.title;
            let description = obj.description;
            let author = obj.author;

            let divTitle = $('<div class="title"></div>').text("Title: " + title);
            let divDescr = $('<div class="description"></div>').text("Description: " + description);
            let divAuthor = $('<div class="author"></div>').text("Author: " + author);

            post.append(divTitle, divAuthor, divDescr);
            post.appendTo(container);




        }
    }

    
    
    function validateWord(word) {
        if(word.length == 0 || word.trim() == 0){
            alert("Word cannot be empty");
            return;
        }

        return true;
        
    }


    function closeResults(button) {
        $('#results').fadeOut(3000);
        $(button).fadeOut(3000);
    }


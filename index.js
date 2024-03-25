"use strict";
// this script fetches the paths to the blog entries in my repo
// it's pretty straight forward, it helps me not have to manually 
// edit the html every time I make a new blog entry

const repo_url = "https://api.github.com/repos/juacu7340/juacu7340.github.io/contents/";
const content_div = document.querySelector("#content");

// this recursive function generates the list elements for each file
// in the repo (explores folders too), using the GitHub Rest API
async function gen(file_json) {
    if (file_json.type === "dir") {
        const response = await fetch(repo_url + file_json.name);
        const data_json = await response.json();
        
        let html = "";
        for (let element_json of data_json) {
            html += await gen(element_json);
        }
        return html;
    } else if (file_json.type === "file") {
        if (!file_json.name.endsWith(".html")) return "";
        return `<li><h1><a href="./${file_json.path}">${file_json.path}</a> <a href="${file_json.download_url}">(raw)</a></h1></li>`;
    } else {
        return "";
    }
}
    
// this function starts the code chain and places the dynamic list
// elements inside a div with id "content"
(async () => {
    const response = await fetch(repo_url);
    const data = await response.json();
    let htmlString = '<ul>';

    for (let file of data) {
        htmlString += await gen(file);
    }

    htmlString += '</ul>';
    content_div.innerHTML = htmlString;
})();
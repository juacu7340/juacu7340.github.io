"use strict";
// this script fetches the paths to the blog entries in my repo
// it's pretty straight forward, it helps me not have to manually 
// edit the html every time I make a new blog entry

const user = "juacu7340";
const repo_url = `https://api.github.com/repos/${user}/${user}.github.io/contents/`;
const content_div = document.querySelector("#content");

const Entry = {
    date: "",
    name: "",
    path: "",
    download_url: "",
};

// this recursive function generates the list elements for each file
// in the repo (explores folders too), using the GitHub Rest API
async function gen(file_json) {
    if (file_json.type === "dir") {
        const response = await fetch(repo_url + file_json.name);
        const data_json = await response.json();
        
        let html = [];
        for (let element_json of data_json) {
            var foo = await gen(element_json);
            html = [...html, ...foo];
        }
        return html;
    } else if (file_json.type === "file") {
        if (!file_json.name.endsWith(".html") || file_json.name === "index.html") return [];

        const foo = []
        const entry = Object.create(Entry);

        entry.date = file_json.name.slice(0,8);
        entry.name = file_json.name;
        entry.path = file_json.path;
        entry.download_url = file_json.download_url;
        foo.push(entry);

        return foo;
    } else {
        return [];
    }
}
    
// this function starts the code chain and places the dynamic list
// elements inside a div with id "content"
(async () => {
    const response = await fetch(repo_url);
    const data = await response.json();

    let arr = [];
    for (let file of data) {
        const foo = await gen(file);
        arr = [...arr, ...foo];
    }

    console.log(arr);
    arr.sort(((a,b) => a.date < b.date));
    console.log(arr);

    let htmlString = '<ul>';
    arr.forEach((element) => {
        htmlString += `<li><h1><a href="./${element.path}">${element.path}</a> <a href="${element.download_url}">(raw)</a></h1></li>`;
    });
    htmlString += '</ul>';

    content_div.innerHTML = htmlString;
})();
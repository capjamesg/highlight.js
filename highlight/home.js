// add list items for all items in chrome.browser.storage.sync.set({ 'all_components': all_components }

function create_home () { 
    var list = document.getElementById('highlight-list');

    browser.storage.local.get('all_components', function (data) {
        console.log(data.all_components);
        var all_components = data.all_components;
        for (var i = 0; i < all_components.length; i++) {
            var item = document.createElement('li');
            var url = document.createElement('a');
            url.href = all_components[i].page_url;
            // get page_url domain
            var url_domain = all_components[i].page_url.match(/:\/\/(.[^/]+)/)[1];
            url.textContent = all_components[i].component
            item.appendChild(url);
            // add domain
            var domain = document.createElement('span');
            domain.textContent = ' (' + url_domain + ')';
            item.appendChild(domain);
            list.appendChild(item);
        }
    });

    // create button that allows export to json
    var export_button = document.createElement('button');
    export_button.textContent = 'Export to JSON';
    export_button.id = 'export-button';
    export_button.addEventListener('click', function () {
        browser.storage.local.get('all_components', function (data) {
            var all_components = data.all_components;
            var json = JSON.stringify(all_components);
            var blob = new Blob([json], { type: 'application/json' });
            var url = URL.createObjectURL(blob);
            var a = document.createElement('a');
            a.href = url;
            a.download = 'highlight.json';
            a.click();
        });
    });
    list.appendChild(export_button);

    // add attribution
    var powered_by = document.createElement('p');
    powered_by.textContent = 'Powered by highlight.js. ';
    powered_by.classList.add('powered-by');
    // add link to github
    var link = document.createElement('a');
    link.href = 'https://github.com/capjamesg/highlight.js';
    link.textContent = '(View Source)';
    powered_by.appendChild(link);
    list.appendChild(powered_by);
}

create_home();
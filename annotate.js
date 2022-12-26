// Note: This function is case sensitive.

var all_components = [];

function create_annotation_count () {
    // create box that shows active annotations
    var annotation_count = document.createElement('div');
    annotation_count.id = 'annotation-count';

    // create h3 that says "Annotations"
    var h3 = document.createElement('h3');
    h3.textContent = 'Annotations';
    h3.classList.add("annotation_h3");
    annotation_count.appendChild(h3);

    // add to page
    document.body.appendChild(annotation_count);
    // create count p
    var count = document.createElement('p');
    count.textContent = '0';
    count.id = 'annotation-count-number';
    annotation_count.appendChild(count);
    // add button that changes url
    var button = document.createElement('button');
    button.textContent = 'Copy URL';
    button.id = 'copy-url-button';
    annotation_count.appendChild(button);
}

function get_selected_text () {
    // get all selected text and compose it into a url
    var selected_text = window.getSelection().toString();

    if (selected_text === '' || !selected_text) {
        return;
    }

    all_components.push(selected_text);

    // update annotation count
    var annotation_count = document.getElementById('annotation-count-number');
    
    if (annotation_count.textContent === '0') {
        annotation_count.textContent = '1 annotation';
    } else {
        annotation_count.textContent = all_components.length + ' annotations';
    }

    change_url();
    annotate();
}

// listen for double click
var command_mode = false;

function trigger_command_mode () {
    // document.addEventListener('dblclick', get_selected_text);
    // if user drags over and highlights text, add to list
    document.addEventListener('mouseup', function () {
        if (window.getSelection().toString()) {
            get_selected_text();
        }
    });
    create_annotation_count();

    document.getElementById('copy-url-button').addEventListener('click', function () {
        change_url();
        navigator.clipboard.writeText(window.location.href);
    });

    // if user presses enter, change
    document.addEventListener('keydown', function (event) {
        if (event.keyCode === 13) {
            change_url();
        }
    });
}

// if control + k is pressed, enter command mode
document.addEventListener('keydown', function (e) {
    if (e.keyCode === 75 && e.ctrlKey && !command_mode) {
        trigger_command_mode();
    } else if (e.keyCode === 75 && e.ctrlKey && command_mode) {
        // document.removeEventListener('dblclick', get_selected_text);
        document.removeEventListener('mouseup', get_selected_text);
        document.getElementById('annotation-count').remove();
        command_mode = false;
    }
});

function change_url () {
    // remove duplicates
    all_components = [...new Set(all_components)];

    // compose url
    var url = window.location.href + '#w=t,#text=' + all_components.join(',#text=');

    // remove current fragment
    url = url.replace(window.location.hash, '');

    // change url
    window.location.href = url;
}
// on full dom

function remove_annotation (item) {
    // update annotation count
    var item_text = item.target.textContent;
    all_components.splice(all_components.indexOf(item_text), 1);

    console.log(all_components)

    var annotation_count = document.getElementById('annotation-count-number');
    
    if (annotation_count.textContent === '1 annotation') {
        annotation_count.textContent = '0';
    } else {
        annotation_count.textContent = all_components.length + ' annotations';
    }

    // remove item
    item.target.style.backgroundColor = 'transparent';
    change_url();
}

function annotate () {
    if (window.location.hash) {
        // remove # from the beginning and replace + with spaces
        var hash = window.location.hash.substring(1).replace(/\+/g, " ");

        // split hash by ,
        var fragments = hash.split(',');

        for (var fragment of fragments) {
            // replace text= with nothing
            var original_fragments = fragment;
            fragment = fragment.replace('#text=', '').replace('text=', '');
            // decode
            fragment = decodeURIComponent(fragment);

            
            // remove all symbols
            // fragment = fragment.replace(/[^a-zA-Z0-9]/g, "");

            var paragraph = document.getElementById(fragment);

            if (paragraph) {
                paragraph.classList.add('highlight');
                // paragraph.scrollIntoView();
            }

            var all_paragraphs = document.getElementsByTagName('p');
            var all_lists = document.getElementsByTagName('li');

            for (var p of all_paragraphs) {
                if (p.textContent.includes(fragment)) {
                    // only highlight selected words
                    var new_span = document.createElement('span');
                    new_span.style.backgroundColor = '#D593FF';
                    // add double click event
                    new_span.textContent = fragment;
                    // get index of  fragments length
                    new_span.id = fragments.indexOf(original_fragments);

                    p.innerHTML = p.innerHTML.replace(fragment, new_span.outerHTML);

                    var new_span = document.getElementById(fragments.indexOf(original_fragments));

                    new_span.addEventListener('click', remove_annotation);
                }
            }

            for (var li of all_lists) {
                // urlencoded
                if (li.textContent.includes(decodeURIComponent(fragment))) {
                    var span = document.createElement('span');
                    span.style.backgroundColor = '#D593FF';
                    span.textContent = decodeURIComponent(fragment);
                    li.innerHTML = li.innerHTML.replace(decodeURIComponent(fragment), span.outerHTML);
                }
            }
        }
    }
}

// on domload
document.addEventListener('DOMContentLoaded', function () {
    if (window.location.hash) {
        annotate();
    }
});
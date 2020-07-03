var root = null;
var useHash = true; // Defaults to: false
var hash = '#!'; // Defaults to: '#'
var router = new Navigo(root, useHash, hash);




function nuse() {
    getPage("nuse.html", "main");
}

function digramas() {
    //var t = 
    var t = function() {

        loadScript('f406bd055db50f8b225197b05684c84c', 'cats');
        console.log("HOLA")
        loadScript('7aed1a6f403c442d33bc1e9bff288e5e', 'dogs');
    }
    getPage2("diagramas.html", "posts", t);

    //setTimeout(function(){ loadScript('7aed1a6f403c442d33bc1e9bff288e5e'); }, 1000);

}

function git() {
    getPage("git.html", "main");
}

function getMenu() {
    getPage("menu.html", "main");
}

function getLogin() {
    getPage("login.html", "main");
}

function codesanbox() {
    getPage("codesanbox.html", "main");
}

function getPage2(file, id, myfunction) {
    var request = new XMLHttpRequest();
    request.open('GET', file, true);

    request.onload = function() {
        if (this.status >= 200 && this.status < 400) {
            // Success!
            var resp = this.response;
            var elem = document.getElementById(id);
            elem.innerHTML = resp;
            myfunction();




        } else {
            // We reached our target server, but it returned an error

        }
    };

    request.onerror = function() {
        // There was a connection error of some sort
    };

    request.send();
}

function getPage(file, id) {
    var request = new XMLHttpRequest();
    request.open('GET', file, true);

    request.onload = function() {
        if (this.status >= 200 && this.status < 400) {
            // Success!
            var resp = this.response;
            var elem = document.getElementById(id);
            elem.innerHTML = resp;


        } else {
            // We reached our target server, but it returned an error

        }
    };

    request.onerror = function() {
        // There was a connection error of some sort
    };

    request.send();
}

function makeDiagramas() {
    var ctx = document.getElementById('myChart').getContext('2d');
    var chart = new Chart(ctx, {
        // The type of chart we want to create
        type: 'line',

        // The data for our dataset
        data: {
            labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
            datasets: [{
                label: 'My First dataset',
                backgroundColor: 'rgb(255, 99, 132)',
                borderColor: 'rgb(255, 99, 132)',
                data: [0, 10, 5, 2, 20, 30, 45]
            }]
        },

        // Configuration options go here
        options: {}
    });
}

function adjustIframeSize(newHeight) {


    if (newHeight == 387) {

        var i = document.getElementById("catsframe");
        i.style.height = parseInt(newHeight + 10) + "px";
        console.log("size adjusted", newHeight);
    } else {




        var i = document.getElementById("dogsframe");
        i.style.height = parseInt(newHeight + 10) + "px";
        console.log("size adjusted", newHeight);
    }

}


function loadScript(gitID, divID) {
    var iframeDiv = divID + 'frame';

    localStorage.setItem('iframeDiv', iframeDiv);

    var gistFrame = document.createElement("iframe");
    gistFrame.setAttribute("width", "100%");
    gistFrame.id = iframeDiv;

    var zone = document.getElementById(divID);
    zone.innerHTML = "";
    zone.appendChild(gistFrame);

    // Create the iframe's document
    var gistFrameHTML = '<html><body onload="parent.adjustIframeSize(document.body.scrollHeight)"><scr' + 'ipt type="text/javascript" src="https://gist.github.com/' + gitID + '.js"></sc' + 'ript></body></html>';



    console.log(gistFrameHTML);

    // Set iframe's document with a trigger for this document to adjust the height
    //var gistFrameDoc = gistFrame.document;

    if (gistFrame.contentDocument) {
        gistFrame.document = gistFrame.contentDocument;
    } else if (gistFrame.contentWindow) {
        gistFrame.document = gistFrame.contentWindow.document;
    }

    gistFrame.document.open();
    gistFrame.document.writeln(gistFrameHTML);
    gistFrame.document.close();
}


function ajustarFrame(newHeight) {
    var i = document.getElementById("iframeDiv");
    i.style.height = parseInt(newHeight + 10) + "px";
    console.log("size adjusted", newHeight);
}


function getMisDatos() {

    var gistFrame = document.createElement("iframe");
    gistFrame.setAttribute("width", "100%");
    gistFrame.setAttribute("height", "100%");
    gistFrame.id = 'iframeDiv';

    var zone = document.getElementById("main");
    zone.innerHTML = "";
    zone.appendChild(gistFrame);

    var gistFrameHTML = '<html><body onload="parent.ajustarFrame(document.body.scrollHeight)"><scr' + 'ipt type="text/javascript" src="https://gist.github.com/' + 'f406bd055db50f8b225197b05684c84c' + '.js"> </sc' + 'ript></body></html>';

    if (gistFrame.contentDocument) {
        gistFrame.document = gistFrame.contentDocument;
    } else if (gistFrame.contentWindow) {
        gistFrame.document = gistFrame.contentWindow.document;
    }
    gistFrame.document.open();
    gistFrame.document.writeln(gistFrameHTML);
    gistFrame.document.close();
}


function ajustarFrame2(newHeight, div) {
    console.log(div);
    var i = document.getElementById("iframeDiv2");
    i.style.height = parseInt(newHeight + 10) + "px";
    console.log("size adjusted", newHeight);
}

var ssss = 89;

function getMisDatos2(divID) {


    var id = 'ssss';

    var gistFrame = document.createElement("iframe");
    gistFrame.setAttribute("width", "100%");
    gistFrame.setAttribute("height", "100%");
    gistFrame.id = 'iframeDiv2';

    var zone = document.getElementById(divID);
    zone.innerHTML = "";
    zone.appendChild(gistFrame);

    var gistFrameHTML = '<html><body onload="parent.ajustarFrame2(document.body.scrollHeight )"><scr' + 'ipt type="text/javascript" src="https://gist.github.com/' + 'f406bd055db50f8b225197b05684c84c' + '.js"> </sc' + 'ript></body></html>';

    console.log(gistFrameHTML);
    if (gistFrame.contentDocument) {
        gistFrame.document = gistFrame.contentDocument;
    } else if (gistFrame.contentWindow) {
        gistFrame.document = gistFrame.contentWindow.document;
    }
    gistFrame.document.open();
    gistFrame.document.writeln(gistFrameHTML);
    gistFrame.document.close();
}


function newTest() {
    var html_string = '<html><body><scr' + 'ipt type="text/javascript" src="https://gist.github.com/' + 'f406bd055db50f8b225197b05684c84c' + '.js"> </sc' + 'ript></body></html>';
    document.getElementById('kilo').src = "data:text/html;charset=utf-8," + escape(html_string);
}


function replaceIframeContent() {

    var iframeElement = document.getElementById("kilo");
    iframeElement.src = "about:blank";
    iframeElement.contentWindow.document.open();
    iframeElement.contentWindow.document.write(newHTML);
    iframeElement.contentWindow.document.close();
}

function test() {
    fetch('https://api.github.com/repos/agalea91/crypto-monetary-base/contents/charts/relative_coin_supply_pct_estimates.html')
        .then(function(response) {
            return response.json();
        }).then(function(data) {
            iframe = document.getElementById('github-iframe');
            iframe.src = 'data:text/html;base64,' + encodeURIComponent(data['content']);
        });
}


var current_page = 1;
var records_per_page = 6;


function prevPage() {
    if (current_page > 1) {
        current_page--;
        changePage(current_page);
    }
}

function nextPage() {
    if (current_page < numPages()) {
        current_page++;
        changePage(current_page);
    }
}

function changePage(page) {
    var btn_next = document.getElementById("btn_next");
    var btn_prev = document.getElementById("btn_prev");
    var listing_table = document.getElementById("posts");
    var page_span = document.getElementById("page");

    // Validate page
    if (page < 1) page = 1;
    if (page > numPages()) page = numPages();

    listing_table.innerHTML = '';
    var template = '';

    for (var i = (page - 1) * records_per_page; i < (page * records_per_page) && i < t.data.length; i++) {
        template += makeTemplate(t.data[i].title, t.data[i].url);
    }
    listing_table.innerHTML += template;
    page_span.innerHTML = page + "/" + numPages();

    if (page == 1) {
        btn_prev.style.visibility = "hidden";
    } else {
        btn_prev.style.visibility = "visible";
    }

    if (page == numPages()) {
        btn_next.style.visibility = "hidden";
    } else {
        btn_next.style.visibility = "visible";
    }
}

function numPages() {
    return Math.ceil(t.data.length / records_per_page);
}



function beginer() {
    Swal.fire(
        'Principiantes',
        'Guias en las cuales no necesitan conocimientos previos. Explicación a detalle de los conceptos mencionados.',
        'question'
    );
}

function intermediate() {
    Swal.fire(
        'Intermedios',
        'Guias en las cuales necesitas conocimientos previos aunque no necesarios.',
        'question'
    );
}

function advanced() {
    Swal.fire(
        'Avanzados',
        'Guias en las cuales se da por echo muchos de los conceptos mencionados.',
        'question'
    );
}

function makeTemplate(Titulo, url) {


    var fire1 = '<div onclick=beginer(); class="fire-beginer"> <div class="fire-left"> <div class="main-fire"></div> <div class="particle-fire"></div> </div> <div class="fire-main"> <div class="main-fire"></div> <div class="particle-fire"></div> </div> <div class="fire-right"> <div class="main-fire"></div> <div class="particle-fire"></div> </div> <div class="fire-bottom"> <div class="main-fire"></div> </div></div>';
    var fire2 = '<div onclick=intermediate(); class="fire-intermediate"> <div class="fire-left"> <div class="main-fire"></div> <div class="particle-fire"></div> </div> <div class="fire-main"> <div class="main-fire"></div> <div class="particle-fire"></div> </div> <div class="fire-right"> <div class="main-fire"></div> <div class="particle-fire"></div> </div> <div class="fire-bottom"> <div class="main-fire"></div> </div></div>';
    var fire3 = '<div onclick=advanced(); class="fire-advanced"> <div class="fire-left"> <div class="main-fire"></div> <div class="particle-fire"></div> </div> <div class="fire-main"> <div class="main-fire"></div> <div class="particle-fire"></div> </div> <div class="fire-right"> <div class="main-fire"></div> <div class="particle-fire"></div> </div> <div class="fire-bottom"> <div class="main-fire"></div> </div></div>';

    var template = '<div class="my-1 px-1 w-full md:w-1/2 lg:my-4 lg:px-4 lg:w-1/3">'
    template += '<article class="overflow-hidden rounded-lg shadow-lg">';
    template += '<a href=' + url + '><img alt="Placeholder" class="block h-auto w-full miImagen" src="images/prueba.jpg"></a>';
    template += '<header class="flex items-center justify-between leading-tight p-2 md:p-4">';
    template += '<h1 class="text-lg"><a class="no-underline hover:underline text-black" href=' + url + '> ' + Titulo + ' </a></h1>';
    template += '</header>';
    template += '<footer class="flex items-center justify-between leading-none p-2 md:p-4">';
    template += '<a target="_blank"  class="flex items-center no-underline hover:underline text-black" href="https://github.com/faustinoloeza">'
    template += '<img alt="Placeholder" class="block rounded-full miperfil" src="https://avatars0.githubusercontent.com/u/30273245?s=60&v=4">';
    template += '<p class="ml-2 text-sm">Faustinoloeza</p></a>';
    template += '<a class="no-underline text-grey-darker hover:text-red-dark" href="#"><span class="hidden">Like</span>' + fire2 + '</a>';
    template += '</footer> </article> </div>';
    return template;
}

function formatDate(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2)
        month = '0' + month;
    if (day.length < 2)
        day = '0' + day;

    return [year, month, day].join('-');
}

function progressbar() {
    var h = document.documentElement,
        b = document.body,
        st = 'scrollTop',
        sh = 'scrollHeight',
        progress = document.querySelector('#progress'),
        scroll;
    var scrollpos = window.scrollY;
    var header = document.getElementById("header");

    document.addEventListener('scroll', function() {

        /*Refresh scroll % width*/
        scroll = (h[st] || b[st]) / ((h[sh] || b[sh]) - h.clientHeight) * 100;
        progress.style.setProperty('--scroll', scroll + '%');

        /*Apply classes for slide in bar*/
        scrollpos = window.scrollY;

        if (scrollpos > 100) {
            header.classList.remove("hidden");
            header.classList.remove("fadeOutUp");
            header.classList.add("slideInDown");
        } else {
            header.classList.remove("slideInDown");
            header.classList.add("fadeOutUp");
            header.classList.add("hidden");
        }

    });
}



const loadJSON = (callback) => {
    let xobj = new XMLHttpRequest();
    xobj.overrideMimeType("application/json");
    xobj.open('GET', 'db.json', true);
    // Replace 'my_data' with the path to your file
    xobj.onreadystatechange = () => {
        if (xobj.readyState === 4 && xobj.status === 200) {
            // Required use of an anonymous callback 
            // as .open() will NOT return a value but simply returns undefined in asynchronous mode
            callback(xobj.responseText);
        }
    };
    xobj.send(null);
}

// get all data in form and return object
function getFormData(form) {
    var elements = form.elements;
    console.log(elements);
    var honeypot;

    var fields = Object.keys(elements).filter(function(k) {
        if (elements[k].name === "honeypot") {
            honeypot = elements[k].value;
            return false;
        }
        return true;
    }).map(function(k) {
        if (elements[k].name !== undefined) {
            return elements[k].name;
            // special case for Edge's html collection
        } else if (elements[k].length > 0) {
            return elements[k].item(0).name;
        }
    }).filter(function(item, pos, self) {
        return self.indexOf(item) == pos && item;
    });

    var formData = {};
    fields.forEach(function(name) {
        var element = elements[name];

        // singular form elements just have one value
        formData[name] = element.value;

        // when our element has multiple items, get their values
        if (element.length) {
            var data = [];
            for (var i = 0; i < element.length; i++) {
                var item = element.item(i);
                if (item.checked || item.selected) {
                    data.push(item.value);
                }
            }
            formData[name] = data.join(', ');
        }
    });

    // add form-specific values into the data
    formData.formDataNameOrder = JSON.stringify(fields);
    formData.formGoogleSheetName = form.dataset.sheet || "responses"; // default sheet name
    formData.formGoogleSendEmail = form.dataset.email || ""; // no email by default

    return {
        data: formData,
        honeypot: honeypot
    };
}

function handleFormSubmit(event) {
    event.preventDefault(); // we are submitting via xhr below
    var form = event.target;
    var formData = getFormData(form);
    var data = formData.data;

    console.log(data);
    // If a honeypot field is filled, assume it was done so by a spam bot.
    if (formData.honeypot) {
        return false;
    }

    //disableAllButtons(form);
    var url = form.action;
    var xhr = new XMLHttpRequest();
    xhr.open('POST', url);
    // xhr.withCredentials = true;
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4 && xhr.status === 200) {
            form.reset();
            alert("Mensaje enviado");
        }
    };
    // url encode form data for sending as post data
    var encoded = Object.keys(data).map(function(k) {
        return encodeURIComponent(k) + "=" + encodeURIComponent(data[k]);
    }).join('&');

    xhr.send(encoded);
}

function loadEventListenerToForm() {
    var form = document.getElementById('formulario');
    if (form.attachEvent) {
        form.attachEvent("submit", processForm);
    } else {
        form.addEventListener("submit", processForm);
    }
}


function disableAllButtons(form) {
    var buttons = form.querySelectorAll("button");
    for (var i = 0; i < buttons.length; i++) {
        buttons[i].disabled = true;
    }
}

function processForm(e) {
    if (e.preventDefault) e.preventDefault();
    handleFormSubmit(e);
    return false;
}
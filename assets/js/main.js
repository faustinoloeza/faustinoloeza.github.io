loadEventListenerToForm();

function loadEventListenerToForm() {
    var form = document.getElementById('formulario');
    if (form.attachEvent) {
        form.attachEvent("submit", processForm);
    } else {
        form.addEventListener("submit", processForm);
    }
}

function processForm(e) {
    if (e.preventDefault) e.preventDefault();
    handleFormSubmit(e);
    return false;
}

function handleFormSubmit(event) {
    event.preventDefault(); // we are submitting via xhr below
    var form = event.target;
    var formData = getFormData(form);
    var data = formData.data;
    Swal.fire(
        'Validating data',
        'Please wait a moment',
        'info'
    );
    // If a honeypot field is filled, assume it was done so by a spam bot.
    if (formData.honeypot) {
        return false;
    }

    var emailValidate = validateEmail(data.email);
    var validateNombre = valideteString(data.nombre.length, 5);
    var validateMensaje = valideteString(data.mensaje.length, 10);

    if (emailValidate.estatus && validateNombre.estatus && validateMensaje.estatus) {
        //disableAllButtons(form);
        var url = form.action;
        var xhr = new XMLHttpRequest();
        xhr.open('POST', url);
        //xhr.withCredentials = true;
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4 && xhr.status === 200) {
                form.reset();
                Swal.fire(
                    'E-mail sent',
                    'Message sent successfully.',
                    'success'
                );
            }
        };
        // url encode form data for sending as post data
        var encoded = Object.keys(data).map(function(k) {
            return encodeURIComponent(k) + "=" + encodeURIComponent(data[k]);
        }).join('&');

        xhr.send(encoded);
    } else {
        Swal.fire(
            'Email not sent',
            'Please verify the data. Remember we need a valid email and a minimum message of 10 characters.',
            'info'
        );
    }


}

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

function validateEmail(email) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    respuesta = re.test(String(email).toLowerCase());
    if (respuesta) {
        return {
            estatus: true
        };
    } else {
        return {
            estatus: false,
            mensaje: "email"
        };
    }
}

function valideteString(mensaje, tamanio) {
    if (mensaje >= tamanio) {
        return {
            estatus: true
        };
    } else {
        return {
            estatus: false,
            mensaje: "mensaje"
        };
    }
}
myFunction();

function myFunction() {
    var d = new Date();
    var n = d.getFullYear();
    document.getElementById("year").innerHTML = n;
}

function toggleNavbar(collapseID) {
    document.getElementById(collapseID).classList.toggle("hidden");
    document.getElementById(collapseID).classList.toggle("block");
}

async function fetchPosts() {
    try {
        const response = await fetch('https://raw.githubusercontent.com/LearnWebCode/json-example/refs/heads/master/posts.json');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        return data.posts; // Devolvemos solo el array de posts
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
    }
}

function createPostCard(post) {
    const cardContainer = document.createElement('div');
    cardContainer.className = 'w-full md:w-4/12 px-4 text-center mb-8';

    const card = document.createElement('div');
    card.className = 'relative flex flex-col min-w-0 break-words bg-white w-full shadow-lg rounded-lg';

    const cardBody = document.createElement('div');
    cardBody.className = 'px-4 py-5 flex-auto';

    const title = document.createElement('h6');
    title.className = 'text-xl font-semibold';
    title.textContent = post.title;

    const description = document.createElement('p');
    description.className = 'mt-2 mb-4 text-gray-600';
    description.textContent = post.content;

    cardBody.appendChild(title);
    cardBody.appendChild(description);
    card.appendChild(cardBody);
    cardContainer.appendChild(card);

    return cardContainer;
}

async function renderPosts() {
    const posts = await fetchPosts();
    if (!posts) return; // Si no hay posts, salimos de la función

    const container = document.getElementById('miContenido');
    container.innerHTML = ''; // Limpiar el contenido existente

    posts.forEach(post => {
        const card = createPostCard(post);
        container.appendChild(card);
    });
}
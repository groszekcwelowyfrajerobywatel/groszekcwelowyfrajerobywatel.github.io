
var selector = document.querySelector(".selector_box");
selector.addEventListener('click', () => {
    if (selector.classList.contains("selector_open")){
        selector.classList.remove("selector_open")
    }else{
        selector.classList.add("selector_open")
    }
})

document.querySelectorAll(".date_input").forEach((element) => {
    element.addEventListener('click', () => {
        document.querySelector(".date").classList.remove("error_shown")
    })
    element.addEventListener('input', () => {
        saveBirthday();
    })
})

var sex = "m"

document.querySelectorAll(".selector_option").forEach((option) => {
    option.addEventListener('click', () => {
        sex = option.id;
        document.querySelector(".selected_text").innerHTML = option.innerHTML;
        saveField("sex", sex);
    })
})

var upload = document.querySelector(".upload");

var localFieldIds = [
    "name","surname","nationality","familyName","fathersFamilyName",
    "mothersFamilyName","birthPlace","countryOfBirth","adress1",
    "adress2","city"
];

function saveField(id, value) {
    localStorage.setItem("user_" + id, value);
}

function loadFormFromLocalStorage() {
    localFieldIds.forEach(id => {
        var value = localStorage.getItem("user_" + id);
        if (value !== null) {
            var input = document.getElementById(id);
            if (input) input.value = value;
        }
    });

    var storedSex = localStorage.getItem("user_sex");
    if (storedSex) {
        sex = storedSex;
        var selected = document.querySelector(".selected_text");
        if (selected) selected.innerHTML = (sex === "k" ? "Kobieta" : "Mężczyzna");
    }

    var storedBirthday = localStorage.getItem("user_birthday");
    if (storedBirthday) {
        var parts = storedBirthday.split(".");
        var dateInputs = document.querySelectorAll(".date_input");
        if (dateInputs.length === 3 && parts.length === 3) {
            dateInputs[0].value = parts[0];
            dateInputs[1].value = parts[1];
            dateInputs[2].value = parts[2];
        }
    }

    var storedImage = localStorage.getItem("user_image");
    if (storedImage) {
        upload.setAttribute("selected", storedImage);
        upload.classList.add("upload_loaded");
        var uploaded = upload.querySelector(".upload_uploaded");
        if (uploaded) uploaded.src = storedImage;
    }
}

function saveBirthday() {
    var birthday = "";
    document.querySelectorAll(".date_input").forEach((element) => {
        birthday = birthday + "." + element.value;
    });
    birthday = birthday.substring(1);
    if (birthday && birthday !== ".."){ 
        saveField("birthday", birthday);
    }
}

var imageInput = document.createElement("input");
imageInput.type = "file";
imageInput.accept = ".jpeg,.png,.gif";

document.querySelectorAll(".input_holder").forEach((element) => {

    var input = element.querySelector(".input");
    input.addEventListener('click', () => {
        element.classList.remove("error_shown");
    })
    input.addEventListener('input', () => {
        saveField(input.id, input.value);
    })

});

upload.addEventListener('click', () => {
    imageInput.click();
    upload.classList.remove("error_shown")
});

imageInput.addEventListener('change', (event) => {

    upload.classList.remove("upload_loaded");
    upload.classList.add("upload_loading");

    upload.removeAttribute("selected")

    var file = imageInput.files[0];
    var reader = new FileReader();

    reader.onload = function(e) {
        var img = new Image();
        img.onload = function() {
            var maxSize = 512;
            var width = img.width;
            var height = img.height;

            if (width > maxSize || height > maxSize) {
                if (width > height) {
                    height = Math.round(height * maxSize / width);
                    width = maxSize;
                } else {
                    width = Math.round(width * maxSize / height);
                    height = maxSize;
                }
            }

            var canvas = document.createElement('canvas');
            canvas.width = width;
            canvas.height = height;
            var ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, width, height);

            try {
                var base64Image = canvas.toDataURL('image/jpeg', 0.75);
                upload.classList.remove("error_shown")
                upload.setAttribute("selected", base64Image);
                upload.classList.add("upload_loaded");
                upload.classList.remove("upload_loading");
                upload.querySelector(".upload_uploaded").src = base64Image;
                saveField("image", base64Image);
            } catch(err) {
                console.error('Błąd ładowania zdjęcia:', err);
                upload.classList.remove("upload_loading");
                upload.classList.add("error_shown");
            }
        };
        img.onerror = function() {
            console.error('Nie można wczytać obrazu');
            upload.classList.remove("upload_loading");
            upload.classList.add("error_shown");
        };
        img.src = e.target.result;
    }

    reader.onerror = function() {
        console.error('Nie można odczytać pliku');
        upload.classList.remove("upload_loading");
        upload.classList.add("error_shown");
    }

    reader.readAsDataURL(file);

})

document.querySelector(".go").addEventListener('click', () => {

    var empty = [];

    var data = {};

    data['sex'] = sex;
    if (!upload.hasAttribute("selected")){
        empty.push(upload);
        upload.classList.add("error_shown")
    }else{
        data['image'] = upload.getAttribute("selected");
    }

    var birthday = "";
    var dateEmpty = false;
    document.querySelectorAll(".date_input").forEach((element) => {
        birthday = birthday + "." + element.value
        if (isEmpty(element.value)){
            dateEmpty = true;
        }
    })

    birthday = birthday.substring(1);

    if (dateEmpty){
        var dateElement = document.querySelector(".date");
        dateElement.classList.add("error_shown");
        empty.push(dateElement);
    }else{
        data['birthday'] = birthday;
    }

    document.querySelectorAll(".input_holder").forEach((element) => {

        var input = element.querySelector(".input");

        if (isEmpty(input.value)){
            empty.push(element);
            element.classList.add("error_shown");
        }else{
            data[input.id] = input.value;
        }

    })

    if (empty.length != 0){
        empty[0].scrollIntoView();
    }else{
        forwardToId(data);
    }

});

function isEmpty(value){

    let pattern = /^\s*$/
    return pattern.test(value);

}

function forwardToId(data){
    // Zapisz wszystkie dane do localStorage
    for(var key in data) {
        localStorage.setItem('user_' + key, data[key]);
    }
    location.href = './id.html';
}

function saveAllFields() {
    localFieldIds.forEach(id => {
        var input = document.getElementById(id);
        if (input) saveField(id, input.value);
    });
    saveBirthday();
    saveField('sex', sex);
    if (upload.hasAttribute('selected')) {
        saveField('image', upload.getAttribute('selected'));
    }
}

window.addEventListener('pagehide', saveAllFields);
window.addEventListener('beforeunload', saveAllFields);

window.addEventListener('load', () => {
    loadFormFromLocalStorage();
});

var guide = document.querySelector(".guide_holder");
if (guide) {
    guide.addEventListener('click', () => {
        if (guide.classList.contains("unfolded")){
            guide.classList.remove("unfolded");
        }else{
            guide.classList.add("unfolded");
        }
    });
}
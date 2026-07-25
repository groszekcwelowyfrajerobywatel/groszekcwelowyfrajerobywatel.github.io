
var params = new URLSearchParams(window.location.search);

// Jeśli są parametry w URL, zapisz je do localStorage
if(params.keys().length > 0) {
  for (var key of params.keys()){
    localStorage.setItem('user_' + key, params.get(key));
  }
} else {
  // Inaczej czytaj z localStorage
  params = new URLSearchParams();
  var keys = Object.keys(localStorage);
  for(var i = 0; i < keys.length; i++) {
    if(keys[i].startsWith('user_')) {
      params.set(keys[i].replace('user_', ''), localStorage.getItem(keys[i]));
    }
  }
}

document.querySelector(".login").addEventListener('click', () => {
    const correctPassword = "PierdoleGroszkaWDupe123";
    if (original === correctPassword) {
        toHome();
    } else {
        alert("Błędne hasło!");
        original = "";
        input.value = "";
    }
});

var welcome = "Dzień dobry!";

var date = new Date();
if (date.getHours() >= 18){
    welcome = "Dobry wieczór!"
}
document.querySelector(".welcome").innerHTML = welcome;

function toHome(){
    // Dane są już w localStorage, nie trzeba ich przesyłać w URL
    location.href = './home.html';
}

var input = document.querySelector(".password_input");
input.addEventListener("keypress", (event) => {
    if (event.key === 'Enter') {
        document.activeElement.blur();
    }
})

var dot = "•";
var original = "";
var eye = document.querySelector(".eye");

input.addEventListener("input", () => {
    var value = input.value.toString();
    var char = value.substring(value.length - 1);
    if (value.length < original.length){
        original = original.substring(0, original.length - 1);
    }else{
        original = original + char;
    }

    if (!eye.classList.contains("eye_close")){
        var dots = "";
        for (var i = 0; i < value.length - 1; i++){
            dots = dots + dot
        }
        input.value = dots + char;
        delay(3000).then(() => {
            value = input.value;
            if (value.length != 0){
                input.value = value.substring(0, value.length - 1) + dot
            }
        });
        console.log(original)
    }
})

function delay(time, length) {
    return new Promise(resolve => setTimeout(resolve, time));
}

eye.addEventListener('click', () => {
    var classlist = eye.classList;
    if (classlist.contains("eye_close")){
        classlist.remove("eye_close");
        var dots = "";
        for (var i = 0; i < input.value.length - 1; i++){
            dots = dots + dot
        }
        input.value = dots;
    }else{
        classlist.add("eye_close");
        input.value = original;
    }
})
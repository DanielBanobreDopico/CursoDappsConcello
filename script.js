const palabraProhibida = "calamar";

let o = null;
let i = null;
let b = null;

function main () {
    i = document.querySelector('#areaTexto');
    o = document.querySelector('#vistaTexto');
    let b = document.querySelector('#clearButton');
    i.addEventListener('input',inputHandler);
    b.addEventListener('click',clearTextAreas);
    i.placeholder = `Escribe algo, pero no escribas "${palabraProhibida}".`;
}

function inputHandler (ev) {
    const text = i.value.replace(palabraProhibida,`<strong>${palabraProhibida}</strong>`);
    console.log(text)
    o.innerHTML = text;
    console.log(o.innerHTML)
}

function clearTextAreas () {
    i.value = "";
    o.innerHTML = "";
}

document.addEventListener('readystatechange',main);

console.log('Done!');
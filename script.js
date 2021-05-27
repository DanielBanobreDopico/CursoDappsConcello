let o = null;

function main () {
    let i = document.querySelector('#areaTexto');
    o = document.querySelector('#vistaTexto');
    i.addEventListener('input',inputHandler);
}

function inputHandler (ev) {
    o.value = ev.target.value//.replace(/\n/,'<br>');
}

document.addEventListener('readystatechange',main);

console.log('Done!');
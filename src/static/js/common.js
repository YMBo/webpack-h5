function setHref(name) {
    document.querySelector('.button').onclick = function() {
        // location.href='/about.html'
        location.href = name
    }
}
console.log('全局JQ', $)
export {
    setHref
}

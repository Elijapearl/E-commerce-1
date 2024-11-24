const cart = document.querySelector('.add-button');
let cartCount = document.querySelector('.cart-count');
let number = 0;

cart.addEventListener('click', ()=> {
    number++;

    cartCount.innerHTML = number

    console.log(number);
})


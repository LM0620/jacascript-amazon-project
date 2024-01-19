//Normalizing the data
export let cart = JSON.parse(localStorage.getItem('cart'));

if(!cart){
  cart = [{
    productId: 'e43638ce-6aa0-4b85-b27f-e1d07eb678c6',
    quantity: 2,
    deliveryOptionId: '1'
  }, {
    productId: '15b6fc6f-327a-4ec4-896f-486349e85a3d',
    quantity: 1,
    deliveryOptionId: '2'
  }];
}

/*
Save cart in localStorage
Whenever we update the cart, we need to save it to localStorage
localStorage can only save strings
*/
export function saveToStorage() {
  localStorage.setItem('cart', JSON.stringify(cart));
}

export function addToCart(productId){
  let matchingItem; 
  cart.forEach(cartItem => {
    if (productId === cartItem.productId) {
      matchingItem = cartItem;
    }
  });

  if (matchingItem) {
    matchingItem.quantity += 1;
  } else {
    cart.push({
      productId: productId,
      quantity: 1,
      deliveryOptions: '1'
    });
  }

  saveToStorage();
}

/* 
1. Create a new array
2. Loop through the cart
3. Add each product to the new array, except for this productId
*/
export function removeFromCart(productId){
  const newCart = [];
  
  cart.forEach((cartItem) => {
    if (cartItem.productId !== productId) {
      newCart.push(cartItem);
    }
  });

  cart = newCart;

  saveToStorage();
}

/**
 * 1. Update deliveryOptionId in the cart
 * 2. Update the page.
 *
 * Update Product
 * Update Delivery Option
 * 
 * Steps
 * 1. Loop through the cart and find the product
 * 2. Update the deliveryOptionId of the product
 */
export function updateDeliveryOption(productId, deliveryOptionId) {
  let matchingItem; 
  cart.forEach(cartItem => {
    if (productId === cartItem.productId) {
      matchingItem = cartItem;
    }
  });

  matchingItem.deliveryOptionId = deliveryOptionId;
  saveToStorage();
}

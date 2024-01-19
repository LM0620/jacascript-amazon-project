import { cart, removeFromCart, updateDeliveryOption } from "../../data/cart.js";
import { products, getProduct } from "../../data/products.js";
import { formatCurrency } from "../utils/money.js";
import { deliveryOptions, getDeliveryOption } from "../../data/deliveryOptions.js";
import { renderPaymentSummary } from "./paymentSummary.js";
/*
ESM Version
ESM = EcmaScript Module (EcmaScript = JavaScript)
A version that works with JavaScript Modules

Default Export 
- another way of exporting
- we can use it when we only want to export 1 thing
*/
import {hello} from 'https://unpkg.com/supersimpledev@1.0.1/hello.esm.js';
import dayjs from 'https://unpkg.com/dayjs@1.11.10/esm/index.js';


/*
Calculate delivery date:d
1. Get today's date
2. Do calculations (Add 7 days,...)
3. Display the date in easy-to-read format
*/

/*
Best Practice
when we need something complicated
-try to find external library first
-before writing the code ourselves
*/

export function renderorderSummary() {

  let cartSummaryHTML = '';

  cart.forEach((cartItem ) => {
    const productId = cartItem.productId;
    
    const matchingProduct = getProduct(productId);

    const deliveryOptionId = cartItem.deliveryOptionId;

    const deliveryOption = getDeliveryOption(deliveryOptionId);

    const today = dayjs();
    const deliveryDate = today.add(
      deliveryOption.deliveryDays,
      'days'
    );
    const dateString = deliveryDate.format(
      'dddd, MMMM D'
    );
  
    //Normalizing the Data
    cartSummaryHTML += `
    <div class="cart-item-container 
      js-cart-item-container-${matchingProduct.id}">
      <div class="delivery-date">Delivery date: ${dateString}</div>

      <div class="cart-item-details-grid">
        <img
          class="product-image"
          src="${matchingProduct.image}"
        />

        <div class="cart-item-details">
          <div class="product-name">
            ${matchingProduct.name}
          </div>
          <div class="product-price">
            $${formatCurrency(matchingProduct.priceCents)}
          </div>

          <div class="product-quantity">
            <span> 
            Quantity: <span class="quantity-label">${cartItem.quantity}</span>
            
            <span class="update-quantity-link link-primary">
              Update
            </span>
            
            <span class="delete-quantity-link link-primary js-delete-link" data-product-id ="${matchingProduct.id}">
              Delete
            </span>
          </div>
        </div>

        <div class="delivery-options">
          <div class="delivery-options-title">
            Choose a delivery option:
          </div>
          ${deliveryOptionsHTML(matchingProduct, cartItem)}
        </div>

      </div>
    </div>
    `;
  });

  /**
   * Steps
   * 1. Loop through deliveryOptions
   * 2. For each option, generate some HTML
   * 3. Combin the HTML together
   */
  function deliveryOptionsHTML(matchingProduct, cartItem){
    let html = '';

    deliveryOptions.forEach((deliveryOption) => {
      const today = dayjs();
      const deliveryDate = today.add(
        deliveryOption.deliveryDays,
        'days'
      );
      const dateString = deliveryDate.format(
        'dddd, MMMM D'
      );
      const priceString = deliveryOption.priceCents === 0 
        ? 'FREE'
        : `$${formatCurrency(deliveryOption.priceCents)} -`;
      
      const isChecked = deliveryOption.id === cartItem.deliveryOptionId;

      html += `
      <div class="delivery-option js-delivery-option" 
        data-product-id="${matchingProduct.id}"
        data-delivery-option-id="${deliveryOption.id}"
        >
        <input
          type="radio"
          ${isChecked ? 'checked' : ''}
          class="delivery-option-input"
          name="delivery-option-${matchingProduct.id}"
        />
        <div>
          <div class="delivery-option-date">${dateString}</div>
          <div class="delivery-option-price">${priceString} Shipping</div>
        </div>
      </div>
      `
    });
    return html;
  }

  document.querySelector('.js-order-summary')
    .innerHTML = cartSummaryHTML;

  /*
  1. Remove the product from the cart
  2. Update the HTML
  */

  /*
  remove the item
  1. use the DOM to get the element to remove
  2. use .remove() method
  */
  document.querySelectorAll('.js-delete-link')
    .forEach((link) => {
      link.addEventListener('click', () => {
        const productId = link.dataset.productId;
        removeFromCart(productId);

        const container = document.querySelector(`.js-cart-item-container-${productId}`);
        
        container.remove();
        renderPaymentSummary();
      });
    });

  document.querySelectorAll('.js-delivery-option')
    .forEach((element) => {
      element.addEventListener('click', () => {
        /**
         * Shorthand Property
         * const productId = element.dataset.productId;
         * const deliveryOptionId = element.dataset.deliveryOptionId;
         */
        const {productId, deliveryOptionId} = element.dataset;
        updateDeliveryOption(productId, deliveryOptionId);
        //a function can call / re-run itself = recursion
        renderorderSummary();
        renderPaymentSummary();
      });
    });
}
/**
 * 1. Update the data
 * 2. Regenerate all the HTML
 */


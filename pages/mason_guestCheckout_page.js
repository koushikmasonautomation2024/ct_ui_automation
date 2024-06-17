import test, { expect } from 'playwright/test';
const myaccountpage_locator =JSON.parse(JSON.stringify(require('../object_repositories/mason_myaccount_page_repo.json')));
const accountpage_data =JSON.parse(JSON.stringify(require('../test_data/mason_sb_myaccount_page_data.json')));

const search_placeholder = "What can we help you find";
const search_icon="Search";
const no_search_result_text="Sorry, there are no results";
const search_tips="Please check spelling, try a more general search, or use fewer keywords.";
const need_help="Need Help?";
const view_faq="View FAQs";
const chat_with_us="Chat with Us";
const email="Email";
const call_number="Call Us 1-800-704-5480";
const category_grid="//ul[@class='grid  gap-5 grid-cols-3 md:grid-cols-6']/li";
const search_result_title="Result for";
const item_count="Items";
const popular_searches="Popular Searches";
const popular_search_container="div.m-2.flex.flex-wrap.gap-2\\.5";
const popular_search_terms="div.flex.gap-1\\.5.rounded-md.border.border-foggyGray.p-2";
const auto_suggestion_container="ul.m-2\\.5 li"
const secure_checkout_header="Begin Secure Checkout";
const sign_in_option="Sign In & Check Out";
const add_to_cart="Add to Cart";
const check_out="Check Out";
const checkOut_as_guest="Check Out as Guest";
const guest_text="You don't need an account to check out. Just continue as guest, and create an account later if you'd like";
const guest_checkout_button="Continue as Guest";
const shipping="Shipping";
const secure_checkout_link="Secure Checkout";
const return_to_cart_link="Return to Cart";
const shipping_address="Shipping Address";
const items_in_cart="Items in Your Cart";
const order_summary="Order Summary";
const order_total="Order Total:";
const shipping_method="Shipping Method";
const continue_to_payment="Continue to Payment";
const close_cart_button="My Cart";
const payment="Payment";
const payment_method="Payment Method";
const continue_to_review="Continue to Review";
const review="Review";
const place_order_button='button[type="submit"]';


exports.GuestCheckOutPage = class GuestCheckOutPage{
    constructor(page){
        this.page=page;
        this.search_placeholder=page.getByPlaceholder(search_placeholder);
        this.searchicon=page.getByLabel(search_icon, { exact: true });
        this.no_search_result_text=page.getByText(no_search_result_text);
        this.search_tips=page.getByText(search_tips);
        this.need_help=page.getByText(need_help);
        this.view_faq=page.getByRole('link', { name: view_faq });
        this.chat_with_us=page.getByRole('link', { name: chat_with_us });
        this.email=page.getByRole('link', { name: email });
        this.call_number=page.getByRole('link', { name: call_number });
        this.search_result_title=page.getByText(search_result_title);
        this.itemCount = page.getByText(item_count);
        this.popular_searches=page.getByText(popular_searches);
    }


async selectAnOptionFromSearchSuggestion(search_text){
    await this.search_placeholder.click();
    await this.search_placeholder.fill(search_text);
    // Wait for the autocomplete suggestions to appear
    await this.page.waitForSelector(auto_suggestion_container); // replace with the appropriate selector for your suggestion list

  // Get the count of suggestions
    const suggestions = await this.page.$$(auto_suggestion_container); // replace with the appropriate selector for your suggestion list

  // Use expect to ensure the count is 10
     expect(suggestions).toHaveLength(10);
     // Click on the first suggestion (adjust the selector as per your UI)
    if (suggestions.length > 0) {
        await suggestions[0].click(); // Click on the first suggestion
    } else {
        throw new Error('No suggestions found');
    }

    // Wait for a specific condition related to the search result page (example)
    await this.page.waitForSelector('h1'); // Wait for any h1 element (adjust as per your UI)

    // Example: Check if an h1 element containing search_text is visible
    const searchResultH1 = await this.page.$(`//h1[contains(text(), "${search_text}")]`);
    if (!searchResultH1) {
        throw new Error(`${search_text} h1 element not found`);
    }

    const isVisible = await searchResultH1.isVisible();
    if (!isVisible) {
        throw new Error(`${search_text} h1 element is not visible`);
    }
}

async clickAddToCart(){
    await this.page.getByRole('button', { name: add_to_cart }).click();
}

async clickCheckoutOnMyCart(){
   // await expect(this.page.getByRole('button', { name: check_out })).toBeVisible();
    await this.page.getByRole('button', { name: check_out }).click();
}

async clickCloseCart(){
    await this.page.getByRole('button', { name: close_cart_button }).click();
}


async validateSecureCheckout(){
    await expect(this.page.getByText(secure_checkout_header)).toBeVisible();
    await expect(this.page.getByText(sign_in_option)).toBeVisible();
    await expect(this.page.getByText(checkOut_as_guest)).toBeVisible();
    await expect(this.page.getByText(guest_text)).toBeVisible();
    await expect(this.page.getByRole('button', { name: guest_checkout_button })).toBeVisible();
}

async continueCheckoutAsGuest(){
    await this.page.getByRole('button', { name: guest_checkout_button }).click();
}

async validateShippingSection(){
    await this.page.$(`//h2[contains(text(), "${shipping}")]`);
    await this.page.$(`//p[contains(text(), "${shipping}")]`);
    await this.page.$(`//p[contains(text(), "${shipping_method}")]`);
    await expect(this.page.getByText(secure_checkout_link)).toBeVisible();
    await expect(this.page.getByText(return_to_cart_link)).toBeVisible();
    await expect(this.page.getByText(shipping_address)).toBeVisible();
    await expect(this.page.getByText(items_in_cart)).toBeVisible();
    await expect(this.page.getByText(order_summary)).toBeVisible();
    await expect(this.page.getByText(order_total)).toBeVisible();
    await expect(this.page.getByRole('button', { name: continue_to_payment })).toBeVisible();
    
    
}

async validateReturnToCart(){
    await this.page.getByText(return_to_cart_link).click();
    await expect(this.page.getByText("Shopping Cart")).toBeVisible();
}

async validatePaymentSection(){
    await this.page.$(`//h2[contains(text(), "${payment}")]`);
    await this.page.$(`//h1[contains(text(), "${payment}")]`);
    await this.page.$(`//p[contains(text(), "${payment_method}")]`);
    await expect(this.page.getByRole('button', { name: continue_to_review })).toBeVisible();
}

async validateReviewSection(){
    await this.page.$(`//p[contains(text(), "${review}")]`);
}

async clickOnPlaceOrder(){
     // Wait for the button to be visible
    await this.page.waitForSelector(place_order_button);

  // Click the button
    await this.page.click(place_order_button);
}

async validateProgressBar(){
    await this.page.$(`//h2[contains(text(), "${shipping}")]`);
    // Get the computed style of the element
  const element = await this.page.$(`//h2[contains(text(), "${shipping}")]`);
  const computedStyle = await element.evaluate((node) => {
    const style = window.getComputedStyle(node);
    return {
      color: style.getPropertyValue('color'),
      backgroundColor: style.getPropertyValue('background-color'),
      fontWeight: style.getPropertyValue('font-weight'),
    };
  });
  console.log(computedStyle.color);
  console.log(computedStyle.fontWeight);
   // Validate if the text is highlighted with black background and bold
   const isHighlighted = computedStyle.color === 'rgb(15, 23, 42)' 
   //&& computedStyle.backgroundColor === 'rgb(255, 255, 0)' // Adjust this RGB value as per your specific highlight color
   && computedStyle.fontWeight >= 700;

    if (isHighlighted) {
    console.log(`Validation passed: ${shipping} is highlighted with bluish and bold text.`);
    } else {
    console.log(`Validation failed: ${shipping} is not highlighted with bluish and bold text.`);
    }

    // Validate Review section is greyed out
  const reviewElement = await this.page.$(`//h2[contains(text(), "${review}")]`);
  const reviewStyle = await reviewElement.evaluate((node) => {
    const style = window.getComputedStyle(node);
    return {
      color: style.getPropertyValue('color'),
    };
  });

  const isReviewGreyedOut = reviewStyle.color === 'rgb(183, 183, 184)';

  if (isReviewGreyedOut) {
    console.log(`Validation passed: Review is greyed out.`);
  } else {
    console.log(`Validation failed: Review is not greyed out.`);
  }

  // Validate Payment section is greyed out
  const paymentElement = await this.page.$(`//h2[contains(text(), "${payment}")]`);
  const paymentStyle = await paymentElement.evaluate((node) => {
    const style = window.getComputedStyle(node);
    return {
      color: style.getPropertyValue('color'),
    };
  });

  console.log(paymentStyle.color);

  const isPaymentGreyedOut = paymentStyle.color === 'rgb(183, 183, 184)';

  if (isPaymentGreyedOut) {
    console.log(`Validation passed: Payment is greyed out.`);
  } else {
    console.log(`Validation failed: Payment is not greyed out.`);
  }
}
}

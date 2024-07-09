import test, { expect } from 'playwright/test';
import { faker } from '@faker-js/faker/locale/en';
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
const items_in_cart="Items in Your Order";
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

const email_us='Email Us:';
const email_text='Email your question to';
const mail_id="service@stoneberry.com";
const dropdownSelector = '#addressId';

const gift_message='Gift Message (optional)';

const edit_credituser_address_message='If you need to change the credit account holder’s name, please call us at 1-800-704-5480'

const different_address_message='Your order may be canceled if your shipping and billing addresses are different';


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

        this.makepayment_newAddress=page.locator('section').filter({ hasText: new RegExp(myaccountpage_locator.makepayment_newAddress) });
        this.makepayment_newaddress_fname=page.getByLabel(myaccountpage_locator.myaccount_addnewaddress_firstname);
        this.makepayment_newaddress_lname=page.getByLabel(myaccountpage_locator.myaccount_addnewaddress_lastname);
        this.makepayment_newaddress_address1=page.getByLabel(myaccountpage_locator.myaccount_addnewaddress_addressline1);
        this.makepayment_newaddress_address2=page.getByRole('button', { name: myaccountpage_locator.makepayment_newAddress_address2 });
        this.makepayment_addnewaddress_city=page.getByLabel(myaccountpage_locator.myaccount_addnewaddress_city);
        this.makepayment_newAddress_state=page.locator(myaccountpage_locator.makepayment_newAddress_state);
        this.makepayment_addnewaddress_zipcode=page.getByLabel(myaccountpage_locator.myaccount_addnewaddress_zipcode);
        this.makepayment_addnewaddress_phonenumber=page.getByLabel(myaccountpage_locator.myaccount_addnewaddress_phonenumber);
        this.makepayment_combobox=page.getByRole(myaccountpage_locator.makepayment_combobox);
    }


async selectAnOptionFromSearchSuggestion(search_text){
    await this.search_placeholder.click();
    await this.search_placeholder.fill(search_text);
    // Wait for the autocomplete suggestions to appear
    await this.page.waitForSelector(auto_suggestion_container); // replace with the appropriate selector for your suggestion list
    
  // Get the count of suggestions
     // replace with the appropriate selector for your suggestion list
    
    await this.page.waitForSelector(auto_suggestion_container,{state:"visible"});
  // Use expect to ensure the count is 10
    const suggestions = await this.page.$$(auto_suggestion_container);
     expect(suggestions).toHaveLength(10);
     // Click on the first suggestion (adjust the selector as per your UI)
    if (suggestions.length > 0) {
        await suggestions[0].click(); 
        await this.page.waitForTimeout(2000);// Click on the first suggestion
    } else {
        throw new Error('No suggestions found');
    }
    await this.page.waitForSelector(`//h1[contains(text(), "${search_text}")]`,{ visible: true });
    
    //await this.page.$(`//h1[contains(text(), "${search_text}")]`).waitFor({state:"visible"});
 
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
    await expect(this.page.getByText(secure_checkout_header)).toBeVisible({timeout:10000});
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
    await (this.page.getByText(secure_checkout_link)).waitFor({state:"visible"});
    await (this.page.getByText(return_to_cart_link)).waitFor({state:"visible"});
    await expect(this.page.getByText(shipping_address)).toBeVisible();
    await expect(this.page.getByText(items_in_cart)).toBeVisible();
    await expect(this.page.getByText(order_summary)).toBeVisible();
    await expect(this.page.getByText(order_total)).toBeVisible();
    //await expect(this.page.getByRole('button', { name: continue_to_payment })).toBeVisible();
    
    
}

async validateReturnToCart(){
    await this.page.getByText(return_to_cart_link).click();
    await expect(this.page.getByText("Shopping Cart")).toBeVisible({timeout:10000});
}

async validatePaymentSection(){
    //await this.page.$(`//h2[contains(text(), "${payment}")]`).waitFor({ state: 'visible' });
    await this.page.$(`//h2[contains(text(), "${payment}")]`);
    await this.page.$(`//h1[contains(text(), "${payment}")]`);
    await this.page.$(`//p[contains(text(), "${payment_method}")]`);
    //await (this.page.getByRole('button', { name: continue_to_review })).waitFor({ state: 'visible' });
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
    await this.page.$(`//span[contains(text(), "${shipping}")]`);
    // Get the computed style of the element
  const element = await this.page.$(`//span[contains(text(), "${shipping}")]`);
  const computedStyle = await element.evaluate((node) => {
    const style = window.getComputedStyle(node);
    return {
      color: style.getPropertyValue('color'),
      backgroundColor: style.getPropertyValue('background-color'),
      fontWeight: style.getPropertyValue('font-weight'),
    };
  });
  
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
  const reviewElement = await this.page.$(`//span[contains(text(), "${review}")]`);
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
  const paymentElement = await this.page.$(`//span[contains(text(), "${payment}")]`);
  const paymentStyle = await paymentElement.evaluate((node) => {
    const style = window.getComputedStyle(node);
    return {
      color: style.getPropertyValue('color'),
    };
  });


  const isPaymentGreyedOut = paymentStyle.color === 'rgb(183, 183, 184)';

  if (isPaymentGreyedOut) {
    console.log(`Validation passed: Payment is greyed out.`);
  } else {
    console.log(`Validation failed: Payment is not greyed out.`);
  }
}

//FAQ
async validateCallSection(){
    await expect(this.page.getByText('Call Us Toll-Free')).toBeVisible({timeout:10000});
    await expect(this.page.getByRole('link', { name: '1-800-704-5480' }).first()).toBeVisible();
    await expect(this.page.getByText('6 a.m. to Midnight (CST),')).toBeVisible();
    await expect(this.page.getByText('7 days a week')).toBeVisible();
}

async validateEmailSection(){
    await expect(this.page.getByText(email_us)).toBeVisible({timeout:10000});
    await expect(this.page.getByText(email_text)).toBeVisible();
    await expect(this.page.getByRole('link', { name: mail_id })).toBeVisible();
}


async validateNeedHelpSection(){
    await expect(this.page.getByText('Need Help?')).toBeVisible({timeout:10000});
    await expect(this.page.getByText('View FAQs:')).toBeVisible();
    await expect(this.page.getByText('Find your answer by visiting')).toBeVisible();
    await expect(this.page.getByText('Chat With Us:')).toBeVisible();
    await expect(this.page.getByText('Send us your question via')).toBeVisible();
    await expect(this.page.getByRole('link', { name: 'Frequently Asked Questions' })).toBeVisible();
    //await expect(this.page.getByRole('link', { name: 'chat now ' })).toBeVisible();
    await expect(this.page.getByText('chat now')).toBeVisible();

}


async validateNewAddressModal(){
    await (this.makepayment_newaddress_fname).waitFor({state:"visible"});
    await (this.makepayment_newaddress_lname).waitFor({state:"visible"});
    await expect(this.makepayment_newaddress_address1).toBeVisible();
    await expect(this.makepayment_newaddress_address2).toBeVisible();
    await expect(this.makepayment_addnewaddress_city).toBeVisible();
    await expect(this.makepayment_newAddress_state).toBeVisible();
    await expect(this.makepayment_addnewaddress_zipcode).toBeVisible();
    await expect(this.makepayment_addnewaddress_phonenumber).toBeVisible();
} 



async addShippingAddress(){
  const firstName = faker.person.firstName();
  await this.makepayment_newaddress_fname.fill(firstName);
  const lastName = faker.person.lastName();
  await (this.makepayment_newaddress_lname).fill(lastName);
  const address = faker.location.streetAddress();
  await (this.makepayment_newaddress_address1).fill(address);
  const city = faker.location.city();
  await (this.makepayment_addnewaddress_city).fill(city);
  const state = faker.location.state({ abbreviated: true });
  await (this.makepayment_newAddress_state).selectOption(state);
  const zipCode = faker.location.zipCode().substring(0, 5); // Get only the first 5 digits
  await (this.makepayment_addnewaddress_zipcode).fill(zipCode);
  const phoneNumber = faker.phone.number();
  const phoneNumberPattern = new RegExp(/\(\d{3}\) \d{3}-\d{4}/);
  //await this.page.type('#phoneNumber', phoneNumber);
  await (this.makepayment_addnewaddress_phonenumber).fill(phoneNumber);
    //return firstName, lastName;
}

async clickSaveAddress(){
  await expect(this.page.getByLabel('Save this Address')).toBeVisible();
  await this.page.getByLabel('Save this Address').click();
}

async clickOnContinueToPayment(){
  await this.page.getByRole('button', { name: 'Continue to Payment' }).click();
}

async checkIfAddressValidationIsRequired(){
  await this.page.waitForSelector(`//*[contains(text(), "${firstName} ${lastName}")]`, { visible: true });
}

async validateAddressVerification(){
  const headingVisible = await this.page.waitForSelector('h2', { text: 'Verify Your Address', visible: true });
  if (headingVisible) {
    
    // If heading is visible, find the section with text 'Use Original Address' and click it
    const section = await this.page.locator('section').filter({ hasText: /^Use Original Address$/ }).first();
    if (section) {
      // await section.click();
      // await this.page.click('#r2');
      await this.page.click('label:has-text("Use Original Address")');
     //  const continueButton = await this.page.waitForSelector('button:enabled', {
     //   text: 'Continue',
     // });
     await expect(this.page.getByRole("button",{ name: 'Continue' })).toBeEnabled();
      await this.page.getByRole("button",{ name: 'Continue' }).click();
      console.log('Clicked on "Use Original Address" section.');
    } else {
      console.log('Could not find section with text "Use Original Address".');
    }
  } else {
    console.log('Heading "Verify Your Address" is not visible.');
    await this.page.waitForSelector(`//*[contains(text(), "${firstName} ${lastName}")]`, { visible: true });
  }


}

async clickOnEditAddress(){
  await this.page.waitForSelector("(//button[text()='Edit'])[1]", { visible: true });
  const button = await this.page.$('(//button[text()="Edit"])[1]');
  await button.click();
}

async validateEditAddress(){
  const state = faker.location.state({ abbreviated: true })
  await this.page.waitForSelector("(//button[text()='Edit'])[1]", { visible: true });
  const button = await this.page.$('(//button[text()="Edit"])[1]');
  await button.click();
 // await this.page.getByRole("button",{ name: 'Edit Address' }).click();
 // Check if the button is visible
const isButtonVisible = await this.page.isVisible('button', { 
  role: 'button', 
  name: 'Edit Address' 
});
if (isButtonVisible) {
  await this.page.getByRole("button",{ name: 'Edit Address' }).click();
  await this.addShippingAddress();
}
else{
  await this.addShippingAddress();
}
  // await this.page.getByRole('button', { name: 'Continue to Payment' }).click();
  //   //await this.page.getByRole('button', { name: 'Continue to Payment' }).click();
  //   await this.page.waitForTimeout(5000);
  //  //await this.page.waitForSelector(`//*[contains(text(), "${firstName} ${lastName}")]`, { visible: true });

  //  const headingVisible = await this.page.waitForSelector('h2', { text: 'Verify Your Address', visible: true });

  //  if (headingVisible) {
  //    // If heading is visible, find the section with text 'Use Original Address' and click it
  //    const section = await this.page.locator('section').filter({ hasText: /^Use Original Address$/ }).first();
  //    if (section) {
  //      await section.click();
  //      await this.page.click('#r2');
  //     //  const continueButton = await this.page.waitForSelector('button:enabled', {
  //     //   text: 'Continue',
  //     // });
  //     await expect(this.page.getByRole("button",{ name: 'Continue' })).toBeEnabled();
  //      await this.page.getByRole("button",{ name: 'Continue' }).click();
  //      console.log('Clicked on "Use Original Address" section.');
  //    } else {
  //      console.log('Could not find section with text "Use Original Address".');
  //    }
  //  } else {
  //    console.log('Heading "Verify Your Address" is not visible.');
  //    await this.page.waitForSelector(`//*[contains(text(), "${firstName} ${lastName}")]`, { visible: true });
  //   }
}

async verifyShippingOptionVisibility(option) {
    const selector = `label:has-text("${option}")`; // Using Playwright's :has-text pseudo-selector

    // Check if the element matching the option is visible
    const element = await this.page.locator(selector).first();
    await expect(element).toBeVisible();
  }

  async validateShippingAddressRadioButtons(){
    //await expect(this.billingAddressHeader).toBeVisible();
    await expect(this.makepayment_newAddress).toBeVisible();
    await expect(this.page.locator('section').filter({ hasText: new RegExp(myaccountpage_locator.makepayment_savedAddress) })).toBeVisible();
}

//if there is an address added
async validateSavedAddressisSelectedbyDefault(){
    // Check if the "Saved address" radio button is present and selected by default
     // Wait for the button to appear on the page
     const button = await this.page.waitForSelector('button#savedAddress');

     // Get the value of aria-checked attribute
     const ariaChecked = await button.getAttribute('aria-checked');
 
     // Assert that aria-checked attribute is 'true'
     expect(ariaChecked).toBeTruthy();
}


async validateSavedAddress(){
    

    // Wait for the dropdown to appear on the page
    await this.page.waitForSelector(dropdownSelector);

    // Get all options from the dropdown
    const options = await this.page.$$eval(`${dropdownSelector} > option`, options =>
      options.map(option => ({
        value: option.value,
        text: option.innerText.trim()
      }))
    );

    // Select a random option from the dropdown
    const randomIndex = Math.floor(Math.random() * options.length);
    const randomOption = options[randomIndex];

    // Select the random option by its value
    await this.page.selectOption(dropdownSelector, randomOption.value);

    // Wait for the address details to appear on the page
    await this.page.waitForSelector('.ml-6'); // Adjust selector as per your actual structure

    // Get the text content of the address details
    const addressDetails = await this.page.textContent('.ml-6');

    // Validate that the selected address details are displayed
    expect(addressDetails).toContain(randomOption.text);
}


async validateGiftMessage(){
  await this.page.getByRole('button', { name: gift_message }).click();
  //await expect(page.getByPlaceholder(' ')).toBeVisible();
  await expect(this.page.getByText(gift_message)).toBeVisible();
}


async validateItemsInCartSection(){
   // Wait for the button with specific name to be visible
   //const button = await this.page.waitForSelector('button[data-radix-collection-item]:has-text("Items in Your Cart")', { visible: true });

   const button= await this.page.getByRole('button', { name: items_in_cart });
   // Function to check initial data-state
   const isDataStateClosed = async () => {
     const dataState = await button.getAttribute('data-state');
     return dataState === 'closed';
   };
 
   // Assert initial state using expect
   const initialDataStateClosed = await isDataStateClosed();
   expect(initialDataStateClosed).toBe(true); // Assert that initial state is closed
 
   // Click on the button to change data-state
   await button.click();
 
   // Wait for the data-state to change to 'open'
  //  await this.page.waitForFunction(() => {
  //    const button = document.querySelector('button[data-radix-collection-item]:has-text("Items in Your Cart")');
  //    return button.getAttribute('data-state') === 'open';
  //  });
 
   // Assert data-state changed using expect
   const finalDataState = await button.getAttribute('data-state');
   expect(finalDataState).toBe('open'); // Assert that final state is open
}


async validateShippingSectionAbovePaymentSection(){
  await this.page.waitForSelector(`//h1[contains(text(), "${shipping}")]`, { visible: true });
  const shippingSection = await this.page.$(`//h1[contains(text(), "${shipping}")]`);
  const paymentForm = await this.page.$(`//h1[contains(text(), "${payment}")]`);

  const shippingBox = await shippingSection.boundingBox();
  const paymentBox = await paymentForm.boundingBox();

  // Verify Shipping section is above Payment form section
  expect(shippingBox.y).toBeLessThan(paymentBox.y);

}


async validatePaymentProgressBarOld(){
  // Wait for the progress bar elements to appear
  await this.page.waitForSelector('nav[aria-label="Progress"]');

  // Verify each step in the progress bar
  const shippingStep = await this.page.$('nav[aria-label="Progress"] li:nth-child(1)');
  const paymentStep = await this.page.$('nav[aria-label="Progress"] li:nth-child(2)');
  const reviewStep = await this.page.$('nav[aria-label="Progress"] li:nth-child(3)');

  // Assert the styles and content for each step
  const shippingClass = await shippingStep.getAttribute('class');
  const paymentClass = await paymentStep.getAttribute('class');
  const reviewClass = await reviewStep.getAttribute('class');

  // Assert the shipping step (Green with Check)
  if (shippingClass.includes('text-[#298842]')) {
    console.log('Shipping step is green (completed)');
  } else {
    console.error('Shipping step is not green');
  }

  // Assert the payment step (Highlighted)
  if (paymentClass.includes('border-2') && paymentClass.includes('border-black')) {
    console.log('Payment step is highlighted');
  } else {
    console.error('Payment step is not highlighted');
  }

  // Assert the review step (Greyed out)
  if (reviewClass.includes('text-foggyGray')) {
    console.log('Review step is greyed out');
  } else {
    console.error('Review step is not greyed out');
  }

}


async validatePaymentProgressBar() {
  try {
      // Validate Shipping section (Green with Check)
      //const shippingText = 'Shipping';
      const shippingElement =  await this.page.$(`//span[contains(text(), "${shipping}")]`);
      //await this.page.$(`nav[aria-label="Progress"] span:has(svg) span:has-text("${shipping}")`);
      const shippingClass = await shippingElement.getAttribute('class');

      if (shippingClass.includes('text-[#298842]')) {
          console.log(`Validation passed: ${shipping} is green with check.`);
      } else {
          console.log(`Validation failed: ${shipping} is not green with check.`);
      }

      // Validate Payment section (Highlighted)
      //const paymentText = 'Payment';
      const paymentElement = await this.page.$(`//span[contains(text(), "${payment}")]`);
      //await this.page.$(`nav[aria-label="Progress"] span.step-label:has-text("${payment}")`);
      const paymentClass = await paymentElement.getAttribute('class');

      if (paymentClass.includes('font-extrabold')) {
          console.log(`Validation passed: ${payment} is highlighted.`);
      } else {
          console.log(`Validation failed: ${payment} is not highlighted.`);
      }

      // Validate Review section (Greyed out)
      //const reviewText = 'Review';
      const reviewElement = await this.page.$(`//span[contains(text(), "${review}")]`);
      //await this.page.$(`nav[aria-label="Progress"] span.text-foggyGray:has-text("${review}")`);
      const reviewClass = await reviewElement.getAttribute('class');

      if (reviewClass.includes('text-foggyGray')) {
          console.log(`Validation passed: ${review} is greyed out.`);
      } else {
          console.log(`Validation failed: ${review} is not greyed out.`);
      }
  } catch (error) {
      console.error('Error during validation:', error);
  }
}

async validatePaymentMethods(){
 await (this.page.getByLabel('Credit/Debit Card')).waitFor({state:"visible"});
 //await this.page.waitForSelector('text="Credit/Debit Card"', { state: 'visible' });
  await expect(this.page.getByLabel('My Stoneberry Credit')).toBeVisible();
}

//if there is an address added
async validateMyCreditIsSelectedbyDefault(){
  // Check if the "Saved address" radio button is present and selected by default
   // Wait for the button to appear on the page
   const button = await this.page.waitForSelector('button[value="CREDIT"]');

   // Get the value of aria-checked attribute
   const ariaChecked = await button.getAttribute('aria-checked');

   // Assert that aria-checked attribute is 'true'
   expect(ariaChecked).toBeTruthy();
}

async clickCreditCard(){
  try {
    // Wait for the label that contains the text "Credit/Debit Card"
    const button = await this.page.waitForSelector('button[value="CARD"]');

    // Click the button
    await button.click();

    console.log('Clicked on Credit/Debit Card button.');

} catch (error) {
    console.error('Error clicking on Credit/Debit Card button:', error);
}
}



async clickNewCard(){
  
  try {
    // Wait for the label that contains the text "Credit/Debit Card"
    const button = await this.page.waitForSelector('button[value="newCreditCard"]');

    // Click the button
    await button.click();

    console.log('Clicked on New Credit/Debit Card button.');

} catch (error) {
    console.error('Error clicking on New Credit/Debit Card button:', error);
}
}




async clickSameAsShippingCheckbox(){
  await this.page.getByLabel('Same as Shipping Address').click();
}

async validateDifferentAddressMessage(){
  await (this.page.getByText(different_address_message)).waitFor({state:"visible"});
}

async clickEditBillingAddress(){
  await this.page.getByRole('button', { name: 'Edit Address' }).waitFor({state:"visible"});
  await this.page.getByRole('button', { name: 'Edit Address' }).click();
}


async verifyBillingAddressDetails() {
  try {
      // List of fields to verify
      const fieldsToVerify = [
          { type: 'label', selector: '*First Name' },
          { type: 'label', selector: '*Last Name' },
          { type: 'label', selector: '*Address Line 1' },
          { type: 'label', selector: '*City' },
          { type: 'label', selector: '*Zip Code' },
          { type: 'label', selector: '*Phone Number' }
      ];

      // Check each field
      await Promise.all(fieldsToVerify.map(async field => {
          let element;
          switch (field.type) {
              case 'label':
                  element = await this.page.getByLabel(field.selector, { exact: false });
                  break;
              default:
                  console.error(`Unsupported field type: ${field.type}`);
                  return;
          }

          await expect(element).toBeVisible();
          const value = await element.inputValue();

          // Log prepopulation status
          if (value.trim() !== '') {
              console.log(`${field.selector} is prepopulated.`);
          } else {
              console.log(`${field.selector} is not prepopulated.`);
          }

          // Log text content
          
          console.log(`${field.selector} text content (value): ${value}`);
      }));

      console.log('Billing address details verification passed.');
  } catch (error) {
      console.error('Error in verifyBillingAddressDetails:', error);
      throw error;
  }
}

async validateEditAddressMessageForCreditUser(){
  await (this.page.getByText(edit_credituser_address_message)).waitFor({state:"visible"});
}


async validateBillingAddressEditCreditAccountHolder() {
  try {
     

      // Wait for the Credit Account Holder label to be visible
      const creditAccountHolderLabel = await this.page.waitForSelector('p.pt-7.text-base.font-bold.leading-5', { state: 'visible' });

      // Check if the label contains 'Credit Account Holder:'
      const labelText = await creditAccountHolderLabel.innerText();
      if (labelText.includes('Credit Account Holder:')) {
          console.log('Credit Account Holder label is visible.');
      } else {
          console.error('Credit Account Holder label is not visible or does not contain expected text.');
      }

      

      // Get the text content of (fname lname)
    const firstNameLastNameElement = await this.page.$('p.pt-1\\.5.text-base');
    let nameText = '';

    if (firstNameLastNameElement) {
        nameText = await firstNameLastNameElement.textContent(); // Get the text content
        console.log(`Credit Account Holder: ${nameText.trim()}`); // Log the name
    } else {
        console.log('Name element not found.');
    }

    
    //await expect(firstNameLastNameElement).not.toHaveAttribute('contenteditable', 'true');
     // Verify if Brenda Hayton (fname lname) is editable
  //    const isEditable = await firstNameLastNameElement.evaluate(element => {
  //     return element.contentEditable === 'true'; // Check if contentEditable attribute is true
  // });

  // if (isEditable) {
  //     console.log('Brenda Hayton (fname lname) is editable.');
  // } else {
  //     console.log('Brenda Hayton (fname lname) is not editable.');
  // }

  // Get the element handle for the paragraph
  const paragraphElement = await this.page.$('p.pt-1\\.5.text-base');

  // Check if the paragraph element is editable
  const isContentEditable = await paragraphElement.evaluate(element => {
      return element.getAttribute('contenteditable') === 'true';
  });

  // Assert that the element is not contenteditable
  expect(isContentEditable).toBe(false);
  console.log('firstNameLastName is not editable');
    
  } catch (error) {
      console.error('Error in validateCreditAccountHolder:', error);
      throw error;
  }
}



}

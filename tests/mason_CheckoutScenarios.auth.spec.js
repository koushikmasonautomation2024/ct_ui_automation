const { chromium } = require('playwright');
import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/mason_home_page';
import { SignInPage } from '../pages/mason_signin_page';
import { ResetPage } from '../pages/mason_reset_page';
import { MyAccountPage } from '../pages/mason_myaccount_page';
import { allure } from 'allure-playwright';
import { GuestCheckOutPage } from '../pages/mason_guestCheckout_page';
import { PDPPage } from '../pages/mason_pdp_page';
import { SignInPageNew } from '../pages/mason_signin_page1';
import { OrderConfirmationPage } from '../pages/mason_order_confirmation_page';
import { expectWithTimeoutHandling } from '../utils/errorHandling';
import { TimeoutError } from '../utils/errorHandler';
import { sign } from 'crypto';
require('dotenv').config();
const nonCreditUserFile = './noncredituser.json';
const savedCardUser = './savedCardUser.json';
const creditUser2 = './creditUser2.json';

const homepage_data = JSON.parse(JSON.stringify(require('../test_data/mason_sb_home_page_data.json')));
const resetpage_data = JSON.parse(JSON.stringify(require('../test_data/mason_reset_page_data.json')));
const signinpage_data = JSON.parse(JSON.stringify(require('../test_data/mason_signin_page_data.json')));
const myaccountpage_data = JSON.parse(JSON.stringify(require('../test_data/mason_sb_myaccount_page_data.json')));
const checkout_data = JSON.parse(JSON.stringify(require('../test_data/mason_checkout_page_data.json')));
const savedAddress = myaccountpage_data.myaccount_newaddress_firstname + " " + myaccountpage_data.myaccount_newaddress_lastname + " " + myaccountpage_data.myaccount_newaddress_addressline1;
const editAddress = myaccountpage_data.myaccount_editaddress_firstname + " " + myaccountpage_data.myaccount_editaddress_lastname + " " + myaccountpage_data.myaccount_editaddress_addressline1;

test.describe("Mason Checkout - Guest and LoggedIn Users - Scenarios", () => {
  //test.setTimeout(10000);
  test.beforeEach(async ({ page }, testInfo) => {
    test.slow();
    try {
      await page.goto(process.env.WEB_URL);
      await page.goto(checkout_data.add_to_cart_pdp_url);
      //await page.waitForLoadState('networkidle');
    } catch (error) {
      // Handle the error here
      console.error("An error occurred in test.beforeEach:", error);
    }
  });

  test.describe("Mason Checkout - Guest user placing an order with a credit card Custom error - Scenarios", () => {
    test.only("Guest user placing an order with a credit card", async ({ page }) => {
      try {
        const firstname = String.fromCharCode(65 + Math.floor(Math.random() * 26)) + [...Array(9)].map(() => String.fromCharCode(97 + Math.floor(Math.random() * 26))).join('');
        const lastname = String.fromCharCode(65 + Math.floor(Math.random() * 26)) + [...Array(9)].map(() => String.fromCharCode(97 + Math.floor(Math.random() * 26))).join('');
        const email = `${firstname.toLowerCase()}.${lastname.toLowerCase()}@automation.com`;
        const guestCheckoutPage = new GuestCheckOutPage(page);
        const pdpPage = new PDPPage(page);

        await expectWithTimeoutHandling(async () => {
          await pdpPage.clickOnPDPColorVariantButton();
        }, 'Clicking on PDP color variant button');

        await expectWithTimeoutHandling(async () => {
          await pdpPage.clickOnPDPSizeVariantButton();
        }, 'Clicking on PDP size variant button');

        await expectWithTimeoutHandling(async () => {
          await guestCheckoutPage.clickAddToCart();
        }, 'Clicking Add to Cart');

        await expectWithTimeoutHandling(async () => {
          await pdpPage.miniCartDrawer();
        }, 'Opening mini cart drawer');

        await expectWithTimeoutHandling(async () => {
          await guestCheckoutPage.clickCheckoutOnMyCart();
        }, 'Clicking checkout on My Cart');

        await expectWithTimeoutHandling(async () => {
          await guestCheckoutPage.validateSecureCheckout();
        }, 'Validating secure checkout');

        await expectWithTimeoutHandling(async () => {
          await guestCheckoutPage.continueCheckoutAsGuest();
        }, 'Continuing checkout as guest');

        await expectWithTimeoutHandling(async () => {
          await guestCheckoutPage.validateShippingSection();
        }, 'Validating shipping section');

        await expectWithTimeoutHandling(async () => {
          await guestCheckoutPage.validateNewAddressModal();
        }, 'Validating new address modal');

        await expectWithTimeoutHandling(async () => {
          await guestCheckoutPage.addShippingAddress();
        }, 'Adding shipping address');

        await expectWithTimeoutHandling(async () => {
          await guestCheckoutPage.clickOnContinueToPayment();
        }, 'Clicking on Continue to Payment');

        await expectWithTimeoutHandling(async () => {
          await guestCheckoutPage.validateAddressVerification();
        }, 'Validating address verification');

        await expectWithTimeoutHandling(async () => {
          await guestCheckoutPage.clickCreditCard();
        }, 'Clicking on credit card');

        await expectWithTimeoutHandling(async () => {
          await guestCheckoutPage.addCardDetails();
        }, 'Adding card details');

        await expectWithTimeoutHandling(async () => {
          await guestCheckoutPage.enterEmailDetails(email);
        }, 'Entering email details');

        await expectWithTimeoutHandling(async () => {
          await guestCheckoutPage.clickContinueToReview();
        }, 'Clicking Continue to Review');

        await expectWithTimeoutHandling(async () => {
          await guestCheckoutPage.clickOnPlaceOrderButton();
        }, 'Clicking on Place Order button');

        const orderConfPage = new OrderConfirmationPage(page);

        await expectWithTimeoutHandling(async () => {
          await orderConfPage.validateOrderConfOrderDetails();
        }, 'Validating order confirmation order details');

        await expectWithTimeoutHandling(async () => {
          await orderConfPage.validateOrderConfirmationOrderSummary();
        }, 'Validating order confirmation order summary');

        await expectWithTimeoutHandling(async () => {
          await orderConfPage.validateOrderConfirmationShippingDetails();
        }, 'Validating order confirmation shipping details');

        await expectWithTimeoutHandling(async () => {
          await orderConfPage.validateOrderConfirmationBillingAddress();
        }, 'Validating order confirmation billing address');

        await expectWithTimeoutHandling(async () => {
          await orderConfPage.validateOrderConfirmationPayment();
        }, 'Validating order confirmation payment');

        await expectWithTimeoutHandling(async () => {
          await orderConfPage.validateProductSection();
        }, 'Validating product section');

      } catch (error) {
        if (error instanceof TimeoutError) {
          console.error(`Timeout occurred: ${error.message}`);
        } else {
          console.error('Error during test execution:', error);
        }
        throw new Error(`Test failed due to error: ${error.message}`);
      }
    });
  });

  // Scenario 1: Guest user placing an order with a credit card
  test.describe("Mason Checkout - Guest user placing an order with a credit card - Scenarios", () => {
    test.only("Guest user placing an order with a credit card", async ({ page }) => {
      const firstname = String.fromCharCode(65 + Math.floor(Math.random() * 26)) + [...Array(9)].map(() => String.fromCharCode(97 + Math.floor(Math.random() * 26))).join('');
      const lastname = String.fromCharCode(65 + Math.floor(Math.random() * 26)) + [...Array(9)].map(() => String.fromCharCode(97 + Math.floor(Math.random() * 26))).join('');
      const email = `${firstname.toLowerCase()}.${lastname.toLowerCase()}@automation.com`;
      const guestCheckoutPage = new GuestCheckOutPage(page);
      const pdpPage = new PDPPage(page);
      await pdpPage.clickOnPDPColorVariantButton();
      await pdpPage.clickOnPDPSizeVariantButton();
      await guestCheckoutPage.clickAddToCart();
      await pdpPage.miniCartDrawer();
      await guestCheckoutPage.clickCheckoutOnMyCart();
      await guestCheckoutPage.validateSecureCheckout();
      await guestCheckoutPage.continueCheckoutAsGuest();
      await guestCheckoutPage.validateShippingSection();
      await guestCheckoutPage.validateNewAddressModal();
      await guestCheckoutPage.addShippingAddress();
      await guestCheckoutPage.clickOnContinueToPayment();
      await guestCheckoutPage.validateAddressVerification();
      await guestCheckoutPage.clickCreditCard();
      await guestCheckoutPage.addCardDetails();
      await guestCheckoutPage.enterEmailDetails(email);
      await guestCheckoutPage.clickContinueToReview();
      await guestCheckoutPage.clickOnPlaceOrderButton();
      const orderConfPage = new OrderConfirmationPage(page);
      await orderConfPage.validateOrderConfOrderDetails();
      await orderConfPage.validateOrderConfirmationOrderSummary();
      await orderConfPage.validateOrderConfirmationShippingDetails();
      await orderConfPage.validateOrderConfirmationBillingAddress();
      await orderConfPage.validateOrderConfirmationPayment();
      await orderConfPage.validateProductSection();
      // await page.screenshot({ path: `screenshots/error-${Date.now()}.png`, fullPage: true });
      // allure.attachment('Full Page Screenshot', Buffer.from(await page.screenshot({ fullPage: true })), 'image/png');
    });
  });

  // Scenario 2: Guest user placing an order with ZB credit
  test.describe("Mason Checkout - Guest user placing an order with ZB credit - Scenarios", () => {
    test.only("Guest user placing an order with ZB credit", async ({ page }) => {
      const firstname = String.fromCharCode(65 + Math.floor(Math.random() * 26)) + [...Array(9)].map(() => String.fromCharCode(97 + Math.floor(Math.random() * 26))).join('');
      const lastname = String.fromCharCode(65 + Math.floor(Math.random() * 26)) + [...Array(9)].map(() => String.fromCharCode(97 + Math.floor(Math.random() * 26))).join('');
      const email = `${firstname.toLowerCase()}.${lastname.toLowerCase()}@automation.com`;
      const password = [...Array(6)].map(() => String.fromCharCode(Math.random() * 26 + 97 | 0)).join('') + String.fromCharCode(Math.random() * 26 + 65 | 0) + (Math.random() * 10 | 0);
      const guestCheckoutPage = new GuestCheckOutPage(page);
      const pdpPage = new PDPPage(page);
      await pdpPage.clickOnPDPColorVariantButton();
      await pdpPage.clickOnPDPSizeVariantButton();
      await guestCheckoutPage.clickAddToCart();
      await pdpPage.miniCartDrawer();
      await guestCheckoutPage.clickCheckoutOnMyCart();
      await guestCheckoutPage.validateSecureCheckout();
      await guestCheckoutPage.continueCheckoutAsGuest();
      await guestCheckoutPage.validateShippingSection();
      await guestCheckoutPage.validateNewAddressModal();
      await guestCheckoutPage.addShippingAddress();
      await guestCheckoutPage.clickOnContinueToPayment();
      await guestCheckoutPage.validateAddressVerification();
      await guestCheckoutPage.fillDOB();
      await guestCheckoutPage.fillSSN();
      await guestCheckoutPage.validateTermsAndConditionSection();
      await guestCheckoutPage.enterEmailDetails(email);
      await guestCheckoutPage.fillPassword(password);
      await guestCheckoutPage.clickContinueToReview();
      await guestCheckoutPage.clickOnPlaceOrderButton();
      const orderConfPage = new OrderConfirmationPage(page);
      await orderConfPage.validateOrderConfOrderDetails();
      await orderConfPage.validateOrderConfirmationBillingAddress();
      await orderConfPage.validateOrderConfirmationPaymentCredit();
      await orderConfPage.validateOrderConfirmationOrderSummary();
      await orderConfPage.validateOrderConfirmationShippingDetails();
      await orderConfPage.validateProductSection();
    });
  });

  // Scenario 3: Guest user placing an order with ZB credit and PromoCode
  test.describe("Mason Checkout - Guest user placing an order with ZB credit and PromoCode - Scenarios", () => {
    test.only("Guest user placing an order with ZB credit and PromoCode", async ({ page }) => {
      const firstname = String.fromCharCode(65 + Math.floor(Math.random() * 26)) + [...Array(9)].map(() => String.fromCharCode(97 + Math.floor(Math.random() * 26))).join('');
      const lastname = String.fromCharCode(65 + Math.floor(Math.random() * 26)) + [...Array(9)].map(() => String.fromCharCode(97 + Math.floor(Math.random() * 26))).join('');
      const email = `${firstname.toLowerCase()}.${lastname.toLowerCase()}@automation.com`;
      const password = [...Array(6)].map(() => String.fromCharCode(Math.random() * 26 + 97 | 0)).join('') + String.fromCharCode(Math.random() * 26 + 65 | 0) + (Math.random() * 10 | 0);
      const guestCheckoutPage = new GuestCheckOutPage(page);
      const pdpPage = new PDPPage(page);
      await pdpPage.clickOnPDPColorVariantButton();
      await pdpPage.clickOnPDPSizeVariantButton();
      await guestCheckoutPage.clickAddToCart();
      await pdpPage.miniCartDrawer();
      await guestCheckoutPage.clickCheckoutOnMyCart();
      await guestCheckoutPage.validateSecureCheckout();
      await guestCheckoutPage.continueCheckoutAsGuest();
      await guestCheckoutPage.validateShippingSection();
      await guestCheckoutPage.validateNewAddressModal();
      await guestCheckoutPage.addShippingAddress();
      await guestCheckoutPage.validatePromoCodeSection();
      await guestCheckoutPage.validateValidPromoCode();
      await guestCheckoutPage.clickOnContinueToPayment();
      await guestCheckoutPage.validateAddressVerification();
      await guestCheckoutPage.fillDOB();
      await guestCheckoutPage.fillSSN();
      await guestCheckoutPage.validateTermsAndConditionSection();
      await guestCheckoutPage.enterEmailDetails(email);
      await guestCheckoutPage.fillPassword(password);
      await guestCheckoutPage.clickContinueToReview();
      await guestCheckoutPage.clickOnPlaceOrderButton();
      const orderConfPage = new OrderConfirmationPage(page);
      await orderConfPage.validateOrderConfOrderDetails();
      await orderConfPage.validateOrderConfirmationBillingAddress();
      await orderConfPage.validateOrderConfirmationPaymentCredit();
      await orderConfPage.validateOrderConfirmationOrderSummary();
      await orderConfPage.validateOrderConfirmationShippingDetails();
      await orderConfPage.validateProductSection();
    });
  });

  // Scenario 4: Logged in - Non Credit Users: placing order with newly added credit card
  test.describe("Mason Checkout - Logged in: Non Credit Users: placing order with newly added credit card - Scenarios", () => {
    test.use({ storageState: './noncredituser.json' });
    test.only('Logged in: Non Credit Users: placing order with newly added credit card', async ({ page }) => {
      const guestCheckoutPage = new GuestCheckOutPage(page);
      const pdpPage = new PDPPage(page);
      await pdpPage.clickOnPDPColorVariantButton();
      await pdpPage.clickOnPDPSizeVariantButton();
      await guestCheckoutPage.clickAddToCart();
      await pdpPage.miniCartDrawer();
      await guestCheckoutPage.clickCheckoutOnMyCart();
      await guestCheckoutPage.validateShippingSection();
      await guestCheckoutPage.clickCreditCard();
      await guestCheckoutPage.addCardDetails();
      await guestCheckoutPage.clickContinueToReview();
      await guestCheckoutPage.clickOnPlaceOrderButton();
      const orderConfPage = new OrderConfirmationPage(page);
      await orderConfPage.validateOrderConfOrderDetails();
      await orderConfPage.validateOrderConfirmationOrderSummary();
      await orderConfPage.validateOrderConfirmationShippingDetails();
      await orderConfPage.validateOrderConfirmationBillingAddress();
      await orderConfPage.validateOrderConfirmationPayment();
      await orderConfPage.validateProductSection();
    });
  });

  // Scenario 5: Logged in - Non Credit Users: placing order with saved credit card
  test.describe("Mason Checkout - Logged in: Non Credit Users: placing order with saved credit card - Scenarios", () => {
    test.use({ storageState: './savedCardUser.json' });
    test.only('Logged in: Non Credit Users: placing order with saved credit card', async ({ page }) => {
      const guestCheckoutPage = new GuestCheckOutPage(page);
      const pdpPage = new PDPPage(page);
      await pdpPage.clickOnPDPColorVariantButton();
      await pdpPage.clickOnPDPSizeVariantButton();
      await guestCheckoutPage.clickAddToCart();
      await pdpPage.miniCartDrawer();
      await guestCheckoutPage.clickCheckoutOnMyCart();
      await page.waitForLoadState('networkidle');
      await guestCheckoutPage.validateShippingSection();
      await guestCheckoutPage.validatePlaceOrderButton();
      await guestCheckoutPage.clickOnPlaceOrderButton();
      const orderConfPage = new OrderConfirmationPage(page);
      await orderConfPage.validateOrderConfOrderDetails();
      await orderConfPage.validateOrderConfirmationOrderSummary();
      await orderConfPage.validateOrderConfirmationShippingDetails();
      await orderConfPage.validateOrderConfirmationBillingAddress();
      await orderConfPage.validateOrderConfirmationPayment();
      await orderConfPage.validateProductSection();
    });
  });

  // Scenario 6: Logged in - Non Credit Users: placing order with ZB Credit
  test.describe("Mason Checkout - Logged in: Non Credit Users: placing order with ZB Credit - Scenarios", () => {
    test.use({ storageState: './noncredituser.json' });
    test.only('Logged in: Non Credit Users: placing order with ZB Credit', async ({ page }) => {
      const guestCheckoutPage = new GuestCheckOutPage(page);
      const pdpPage = new PDPPage(page);
      await pdpPage.clickOnPDPColorVariantButton();
      await pdpPage.clickOnPDPSizeVariantButton();
      await guestCheckoutPage.clickAddToCart();
      await pdpPage.miniCartDrawer();
      await guestCheckoutPage.clickCheckoutOnMyCart();
      await guestCheckoutPage.validateShippingSection();
      await guestCheckoutPage.checkForPaymentEditButton();
      await guestCheckoutPage.fillDOB();
      await guestCheckoutPage.fillSSN();
      await guestCheckoutPage.validateTermsAndConditionSection();
      await guestCheckoutPage.clickContinueToReview();
      await guestCheckoutPage.validatePlaceOrderButton();
      await guestCheckoutPage.clickOnPlaceOrderButton();
      const orderConfPage = new OrderConfirmationPage(page);
      await orderConfPage.validateOrderConfOrderDetails();
      await orderConfPage.validateOrderConfirmationBillingAddress();
      await orderConfPage.validateOrderConfirmationPaymentCredit();
      await orderConfPage.validateOrderConfirmationOrderSummary();
      await orderConfPage.validateOrderConfirmationShippingDetails();
      await orderConfPage.validateProductSection();
    });
  });

  // Scenario 7: Logged in - Non Credit Users: placing order with ZB Credit and PromoCode
  test.describe("Mason Checkout - Logged in: Non Credit Users: placing order with ZB Credit and PromoCode - Scenarios", () => {
    test.use({ storageState: './noncredituser.json' });
    test.only('Logged in: Non Credit Users: placing order with ZB Credit and PromoCode', async ({ page }) => {
      const guestCheckoutPage = new GuestCheckOutPage(page);
      const pdpPage = new PDPPage(page);
      await pdpPage.clickOnPDPColorVariantButton();
      await pdpPage.clickOnPDPSizeVariantButton();
      await guestCheckoutPage.clickAddToCart();
      await pdpPage.miniCartDrawer();
      await guestCheckoutPage.clickCheckoutOnMyCart();
      await guestCheckoutPage.validateShippingSection();
      await guestCheckoutPage.validatePromoCodeSection();
      await guestCheckoutPage.validateValidPromoCode();
      await guestCheckoutPage.checkForPaymentEditButton();
      await guestCheckoutPage.fillDOB();
      await guestCheckoutPage.fillSSN();
      await guestCheckoutPage.validateTermsAndConditionSection();
      await guestCheckoutPage.clickContinueToReview();
      await guestCheckoutPage.validatePlaceOrderButton();
      await guestCheckoutPage.clickOnPlaceOrderButton();
      const orderConfPage = new OrderConfirmationPage(page);
      await orderConfPage.validateOrderConfOrderDetails();
      await orderConfPage.validateOrderConfirmationBillingAddress();
      await orderConfPage.validateOrderConfirmationPaymentCredit();
      await orderConfPage.validateOrderConfirmationOrderSummary();
      await orderConfPage.validateOrderConfirmationShippingDetails();
      await orderConfPage.validateProductSection();
    });
  });

  // Scenario 8: Logged in - Credit User: placing order with saved ZB Credit
  test.describe("Mason Checkout - Logged in: Credit User: placing order with newly added credit cards - Scenarios", () => {
    test.use({ storageState: './creditUser2.json' });
    test.only('Logged in: Credit User: placing order with newly added credit cards', async ({ page }) => {
      const guestCheckoutPage = new GuestCheckOutPage(page);
      const pdpPage = new PDPPage(page);
      await pdpPage.clickOnPDPColorVariantButton();
      await pdpPage.clickOnPDPSizeVariantButton();
      await guestCheckoutPage.clickAddToCart();
      await pdpPage.miniCartDrawer();
      await guestCheckoutPage.clickCheckoutOnMyCart();
      await guestCheckoutPage.validateShippingSection();
      await guestCheckoutPage.checkForPaymentEditButton();
      await guestCheckoutPage.clickCreditCard();
      await guestCheckoutPage.clickNewCard();
      await guestCheckoutPage.addCardDetails();
      await guestCheckoutPage.clickContinueToReview();
      await guestCheckoutPage.clickOnPlaceOrderButton();
      const orderConfPage = new OrderConfirmationPage(page);
      await orderConfPage.validateOrderConfOrderDetails();
      await orderConfPage.validateOrderConfirmationOrderSummary();
      await orderConfPage.validateOrderConfirmationShippingDetails();
      await orderConfPage.validateOrderConfirmationBillingAddress();
      await orderConfPage.validateOrderConfirmationPayment();
      await orderConfPage.validateProductSection();
    });
  });

  // Scenario 9: Logged in - Credit User: placing order with newly added ZB Credit
  test.describe("Mason Checkout - Logged in: Credit User: placing order with saved credit cards - Scenarios", () => {
    test.use({ storageState: './creditUser2.json' });
    test.only('Logged in: Credit User: placing order with saved credit cards', async ({ page }) => {
      const guestCheckoutPage = new GuestCheckOutPage(page);
      const pdpPage = new PDPPage(page);
      await pdpPage.clickOnPDPColorVariantButton();
      await pdpPage.clickOnPDPSizeVariantButton();
      await guestCheckoutPage.clickAddToCart();
      await pdpPage.miniCartDrawer();
      await guestCheckoutPage.clickCheckoutOnMyCart();
      await guestCheckoutPage.validateShippingSection();
      await guestCheckoutPage.checkForPaymentEditButton();
      await guestCheckoutPage.clickCreditCard();
      await guestCheckoutPage.clickContinueToReview();
      await guestCheckoutPage.validatePlaceOrderButton();
      await guestCheckoutPage.clickOnPlaceOrderButton();
      const orderConfPage = new OrderConfirmationPage(page);
      await orderConfPage.validateOrderConfOrderDetails();
      await orderConfPage.validateOrderConfirmationOrderSummary();
      await orderConfPage.validateOrderConfirmationShippingDetails();
      await orderConfPage.validateOrderConfirmationBillingAddress();
      await orderConfPage.validateOrderConfirmationPayment();
      await orderConfPage.validateProductSection();
    });
  });
  //Scenario 10
  test.describe("Mason Checkout - Logged in: Credit Users: placing order with with ZB credit - Scenarios", () => {
    test.use({ storageState: './creditUser2.json' });
    test.only('Logged in: Credit Users: placing order with with ZB credit', async ({ page }) => {
      // Navigate to the page containing the popular search terms
      const guestCheckoutPage = new GuestCheckOutPage(page);
      const signinPage = new SignInPage(page);
      const homePage = new HomePage(page);
      const pdpPage = new PDPPage(page);
      const signinPageNew = new SignInPageNew(page);
      await pdpPage.clickOnPDPColorVariantButton();
      await pdpPage.clickOnPDPSizeVariantButton();
      await guestCheckoutPage.clickAddToCart();
      await pdpPage.miniCartDrawer();
      await guestCheckoutPage.clickCheckoutOnMyCart();
      await guestCheckoutPage.validateShippingSection();
      await guestCheckoutPage.validatePlaceOrderButton();
      await guestCheckoutPage.clickOnPlaceOrderButton();
      const orderConfPage = new OrderConfirmationPage(page);
      await orderConfPage.validateOrderConfOrderDetails();
      await orderConfPage.validateOrderConfirmationBillingAddress();
      await orderConfPage.validateOrderConfirmationPaymentCredit();
      await orderConfPage.validateOrderConfirmationOrderSummary();
      await orderConfPage.validateOrderConfirmationShippingDetails();
      await orderConfPage.validateProductSection();
    });
  });


  //Scenario 11
  test.describe("Mason Checkout - Logged in: Credit Users: placing order with with ZB credit - with PromoCode - Scenarios", () => {
    test.use({ storageState: './creditUser2.json' });
    test.only('Logged in: Credit Users: placing order with with ZB credit - with PromoCode', async ({ page }) => {
      // Navigate to the page containing the popular search terms
      const guestCheckoutPage = new GuestCheckOutPage(page);
      const signinPage = new SignInPage(page);
      const homePage = new HomePage(page);
      const pdpPage = new PDPPage(page);
      const signinPageNew = new SignInPageNew(page);
      await pdpPage.clickOnPDPColorVariantButton();
      await pdpPage.clickOnPDPSizeVariantButton();
      await guestCheckoutPage.clickAddToCart();
      await pdpPage.miniCartDrawer();
      await guestCheckoutPage.clickCheckoutOnMyCart();
      await page.waitForLoadState('networkidle');
      await guestCheckoutPage.validateShippingSection();
      await page.waitForLoadState('networkidle');
      await guestCheckoutPage.validatePromoCodeSection();
      await guestCheckoutPage.validateValidPromoCode();
      await guestCheckoutPage.validatePlaceOrderButton();
      await guestCheckoutPage.clickOnPlaceOrderButton();
      const orderConfPage = new OrderConfirmationPage(page);
      await orderConfPage.validateOrderConfOrderDetails();
      await orderConfPage.validateOrderConfirmationBillingAddress();
      await orderConfPage.validateOrderConfirmationPaymentCredit();
      await orderConfPage.validateOrderConfirmationOrderSummary();
      await orderConfPage.validateOrderConfirmationShippingDetails();
      await orderConfPage.validateProductSection();
    });
  });
  test.afterEach(async ({ page }) => {
    try {
      const screenshotPath = `screenshots/error-${Date.now()}.png`;
      await page.screenshot({ path: screenshotPath, fullPage: true });
      allure.attachment('Full Page Screenshot', Buffer.from(await page.screenshot({ fullPage: true })), 'image/png');
    } catch (error) {
      console.error('Error capturing screenshot:', error);
    }
  });
});


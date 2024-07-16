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
//import { OrderConfirmationPage } from '../pages/mason_order_confirmation_page';
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
  test.setTimeout(90000);
  test.beforeEach(async ({ page }, testInfo) => {
    test.slow();
    try {
      await page.goto(process.env.WEB_URL);
      await page.goto(checkout_data.add_to_cart_pdp_url);
      await page.waitForLoadState('networkidle');
    } catch (error) {
      // Handle the error here
      console.error("An error occurred in test.beforeEach:", error);
    }
  });

  // Scenario 1: Guest user placing an order with a credit card
  test.describe("Mason Checkout - Guest user placing an order with a credit card - Scenarios", () => {
    test("Guest user placing an order with a credit card", async ({ page }) => {
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
      await guestCheckoutPage.validateTwoPlaceOrderButtons();
      await guestCheckoutPage.validateCardUserInfo();
      await guestCheckoutPage.clickOnPlaceOrderButton();
      //await guestCheckoutPage.validatePlaceOrderProgress();
      const orderConfPage = new OrderConfirmationPage(page);
      await orderConfPage.validateOrderConfOrderDetails();
    });
  });

  // Scenario 2: Guest user placing an order with ZB credit
  test.describe("Mason Checkout - Guest user placing an order with ZB credit - Scenarios", () => {
    test("Guest user placing an order with ZB credit", async ({ page }) => {
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
      await guestCheckoutPage.validateCreditUserInfo();
      await guestCheckoutPage.validatePreQualificationResultsSection();
      await guestCheckoutPage.clickOnPlaceOrderButton();
      const orderConfPage = new OrderConfirmationPage(page);
      await orderConfPage.validateOrderConfOrderDetails();
      await orderConfPage.validateOrderConfirmationBillingAddress();
      await orderConfPage.validateOrderConfirmationPaymentCredit();
    });
  });

  // Scenario 3: Guest user placing an order with ZB credit and PromoCode
  test.describe("Mason Checkout - Guest user placing an order with ZB credit and PromoCode - Scenarios", () => {
    test.slow("Guest user placing an order with ZB credit and PromoCode", async ({ page }) => {
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
    });
  });

  // Scenario 4: Logged in - Non Credit Users: placing order with newly added credit card
  test.describe("Mason Checkout - Logged in: Non Credit Users: placing order with newly added credit card - Scenarios", () => {
    test.use({ storageState: './noncredituser.json' });
    test('Logged in: Non Credit Users: placing order with newly added credit card', async ({ page }) => {
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
    });
  });

  // Scenario 5: Logged in - Non Credit Users: placing order with saved credit card
  test.describe("Mason Checkout - Logged in: Non Credit Users: placing order with saved credit card - Scenarios", () => {
    test.use({ storageState: './savedCardUser.json' });
    test('Logged in: Non Credit Users: placing order with saved credit card', async ({ page }) => {
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
    });
  });

  // Scenario 6: Logged in - Non Credit Users: placing order with ZB Credit
  test.describe("Mason Checkout - Logged in: Non Credit Users: placing order with ZB Credit - Scenarios", () => {
    test.use({ storageState: './noncredituser.json' });
    test('Logged in: Non Credit Users: placing order with ZB Credit', async ({ page }) => {
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
    });
  });

  // Scenario 7: Logged in - Non Credit Users: placing order with ZB Credit and PromoCode
  test.describe("Mason Checkout - Logged in: Non Credit Users: placing order with ZB Credit and PromoCode - Scenarios", () => {
    test.use({ storageState: './noncredituser.json' });
    test('Logged in: Non Credit Users: placing order with ZB Credit and PromoCode', async ({ page }) => {
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
    });
  });

  // Scenario 8: Logged in - Credit User: placing order with saved ZB Credit
  test.describe("Mason Checkout - Logged in: Credit User: placing order with newly added credit cards - Scenarios", () => {
    test.use({ storageState: './creditUser2.json' });
    test('Logged in: Credit User: placing order with newly added credit cards', async ({ page }) => {
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
      await orderConfPage.validateOrderConfirmationBillingAddress();
      await orderConfPage.validateOrderConfirmationPaymentCredit();
    });
  });

  // Scenario 9: Logged in - Credit User: placing order with newly added ZB Credit
  test.describe("Mason Checkout - Logged in: Credit User: placing order with saved credit cards - Scenarios", () => {
    test.use({ storageState: './creditUser2.json' });
    test('Logged in: Credit User: placing order with saved credit cards', async ({ page }) => {
      const guestCheckoutPage = new GuestCheckOutPage(page);
      const pdpPage = new PDPPage(page);
      await pdpPage.clickOnPDPColorVariantButton();
      await pdpPage.clickOnPDPSizeVariantButton();
      await guestCheckoutPage.clickAddToCart();
      await pdpPage.miniCartDrawer();
      await guestCheckoutPage.clickCheckoutOnMyCart();
      await guestCheckoutPage.validateShippingSection();
      await guestCheckoutPage.checkForPaymentEditButton();
      await guestCheckoutPage.clickNewCard();
      await guestCheckoutPage.clickContinueToReview();
      await guestCheckoutPage.validatePlaceOrderButton();
      await guestCheckoutPage.clickOnPlaceOrderButton();
      const orderConfPage = new OrderConfirmationPage(page);
      await orderConfPage.validateOrderConfOrderDetails();
      await orderConfPage.validateOrderConfirmationBillingAddress();
      await orderConfPage.validateOrderConfirmationPaymentCredit();
    });
  });
  //Scenario 10
  test.describe("Mason Checkout - Logged in: Credit Users: placing order with with ZB credit - Scenarios", () => {
    test.use({ storageState: './creditUser2.json' });
    test('Logged in: Credit Users: placing order with with ZB credit', async ({ page }) => {
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
    });
  });


  //Scenario 11
  test.describe("Mason Checkout - Logged in: Credit Users: placing order with with ZB credit - with PromoCode - Scenarios", () => {
    test.use({ storageState: './creditUser2.json' });
    test('Logged in: Credit Users: placing order with with ZB credit - with PromoCode', async ({ page }) => {
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
    });
  });
});


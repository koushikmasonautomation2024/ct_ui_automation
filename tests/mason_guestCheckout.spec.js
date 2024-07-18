const { chromium } = require('playwright');
import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/mason_home_page';
import { SignInPage } from '../pages/mason_signin_page';
import { ResetPage } from '../pages/mason_reset_page';
import { MyAccountPage } from '../pages/mason_myaccount_page';
import { GuestCheckOutPage } from '../pages/mason_guestCheckout_page';
import { PDPPage } from '../pages/mason_pdp_page';
import { allure } from 'allure-playwright';
import { sign } from 'crypto';
require('dotenv').config();

const homepage_data = JSON.parse(JSON.stringify(require('../test_data/mason_sb_home_page_data.json')));
const resetpage_data = JSON.parse(JSON.stringify(require('../test_data/mason_reset_page_data.json')));
const signinpage_data = JSON.parse(JSON.stringify(require('../test_data/mason_signin_page_data.json')));
const myaccountpage_data = JSON.parse(JSON.stringify(require('../test_data/mason_sb_myaccount_page_data.json')));
const checkout_data = JSON.parse(JSON.stringify(require('../test_data/mason_checkout_page_data.json')));
const savedAddress = myaccountpage_data.myaccount_newaddress_firstname + " " + myaccountpage_data.myaccount_newaddress_lastname + " " + myaccountpage_data.myaccount_newaddress_addressline1;
const editAddress = myaccountpage_data.myaccount_editaddress_firstname + " " + myaccountpage_data.myaccount_editaddress_lastname + " " + myaccountpage_data.myaccount_editaddress_addressline1;

test.describe("Mason Checkout - Guest Users - Scenarios", () => {
  test.setTimeout(90000);
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



  test('Verify Checkout Scenario for the guest user', async ({ page }) => {
    // Navigate to the page containing the popular search terms
    const guestCheckoutPage = new GuestCheckOutPage(page);
    //await guestCheckoutPage.selectAnOptionFromSearchSuggestion('Yellow');
    const pdpPage = new PDPPage(page);
    await pdpPage.clickOnPDPColorVariantButton();
    await pdpPage.clickOnPDPSizeVariantButton();
    await guestCheckoutPage.clickAddToCart();
    await pdpPage.miniCartDrawer();
    await guestCheckoutPage.clickCheckoutOnMyCart();
    await guestCheckoutPage.validateSecureCheckout();
    await guestCheckoutPage.continueCheckoutAsGuest();
    //await page.waitForTimeout(5000);
    await guestCheckoutPage.validateShippingSection();

  })

  test('Verify closing of cart - Checkout Scenario for the guest user', async ({ page }) => {
    // Navigate to the page containing the popular search terms
    const guestCheckoutPage = new GuestCheckOutPage(page);
    const pdpPage = new PDPPage(page);
    await pdpPage.clickOnPDPColorVariantButton();
    await pdpPage.clickOnPDPSizeVariantButton();
    await guestCheckoutPage.clickAddToCart();
    await pdpPage.miniCartDrawer();
    await guestCheckoutPage.clickCloseCart();
  })



  test('Validate the Progress Bar for the checkout scenario', async ({ page }) => {
    // Navigate to the page containing the popular search terms
    const guestCheckoutPage = new GuestCheckOutPage(page);
    const pdpPage = new PDPPage(page);
    await pdpPage.clickOnPDPColorVariantButton();
    await pdpPage.clickOnPDPSizeVariantButton();
    await guestCheckoutPage.clickAddToCart();
    await pdpPage.miniCartDrawer();
    await guestCheckoutPage.clickCheckoutOnMyCart();
    await guestCheckoutPage.validateSecureCheckout();
    await guestCheckoutPage.continueCheckoutAsGuest();
    //await page.waitForTimeout(1000);
    await guestCheckoutPage.validateShippingSection();
    await guestCheckoutPage.validateProgressBar();
  })


  test('Verify return to cart for guest user', async ({ page }) => {
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
    await guestCheckoutPage.validateReturnToCart();

  })

  //Need Help section
  test('Verify Need Help section - go to shipping scenario', async ({ page }) => {
    // Navigate to the page containing the popular search terms
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
    await guestCheckoutPage.validateProgressBar();
    await guestCheckoutPage.validateNeedHelpSection();
    await guestCheckoutPage.validateCallSection();
    await guestCheckoutPage.validateEmailSection();

  })

  //New Address
  test('Verify add/edit New Address - go to shipping scenario', async ({ page }) => {
    // Navigate to the page containing the popular search terms
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
    await guestCheckoutPage.validateProgressBar();
    await guestCheckoutPage.validateNewAddressModal();
    await guestCheckoutPage.validateNewAddressModal();
    await guestCheckoutPage.addShippingAddress();
    await guestCheckoutPage.clickOnContinueToPayment();
    await guestCheckoutPage.validateAddressVerification();
    await guestCheckoutPage.validateEditAddress();
    await guestCheckoutPage.clickOnContinueToPayment();
    await guestCheckoutPage.validateAddressVerification();
    await guestCheckoutPage.validatePaymentSection();

  })


  test('Verify Shipping Methods - Guest User - go to shipping scenario', async ({ page }) => {
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

    // List of shipping options to verify
    const shippingOptions = ['Priority', 'Standard', 'Express'];
    for (const option of shippingOptions) {
      await guestCheckoutPage.verifyShippingOptionVisibility(option);
    }
  })


  test('Verify CreateAccount - Guest User - go to shipping scenario', async ({ page }) => {
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
    await guestCheckoutPage.validateCreateAccountOnCheckoutPage();
    await guestCheckoutPage.clickOnSignIn();
  })

})
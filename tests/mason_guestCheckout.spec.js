const { chromium } = require('playwright');
import {test,expect } from '@playwright/test';
import {HomePage} from '../pages/mason_home_page';
import {SignInPage} from '../pages/mason_signin_page';
import {ResetPage} from '../pages/mason_reset_page';
import {MyAccountPage} from '../pages/mason_myaccount_page';
import {GuestCheckOutPage} from '../pages/mason_guestCheckout_page';
import { allure } from 'allure-playwright';
import { sign } from 'crypto';

const homepage_data =JSON.parse(JSON.stringify(require('../test_data/mason_sb_home_page_data.json')));
const resetpage_data =JSON.parse(JSON.stringify(require('../test_data/mason_reset_page_data.json')));
const signinpage_data =JSON.parse(JSON.stringify(require('../test_data/mason_signin_page_data.json')));
const myaccountpage_data =JSON.parse(JSON.stringify(require('../test_data/mason_sb_myaccount_page_data.json')));
const savedAddress = myaccountpage_data.myaccount_newaddress_firstname +" "+ myaccountpage_data.myaccount_newaddress_lastname +" "+ myaccountpage_data.myaccount_newaddress_addressline1;
const editAddress = myaccountpage_data.myaccount_editaddress_firstname +" "+ myaccountpage_data.myaccount_editaddress_lastname +" "+ myaccountpage_data.myaccount_editaddress_addressline1;

test.describe("Mason Guest Checkout Scenario", ()=>{

   test.beforeEach(async({page,isMobile},testInfo)=>{
    test.slow();
    try{  
    await page.goto(process.env.WEB_URL);
    await page.waitForLoadState('networkidle');
    if(isMobile==true){
      const signinPage = new SignInPage(page);  
      await signinPage.clickSignInImage();
      await signinPage.clickSignIn();
      await signinPage.validateSignInDialog();
      await signinPage.login(process.env.USERNAME,process.env.PASSWORD);
      await signinPage.clickSignIn();
    } else {
      
    }
    const masonHomePageScreenshot = await page.screenshot();
    await testInfo.attach('screenshot', { body: masonHomePageScreenshot, contentType: 'image/png' });
    //await page.screenshot({ path: './screenshots/MasonHomePage.png', fullPage: true });
  }catch (error) {
    // Handle the error here
    console.error("An error occurred in test.beforeEach:", error);
}
    
  })
 



test('Verify Checkout Scenario for the guest user', async ({ page }) => {
  // Navigate to the page containing the popular search terms
  const guestCheckoutPage = new GuestCheckOutPage(page);
  await guestCheckoutPage.selectAnOptionFromSearchSuggestion('Yellow');
  await guestCheckoutPage.clickAddToCart();
  await guestCheckoutPage.clickCheckoutOnMyCart();
  await guestCheckoutPage.validateSecureCheckout();
  await guestCheckoutPage.continueCheckoutAsGuest();
  await page.waitForTimeout(5000);
  await guestCheckoutPage.validateShippingSection();
  
})

test('Verify closing of cart - Checkout Scenario for the guest user', async ({ page }) => {
  // Navigate to the page containing the popular search terms
  const guestCheckoutPage = new GuestCheckOutPage(page);
  await guestCheckoutPage.selectAnOptionFromSearchSuggestion('Yellow');
  await guestCheckoutPage.clickAddToCart();
  await guestCheckoutPage.clickCloseCart();
})

test('Verify Checkout Scenario for the guest user - login with no address or credit - go to shipping scenario', async ({ page }) => {
  // Navigate to the page containing the popular search terms
  const guestCheckoutPage = new GuestCheckOutPage(page);
  const signinPage = new SignInPage(page);
  await guestCheckoutPage.selectAnOptionFromSearchSuggestion('Yellow');
  await guestCheckoutPage.clickAddToCart();
  await guestCheckoutPage.clickCheckoutOnMyCart();
  await guestCheckoutPage.validateSecureCheckout();
  await signinPage.login(process.env.NON_CREDIT_USER,process.env.NON_CREDIT_PASSWORD);
  await signinPage.clickSignIn();
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(5000);
  await guestCheckoutPage.validateShippingSection();
  

})

test('Validate the Progress Bar for the checkout scenario', async ({ page }) => {
  // Navigate to the page containing the popular search terms
  const guestCheckoutPage = new GuestCheckOutPage(page);
  await guestCheckoutPage.selectAnOptionFromSearchSuggestion('Yellow');
  await guestCheckoutPage.clickAddToCart();
  await page.waitForTimeout(5000);
  await guestCheckoutPage.clickCheckoutOnMyCart();
  await guestCheckoutPage.validateSecureCheckout();
  await guestCheckoutPage.continueCheckoutAsGuest();
  await page.waitForTimeout(1000);
  await guestCheckoutPage.validateShippingSection();
  await guestCheckoutPage.validateProgressBar();
})


test('Verify Checkout Scenario for the loggedIn user - go to shipping scenario - check progress bar and return to cart', async ({ page }) => {
  // Navigate to the page containing the popular search terms
  const guestCheckoutPage = new GuestCheckOutPage(page);
  const signinPage = new SignInPage(page);
  const homePage = new HomePage(page);
  await homePage.clickOnHomePageSignIn();
  await signinPage.clickSignIn();
  await signinPage.login(process.env.NON_CREDIT_USER,process.env.NON_CREDIT_PASSWORD);
  await signinPage.clickSignIn();
  await page.waitForLoadState('networkidle');
  await guestCheckoutPage.selectAnOptionFromSearchSuggestion('Yellow');
  await guestCheckoutPage.clickAddToCart();
  await page.waitForTimeout(5000);
  await guestCheckoutPage.clickCheckoutOnMyCart();
  await page.waitForTimeout(5000);
  //await guestCheckoutPage.validateSecureCheckout();
  await guestCheckoutPage.validateShippingSection();
  await guestCheckoutPage.validateProgressBar();
  await guestCheckoutPage.validateReturnToCart();

})

//Need Help section
test.only('Verify Need Help section and New Address - Checkout Scenario for the loggedIn user - go to shipping scenario', async ({ page }) => {
  // Navigate to the page containing the popular search terms
  const guestCheckoutPage = new GuestCheckOutPage(page);
  const signinPage = new SignInPage(page);
  const homePage = new HomePage(page);
  await homePage.clickOnHomePageSignIn();
  await signinPage.clickSignIn();
  await signinPage.login(process.env.NON_CREDIT_USER,process.env.NON_CREDIT_PASSWORD);
  await signinPage.clickSignIn();
  await page.waitForLoadState('networkidle');
  await guestCheckoutPage.selectAnOptionFromSearchSuggestion('Yellow');
  await guestCheckoutPage.clickAddToCart();
  await page.waitForTimeout(5000);
  await guestCheckoutPage.clickCheckoutOnMyCart();
  await page.waitForTimeout(10000);
  await guestCheckoutPage.validateShippingSection();
  await guestCheckoutPage.validateProgressBar();
  await guestCheckoutPage.validateNeedHelpSection();
  await guestCheckoutPage.validateCallSection();
  await guestCheckoutPage.validateEmailSection();
  await guestCheckoutPage.validateNewAddressModal();
  await guestCheckoutPage.validateAddNewAddress();
})


test('Verify Shipping Methods - Checkout Scenario for the loggedIn user - go to shipping scenario', async ({ page }) => {
  // Navigate to the page containing the popular search terms
  const guestCheckoutPage = new GuestCheckOutPage(page);
  const signinPage = new SignInPage(page);
  const homePage = new HomePage(page);
  await homePage.clickOnHomePageSignIn();
  await signinPage.clickSignIn();
  await signinPage.login(process.env.NON_CREDIT_USER,process.env.NON_CREDIT_PASSWORD);
  await signinPage.clickSignIn();
  await guestCheckoutPage.selectAnOptionFromSearchSuggestion('Yellow');
  await guestCheckoutPage.clickAddToCart();
  await page.waitForTimeout(5000);
  await guestCheckoutPage.clickCheckoutOnMyCart();
  await page.waitForTimeout(10000);
  await guestCheckoutPage.validateShippingSection();

// List of shipping options to verify
  const shippingOptions = ['Priority', 'Standard', 'Express'];
  for (const option of shippingOptions) {
    await guestCheckoutPage.verifyShippingOptionVisibility(option);
  }
})


test('Verify Shipping Address Options - Checkout Scenario for the loggedIn user - go to shipping section', async ({ page }) => {
  // Navigate to the page containing the popular search terms
  const guestCheckoutPage = new GuestCheckOutPage(page);
  const signinPage = new SignInPage(page);
  const homePage = new HomePage(page);
  await homePage.clickOnHomePageSignIn();
  await signinPage.clickSignIn();
  await signinPage.login(process.env.PAYMENT_USERNAME,process.env.PAYMENT_PASSWORD);
  await signinPage.clickSignIn();
  await guestCheckoutPage.selectAnOptionFromSearchSuggestion('Yellow');
  await guestCheckoutPage.clickAddToCart();
  await page.waitForTimeout(5000);
  await guestCheckoutPage.clickCheckoutOnMyCart();
  await page.waitForTimeout(10000);
  await guestCheckoutPage.validateShippingSection();
  await guestCheckoutPage.validateShippingAddressRadioButtons();
  await guestCheckoutPage.validateSavedAddressisSelectedbyDefault();
  await guestCheckoutPage.validateSavedAddress();
})

})
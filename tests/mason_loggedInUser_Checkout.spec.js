const { chromium } = require('playwright');
import {test,expect } from '@playwright/test';
import {HomePage} from '../pages/mason_home_page';
import {SignInPage} from '../pages/mason_signin_page';
import {PDPPage} from '../pages/mason_pdp_page';
import {SignInPageNew} from '../pages/mason_signin_page1';
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

test.describe("Mason LoggedIn User Checkout Scenario", ()=>{

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
 


test('Verify Checkout Scenario for the guest user - login with no address or credit - go to shipping scenario', async ({ page }) => {
  // Navigate to the page containing the popular search terms
  const guestCheckoutPage = new GuestCheckOutPage(page);
  const signinPage = new SignInPage(page);
  const signinPageNew = new SignInPageNew(page);
  const pdpPage = new PDPPage(page);
  await guestCheckoutPage.selectAnOptionFromSearchSuggestion('Pant');
  await pdpPage.clickOnPDPColorVariantButton();
  await pdpPage.clickOnPDPSizeVariantButton();
  await guestCheckoutPage.clickAddToCart();
  await pdpPage.miniCartDrawer();
  await guestCheckoutPage.clickCheckoutOnMyCart();
  await guestCheckoutPage.validateSecureCheckout();
  await signinPage.login(process.env.NON_CREDIT_USER,process.env.NON_CREDIT_PASSWORD);
  await signinPage.clickSignIn();
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(5000);
  await guestCheckoutPage.validateShippingSection();
  

})




test('Verify Checkout Scenario for the loggedIn user - go to shipping scenario - check progress bar and return to cart', async ({ page }) => {
  // Navigate to the page containing the popular search terms
  const guestCheckoutPage = new GuestCheckOutPage(page);
  const signinPage = new SignInPage(page);
  const homePage = new HomePage(page);
  const pdpPage = new PDPPage(page);
  const signinPageNew = new SignInPageNew(page);
  await homePage.clickOnHomePageSignIn();
  await signinPage.clickSignIn();
  await signinPage.login(process.env.NON_CREDIT_USER,process.env.NON_CREDIT_PASSWORD);
  await signinPage.clickSignIn();
  await signinPageNew.waitForMyAccountDashboardLoad();
  //await signinPageNew.validateSignInMessage(signinpage_data.signin_success_text);
  await page.waitForLoadState('networkidle');
  await guestCheckoutPage.selectAnOptionFromSearchSuggestion('Pant');
  await pdpPage.clickOnPDPColorVariantButton();
  await pdpPage.clickOnPDPSizeVariantButton();
  await guestCheckoutPage.clickAddToCart();
  await pdpPage.miniCartDrawer();
  await guestCheckoutPage.clickCheckoutOnMyCart();
  await page.waitForTimeout(5000);
  //await guestCheckoutPage.validateSecureCheckout();
  await guestCheckoutPage.validateShippingSection();
  await guestCheckoutPage.validateProgressBar();
  await guestCheckoutPage.validateReturnToCart();

})

//Need Help section
test('Verify Need Help section - Checkout Scenario for the loggedIn user - go to shipping scenario', async ({ page }) => {
  // Navigate to the page containing the popular search terms
  const guestCheckoutPage = new GuestCheckOutPage(page);
  const signinPage = new SignInPage(page);
  const homePage = new HomePage(page);
  const pdpPage = new PDPPage(page);
  const signinPageNew = new SignInPageNew(page);
  await homePage.clickOnHomePageSignIn();
  await signinPage.clickSignIn();
  await signinPage.login(process.env.NON_CREDIT_USER,process.env.NON_CREDIT_PASSWORD);
  await signinPage.clickSignIn();
  await signinPageNew.waitForMyAccountDashboardLoad();
  //await signinPageNew.validateSignInMessage(signinpage_data.signin_success_text);
  await page.waitForLoadState('networkidle');
  await guestCheckoutPage.selectAnOptionFromSearchSuggestion('Pant');
  await pdpPage.clickOnPDPColorVariantButton();
  await pdpPage.clickOnPDPSizeVariantButton();
  await guestCheckoutPage.clickAddToCart();
  await pdpPage.miniCartDrawer();
  await guestCheckoutPage.clickCheckoutOnMyCart();
  await page.waitForTimeout(10000);
  await guestCheckoutPage.validateShippingSection();
  await guestCheckoutPage.validateProgressBar();
  await guestCheckoutPage.validateNeedHelpSection();
  await guestCheckoutPage.validateCallSection();
  await guestCheckoutPage.validateEmailSection();
})

//Need Help section
test('Verify add New Address - Checkout Scenario for the loggedIn user - go to shipping scenario', async ({ page }) => {
  // Navigate to the page containing the popular search terms
  const guestCheckoutPage = new GuestCheckOutPage(page);
  const signinPage = new SignInPage(page);
  const homePage = new HomePage(page);
  const pdpPage = new PDPPage(page);
  const signinPageNew = new SignInPageNew(page);
  await homePage.clickOnHomePageSignIn();
  await signinPage.clickSignIn();
  await signinPage.login(process.env.NON_CREDIT_USER,process.env.NON_CREDIT_PASSWORD);
  await signinPage.clickSignIn();
  await signinPageNew.waitForMyAccountDashboardLoad();
  //await signinPageNew.validateSignInMessage(signinpage_data.signin_success_text);
  await page.waitForLoadState('networkidle');
  await guestCheckoutPage.selectAnOptionFromSearchSuggestion('Pant');
  await pdpPage.clickOnPDPColorVariantButton();
  await pdpPage.clickOnPDPSizeVariantButton();
  
  await guestCheckoutPage.clickAddToCart();
  await pdpPage.miniCartDrawer();
  await guestCheckoutPage.clickCheckoutOnMyCart();
  await page.waitForTimeout(10000);
  await guestCheckoutPage.validateShippingSection();
  await guestCheckoutPage.validateProgressBar();
  await guestCheckoutPage.validateNewAddressModal();
  // await guestCheckoutPage.validateAddNewAddress();
  // await page.waitForLoadState('networkidle');
  // await guestCheckoutPage.validateEditAddress();
  // await guestCheckoutPage.validatePaymentSection();

  await guestCheckoutPage.addShippingAddress();
  await guestCheckoutPage.clickOnContinueToPayment();
  await guestCheckoutPage.validateAddressVerification();
  await guestCheckoutPage.validatePaymentSection();
  
})


test('Verify Shipping Methods - Checkout Scenario for the loggedIn user - go to shipping scenario', async ({ page }) => {
  // Navigate to the page containing the popular search terms
  const guestCheckoutPage = new GuestCheckOutPage(page);
  const signinPage = new SignInPage(page);
  const homePage = new HomePage(page);
  const pdpPage = new PDPPage(page);
  const signinPageNew = new SignInPageNew(page);
  await homePage.clickOnHomePageSignIn();
  await signinPage.clickSignIn();
  await signinPage.login(process.env.NON_CREDIT_USER,process.env.NON_CREDIT_PASSWORD);
  await signinPage.clickSignIn();
  await signinPageNew.waitForMyAccountDashboardLoad();
  //await signinPageNew.validateSignInMessage(signinpage_data.signin_success_text);
  await page.waitForLoadState('networkidle');
  await guestCheckoutPage.selectAnOptionFromSearchSuggestion('Pant');
  await pdpPage.clickOnPDPColorVariantButton();
  await pdpPage.clickOnPDPSizeVariantButton();
  await guestCheckoutPage.clickAddToCart();
  await pdpPage.miniCartDrawer();
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
  const pdpPage = new PDPPage(page);
  const signinPageNew = new SignInPageNew(page);
  await homePage.clickOnHomePageSignIn();
  await signinPage.clickSignIn();
  await signinPage.login(process.env.PAYMENT_USERNAME,process.env.PAYMENT_PASSWORD);
  await signinPage.clickSignIn();
  await signinPageNew.waitForMyAccountDashboardLoad();
  //await signinPageNew.validateSignInMessage(signinpage_data.signin_success_text);
  await page.waitForLoadState('networkidle');
  await guestCheckoutPage.selectAnOptionFromSearchSuggestion('Pant');
  await pdpPage.clickOnPDPColorVariantButton();
  await pdpPage.clickOnPDPSizeVariantButton();
  await guestCheckoutPage.clickAddToCart();
  await pdpPage.miniCartDrawer();
  await guestCheckoutPage.clickCheckoutOnMyCart();
  await page.waitForTimeout(10000);
  await guestCheckoutPage.validateShippingSection();
  await guestCheckoutPage.validateShippingAddressRadioButtons();
  await guestCheckoutPage.validateSavedAddressisSelectedbyDefault();
  await guestCheckoutPage.validateSavedAddress();
})

test.only('Verify Edit Shipping Address Options - Checkout Scenario for the loggedIn user - go to shipping section', async ({ page }) => {
  // Navigate to the page containing the popular search terms
  const guestCheckoutPage = new GuestCheckOutPage(page);
  const signinPage = new SignInPage(page);
  const homePage = new HomePage(page);
  const pdpPage = new PDPPage(page);
  const signinPageNew = new SignInPageNew(page);
  await homePage.clickOnHomePageSignIn();
  await signinPage.clickSignIn();
  await signinPage.login(process.env.PAYMENT_USERNAME,process.env.PAYMENT_PASSWORD);
  await signinPage.clickSignIn();
  await signinPageNew.waitForMyAccountDashboardLoad();
  //await signinPageNew.validateSignInMessage(signinpage_data.signin_success_text);
  await page.waitForLoadState('networkidle');
  await guestCheckoutPage.selectAnOptionFromSearchSuggestion('Pant');
  await pdpPage.clickOnPDPColorVariantButton();
  await pdpPage.clickOnPDPSizeVariantButton();
  await guestCheckoutPage.clickAddToCart();
  await pdpPage.miniCartDrawer();
  await guestCheckoutPage.clickCheckoutOnMyCart();
  await page.waitForTimeout(10000);
 // await guestCheckoutPage.validateShippingSection();
  await guestCheckoutPage.validateEditAddress();
  await guestCheckoutPage.clickOnContinueToPayment();
  await guestCheckoutPage.validateAddressVerification();
  await guestCheckoutPage.validatePaymentSection();
})

test('Verify Gift Message Options - Checkout Scenario for the loggedIn user - go to shipping section', async ({ page }) => {
  // Navigate to the page containing the popular search terms
  const guestCheckoutPage = new GuestCheckOutPage(page);
  const signinPage = new SignInPage(page);
  const homePage = new HomePage(page);
  const pdpPage = new PDPPage(page);
  const signinPageNew = new SignInPageNew(page);
  await homePage.clickOnHomePageSignIn();
  await signinPage.clickSignIn();
  await signinPage.login(process.env.NON_CREDIT_USER,process.env.NON_CREDIT_PASSWORD);
  await signinPage.clickSignIn();
  await signinPageNew.waitForMyAccountDashboardLoad();
  //await signinPageNew.validateSignInMessage(signinpage_data.signin_success_text);
  await page.waitForLoadState('networkidle');
  await guestCheckoutPage.selectAnOptionFromSearchSuggestion('Pant');
  await pdpPage.clickOnPDPColorVariantButton();
  await pdpPage.clickOnPDPSizeVariantButton();
  
  await guestCheckoutPage.clickAddToCart();
  await pdpPage.miniCartDrawer();
  await guestCheckoutPage.clickCheckoutOnMyCart();
  await page.waitForTimeout(10000);
  await guestCheckoutPage.validateShippingSection();
  await guestCheckoutPage.validateGiftMessage();
})

test('Verify Items in Cart section - open/close - Checkout Scenario for the loggedIn user - go to shipping section', async ({ page }) => {
  // Navigate to the page containing the popular search terms
  const guestCheckoutPage = new GuestCheckOutPage(page);
  const signinPage = new SignInPage(page);
  const homePage = new HomePage(page);
  const pdpPage = new PDPPage(page);
  const signinPageNew = new SignInPageNew(page);
  await homePage.clickOnHomePageSignIn();
  await signinPage.clickSignIn();
  await signinPage.login(process.env.NON_CREDIT_USER,process.env.NON_CREDIT_PASSWORD);
  await signinPage.clickSignIn();
  await signinPageNew.waitForMyAccountDashboardLoad();
  //await signinPageNew.validateSignInMessage(signinpage_data.signin_success_text);
  await page.waitForLoadState('networkidle');
  await guestCheckoutPage.selectAnOptionFromSearchSuggestion('Pant');
  await pdpPage.clickOnPDPColorVariantButton();
  await pdpPage.clickOnPDPSizeVariantButton();
  
  await guestCheckoutPage.clickAddToCart();
  await pdpPage.miniCartDrawer();
  await guestCheckoutPage.clickCheckoutOnMyCart();
  await page.waitForTimeout(10000);
  await guestCheckoutPage.validateShippingSection();
  await guestCheckoutPage.validateItemsInCartSection();

})


test('Verify shipping section is above Payment section - Checkout Scenario for the loggedIn user - go to shipping section', async ({ page }) => {
  // Navigate to the page containing the popular search terms
  const guestCheckoutPage = new GuestCheckOutPage(page);
  const signinPage = new SignInPage(page);
  const homePage = new HomePage(page);
  const pdpPage = new PDPPage(page);
  const signinPageNew = new SignInPageNew(page);
  await homePage.clickOnHomePageSignIn();
  await signinPage.clickSignIn();
  await signinPage.login(process.env.NON_CREDIT_USER,process.env.NON_CREDIT_PASSWORD);
  await signinPage.clickSignIn();
  await signinPageNew.waitForMyAccountDashboardLoad();
  //await signinPageNew.validateSignInMessage(signinpage_data.signin_success_text);
  await page.waitForLoadState('networkidle');
  await guestCheckoutPage.selectAnOptionFromSearchSuggestion('Pant');
  await page.waitForTimeout(5000);
  await page.waitForLoadState('networkidle');
  await pdpPage.clickOnPDPColorVariantButton();
  await pdpPage.clickOnPDPSizeVariantButton();
  await guestCheckoutPage.clickAddToCart();
  await pdpPage.miniCartDrawer();
  await guestCheckoutPage.clickCheckoutOnMyCart();
  await page.waitForTimeout(10000);
  //await guestCheckoutPage.validateShippingSection();
  // await guestCheckoutPage.validateAddNewAddress();
  // await page.waitForLoadState('networkidle');
  await guestCheckoutPage.validateShippingSectionAbovePaymentSection();
})

})
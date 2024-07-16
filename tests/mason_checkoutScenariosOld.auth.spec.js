const { chromium } = require('playwright');
import {test,expect } from '@playwright/test';
import {HomePage} from '../pages/mason_home_page';
import {SignInPage} from '../pages/mason_signin_page';
import {ResetPage} from '../pages/mason_reset_page';
import {MyAccountPage} from '../pages/mason_myaccount_page';
import { allure } from 'allure-playwright';
import {GuestCheckOutPage} from '../pages/mason_guestCheckout_page';
import { PDPPage } from '../pages/mason_pdp_page';
import {SignInPageNew} from '../pages/mason_signin_page1';
import { sign } from 'crypto';
require('dotenv').config();

const homepage_data =JSON.parse(JSON.stringify(require('../test_data/mason_sb_home_page_data.json')));
const resetpage_data =JSON.parse(JSON.stringify(require('../test_data/mason_reset_page_data.json')));
const signinpage_data =JSON.parse(JSON.stringify(require('../test_data/mason_signin_page_data.json')));
const myaccountpage_data =JSON.parse(JSON.stringify(require('../test_data/mason_sb_myaccount_page_data.json')));
const checkout_data = JSON.parse(JSON.stringify(require('../test_data/mason_checkout_page_data.json')));
const savedAddress = myaccountpage_data.myaccount_newaddress_firstname +" "+ myaccountpage_data.myaccount_newaddress_lastname +" "+ myaccountpage_data.myaccount_newaddress_addressline1;
const editAddress = myaccountpage_data.myaccount_editaddress_firstname +" "+ myaccountpage_data.myaccount_editaddress_lastname +" "+ myaccountpage_data.myaccount_editaddress_addressline1;

test.describe("Mason Checkout - Guest and LoggedIn Users - Scenarios", ()=>{

   test.beforeEach(async({page,isMobile},testInfo)=>{
    test.slow();
    try{  
    await page.goto(checkout_data.add_to_cart_pdp_url);
    await page.waitForLoadState('networkidle');
  }catch (error) {
    // Handle the error here
    console.error("An error occurred in test.beforeEach:", error);
}
    
  })
  
//Scenario 1:
  test("Guest user placing and order with credit card",async({page})=>{ 
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
    await page.waitForLoadState('networkidle');
    await guestCheckoutPage.clickCreditCard();
  //await guestCheckoutPage.clickNewCard();
    await guestCheckoutPage.addCardDetails();
    await guestCheckoutPage.enterEmailDetails(email);
    await guestCheckoutPage.clickContinueToReview();
    await page.waitForLoadState('networkidle');
    await guestCheckoutPage.validatePlaceOrderButton();
    await guestCheckoutPage.clickOnPlaceOrderButton();    
})

//Scenario 2:
test("Guest user placing and order with ZB credit",async({page})=>{ 
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
  await page.waitForLoadState('networkidle');
  await guestCheckoutPage.fillDOB();
  await guestCheckoutPage.fillSSN();
  await guestCheckoutPage.validateTermsAndConditionSection();
  await guestCheckoutPage.enterEmailDetails(email);
  await guestCheckoutPage.fillPassword(password);
  await guestCheckoutPage.clickContinueToReview();
  await page.waitForLoadState('networkidle');
  await guestCheckoutPage.validatePlaceOrderButton();
  await guestCheckoutPage.clickOnPlaceOrderButton();
  

  
})


//Scenario 3:
test("Guest user placing and order with ZB credit - with PromoCode",async({page})=>{ 
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
  await page.waitForLoadState('networkidle');
  await guestCheckoutPage.fillDOB();
  await guestCheckoutPage.fillSSN();
  await guestCheckoutPage.validateTermsAndConditionSection();
  await guestCheckoutPage.enterEmailDetails(email);
  await guestCheckoutPage.fillPassword(password);
  await guestCheckoutPage.clickContinueToReview();
  await page.waitForLoadState('networkidle');
  await guestCheckoutPage.validatePlaceOrderButton();
  await guestCheckoutPage.clickOnPlaceOrderButton();
  

  
})

//Scenario 4
test('Logged in: Non Credit Users: placing order with newly added credit card', async ({ page }) => {
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
  await page.waitForLoadState('networkidle');
  await pdpPage.clickOnPDPColorVariantButton();
  await pdpPage.clickOnPDPSizeVariantButton();
  await guestCheckoutPage.clickAddToCart();
  await pdpPage.miniCartDrawer();
  await guestCheckoutPage.clickCheckoutOnMyCart();
  await guestCheckoutPage.validateShippingSection();
  await guestCheckoutPage.clickCreditCard();
  //await guestCheckoutPage.clickNewCard();
    await guestCheckoutPage.addCardDetails();
    //await guestCheckoutPage.enterEmailDetails(email);
    await guestCheckoutPage.clickContinueToReview();
    await page.waitForLoadState('networkidle');
    await guestCheckoutPage.validatePlaceOrderButton();
    await guestCheckoutPage.clickOnPlaceOrderButton(); 

})


//Scenario 5
test('Logged in: Non Credit Users: placing order with saved credit card', async ({ page }) => {
  // Navigate to the page containing the popular search terms
  const guestCheckoutPage = new GuestCheckOutPage(page);
  const signinPage = new SignInPage(page);
  const homePage = new HomePage(page);
  const pdpPage = new PDPPage(page);
  const signinPageNew = new SignInPageNew(page);
  await homePage.clickOnHomePageSignIn();
  await signinPage.clickSignIn();
  await signinPage.login(process.env.CARD_USER,process.env.CREDIT_USER_PASSWORD);
  await signinPage.clickSignIn();
  await page.waitForLoadState('networkidle');
  await pdpPage.clickOnPDPColorVariantButton();
  await pdpPage.clickOnPDPSizeVariantButton();
  await guestCheckoutPage.clickAddToCart();
  await pdpPage.miniCartDrawer();
  await guestCheckoutPage.clickCheckoutOnMyCart();
  await page.waitForLoadState('networkidle');
  await guestCheckoutPage.validateShippingSection();
  await guestCheckoutPage.clickOnContinueToPayment();
  await page.waitForLoadState('networkidle');
  await guestCheckoutPage.clickCreditCard();
  await guestCheckoutPage.clickContinueToReview();
  await page.waitForLoadState('networkidle');
  await guestCheckoutPage.validatePlaceOrderButton();
  await guestCheckoutPage.clickOnPlaceOrderButton(); 

})

//Scenario 6
test('Logged in: Non Credit Users: placing order with ZB Credit', async ({ page }) => {
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
  await page.waitForLoadState('networkidle');
  await pdpPage.clickOnPDPColorVariantButton();
  await pdpPage.clickOnPDPSizeVariantButton();
  await guestCheckoutPage.clickAddToCart();
  await pdpPage.miniCartDrawer();
  await guestCheckoutPage.clickCheckoutOnMyCart();
  await page.waitForLoadState('networkidle');
  await guestCheckoutPage.validateShippingSection();
  await page.waitForLoadState('networkidle');
  await guestCheckoutPage.fillDOB();
  await guestCheckoutPage.fillSSN();
 // await guestCheckoutPage.validateTermsAndConditionSection();
  await guestCheckoutPage.clickContinueToReview();
  await page.waitForLoadState('networkidle');
  await guestCheckoutPage.validatePlaceOrderButton();
  await guestCheckoutPage.clickOnPlaceOrderButton(); 

})

//Scenario 7
test('Logged in: Non Credit Users: placing order with ZB Credit - with PromoCode', async ({ page }) => {
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
  await page.waitForLoadState('networkidle');
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
  await guestCheckoutPage.fillDOB();
  await guestCheckoutPage.fillSSN();
 // await guestCheckoutPage.validateTermsAndConditionSection();
  await guestCheckoutPage.clickContinueToReview();
  await page.waitForLoadState('networkidle');
  await guestCheckoutPage.validatePlaceOrderButton();
  await guestCheckoutPage.clickOnPlaceOrderButton(); 

})

//Scenario 10
test('Logged in: Credit Users: placing order with with ZB credit', async ({ page }) => {
  // Navigate to the page containing the popular search terms
  const guestCheckoutPage = new GuestCheckOutPage(page);
  const signinPage = new SignInPage(page);
  const homePage = new HomePage(page);
  const pdpPage = new PDPPage(page);
  const signinPageNew = new SignInPageNew(page);
  await homePage.clickOnHomePageSignIn();
  await signinPage.clickSignIn();
  await signinPage.login(process.env.CREDIT_USER_2,process.env.CREDIT_USER_PASSWORD);
  await signinPage.clickSignIn();
  await page.waitForLoadState('networkidle');
  await pdpPage.clickOnPDPColorVariantButton();
  await pdpPage.clickOnPDPSizeVariantButton();
  await guestCheckoutPage.clickAddToCart();
  await pdpPage.miniCartDrawer();
  await guestCheckoutPage.clickCheckoutOnMyCart();
  await page.waitForLoadState('networkidle');
  await guestCheckoutPage.validateShippingSection();
  await page.waitForLoadState('networkidle');
  // await guestCheckoutPage.validatePromoCodeSection();
  // await guestCheckoutPage.validateValidPromoCode();
 // await guestCheckoutPage.validateTermsAndConditionSection();
  //await guestCheckoutPage.clickContinueToReview();
  await page.waitForLoadState('networkidle');
  await guestCheckoutPage.validatePlaceOrderButton();
  await guestCheckoutPage.clickOnPlaceOrderButton(); 
  await page.waitForLoadState('networkidle');
})


//Scenario 11
test('Logged in: Credit Users: placing order with with ZB credit - with PromoCode', async ({ page }) => {
  // Navigate to the page containing the popular search terms
  const guestCheckoutPage = new GuestCheckOutPage(page);
  const signinPage = new SignInPage(page);
  const homePage = new HomePage(page);
  const pdpPage = new PDPPage(page);
  const signinPageNew = new SignInPageNew(page);
  await homePage.clickOnHomePageSignIn();
  await signinPage.clickSignIn();
  await signinPage.login(process.env.CREDIT_USER_2,process.env.CREDIT_USER_PASSWORD);
  await signinPage.clickSignIn();
  await page.waitForLoadState('networkidle');
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
 // await guestCheckoutPage.validateTermsAndConditionSection();
  //await guestCheckoutPage.clickContinueToReview();
  await page.waitForLoadState('networkidle');
  await guestCheckoutPage.validatePlaceOrderButton();
  await guestCheckoutPage.clickOnPlaceOrderButton(); 
  await page.waitForLoadState('networkidle');
})


//Scenario 8
test.only('Logged in: Credit Users: placing order with new credit card', async ({ page }) => {
  // Navigate to the page containing the popular search terms
  const guestCheckoutPage = new GuestCheckOutPage(page);
  const signinPage = new SignInPage(page);
  const homePage = new HomePage(page);
  const pdpPage = new PDPPage(page);
  const signinPageNew = new SignInPageNew(page);
  await homePage.clickOnHomePageSignIn();
  await signinPage.clickSignIn();
  await signinPage.login(process.env.CREDIT_USER_2,process.env.CREDIT_USER_PASSWORD);
  await signinPage.clickSignIn();
  await page.waitForLoadState('networkidle');
  await pdpPage.clickOnPDPColorVariantButton();
  await pdpPage.clickOnPDPSizeVariantButton();
  await guestCheckoutPage.clickAddToCart();
  await pdpPage.miniCartDrawer();
  await guestCheckoutPage.clickCheckoutOnMyCart();
  await page.waitForLoadState('networkidle');
  await guestCheckoutPage.validateShippingSection();
  await page.waitForLoadState('networkidle');
  await guestCheckoutPage.clickOnEditAddress();
  await guestCheckoutPage.clickOnContinueToPayment();
  await page.waitForLoadState('networkidle');
  await guestCheckoutPage.clickCreditCard();
  await guestCheckoutPage.clickNewCard();
  await guestCheckoutPage.addCardDetails();
  //await guestCheckoutPage.enterEmailDetails(email);
  await guestCheckoutPage.clickContinueToReview();
  await page.waitForLoadState('networkidle');
  await guestCheckoutPage.validatePlaceOrderButton();
  await guestCheckoutPage.clickOnPlaceOrderButton(); 
  await page.waitForLoadState('networkidle');
})



//Scenario 9
test('Logged in: Credit Users: placing order with saved credit card', async ({ page }) => {
  // Navigate to the page containing the popular search terms
  const guestCheckoutPage = new GuestCheckOutPage(page);
  const signinPage = new SignInPage(page);
  const homePage = new HomePage(page);
  const pdpPage = new PDPPage(page);
  const signinPageNew = new SignInPageNew(page);
  await homePage.clickOnHomePageSignIn();
  await signinPage.clickSignIn();
  await signinPage.login(process.env.CREDIT_USER_2,process.env.CREDIT_USER_PASSWORD);
  await signinPage.clickSignIn();
  await page.waitForLoadState('networkidle');
  await pdpPage.clickOnPDPColorVariantButton();
  await pdpPage.clickOnPDPSizeVariantButton();
  await guestCheckoutPage.clickAddToCart();
  await pdpPage.miniCartDrawer();
  await guestCheckoutPage.clickCheckoutOnMyCart();
  await page.waitForLoadState('networkidle');
  await guestCheckoutPage.validateShippingSection();
  await page.waitForLoadState('networkidle');
  await guestCheckoutPage.clickOnEditAddress();
  await guestCheckoutPage.clickOnContinueToPayment();
  await page.waitForLoadState('networkidle');
  await guestCheckoutPage.clickCreditCard();
  
  //await guestCheckoutPage.enterEmailDetails(email);
  await guestCheckoutPage.clickContinueToReview();
  await page.waitForLoadState('networkidle');
  await guestCheckoutPage.validatePlaceOrderButton();
  await guestCheckoutPage.clickOnPlaceOrderButton(); 
  await page.waitForLoadState('networkidle');
})



})
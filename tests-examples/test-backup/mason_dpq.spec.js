const { chromium } = require('playwright');
import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/mason_home_page';
import { SignInPage } from '../pages/mason_signin_page';
import { MasonDPQPage } from '../pages/mason_dpq_page';
import { GuestCheckOutPage } from '../pages/mason_guestCheckout_page';
import { CreateAccountPage } from '../pages/mason_createAccount_page';
import { MyAccountPage } from '../pages/mason_myaccount_page';
import { MyAccountAddressPage } from '../pages/mason_myAccountAddress_page';
import { allure } from 'allure-playwright';
import { sign } from 'crypto';

const homepage_data = JSON.parse(JSON.stringify(require('../test_data/mason_sb_home_page_data.json')));
const resetpage_data = JSON.parse(JSON.stringify(require('../test_data/mason_reset_page_data.json')));
const signinpage_data = JSON.parse(JSON.stringify(require('../test_data/mason_signin_page_data.json')));
const myaccountpage_data = JSON.parse(JSON.stringify(require('../test_data/mason_sb_myaccount_page_data.json')));
const savedAddress = myaccountpage_data.myaccount_newaddress_firstname + " " + myaccountpage_data.myaccount_newaddress_lastname + " " + myaccountpage_data.myaccount_newaddress_addressline1;
const editAddress = myaccountpage_data.myaccount_editaddress_firstname + " " + myaccountpage_data.myaccount_editaddress_lastname + " " + myaccountpage_data.myaccount_editaddress_addressline1;

test.describe("Mason DPQ Scenarios", () => {


  test.beforeEach(async ({ page, isMobile }, testInfo) => {
    test.slow();
    try {
      await page.goto(process.env.WEB_URL);
      await page.waitForLoadState('networkidle');
    } catch (error) {
      // Handle the error here
      console.error("An error occurred in test.beforeEach:", error);
    }
  })


  //SB-DPQ001 //SB-DPQ002 //SB-DPQ003
  test('Verify DPQ Navigation from the link', async ({ page }) => {
    // Navigate to the page containing the popular search terms
    const dpqPage = new MasonDPQPage(page);
    await dpqPage.validateDPQLink();
    await dpqPage.clickDPQLink();
    await page.waitForLoadState('networkidle');
    await dpqPage.validateLogoImage();
    await dpqPage.validateLogoAtCentre();
    await dpqPage.validateTextUnderLogo();
    await dpqPage.validateTextPositionUnderLogo();
    await dpqPage.validateSignInButton();


  })

  //SB-DPQ001 //SB-DPQ002//SB-DPQ003
  test('Verify DPQ Navigation from the link and Logo with it at centre check', async ({ page }) => {
    // Navigate to the page containing the popular search terms
    const dpqPage = new MasonDPQPage(page);
    await dpqPage.validateDPQLink();
    await dpqPage.clickDPQLink();
    await page.waitForLoadState('networkidle');
    await dpqPage.validateLogoImage();
    await dpqPage.validateLogoAtCentre();

  })

  //SB-DPQ001 //SB-DPQ002 //SB-DPQ003
  test('Verify DPQ Navigation from the link and the text below logo', async ({ page }) => {
    // Navigate to the page containing the popular search terms
    const dpqPage = new MasonDPQPage(page);
    await dpqPage.validateDPQLink();
    await dpqPage.clickDPQLink();
    await page.waitForLoadState('networkidle');
    await dpqPage.validateLogoImage();
    await dpqPage.validateTextUnderLogo();
    await dpqPage.validateTextPositionUnderLogo();

  })

  //SB-DPQ001 //SB-DPQ002 //SB-DPQ003
  test('Verify DPQ Navigation from the link and the sign-in button on the page', async ({ page }) => {
    // Navigate to the page containing the popular search terms
    const dpqPage = new MasonDPQPage(page);
    await dpqPage.validateDPQLink();
    await dpqPage.clickDPQLink();
    await page.waitForLoadState('networkidle');
    await dpqPage.validateLogoImage();
    await dpqPage.validateSignInButton();
  })

  //SB-DPQ005 //SB-DPQ006
  test('Verify DPQ Navigation from the link and the PreQualified text on the page', async ({ page }) => {
    // Navigate to the page containing the popular search terms
    const dpqPage = new MasonDPQPage(page);
    await dpqPage.validateDPQLink();
    await dpqPage.clickDPQLink();
    await page.waitForLoadState('networkidle');
    await dpqPage.validateLogoImage();
    await dpqPage.validateGetPreQualifiedText();

  })

  //SB-DPQ005 //SB-DPQ006
  test('Verify DPQ Navigation from the link and your information section on the page', async ({ page }) => {
    // Navigate to the page containing the popular search terms
    const dpqPage = new MasonDPQPage(page);
    await dpqPage.validateDPQLink();
    await dpqPage.clickDPQLink();
    await page.waitForLoadState('networkidle');
    await dpqPage.validateLogoImage();
    await dpqPage.validateYourInformationSection();
  })


  //SB-DPQ005 //SB-DPQ006
  test('Verify DPQ Navigation from the link and the Create Account section on the page', async ({ page }) => {
    // Navigate to the page containing the popular search terms
    const dpqPage = new MasonDPQPage(page);
    await dpqPage.validateDPQLink();
    await dpqPage.clickDPQLink();
    await page.waitForLoadState('networkidle');
    await dpqPage.validateLogoImage();
    await dpqPage.validateCreateAccountSection();

  })


  //SB-DPQ024 //SB-DPQ025
  test('Verify DPQ Navigation from the link and the Terms&Conditions on the page', async ({ page }) => {
    // Navigate to the page containing the popular search terms
    const dpqPage = new MasonDPQPage(page);
    await dpqPage.validateDPQLink();
    await dpqPage.clickDPQLink();
    await page.waitForLoadState('networkidle');
    await dpqPage.validateLogoImage();
    await dpqPage.validateTermsAndConditionSection();
    await dpqPage.validateElectronicCommunication();
  })

  //SB-DPQ026
  test('Verify DPQ Navigation from the link and the Electronic Communications on the page', async ({ page }) => {
    // Navigate to the page containing the popular search terms
    const dpqPage = new MasonDPQPage(page);
    await dpqPage.validateDPQLink();
    await dpqPage.clickDPQLink();
    await page.waitForLoadState('networkidle');
    await dpqPage.validateLogoImage();
    await dpqPage.validateElectronicCommunication();
  })


  test('Verify DPQ Navigation from the link - logged In User - submission success and unavailable', async ({ page }) => {
    // Navigate to the page containing the popular search terms

    const firstname = String.fromCharCode(65 + Math.floor(Math.random() * 26)) + [...Array(9)].map(() => String.fromCharCode(97 + Math.floor(Math.random() * 26))).join('');
    const lastname = String.fromCharCode(65 + Math.floor(Math.random() * 26)) + [...Array(9)].map(() => String.fromCharCode(97 + Math.floor(Math.random() * 26))).join('');
    const email = `${firstname.toLowerCase()}.${lastname.toLowerCase()}@automation.com`;
    const password = [...Array(6)].map(() => String.fromCharCode(Math.random() * 26 + 97 | 0)).join('') + String.fromCharCode(Math.random() * 26 + 65 | 0) + (Math.random() * 10 | 0);
    const dpqPage = new MasonDPQPage(page);
    const homePage = new HomePage(page);
    const createAccountPage = new CreateAccountPage(page);
    const guestCheckoutPage = new GuestCheckOutPage(page);
    await homePage.clickOnHomePageSignIn();
    const signinPage = new SignInPage(page);
    await createAccountPage.clickOnCreateAccount();
    await createAccountPage.enterNameDetailsOnCreateAccountPage('Clark', 'Kent');
    await createAccountPage.enterEmailOnAccountPage(email);
    await createAccountPage.enterPasswordOnCreateAccountPage(password);
    await createAccountPage.clickOnCreateAccount();
    await dpqPage.validateDPQLink();
    await dpqPage.clickDPQLink();
    await page.waitForLoadState('networkidle');

    //await dpqPage.validateLogoImage();
    await dpqPage.validateElectronicCommunication();
    await dpqPage.addAddress();
    await dpqPage.fillDOB();
    await dpqPage.fillSNN();
    await dpqPage.validateTermsAndConditionSection();
    await dpqPage.clickSubmit();
    await guestCheckoutPage.validateAddressVerification();
    await page.waitForLoadState('networkidle');
    const url1 = page.url();
    console.log(url1);
    await dpqPage.validateSubmissionSuccess();
  })


  test('Verify DPQ Navigation from the link - logged In User - submission failure', async ({ page }) => {
    // Navigate to the page containing the popular search terms

    const firstname = String.fromCharCode(65 + Math.floor(Math.random() * 26)) + [...Array(9)].map(() => String.fromCharCode(97 + Math.floor(Math.random() * 26))).join('');
    const lastname = String.fromCharCode(65 + Math.floor(Math.random() * 26)) + [...Array(9)].map(() => String.fromCharCode(97 + Math.floor(Math.random() * 26))).join('');
    const email = `${firstname.toLowerCase()}.${lastname.toLowerCase()}@automation.com`;
    const password = [...Array(6)].map(() => String.fromCharCode(Math.random() * 26 + 97 | 0)).join('') + String.fromCharCode(Math.random() * 26 + 65 | 0) + (Math.random() * 10 | 0);
    const dpqPage = new MasonDPQPage(page);
    const homePage = new HomePage(page);
    const createAccountPage = new CreateAccountPage(page);
    const guestCheckoutPage = new GuestCheckOutPage(page);
    await homePage.clickOnHomePageSignIn();
    const signinPage = new SignInPage(page);
    await createAccountPage.clickOnCreateAccount();
    await createAccountPage.enterNameDetailsOnCreateAccountPage('Bruce', 'Banner');
    await createAccountPage.enterEmailOnAccountPage(email);
    await createAccountPage.enterPasswordOnCreateAccountPage(password);
    await createAccountPage.clickOnCreateAccount();
    await dpqPage.validateDPQLink();
    await dpqPage.clickDPQLink();
    await page.waitForLoadState('networkidle');

    //await dpqPage.validateLogoImage();
    await dpqPage.validateElectronicCommunication();
    await dpqPage.addAddress();
    await dpqPage.fillDOB();
    await dpqPage.fillSNN();
    await dpqPage.validateTermsAndConditionSection();
    await dpqPage.clickSubmit();
    await guestCheckoutPage.validateAddressVerification();
    await page.waitForLoadState('networkidle');
    const dpqExpDigit = await dpqPage.validateTheSubmissionProgress();
    console.log(dpqExpDigit);
    await dpqPage.validateSubmissionPageFailure();
  })

  test('Verify DPQ Navigation from the link - logged In User - submission success but with downpayment', async ({ page }) => {
    // Navigate to the page containing the popular search terms

    const firstname = String.fromCharCode(65 + Math.floor(Math.random() * 26)) + [...Array(9)].map(() => String.fromCharCode(97 + Math.floor(Math.random() * 26))).join('');
    const lastname = String.fromCharCode(65 + Math.floor(Math.random() * 26)) + [...Array(9)].map(() => String.fromCharCode(97 + Math.floor(Math.random() * 26))).join('');
    const email = `${firstname.toLowerCase()}.${lastname.toLowerCase()}@automation.com`;
    const password = [...Array(6)].map(() => String.fromCharCode(Math.random() * 26 + 97 | 0)).join('') + String.fromCharCode(Math.random() * 26 + 65 | 0) + (Math.random() * 10 | 0);
    const dpqPage = new MasonDPQPage(page);
    const homePage = new HomePage(page);
    const createAccountPage = new CreateAccountPage(page);
    const guestCheckoutPage = new GuestCheckOutPage(page);
    await homePage.clickOnHomePageSignIn();
    const signinPage = new SignInPage(page);
    await createAccountPage.clickOnCreateAccount();
    await createAccountPage.enterNameDetailsOnCreateAccountPage(firstname, lastname);
    await createAccountPage.enterEmailOnAccountPage(email);
    await createAccountPage.enterPasswordOnCreateAccountPage(password);
    await createAccountPage.clickOnCreateAccount();
    await dpqPage.validateDPQLink();
    await dpqPage.clickDPQLink();
    await page.waitForLoadState('networkidle');

    //await dpqPage.validateLogoImage();
    await dpqPage.validateElectronicCommunication();
    await dpqPage.addAddressForStatus14();
    await dpqPage.fillDOB();
    await dpqPage.fillSNN();
    await dpqPage.validateTermsAndConditionSection();
    await dpqPage.clickSubmit();
    await guestCheckoutPage.validateAddressVerification();
    //const dpqExpDigit = await dpqPage.validateTheSubmissionProgress();
    await page.waitForLoadState('networkidle');
    await dpqPage.validateSubmissionSuccessWithDownPayment();
  })

  test('Verify DPQ Navigation from the link - logged In User - check submission status', async ({ page }) => {
    // Navigate to the page containing the popular search terms

    const firstname = String.fromCharCode(65 + Math.floor(Math.random() * 26)) + [...Array(9)].map(() => String.fromCharCode(97 + Math.floor(Math.random() * 26))).join('');
    const lastname = String.fromCharCode(65 + Math.floor(Math.random() * 26)) + [...Array(9)].map(() => String.fromCharCode(97 + Math.floor(Math.random() * 26))).join('');
    const email = `${firstname.toLowerCase()}.${lastname.toLowerCase()}@automation.com`;
    const password = [...Array(6)].map(() => String.fromCharCode(Math.random() * 26 + 97 | 0)).join('') + String.fromCharCode(Math.random() * 26 + 65 | 0) + (Math.random() * 10 | 0);
    const dpqPage = new MasonDPQPage(page);
    const homePage = new HomePage(page);
    const createAccountPage = new CreateAccountPage(page);
    const guestCheckoutPage = new GuestCheckOutPage(page);
    await homePage.clickOnHomePageSignIn();
    const signinPage = new SignInPage(page);
    await createAccountPage.clickOnCreateAccount();
    await createAccountPage.enterNameDetailsOnCreateAccountPage(firstname, lastname);
    await createAccountPage.enterEmailOnAccountPage(email);
    await createAccountPage.enterPasswordOnCreateAccountPage(password);
    await createAccountPage.clickOnCreateAccount();
    await dpqPage.validateDPQLink();
    await dpqPage.clickDPQLink();
    //await page.waitForLoadState('networkidle');

    //await dpqPage.validateLogoImage();
    await dpqPage.validateElectronicCommunication();
    await dpqPage.addAddress();
    await dpqPage.fillDOB();
    await dpqPage.fillSNN();
    await dpqPage.validateTermsAndConditionSection();
    await dpqPage.clickSubmit();
    await guestCheckoutPage.validateAddressVerification();
    const dpqExpDigit = await dpqPage.validateTheSubmissionProgress();
    //await page.waitForLoadState('networkidle');
    await dpqPage.handleSubmissionScenario(dpqExpDigit);
  })

  test.afterEach(async ({ page }) => {
    try {
      const screenshotPath = `screenshots/DPQ-Screenshoot-${Date.now()}.png`;
      await page.screenshot({ path: screenshotPath, fullPage: true });
      allure.attachment('Full Page Screenshot', Buffer.from(await page.screenshot({ fullPage: true })), 'image/png');
    } catch (error) {
      console.error('Error capturing screenshot:', error);
    }
  });

})

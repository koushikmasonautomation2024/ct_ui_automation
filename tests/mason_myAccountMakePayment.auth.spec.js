const { chromium } = require('playwright');
import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/mason_home_page';
import { SignInPage } from '../pages/mason_signin_page';
import { MyAccountMakePaymentPage } from '../pages/mason_myAccountMakePayment_page';
import { MyAccountPage } from '../pages/mason_myaccount_page';
import { allure } from 'allure-playwright';
import { sign } from 'crypto';
import fs from 'fs';
require('dotenv').config();
const creditUserFile = './credituser.json';
const nonCreditUserFile = './noncredituser.json';
const newUserFile = './newuser.json';
const paymentUserFile = './paymentuser.json';

const homepage_data = JSON.parse(JSON.stringify(require('../test_data/mason_sb_home_page_data.json')));
const resetpage_data = JSON.parse(JSON.stringify(require('../test_data/mason_reset_page_data.json')));
const signinpage_data = JSON.parse(JSON.stringify(require('../test_data/mason_signin_page_data.json')));
const myaccountpage_data = JSON.parse(JSON.stringify(require('../test_data/mason_sb_myaccount_page_data.json')));
const savedAddress = myaccountpage_data.myaccount_newaddress_firstname + " " + myaccountpage_data.myaccount_newaddress_lastname + " " + myaccountpage_data.myaccount_newaddress_addressline1;
const editAddress = myaccountpage_data.myaccount_editaddress_firstname + " " + myaccountpage_data.myaccount_editaddress_lastname + " " + myaccountpage_data.myaccount_editaddress_addressline1;
let loginSuccessful = false;
test.describe("Mason MakePayment Scenarios", () => {

  test.beforeEach(async ({ page, isMobile }, testInfo) => {
    test.slow();
    const storageStatePath = isMobile ? paymentUserFile : paymentUserFile;

    if (fs.existsSync(storageStatePath)) {
      await page.context().addCookies(JSON.parse(fs.readFileSync(storageStatePath, 'utf-8')).cookies);
      loginSuccessful = true;
    } else {
      console.error("Login state is not available, skipping test.");
      test.skip('Skipping test because login state is not available');
    }

    try {
      await page.goto(process.env.WEB_URL);
      //await page.waitForLoadState('networkidle');
    } catch (error) {
      console.error("Navigation failed:", error);
      test.skip('Skipping test because navigation failed');
    }

  })


  //SB-MyA119
  test("Validate user should be able to navigate to Make a Payment Page along with the New Credit card modal checks in My account", async ({ page }, testInfo) => {
    //test.slow();
    if (!loginSuccessful) {
      test.skip('Skipping test due to failed login');
    }
    const myaccountPage = new MyAccountPage(page);
    await myaccountPage.redirectToMyAccount();
    const myaccountMakePaymentpage = new MyAccountMakePaymentPage(page);
    await myaccountPage.clickMakeAPaymentButton();
    await myaccountMakePaymentpage.validateMakeaPaymentPage();
    await myaccountMakePaymentpage.validateNewCreditCardRadioButton();
    await myaccountMakePaymentpage.validateSavedCreditCardRadioButton();
    await myaccountMakePaymentpage.addNewCreditCard();
    await myaccountMakePaymentpage.validateNewCreditCardModal();
  })

  //SB-MyA120
  test("Validate the securitycode tooltip text on hover in the New Credit card modal of Make Payment", async ({ page }, testInfo) => {
    //test.slow();
    if (!loginSuccessful) {
      test.skip('Skipping test due to failed login');
    }
    const myaccountPage = new MyAccountPage(page);
    await myaccountPage.redirectToMyAccount();
    const myaccountMakePaymentpage = new MyAccountMakePaymentPage(page);
    await myaccountPage.clickMakeAPaymentButton();
    await myaccountMakePaymentpage.validateMakeaPaymentPage();
    await myaccountMakePaymentpage.validateNewCreditCardRadioButton();
    await myaccountMakePaymentpage.validateSavedCreditCardRadioButton();
    await myaccountMakePaymentpage.addNewCreditCard();
    await myaccountMakePaymentpage.validateSecurityCodeTooltiphover();
  })

  //SB-MyA121
  test("Validate the RadioButtons in the Billing Address in Make Payment page", async ({ page }, testInfo) => {
    //test.slow();
    if (!loginSuccessful) {
      test.skip('Skipping test due to failed login');
    }
    const myaccountPage = new MyAccountPage(page);
    await myaccountPage.redirectToMyAccount();
    const myaccountMakePaymentpage = new MyAccountMakePaymentPage(page);
    await myaccountPage.clickMakeAPaymentButton();
    await myaccountMakePaymentpage.addNewCreditCard();
    await myaccountMakePaymentpage.validateBillingAddressRadioButtons();

  })

  //SB-MyA124
  test("Validate the New Address Modal in Make Payment page", async ({ page }, testInfo) => {
    //test.slow();
    if (!loginSuccessful) {
      test.skip('Skipping test due to failed login');
    }
    const myaccountPage = new MyAccountPage(page);
    await myaccountPage.redirectToMyAccount();
    const myaccountMakePaymentpage = new MyAccountMakePaymentPage(page);
    await myaccountPage.clickMakeAPaymentButton();
    await myaccountMakePaymentpage.addNewCreditCard();
    await myaccountMakePaymentpage.addNewAddress();
    await myaccountMakePaymentpage.validateNewAddressModal();

  })

  //SB-MyA125
  test("Validate the Saved Address is selected by default if there are addresses added in Make Payment page", async ({ page }, testInfo) => {
    //test.slow();
    if (!loginSuccessful) {
      test.skip('Skipping test due to failed login');
    }
    const myaccountPage = new MyAccountPage(page);
    await myaccountPage.redirectToMyAccount();
    const myaccountMakePaymentpage = new MyAccountMakePaymentPage(page);
    await myaccountPage.clickMakeAPaymentButton();
    await myaccountMakePaymentpage.addNewCreditCard();
    await myaccountMakePaymentpage.validateSavedAddressisSelectedbyDefault();
    await myaccountMakePaymentpage.validateSavedAddressComboBox();

  })

  //SB-MyA126,27,28,29
  test("Validate the ComboBox in the SavedAddress in Make Payment page", async ({ page }, testInfo) => {
    //test.slow();
    if (!loginSuccessful) {
      test.skip('Skipping test due to failed login');
    }
    const myaccountPage = new MyAccountPage(page);
    await myaccountPage.redirectToMyAccount();
    const myaccountMakePaymentpage = new MyAccountMakePaymentPage(page);
    await myaccountPage.clickMakeAPaymentButton();
    await myaccountMakePaymentpage.addNewCreditCard();
    await myaccountMakePaymentpage.validateSavedAddressisSelectedbyDefault();
    await myaccountMakePaymentpage.validateSavedAddressComboBox();
    await myaccountMakePaymentpage.validateSavedAddressList();

  })

  //SB-MyA133
  test("Validate the SavedCC is selected by default when there is default billing address in Make Payment page", async ({ page }, testInfo) => {
    //test.slow();
    if (!loginSuccessful) {
      test.skip('Skipping test due to failed login');
    }
    const myaccountPage = new MyAccountPage(page);
    await myaccountPage.redirectToMyAccount();
    const myaccountMakePaymentpage = new MyAccountMakePaymentPage(page);
    await myaccountPage.clickMakeAPaymentButton();
    await myaccountMakePaymentpage.validateSavedCCisSelectedbyDefault();

  })

  //SB-MyA134
  test("Validate the SavedCC details in the dropdown in Make Payment page", async ({ page }, testInfo) => {
    //test.slow();
    if (!loginSuccessful) {
      test.skip('Skipping test due to failed login');
    }
    const myaccountPage = new MyAccountPage(page);
    await myaccountPage.redirectToMyAccount();
    const myaccountMakePaymentpage = new MyAccountMakePaymentPage(page);
    await myaccountPage.clickMakeAPaymentButton();
    await myaccountMakePaymentpage.validateSavedCCisSelectedbyDefault();
    await myaccountMakePaymentpage.validateSavedCCDropDownField();

  })

  //SB-MyA135,36,37
  test("Validate the selection of CC from savedCC List in Make Payment page", async ({ page }, testInfo) => {
    //test.slow();
    if (!loginSuccessful) {
      test.skip('Skipping test due to failed login');
    }
    const myaccountPage = new MyAccountPage(page);
    await myaccountPage.redirectToMyAccount();
    const myaccountMakePaymentpage = new MyAccountMakePaymentPage(page);
    await myaccountPage.clickMakeAPaymentButton();
    await myaccountMakePaymentpage.validateSavedCCisSelectedbyDefault();
    await myaccountMakePaymentpage.validateSavedCCDropDownField();
    await myaccountMakePaymentpage.selectComboBoxValue(/.+/);
    //await myaccountMakePaymentpage.clickAnOptionFromSavedCCList();

  })


  //SB-MyA138
  test("Validate the selected CC details in Make Payment page", async ({ page }, testInfo) => {
    //test.slow();
    if (!loginSuccessful) {
      test.skip('Skipping test due to failed login');
    }
    const myaccountPage = new MyAccountPage(page);
    await myaccountPage.redirectToMyAccount();
    const myaccountMakePaymentpage = new MyAccountMakePaymentPage(page);
    await myaccountPage.clickMakeAPaymentButton();
    await myaccountMakePaymentpage.validateSavedCCisSelectedbyDefault();
    // await myaccountMakePaymentpage.validateSavedCCDropDownField();
    // await myaccountMakePaymentpage.selectComboBoxValue(/.+/);
    await myaccountMakePaymentpage.validateEditCardlink();
    await myaccountMakePaymentpage.validateCardDetailOnPage();
    await myaccountMakePaymentpage.validateExpiryDetailOnPage();

  })

  //SB-MyA151,52
  test("Validate the Payment section in Make Payment page", async ({ page }, testInfo) => {
    //test.slow();
    if (!loginSuccessful) {
      test.skip('Skipping test due to failed login');
    }
    const myaccountPage = new MyAccountPage(page);
    await myaccountPage.redirectToMyAccount();
    const myaccountMakePaymentpage = new MyAccountMakePaymentPage(page);
    await myaccountPage.clickMakeAPaymentButton();
    await myaccountMakePaymentpage.validateSavedCCisSelectedbyDefault();
    await myaccountMakePaymentpage.validatePaymentsection();
    await myaccountMakePaymentpage.validateOtherAmountisEditable();

  })


  //SB-MyA156,57
  test("Validate the Review Payment section in Make Payment page", async ({ page }, testInfo) => {
    //test.slow();
    if (!loginSuccessful) {
      test.skip('Skipping test due to failed login');
    }
    const myaccountPage = new MyAccountPage(page);
    await myaccountPage.redirectToMyAccount();
    const myaccountMakePaymentpage = new MyAccountMakePaymentPage(page);
    await myaccountPage.clickMakeAPaymentButton();
    await myaccountMakePaymentpage.clickOnReviewPayment();
    await myaccountMakePaymentpage.validateReviewPaymentModal();


  })


  //SB-MyA158
  test("Validate the Payment Success in Make Payment page", async ({ page }, testInfo) => {
    //test.slow();
    if (!loginSuccessful) {
      test.skip('Skipping test due to failed login');
    }
    const myaccountPage = new MyAccountPage(page);
    await myaccountPage.redirectToMyAccount();
    const myaccountMakePaymentpage = new MyAccountMakePaymentPage(page);
    await myaccountPage.clickMakeAPaymentButton();
    await myaccountMakePaymentpage.clickOnReviewPayment();
    await myaccountMakePaymentpage.validateSubmitPayment();
    await myaccountMakePaymentpage.validatePaymentSuccessPage();


  })

  //SB-MyA160
  test("Validate the Edit Option from Review Payment in Make Payment page", async ({ page }, testInfo) => {
    //test.slow();
    if (!loginSuccessful) {
      test.skip('Skipping test due to failed login');
    }
    const myaccountPage = new MyAccountPage(page);
    await myaccountPage.redirectToMyAccount();
    const myaccountMakePaymentpage = new MyAccountMakePaymentPage(page);
    await myaccountPage.clickMakeAPaymentButton();
    // await myaccountMakePaymentpage.validateSavedCCDropDownField();
    // await myaccountMakePaymentpage.selectComboBoxValue('****7777');
    await myaccountMakePaymentpage.clickOnReviewPayment();
    await myaccountMakePaymentpage.editPaymentFromReviewPayment();

  })

})
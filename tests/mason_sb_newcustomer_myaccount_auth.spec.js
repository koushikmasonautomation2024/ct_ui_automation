const { chromium } = require('playwright');
import {test,expect } from '@playwright/test';
import {HomePageNew} from '../pages/mason_home_page1';
import {SignInPageNew} from '../pages/mason_signin_page1';
import {MyAccountPage} from '../pages/mason_myaccount_page';
import {NewUserMyAccountPage} from '../pages/mason_newuser_myaccount_page';
import { allure } from 'allure-playwright';
import fs from 'fs';
require('dotenv').config();
const creditUserFile = './credituser.json';
const nonCreditUserFile = './noncredituser.json';
const newUserFile = './newuser.json';

const homepage_data =JSON.parse(JSON.stringify(require('../test_data/mason_sb_home_page_data.json')));
const signinpage_data =JSON.parse(JSON.stringify(require('../test_data/mason_signin_page_data.json')));
const signoutpage_data =JSON.parse(JSON.stringify(require('../test_data/mason_signout_page_data.json')));
const myaccountpage_data =JSON.parse(JSON.stringify(require('../test_data/mason_sb_myaccount_page_data.json')));
const newuser_myaccountpage_data =JSON.parse(JSON.stringify(require('../test_data/mason_sb_newcustomer_myaccount_page_data.json')));
const savedAddress = myaccountpage_data.myaccount_newaddress_firstname +" "+ myaccountpage_data.myaccount_newaddress_lastname +" "+ myaccountpage_data.myaccount_newaddress_addressline1;
const editAddress = myaccountpage_data.myaccount_editaddress_firstname +" "+ myaccountpage_data.myaccount_editaddress_lastname +" "+ myaccountpage_data.myaccount_editaddress_addressline1;
let loginSuccessful = false;
test.describe("Mason MyAccount New User", ()=>{

   test.beforeEach(async({page,isMobile},testInfo)=>{
    test.slow();
    const storageStatePath = isMobile ? newUserFile : newUserFile;

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
  //Account - My Account - New Customer - Test Cases ID-SB-MyA005
  test("New User Account - My Account-Left-hand Navigation - Verify all navigation links are clickable",async({page},testInfo)=>{ 
    //test.slow();
    if (!loginSuccessful) {
      test.skip('Skipping test due to failed login');
    }
    const myaccountPage = new MyAccountPage(page);
    await myaccountPage.redirectToMyAccount();
    await myaccountPage.verifyLeftNavLinks();
    //await myaccountPage.verifyAllLinksAreClickable();
  })

  //Account - My Account - New Customer - Test Cases ID-SB-MyA005
  test("New User Account - My Account-Left-hand Navigation - Verify navigation link highlights current section",async({page},testInfo)=>{ 
    //test.slow();
    if (!loginSuccessful) {
      test.skip('Skipping test due to failed login');
    }
    const myaccountPage = new MyAccountPage(page);
    await myaccountPage.redirectToMyAccount();
    await myaccountPage.clickAndVerifyHighlightedLink(myaccountpage_data.navhighlighted_color);
          
  })

  //Account - My Account - New Customer - Test Cases ID-SB-MyA043/SB-MyA044/SB-MyA045/SB-MyA046
  test("New User Account - My Stoneberry Credit - Verify display of Get Pre Qualified and Learn More links and redirection to the corresponding pages",async({page},testInfo)=>{ 
    //test.slow();
    if (!loginSuccessful) {
      test.skip('Skipping test due to failed login');
    }
    const newuser_myaccountPage = new NewUserMyAccountPage(page);
    await newuser_myaccountPage.redirectToMyAccount();
    await newuser_myaccountPage.validateNewUserStoneBerryCreditSection(newuser_myaccountpage_data.myaccount_sb_newuser_prequalifiedlinkname,newuser_myaccountpage_data.myaccount_sb_newuser_learnmorelinkname);
          
  })

  //Account - My Account - New Customer
  test("New User Account - Payments - Verify display of Credit Account Verification when user click on the Make a payment link for new user.",async({page},testInfo)=>{ 
    //test.slow();
    if (!loginSuccessful) {
      test.skip('Skipping test due to failed login');
    }
    const myaccountPage = new MyAccountPage(page);
    await myaccountPage.redirectToMyAccount();
    await myaccountPage.clickMyAccountMakeaPaymentLink();
    const newuser_myaccountPage = new NewUserMyAccountPage(page);
    await newuser_myaccountPage.navigatetoMakeAPaymentNonCreditUser();
    await newuser_myaccountPage.validateCreditAccountVerificationDisplay();
          
  })

  //Account - My Account - New Customer
  test("New User Account - Payments - Verify correct display of help icon tooltip.",async({page},testInfo)=>{ 
    //test.slow();
    if (!loginSuccessful) {
      test.skip('Skipping test due to failed login');
    }
    const myaccountPage = new MyAccountPage(page);
    await myaccountPage.redirectToMyAccount();
    await myaccountPage.clickMyAccountMakeaPaymentLink();
    const newuser_myaccountPage = new NewUserMyAccountPage(page);
    await newuser_myaccountPage.navigatetoMakeAPaymentNonCreditUser();
    await newuser_myaccountPage.clickOnTooltip();
          
  })

  //Account - My Account - New Customer - Test Cases ID-SB-MyA185
  test("New User Account - Orders - Verify display of message There are no recent orders in your account.",async({page},testInfo)=>{ 
    //test.slow();
    if (!loginSuccessful) {
      test.skip('Skipping test due to failed login');
    }
    const myaccountPage = new MyAccountPage(page);
    await myaccountPage.redirectToMyAccount();
    await myaccountPage.clickMyAccountOrderLink();
    const newuser_myaccountPage = new NewUserMyAccountPage(page);
    await newuser_myaccountPage.validateNoRecentOrdersSection();
          
  })

  //Account - My Account - New Customer - Test Cases ID-SB-MyA048/SB-MyA049/SB-MyA050
  test("New User Account - Addresses - Verify display of message There are currently no addresses saved to your account.",async({page},testInfo)=>{ 
    //test.slow();
    if (!loginSuccessful) {
      test.skip('Skipping test due to failed login');
    }
    const myaccountPage = new MyAccountPage(page);
    await myaccountPage.redirectToMyAccount();
    await myaccountPage.clickMyAccountAddressLink();
    const newuser_myaccountPage = new NewUserMyAccountPage(page);
    await newuser_myaccountPage.validateNoRecentAddressesSection();
          
  })

  //Account - My Account - New Customer - Test Cases ID-SB-MyA051/SB-MyA052/SB-MyA053/SB-MyA054
  test("New User Account - Saved Credit Cards - Verify display of message There are currently no credit cards saved to your account.",async({page},testInfo)=>{ 
    //test.slow();
    if (!loginSuccessful) {
      test.skip('Skipping test due to failed login');
    }
    const myaccountPage = new MyAccountPage(page);
    await myaccountPage.redirectToMyAccount();
    await myaccountPage.clickMyAccountSavedCCLink();
    const newuser_myaccountPage = new NewUserMyAccountPage(page);
    await newuser_myaccountPage.validateNoSavedCCSection();
          
  })

  //Account - My Account - New Customer - Test Cases ID-SB-MyA051/SB-MyA052/SB-MyA053/SB-MyA054
  test("New User Account - Saved Credit Cards - Verify application expands and focuses the user to the Add New Credit/Debit Card fields when navigated to Saved cards page.",async({page},testInfo)=>{ 
    //test.slow();
    if (!loginSuccessful) {
      test.skip('Skipping test due to failed login');
    }
    const myaccountPage = new MyAccountPage(page);
    await myaccountPage.redirectToMyAccount();
    await myaccountPage.clickMyAccountSavedCCLink();
    const newuser_myaccountPage = new NewUserMyAccountPage(page);
    await newuser_myaccountPage.clickAddNewCCButton();
    await myaccountPage.validateNewCCSection();
    await newuser_myaccountPage.defaultSaveCCCheckboxDisplay();
    await newuser_myaccountPage.defaultSaveCCBillShipAddressCheckboxDisplay();
      
  })

  //Account - My Account - New Customer - Test Cases ID-SB-MyA055
  test("New User Account - Wishlist - Verify display of message There are currently no items saved to your wish list.",async({page},testInfo)=>{ 
    //test.slow();
    if (!loginSuccessful) {
      test.skip('Skipping test due to failed login');
    }
    const myaccountPage = new MyAccountPage(page);
    await myaccountPage.redirectToMyAccount();
    await myaccountPage.clickMyAccountWishListLink();
    const newuser_myaccountPage = new NewUserMyAccountPage(page);
    await newuser_myaccountPage.validateNoWishlistSection();
      
  })

})
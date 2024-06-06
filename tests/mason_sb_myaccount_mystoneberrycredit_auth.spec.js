const { chromium } = require('playwright');
import {test,expect } from '@playwright/test';
import {HomePageNew} from '../pages/mason_home_page1';
import {SignInPageNew} from '../pages/mason_signin_page1';
import {MyAccountPage} from '../pages/mason_myaccount_page';
import { allure } from 'allure-playwright';
import fs from 'fs';
require('dotenv').config();
const creditUserFile = './credituser.json';
const nonCreditUserFile = './noncredituser.json';

const homepage_data =JSON.parse(JSON.stringify(require('../test_data/mason_sb_home_page_data.json')));
const signinpage_data =JSON.parse(JSON.stringify(require('../test_data/mason_signin_page_data.json')));
const signoutpage_data =JSON.parse(JSON.stringify(require('../test_data/mason_signout_page_data.json')));
const myaccountpage_data =JSON.parse(JSON.stringify(require('../test_data/mason_sb_myaccount_page_data.json')));
const savedAddress = myaccountpage_data.myaccount_newaddress_firstname +" "+ myaccountpage_data.myaccount_newaddress_lastname +" "+ myaccountpage_data.myaccount_newaddress_addressline1;
const editAddress = myaccountpage_data.myaccount_editaddress_firstname +" "+ myaccountpage_data.myaccount_editaddress_lastname +" "+ myaccountpage_data.myaccount_editaddress_addressline1;
let loginSuccessful = false;
test.describe("Mason MyAccount My Stoneberry Credit", ()=>{

   test.beforeEach(async({page,isMobile},testInfo)=>{
    test.slow();
    const storageStatePath = isMobile ? creditUserFile : creditUserFile;

    if (fs.existsSync(storageStatePath)) {
      await page.context().addCookies(JSON.parse(fs.readFileSync(storageStatePath, 'utf-8')).cookies);
      loginSuccessful = true;
    } else {
      console.error("Login state is not available, skipping test.");
      test.skip('Skipping test because login state is not available');
    }

    try {
      await page.goto(process.env.WEB_URL);
      await page.waitForLoadState('networkidle');
    } catch (error) {
      console.error("Navigation failed:", error);
      test.skip('Skipping test because navigation failed');
    }
  })

  //Account - My Stoneberry Credit - Test Cases ID-SB-MyA065
  test.only("Account - My Stoneberry Credit - Verify redirection upon clicking Start Shopping CTA",async({page},testInfo)=>{ 
    //test.slow();
    if (!loginSuccessful) {
      test.skip('Skipping test due to failed login');
    }
    const myaccountPage = new MyAccountPage(page);
    await myaccountPage.redirectToMyAccount();
    await myaccountPage.clickMyAccountCreditLink();
    await myaccountPage.startShoppingButtonDisplay();
    await myaccountPage.clickStartShoppingButton();      
  })

  //Account - My Stoneberry Credit - Test Cases ID-SB-MyA066/SB-MyA067
  test.only("Account-My Stoneberry Credit-Overview Section - Verify: If available credit value is greater than or equal to the threshold set for the courtesy nav (currently $75), the available credit should display in green else black",async({page},testInfo)=>{ 
    //test.slow();
    if (!loginSuccessful) {
      test.skip('Skipping test due to failed login');
    }
    const myaccountPage = new MyAccountPage(page);
    await myaccountPage.redirectToMyAccount();
    await myaccountPage.clickMyAccountCreditLink();
    await myaccountPage.startShoppingButtonDisplay();
    await myaccountPage.validateAvailableCreditValueColor();
          
  })

  //Account - My Stoneberry Credit - Test Cases ID-SB-MyA066/SB-MyA067
  test.only("Account-My Stoneberry Credit-Payment Section- Verify display of Make a Payment CTA based on Total Balance",async({page},testInfo)=>{ 
    //test.slow();
    if (!loginSuccessful) {
      test.skip('Skipping test due to failed login');
    }
    const myaccountPage = new MyAccountPage(page);
    await myaccountPage.redirectToMyAccount();
    await myaccountPage.clickMyAccountCreditLink();
    await myaccountPage.makeAPaymentButtonDisplay();        
  })

  //Account - My Stoneberry Credit - Test Cases ID-SB-MyA072/SB-MyA073/SB-MyA074/SB-MyA075/SB-MyA076/SB-MyA077/SB-MyA078/SB-MyA079/SB-MyA080/SB-MyA081
  test.only("Account-My Stoneberry Credit-Account Information Section - Verify display of Customer Account #, Account Status, Amount Past Due, Last Statement Date, and Next Statement Date",async({page},testInfo)=>{ 
    //test.slow();
    if (!loginSuccessful) {
      test.skip('Skipping test due to failed login');
    }
    const myaccountPage = new MyAccountPage(page);
    await myaccountPage.redirectToMyAccount();
    await myaccountPage.clickMyAccountCreditLink();
    await myaccountPage.validateMakeAPaymentAccountInformation(); 
    await myaccountPage.validateCreditStatementAddress();
    await myaccountPage.helpIconTooltip(myaccountpage_data.myaccount_makeapayment_accountstatus_tooltip);       
  })

  //Account - My Stoneberry Credit - Test Cases ID-SB-MyA082/SB-MyA083/SB-MyA084/SB-MyA085/SB-MyA086
  test.only("Account-My Stoneberry Credit-Account Information Section- Verify application shows the address in edit mode when click on edit",async({page},testInfo)=>{ 
    //test.slow();
    if (!loginSuccessful) {
      test.skip('Skipping test due to failed login');
    }
    const myaccountPage = new MyAccountPage(page);
    await myaccountPage.redirectToMyAccount();
    await myaccountPage.clickMyAccountCreditLink();
    await myaccountPage.validateCreditStatementAddress();
    await myaccountPage.clickEditCreditStatementAddress();
    await myaccountPage.validateEditCreditStatementAddress();  
  })

  //Account - My Stoneberry Credit - Test Cases ID-SB-MyA087/SB-MyA088/SB-MyA089/SB-MyA090/SB-MyA091
  test.only("Account-My Stoneberry Credit-Recent Account Transactions Section - Verify display of transaction date, status, and description",async({page},testInfo)=>{ 
    //test.slow();
    if (!loginSuccessful) {
      test.skip('Skipping test due to failed login');
    }
    const myaccountPage = new MyAccountPage(page);
    await myaccountPage.redirectToMyAccount();
    await myaccountPage.clickMyAccountCreditLink();
    const existsRecentAccountTransactions = await myaccountPage.displayRecentAccountTransactions();
    console.log('Recent Account transactions Visible:' + existsRecentAccountTransactions);
    if(existsRecentAccountTransactions){
      await myaccountPage.validateRecentAccountTransactionsColumnHeader();
      await myaccountPage.validateRecentAccountTransactionsDateColumnData();
      await myaccountPage.validateRecentAccountTransactionsStatusColumnData();
      await myaccountPage.validateRecentAccountTransactionsDescriptionColumnData();
      await myaccountPage.validateRecentAccountTransactionsPurchaseChargeColumnData();
      await myaccountPage.validateRecentAccountTransactionsPaymentCreditColumnData();
    }else{
      console.log('Recent Transactions is not available');
    }
    
  })

})
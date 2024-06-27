const { chromium } = require('playwright');
import {test,expect } from '@playwright/test';
import {HomePage} from '../pages/mason_home_page';
import {SignInPage} from '../pages/mason_signin_page';
import {MyAccountOrderPage} from '../pages/mason_myAccountOrder_page';
import {MyAccountPage} from '../pages/mason_myaccount_page';
import {MyAccountSavedCCPage} from '../pages/mason_myAccountSavedCC_page';
import { allure } from 'allure-playwright';
import { sign } from 'crypto';

const homepage_data =JSON.parse(JSON.stringify(require('../test_data/mason_sb_home_page_data.json')));
const resetpage_data =JSON.parse(JSON.stringify(require('../test_data/mason_reset_page_data.json')));
const signinpage_data =JSON.parse(JSON.stringify(require('../test_data/mason_signin_page_data.json')));
const myaccountpage_data =JSON.parse(JSON.stringify(require('../test_data/mason_sb_myaccount_page_data.json')));
const savedAddress = myaccountpage_data.myaccount_newaddress_firstname +" "+ myaccountpage_data.myaccount_newaddress_lastname +" "+ myaccountpage_data.myaccount_newaddress_addressline1;
const editAddress = myaccountpage_data.myaccount_editaddress_firstname +" "+ myaccountpage_data.myaccount_editaddress_lastname +" "+ myaccountpage_data.myaccount_editaddress_addressline1;

test.describe("Mason Commerce Tool Site", ()=>{

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
      const homePage = new HomePage(page);
      await homePage.clickOnHomePageSignIn();
      // const signinPage = new SignInPage(page);
      // await signinPage.validateWelcomeTextSignInDialog(signinpage_data.signin_dailog_text);
      // await signinPage.validateWelcomeSignInDialog();
      // await signinPage.clickSignIn();
      // await signinPage.validateSignInDialog();
      // await signinPage.login(process.env.USERNAME,process.env.PASSWORD);
      // await signinPage.clickSignIn();
    }
    const masonHomePageScreenshot = await page.screenshot();
    await testInfo.attach('screenshot', { body: masonHomePageScreenshot, contentType: 'image/png' });
    //await page.screenshot({ path: './screenshots/MasonHomePage.png', fullPage: true });
  }catch (error) {
    // Handle the error here
    console.error("An error occurred in test.beforeEach:", error);
}
    
  })
 
  
//SB-MyA187
test("Validate proper Error Messages if required fields are left empty in Orders page",async({page},testInfo)=>{ 
  //test.slow();
  const myaccountPage = new MyAccountPage(page);
  const myaccountOrderPage = new MyAccountOrderPage(page);
  //await myaccountPage.displayMyAccountLeftNavigationLink();
 // await myaccountPage.clickOnMyAccountLink();
  await myaccountPage.clickMyAccountOrderStatusLink();
  await page.waitForLoadState('networkidle');
  await myaccountOrderPage.validateSingleOrderLookupSection();   
  await myaccountOrderPage.enterOrderNumber('');
  await myaccountOrderPage.enterZipCode('');
  await myaccountOrderPage.clickOnViewOrderButton();
  await myaccountOrderPage.requiredOrderNumberError();
  await myaccountOrderPage.requiredZipError();
        
  })

  //SB-MyA186
test("Validate user should be able to navigate to Orders Page in My account and the fields in Orders Page",async({page},testInfo)=>{ 
  //test.slow();
  const myaccountPage = new MyAccountPage(page);
  const myaccountOrderPage = new MyAccountOrderPage(page);
  //await myaccountPage.displayMyAccountLeftNavigationLink();
 // await myaccountPage.clickOnMyAccountLink();
  await myaccountPage.clickMyAccountOrderStatusLink();
  await page.waitForLoadState('networkidle');
  await myaccountOrderPage.validateSingleOrderLookupSection();    
        
  })


  //SB-MyA189
test("Validate proper Error Message when entered order number and zip code are wrong",async({page},testInfo)=>{ 
  //test.slow();
  const myaccountPage = new MyAccountPage(page);
  const myaccountOrderPage = new MyAccountOrderPage(page);
  //await myaccountPage.displayMyAccountLeftNavigationLink();
 // await myaccountPage.clickOnMyAccountLink();
  await myaccountPage.clickMyAccountOrderStatusLink();
  await page.waitForLoadState('networkidle');
  await myaccountOrderPage.validateSingleOrderLookupSection();   
  await myaccountOrderPage.enterOrderNumber('123');
  await myaccountOrderPage.enterZipCode('11111');
  await myaccountOrderPage.clickOnViewOrderButton();
  await myaccountOrderPage.noOrderMessage();
        
  })


  //SB-MyA190
test("Validate navigation to the Contact Us page when user clicks on ContactUs link",async({page},testInfo)=>{ 
  //test.slow();
  const myaccountPage = new MyAccountPage(page);
  const myaccountOrderPage = new MyAccountOrderPage(page);
  //await myaccountPage.displayMyAccountLeftNavigationLink();
 // await myaccountPage.clickOnMyAccountLink();
  await myaccountPage.clickMyAccountOrderStatusLink();
  await page.waitForLoadState('networkidle');
  await myaccountOrderPage.validateSingleOrderLookupSection();   
  await myaccountOrderPage.enterOrderNumber('123');
  await myaccountOrderPage.enterZipCode('11111');
  await myaccountOrderPage.clickOnViewOrderButton();
  await myaccountOrderPage.noOrderMessage();
  await myaccountOrderPage.clickOncontactUs();
        
  })

  

  
  

  })
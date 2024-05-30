const { chromium } = require('playwright');
import {test,expect } from '@playwright/test';
import {HomePage} from '../pages/mason_home_page';
import {SignInPage} from '../pages/mason_signin_page';
import {ResetPage} from '../pages/mason_reset_page';
import {MyAccountPage} from '../pages/mason_myaccount_page';
import {MyAccountAddressPage} from '../pages/mason_myAccountAddress_page';
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
      const signinPage = new SignInPage(page);
      await signinPage.validateWelcomeTextSignInDialog(signinpage_data.signin_dailog_text);
      await signinPage.validateWelcomeSignInDialog();
      await signinPage.clickSignIn();
      await signinPage.validateSignInDialog();
      await signinPage.login(process.env.USERNAME,process.env.PASSWORD);
      await signinPage.clickSignIn();
    }
    const masonHomePageScreenshot = await page.screenshot();
    await testInfo.attach('screenshot', { body: masonHomePageScreenshot, contentType: 'image/png' });
    //await page.screenshot({ path: './screenshots/MasonHomePage.png', fullPage: true });
  }catch (error) {
    // Handle the error here
    console.error("An error occurred in test.beforeEach:", error);
}
    
  })
 
  
//SB-MyA227
  test("Validate Home -> My account -> Addresses breadcrumbs are shown in Address page",async({page},testInfo)=>{ 
    const myAccountAddressPage = new MyAccountAddressPage(page);
    const myAccountPage = new MyAccountPage(page);
    await myAccountPage.clickOnMyAccountLink();
    await myAccountAddressPage.displayAddressPage();    
        
  })

  //SB-MyA228
  test("Validate Add new address link is shown aligned with the page title in Address page",async({page},testInfo)=>{ 
    const myAccountAddressPage = new MyAccountAddressPage(page);
    const myAccountPage = new MyAccountPage(page);
    await myAccountPage.clickOnMyAccountLink();
    await myAccountAddressPage.displayAddressPage();    
    await myAccountAddressPage.displayAddNewAddressLink();  
        
  })

  //SB-MyA259
  test.only("Validate message -There are currently no addresses saved to your account - when no addresses are available",async({page},testInfo)=>{ 
    const myAccountAddressPage = new MyAccountAddressPage(page);
    const myAccountPage = new MyAccountPage(page);
    await myAccountPage.clickOnMyAccountLink();
    await myAccountAddressPage.clickMyAccountAddressLink();
    await myAccountAddressPage.noAddressMessageForNewUser();

  })

  })
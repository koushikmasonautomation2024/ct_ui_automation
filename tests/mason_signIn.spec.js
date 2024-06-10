const { chromium } = require('playwright');
import {test,expect } from '@playwright/test';
import {HomePage} from '../pages/mason_home_page';
import {SignInPage} from '../pages/mason_signin_page';
import {ResetPage} from '../pages/mason_reset_page';
import {MyAccountPage} from '../pages/mason_myaccount_page';
import { allure } from 'allure-playwright';
import { sign } from 'crypto';

const homepage_data =JSON.parse(JSON.stringify(require('../test_data/mason_sb_home_page_data.json')));
const resetpage_data =JSON.parse(JSON.stringify(require('../test_data/mason_reset_page_data.json')));
const signinpage_data =JSON.parse(JSON.stringify(require('../test_data/mason_signin_page_data.json')));
const myaccountpage_data =JSON.parse(JSON.stringify(require('../test_data/mason_sb_myaccount_page_data.json')));
const savedAddress = myaccountpage_data.myaccount_newaddress_firstname +" "+ myaccountpage_data.myaccount_newaddress_lastname +" "+ myaccountpage_data.myaccount_newaddress_addressline1;
const editAddress = myaccountpage_data.myaccount_editaddress_firstname +" "+ myaccountpage_data.myaccount_editaddress_lastname +" "+ myaccountpage_data.myaccount_editaddress_addressline1;

test.describe("Mason SignIn Scenarios", ()=>{

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
      
    }
    const masonHomePageScreenshot = await page.screenshot();
    await testInfo.attach('screenshot', { body: masonHomePageScreenshot, contentType: 'image/png' });
    //await page.screenshot({ path: './screenshots/MasonHomePage.png', fullPage: true });
  }catch (error) {
    // Handle the error here
    console.error("An error occurred in test.beforeEach:", error);
}
    
  })
  

  //SB-LOGREG009
test("Account - SignIn - Validate the Loader icon when user tries to sign-in",async({page})=>{ 
  const signinPage = new SignInPage(page);
  await signinPage.clickSignIn();
  //await signinPage.validateSignInDialog();
  await signinPage.login(process.env.NON_CREDIT_USER,process.env.NON_CREDIT_PASSWORD);
  await signinPage.clickSignIn();
  await signinPage.checkLoaderwhileSignIn();

})


//SB-LOGREG012
test("Account - Sign In (Drawer)/Sign In Page - Validate user should be able to login to site",async({page})=>{ 
  const signinPage = new SignInPage(page);
  await signinPage.clickSignIn();
  //await signinPage.validateSignInDialog();
  await signinPage.login(process.env.NON_CREDIT_USER,process.env.NON_CREDIT_PASSWORD);
  await signinPage.clickSignIn();
  await signinPage.waitForHiddenSignedInMessage();
           
})

//SB-LOGREG013
test("Account - Sign In (Drawer)/Sign In Page - Validate user should be able to login to site and close success message",async({page})=>{ 
  const signinPage = new SignInPage(page);
  await signinPage.clickSignIn();
  //await signinPage.validateSignInDialog();
  await signinPage.login(process.env.NON_CREDIT_USER,process.env.NON_CREDIT_PASSWORD);
  await signinPage.clickSignIn();
  await signinPage.waitForHiddenSignedInMessage();
  await signinPage.closeSignIsSuccessMessage();
         
})


//SB-LOGREG014
test("Account - Sign In (Drawer)/Sign In Page - Validate proper message when login fails",async({page})=>{ 
  const signinPage = new SignInPage(page);
  await signinPage.clickSignIn();
  //await signinPage.validateSignInDialog();
  await signinPage.login(process.env.NON_CREDIT_USER,process.env.PASSWORD);
  await signinPage.clickSignIn();
  await signinPage.loginFailMessage();
         
})

//SB-LOGREG036
test("Account - Sign In (Drawer)/Sign In Page - Validate the Error message for null or invalid email",async({page})=>{ 
  //test.slow();
  // const homePage = new HomePage(page);
  // await homePage.clickOnHomePageSignIn();
  
  const signinPage = new SignInPage(page);
  
  await signinPage.clickOnForgotPassword();
  await signinPage.validateNullEmailAddressOnForgotPassword();
  await signinPage.validateInvalidEmailAddressOnForgotPassword();

})


test("Account - SignIn - Validate the Password Hide/Show in Sign-In ",async({page})=>{ 
  const signinPage = new SignInPage(page);
  //const createAccountPage = new CreateAccountPage(page);
  //await signinPage.clickCreateAnAccount();
  const password = [...Array(6)].map(() => String.fromCharCode(Math.random() * 26 + 97 | 0)).join('') + String.fromCharCode(Math.random() * 26 + 65 | 0) + (Math.random() * 10 | 0);
  //await signinPage.enterPasswordOnCreateAccountPage(password);
  await signinPage.clickSignIn();
  await signinPage.login(process.env.NON_CREDIT_USER,process.env.NON_CREDIT_PASSWORD);
  await signinPage.validatePasswordShowLinkIsVisible();
  await signinPage.clickOnShowPassword();
  await signinPage.validatePasswordIsShown();
  //await signinPage.readPasswordFromTextboxAndValidate(password);
  await signinPage.validatePasswordHideLinkIsVisible();
  await signinPage.clickOnHidePassword();
  await signinPage.validatePasswordIsHidden();

})


})
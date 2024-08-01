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

test.describe("Mason Reset Password Scenarios", ()=>{

   test.beforeEach(async({page,isMobile},testInfo)=>{
    test.slow();
    try{  
    await page.goto(process.env.WEB_URL);
    //await page.waitForLoadState('networkidle');
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
  

  //SB-LOGREG024 //SB-LOGREG019
  test("Account - Reset/Forgot Password - Validate user receives the reset password link ",async({page})=>{ 
    //test.slow();
    // const homePage = new HomePage(page);
    // await homePage.clickOnHomePageSignIn();
    const signinPage = new SignInPage(page);
    await signinPage.clickOnForgotPassword();
    await signinPage.validateForgotPasswordModal(signinpage_data.forgot_password_text, signinpage_data.forgot_password_paragraph);
    await signinPage.fillEmailAddressForgotPassword(process.env.RESET_USERNAME);
    await signinPage.submitForgotPasswordForm();
    await signinPage.waitForSuccessMessage(signinpage_data.forgot_password_submission_text);
    //await signinPage.readConsolePasswordResetURL();     
  })

  //SB-LOGREG025
  test("Account - Reset/Forgot Password - Validate user should be able to navigate to the Reset page from Reset Link",async({page})=>{ 
    //test.slow();
    // const homePage = new HomePage(page);
    // await homePage.clickOnHomePageSignIn();
    const signinPage = new SignInPage(page);
    await signinPage.clickOnForgotPassword();
    await signinPage.validateForgotPasswordModal(signinpage_data.forgot_password_text, signinpage_data.forgot_password_paragraph);
    await signinPage.fillEmailAddressForgotPassword(process.env.RESET_USERNAME);
    await signinPage.submitForgotPasswordForm();
    await signinPage.waitForSuccessMessage(signinpage_data.forgot_password_submission_text);
    await page.goto(process.env.RESET_LINK);
    await page.waitForLoadState('networkidle');

  })

//SB-LOGREG026
test("Account - Reset/Forgot Password - Validate the elements to be visible on Reset Password page",async({page})=>{ 
  //test.slow();
  // const homePage = new HomePage(page);
  // await homePage.clickOnHomePageSignIn();
  const signinPage = new SignInPage(page);
  const resetPage = new ResetPage(page);
  await signinPage.clickOnForgotPassword();
  await signinPage.validateForgotPasswordModal(signinpage_data.forgot_password_text, signinpage_data.forgot_password_paragraph);
  await signinPage.fillEmailAddressForgotPassword(process.env.RESET_USERNAME);
  await signinPage.submitForgotPasswordForm();
  await signinPage.waitForSuccessMessage(signinpage_data.forgot_password_submission_text);
  await page.goto(process.env.RESET_LINK);
  await page.waitForLoadState('networkidle');
  await resetPage.validateEmailIdIsAutoFilled(process.env.RESET_USERNAME);
  await resetPage.validatePasswordTextBoxIsVisible();
  await resetPage.validatePasswordInfoIconIsVisible();
  await resetPage.validatePasswordShowLinkIsVisible();
  await resetPage.validatePasswordResetButtonIsVisible();
})

//SB-LOGREG027
test("Account - Reset/Forgot Password - Validate the Email is ReadOnly on Reset Password page",async({page})=>{ 
  //test.slow();
  // const homePage = new HomePage(page);
  // await homePage.clickOnHomePageSignIn();
  const signinPage = new SignInPage(page);
  const resetPage = new ResetPage(page);
  await signinPage.clickOnForgotPassword();
  await signinPage.validateForgotPasswordModal(signinpage_data.forgot_password_text, signinpage_data.forgot_password_paragraph);
  await signinPage.fillEmailAddressForgotPassword(process.env.RESET_USERNAME);
  await signinPage.submitForgotPasswordForm();
  await signinPage.waitForSuccessMessage(signinpage_data.forgot_password_submission_text);
  await page.goto(process.env.RESET_LINK);
  await page.waitForLoadState('networkidle');
  await resetPage.validateEmailIdIsReadOnly(process.env.RESET_USERNAME);
  })


//SB-LOGREG028
test("Account - Reset/Forgot Password - Validate the Show/Hide of Password on Reset Password page",async({page})=>{ 
  //test.slow();
  // const homePage = new HomePage(page);
  // await homePage.clickOnHomePageSignIn();
  const password = [...Array(6)].map(() => String.fromCharCode(Math.random() * 26 + 97 | 0)).join('') + String.fromCharCode(Math.random() * 26 + 65 | 0) + (Math.random() * 10 | 0);
  const signinPage = new SignInPage(page);
  const resetPage = new ResetPage(page);
  await signinPage.clickOnForgotPassword();
  await signinPage.validateForgotPasswordModal(signinpage_data.forgot_password_text, signinpage_data.forgot_password_paragraph);
  await signinPage.fillEmailAddressForgotPassword(process.env.RESET_USERNAME);
  await signinPage.submitForgotPasswordForm();
  await signinPage.waitForSuccessMessage(signinpage_data.forgot_password_submission_text);
  await page.goto(process.env.RESET_LINK);
  await page.waitForLoadState('networkidle');
  await resetPage.enterPasswordOnResetPage(password);
  await resetPage.validatePasswordShowLinkIsVisible();
  await resetPage.clickOnShowPassword();
  await resetPage.readPasswordFromTextboxAndValidate(password);
  await resetPage.validatePasswordHideLinkIsVisible();
  await resetPage.clickOnHidePassword();
  
})


//SB-LOGREG030
test("Account - Reset/Forgot Password - Validate the Password Info Icon on Reset Password page",async({page})=>{ 
  //test.slow();
  // const homePage = new HomePage(page);
  // await homePage.clickOnHomePageSignIn();
  const password = [...Array(6)].map(() => String.fromCharCode(Math.random() * 26 + 97 | 0)).join('') + String.fromCharCode(Math.random() * 26 + 65 | 0) + (Math.random() * 10 | 0);
  const signinPage = new SignInPage(page);
  const resetPage = new ResetPage(page);
  await signinPage.clickOnForgotPassword();
  await signinPage.validateForgotPasswordModal(signinpage_data.forgot_password_text, signinpage_data.forgot_password_paragraph);
  await signinPage.fillEmailAddressForgotPassword(process.env.RESET_USERNAME);
  await signinPage.submitForgotPasswordForm();
  await signinPage.waitForSuccessMessage(signinpage_data.forgot_password_submission_text);
  await page.goto(process.env.RESET_LINK);
  await page.waitForLoadState('networkidle');
  await resetPage.hoverAndReadInfo(resetpage_data.info_icon_text);
  
})


//SB-LOGREG031
test("Account - Reset/Forgot Password - Validate the Password Reset Message on Reset Password page",async({page})=>{ 
  //test.slow();
  // const homePage = new HomePage(page);
  // await homePage.clickOnHomePageSignIn();
  const password = [...Array(6)].map(() => String.fromCharCode(Math.random() * 26 + 97 | 0)).join('') + String.fromCharCode(Math.random() * 26 + 65 | 0) + (Math.random() * 10 | 0);
  const signinPage = new SignInPage(page);
  const resetPage = new ResetPage(page);
  await signinPage.clickOnForgotPassword();
  await signinPage.validateForgotPasswordModal(signinpage_data.forgot_password_text, signinpage_data.forgot_password_paragraph);
  await signinPage.fillEmailAddressForgotPassword(process.env.RESET_USERNAME);
  await signinPage.submitForgotPasswordForm();
  await signinPage.waitForSuccessMessage(signinpage_data.forgot_password_submission_text);
  await page.goto(process.env.RESET_LINK);
  await page.waitForLoadState('networkidle');
  await resetPage.enterPasswordOnResetPage(password);
  await resetPage.validateThePasswordCriteria();
  await resetPage.clickOnPasswordResetButton();
  await resetPage.validatePasswordResetMessage();

})

test("Account - Reset/Forgot Password - Validate the user is auto-login with the newly Reset password",async({page})=>{ 
  //test.slow();
  // const homePage = new HomePage(page);
  // await homePage.clickOnHomePageSignIn();
  const password = [...Array(6)].map(() => String.fromCharCode(Math.random() * 26 + 97 | 0)).join('') + String.fromCharCode(Math.random() * 26 + 65 | 0) + (Math.random() * 10 | 0);
  const signinPage = new SignInPage(page);
  const resetPage = new ResetPage(page);
  await signinPage.clickOnForgotPassword();
 // await signinPage.validateForgotPasswordModal(signinpage_data.forgot_password_text, signinpage_data.forgot_password_paragraph);
  await signinPage.fillEmailAddressForgotPassword(process.env.RESET_USERNAME);
  await signinPage.submitForgotPasswordForm();
  await signinPage.waitForSuccessMessage(signinpage_data.forgot_password_submission_text);
  await page.goto(process.env.RESET_LINK);
  await page.waitForLoadState('networkidle');
  await resetPage.enterPasswordOnResetPage(password);
  //await resetPage.validateThePasswordCriteria();
  await resetPage.clickOnPasswordResetButton();
  await resetPage.validatePasswordResetMessage();

})

//SB-LOGREG035
test("Account - Reset/Forgot Password - Validate the user is able to login with the newly Reset password",async({page})=>{ 
  //test.slow();
  // const homePage = new HomePage(page);
  // await homePage.clickOnHomePageSignIn();
  const password = [...Array(6)].map(() => String.fromCharCode(Math.random() * 26 + 97 | 0)).join('') + String.fromCharCode(Math.random() * 26 + 65 | 0) + (Math.random() * 10 | 0);
  const signinPage = new SignInPage(page);
  const resetPage = new ResetPage(page);
  await signinPage.clickOnForgotPassword();
 // await signinPage.validateForgotPasswordModal(signinpage_data.forgot_password_text, signinpage_data.forgot_password_paragraph);
  await signinPage.fillEmailAddressForgotPassword(process.env.RESET_USERNAME);
  await signinPage.submitForgotPasswordForm();
  await signinPage.waitForSuccessMessage(signinpage_data.forgot_password_submission_text);
  await page.goto(process.env.RESET_LINK);
  await page.waitForLoadState('networkidle');
  await resetPage.enterPasswordOnResetPage(password);
  //await resetPage.validateThePasswordCriteria();
  await resetPage.clickOnPasswordResetButton();
  await resetPage.validatePasswordResetMessage();
  await signinPage.logout()

  await page.goto(process.env.WEB_URL);
  await page.waitForLoadState('networkidle');
        
  await signinPage.clickSignInImage();
  await signinPage.clickSignIn();
      //await signinPage.validateSignInDialog();
  await signinPage.login(process.env.RESET_USERNAME,password);
  await signinPage.clickSignIn();
  await signinPage.validateSignInDialog();

})


//SB-LOGREG034
test("Account - Reset/Forgot Password - Validate the Invalid Password Reset Message on Reset Password page",async({page})=>{ 
  //test.slow();
  // const homePage = new HomePage(page);
  // await homePage.clickOnHomePageSignIn();
  const password = [...Array(2)].map(() => String.fromCharCode(Math.random() * 26 + 97 | 0)).join('') + String.fromCharCode(Math.random() * 26 + 65 | 0) + (Math.random() * 10 | 0);
  const signinPage = new SignInPage(page);
  const resetPage = new ResetPage(page);
  await signinPage.clickOnForgotPassword();
  await signinPage.validateForgotPasswordModal(signinpage_data.forgot_password_text, signinpage_data.forgot_password_paragraph);
  await signinPage.fillEmailAddressForgotPassword(process.env.RESET_USERNAME);
  await signinPage.submitForgotPasswordForm();
  await signinPage.waitForSuccessMessage(signinpage_data.forgot_password_submission_text);
  await page.goto(process.env.RESET_LINK);
  await page.waitForLoadState('networkidle');
  await resetPage.clickOnPasswordResetButton();
  await resetPage.noPasswordEntered();
  await resetPage.enterPasswordOnResetPage(password);
  await resetPage.validateThePasswordCriteria();
  await resetPage.clickOnPasswordResetButton();

})

})
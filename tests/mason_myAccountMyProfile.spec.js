const { chromium } = require('playwright');
import {test,expect } from '@playwright/test';
import {HomePage} from '../pages/mason_home_page';
import {SignInPage} from '../pages/mason_signin_page';
import {ResetPage} from '../pages/mason_reset_page';
import {MyAccountPage} from '../pages/mason_myaccount_page';
import {MyAccountAddressPage} from '../pages/mason_myAccountAddress_page';
import {MyAccountMyProfilePage} from '../pages/mason_myAccountMyProfile_page';
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
      // await page.waitForLoadState('networkidle');
      // await signinPage.validateSignedInMessage(myaccountpage_data.signedin_message);
      // await signinPage.waitForHiddenSignedInMessage();
      // await page.waitForLoadState('networkidle');
      // await homePage.clickOnHomePageSignIn();
      // await page.goto(process.env.DASHBOARD_URL);
    }
    const masonHomePageScreenshot = await page.screenshot();
    await testInfo.attach('screenshot', { body: masonHomePageScreenshot, contentType: 'image/png' });
    //await page.screenshot({ path: './screenshots/MasonHomePage.png', fullPage: true });
  }catch (error) {
    // Handle the error here
    console.error("An error occurred in test.beforeEach:", error);
}
    
  })
 
  
//SB-MyA266
  test.skip("Validate My Profile page",async({page},testInfo)=>{ 
    const myAccountPage = new MyAccountPage(page);
    const myAccountMyProfilePage = new MyAccountMyProfilePage(page);
    await myAccountPage.clickOnMyAccountLink();
    await page.waitForTimeout(4000);
    await myAccountPage.clickMyAccountMyProfileLink();
    await page.waitForTimeout(4000);
    await myAccountMyProfilePage.validateMyProfilePageFields();
        
  })

  //SB-MyA266
  test("Validate user should be able to navigate to My Profile page in My account",async({page},testInfo)=>{ 
    //test.slow();
    const myaccountPage = new MyAccountPage(page);
    const myAccountMyProfilePage = new MyAccountMyProfilePage(page);
    await myaccountPage.displayMyAccountLeftNavigationLink();
    await myaccountPage.clickOnMyAccountLink();
    await myaccountPage.clickMyAccountMyProfileLink();
    await myAccountMyProfilePage.validateMyProfilePage();

  })

  //SB-MyA267
  test("Validate user should be able to update contact information in My Profile page in My account",async({page},testInfo)=>{ 
    //test.slow();
    const firstname = String.fromCharCode(65 + Math.floor(Math.random() * 26)) + [...Array(9)].map(() => String.fromCharCode(97 + Math.floor(Math.random() * 26))).join('');
    const myaccountPage = new MyAccountPage(page);
    const myAccountMyProfilePage = new MyAccountMyProfilePage(page);
    //await myaccountPage.displayMyAccountLeftNavigationLink();
    await myaccountPage.clickOnMyAccountLink();
    await myaccountPage.clickMyAccountMyProfileLink();
    await myAccountMyProfilePage.validateMyProfilePage();
    await myAccountMyProfilePage.enterFirstName(firstname);
    await myAccountMyProfilePage.enterLastName(myaccountpage_data.myaccount_myprofile_updatedlastname);
    await myAccountMyProfilePage.clickMyProfileSaveChangesButton();
    await myAccountMyProfilePage.validateMyProfileUpdateMessage();
  })

  //SB-MyA270
  test("Validate SaveButton is disabled in My Profile page",async({page},testInfo)=>{ 
    //test.slow();
    const myaccountPage = new MyAccountPage(page);
    const myAccountMyProfilePage = new MyAccountMyProfilePage(page);
    await myaccountPage.displayMyAccountLeftNavigationLink();
    await myaccountPage.clickOnMyAccountLink();
    await myaccountPage.clickMyAccountMyProfileLink();
    await myAccountMyProfilePage.validateSaveButtonIsDisabled();

  })

  //SB-MyA269
  test("Validate user is able to see the updated profile information in My Profile page",async({page},testInfo)=>{ 
    //test.slow();
    const firstname = String.fromCharCode(65 + Math.floor(Math.random() * 26)) + [...Array(9)].map(() => String.fromCharCode(97 + Math.floor(Math.random() * 26))).join('');
    const myaccountPage = new MyAccountPage(page);
    const myAccountMyProfilePage = new MyAccountMyProfilePage(page);
    //await myaccountPage.displayMyAccountLeftNavigationLink();
    await myaccountPage.clickOnMyAccountLink();
    await myaccountPage.clickMyAccountMyProfileLink();
   // await myAccountMyProfilePage.validateMyProfilePage();
    await myAccountMyProfilePage.enterFirstName(firstname);
    await myAccountMyProfilePage.enterLastName(myaccountpage_data.myaccount_myprofile_updatedlastname);
    await myAccountMyProfilePage.clickMyProfileSaveChangesButton();
    await myAccountMyProfilePage.validateFirstName(firstname);

  })


  //SB-MyA280
  test("Validate Invalid data error message in My Profile page",async({page},testInfo)=>{ 
    //test.slow();
    const firstname = String.fromCharCode(65 + Math.floor(Math.random() * 26)) + [...Array(9)].map(() => String.fromCharCode(97 + Math.floor(Math.random() * 26))).join('');
    const myaccountPage = new MyAccountPage(page);
    const myAccountMyProfilePage = new MyAccountMyProfilePage(page);
    //await myaccountPage.displayMyAccountLeftNavigationLink();
    await myaccountPage.clickOnMyAccountLink();
    await myaccountPage.clickMyAccountMyProfileLink();
   // await myAccountMyProfilePage.validateMyProfilePage();
    await myAccountMyProfilePage.validateInvalidDataInMyProfile();

  })


  //SB-MyA272 //SB-MyA276
  test("Validate Change Email Address modal in My Profile page",async({page},testInfo)=>{ 
    //test.slow();
    const firstname = String.fromCharCode(65 + Math.floor(Math.random() * 26)) + [...Array(9)].map(() => String.fromCharCode(97 + Math.floor(Math.random() * 26))).join('');
    const lastname = String.fromCharCode(65 + Math.floor(Math.random() * 26)) + [...Array(9)].map(() => String.fromCharCode(97 + Math.floor(Math.random() * 26))).join('');
    const email = `${firstname.toLowerCase()}.${lastname.toLowerCase()}@automation.com`;  
    const myaccountPage = new MyAccountPage(page);
    const myAccountMyProfilePage = new MyAccountMyProfilePage(page);
    //await myaccountPage.displayMyAccountLeftNavigationLink();
    await myaccountPage.clickOnMyAccountLink();
    await myaccountPage.clickMyAccountMyProfileLink();
    await myAccountMyProfilePage.validateChangeEmailModal(email);
  })

//SB-MyA273
  test("My Profile - Validate the Password Hide/Show in Email Change Modal",async({page})=>{ 
    const myaccountPage = new MyAccountPage(page);
    const myAccountMyProfilePage = new MyAccountMyProfilePage(page);
    const firstname = String.fromCharCode(65 + Math.floor(Math.random() * 26)) + [...Array(9)].map(() => String.fromCharCode(97 + Math.floor(Math.random() * 26))).join('');
    const lastname = String.fromCharCode(65 + Math.floor(Math.random() * 26)) + [...Array(9)].map(() => String.fromCharCode(97 + Math.floor(Math.random() * 26))).join('');
    const email = `${firstname.toLowerCase()}.${lastname.toLowerCase()}@automation.com`; 
    //await myaccountPage.displayMyAccountLeftNavigationLink();
    await myaccountPage.clickOnMyAccountLink();
    await myaccountPage.clickMyAccountMyProfileLink();
    await myAccountMyProfilePage.validateChangeEmailModal(email);
    const password = [...Array(6)].map(() => String.fromCharCode(Math.random() * 26 + 97 | 0)).join('') + String.fromCharCode(Math.random() * 26 + 65 | 0) + (Math.random() * 10 | 0);
    await myAccountMyProfilePage.enterPasswordOnEmailModal(password);
    await myAccountMyProfilePage.validatePasswordShowLinkIsVisible();
    await myAccountMyProfilePage.clickOnShowPassword();
    await myAccountMyProfilePage.validatePasswordIsShown();
    await myAccountMyProfilePage.readPasswordFromTextboxAndValidate(password);
    await myAccountMyProfilePage.validatePasswordHideLinkIsVisible();
    await myAccountMyProfilePage.clickOnHidePassword();
    await myAccountMyProfilePage.validatePasswordIsHidden();

})

//SB-MyA275
test("Validate Cancel Email Address modal in My Profile page",async({page},testInfo)=>{ 
  //test.slow();
  const firstname = String.fromCharCode(65 + Math.floor(Math.random() * 26)) + [...Array(9)].map(() => String.fromCharCode(97 + Math.floor(Math.random() * 26))).join('');
  const lastname = String.fromCharCode(65 + Math.floor(Math.random() * 26)) + [...Array(9)].map(() => String.fromCharCode(97 + Math.floor(Math.random() * 26))).join('');
  const email = `${firstname.toLowerCase()}.${lastname.toLowerCase()}@automation.com`;  
  const myaccountPage = new MyAccountPage(page);
  const myAccountMyProfilePage = new MyAccountMyProfilePage(page);
  //await myaccountPage.displayMyAccountLeftNavigationLink();
  await myaccountPage.clickOnMyAccountLink();
  await myaccountPage.clickMyAccountMyProfileLink();
  await myAccountMyProfilePage.validateChangeEmailModal(email);
  await myAccountMyProfilePage.validateCancelOnEmailChangeModal();
})

//SB-MyA277 //SB-My287 //SB-MyA290
test("Validate Change Password Button is enabled on meeting the New Password criteria", async ({ page }, testInfo) => {
  const generateRandomString = (length) => {
    const getRandomChar = (base, range) => String.fromCharCode(base + Math.floor(Math.random() * range));
    return getRandomChar(65, 26) + Array.from({ length: length - 1 }, () => getRandomChar(97, 26)).join('');
  };

  const generateRandomPassword = () => {
    const getRandomChar = (base, range) => String.fromCharCode(base + Math.floor(Math.random() * range));
    const lowerCase = Array.from({ length: 6 }, () => getRandomChar(97, 26)).join('');
    const upperCase = getRandomChar(65, 26);
    const number = Math.floor(Math.random() * 10);
    return lowerCase + upperCase + number;
  };

  const firstname = generateRandomString(10);
  const lastname = generateRandomString(10);
  const email = `${firstname.toLowerCase()}.${lastname.toLowerCase()}@automation.com`;
  const password = generateRandomPassword();

  const myaccountPage = new MyAccountPage(page);
  const myAccountMyProfilePage = new MyAccountMyProfilePage(page);

  await myaccountPage.clickOnMyAccountLink();
  await myaccountPage.clickMyAccountMyProfileLink();

  const changePassword = async (currentPassword, newPassword) => {
    await myAccountMyProfilePage.enterCurrentPasswordOnMyProfile(currentPassword);
    await myAccountMyProfilePage.enterNewPasswordOnMyProfile(newPassword);
    await myAccountMyProfilePage.validateThePasswordCriteria();
    await myAccountMyProfilePage.updatePasswordonMyProfile();
  };

  await changePassword(process.env.PASSWORD, password);

  await myAccountMyProfilePage.enterFirstName(firstname);
  await myAccountMyProfilePage.enterLastName(myaccountpage_data.myaccount_myprofile_updatedlastname);
  await myAccountMyProfilePage.clickMyProfileSaveChangesButton();
  await myAccountMyProfilePage.validateFirstName(firstname);

  await changePassword(password, process.env.PASSWORD);

  console.log(`Temporary password used for testing: ${password}`);
})


//SB-MyA278
test("Validate Change of email in Email Address modal in My Profile page", async ({ page }, testInfo) => {
  const generateRandomString = (length) => {
    const getRandomChar = (base, range) => String.fromCharCode(base + Math.floor(Math.random() * range));
    return getRandomChar(65, 26) + Array.from({ length: length - 1 }, () => getRandomChar(97, 26)).join('');
  };

  const firstname = generateRandomString(10);
  const lastname = generateRandomString(10);
  const email = `${firstname.toLowerCase()}.${lastname.toLowerCase()}@automation.com`;

  const myaccountPage = new MyAccountPage(page);
  const myAccountMyProfilePage = new MyAccountMyProfilePage(page);

  const changeEmail = async (newEmail) => {
    await myAccountMyProfilePage.enterEmailtoChange(newEmail);
    await myAccountMyProfilePage.enterPasswordOnEmailModal(process.env.PASSWORD);
    await myAccountMyProfilePage.clickSaveChangesOnEmailModal();
    await myAccountMyProfilePage.validateEmailUpdateSuccessMessage();
    await page.waitForTimeout(2000);
  };

  await myaccountPage.clickOnMyAccountLink();
  await myaccountPage.clickMyAccountMyProfileLink();

  await changeEmail(email);
  //await myAccountMyProfilePage.validateChangeEmailModal(process.env.USERNAME);

  await changeEmail(process.env.USERNAME);

  console.log(`Temporary email used for testing: ${email}`);
})

//SB-MyA274
test("Validate Close Email Address modal in My Profile page",async({page},testInfo)=>{ 
  //test.slow();
  const firstname = String.fromCharCode(65 + Math.floor(Math.random() * 26)) + [...Array(9)].map(() => String.fromCharCode(97 + Math.floor(Math.random() * 26))).join('');
  const lastname = String.fromCharCode(65 + Math.floor(Math.random() * 26)) + [...Array(9)].map(() => String.fromCharCode(97 + Math.floor(Math.random() * 26))).join('');
  const email = `${firstname.toLowerCase()}.${lastname.toLowerCase()}@automation.com`;  
  const myaccountPage = new MyAccountPage(page);
  const myAccountMyProfilePage = new MyAccountMyProfilePage(page);
  //await myaccountPage.displayMyAccountLeftNavigationLink();
  await myaccountPage.clickOnMyAccountLink();
  await myaccountPage.clickMyAccountMyProfileLink();
  await myAccountMyProfilePage.enterEmailtoChange(email);
  await myAccountMyProfilePage.validateCloseOnEmailChangeModal();
})


//SB-MyA279
test("Validate Incorrect Password Message in Email Address modal in My Profile page",async({page},testInfo)=>{ 
  //test.slow();
  const firstname = String.fromCharCode(65 + Math.floor(Math.random() * 26)) + [...Array(9)].map(() => String.fromCharCode(97 + Math.floor(Math.random() * 26))).join('');
  const lastname = String.fromCharCode(65 + Math.floor(Math.random() * 26)) + [...Array(9)].map(() => String.fromCharCode(97 + Math.floor(Math.random() * 26))).join('');
  const email = `${firstname.toLowerCase()}.${lastname.toLowerCase()}@automation.com`;  
  const myaccountPage = new MyAccountPage(page);
  const myAccountMyProfilePage = new MyAccountMyProfilePage(page);
  //await myaccountPage.displayMyAccountLeftNavigationLink();
  await myaccountPage.clickOnMyAccountLink();
  await myaccountPage.clickMyAccountMyProfileLink();
  await myAccountMyProfilePage.enterEmailtoChange(email);
  await myAccountMyProfilePage.enterPasswordOnEmailModal(firstname);
  await myAccountMyProfilePage.clickSaveChangesOnEmailModal();
  await myAccountMyProfilePage.validateIncorrectPasswordMessage();
})

//SB-MyA279
test("Validate Incorrect Password Message on entring wrong password in My Profile page",async({page},testInfo)=>{ 
  //test.slow();  
  const myaccountPage = new MyAccountPage(page);
  const myAccountMyProfilePage = new MyAccountMyProfilePage(page);
  const firstname = String.fromCharCode(65 + Math.floor(Math.random() * 26)) + [...Array(9)].map(() => String.fromCharCode(97 + Math.floor(Math.random() * 26))).join('');
  const lastname = String.fromCharCode(65 + Math.floor(Math.random() * 26)) + [...Array(9)].map(() => String.fromCharCode(97 + Math.floor(Math.random() * 26))).join('');
  const email = `${firstname.toLowerCase()}.${lastname.toLowerCase()}@automation.com`; 
  const password = [...Array(6)].map(() => String.fromCharCode(Math.random() * 26 + 97 | 0)).join('') + String.fromCharCode(Math.random() * 26 + 65 | 0) + (Math.random() * 10 | 0);
  await myaccountPage.clickOnMyAccountLink();
  await myaccountPage.clickMyAccountMyProfileLink();
  //console.log(password);
  
  //await page.waitForTimeout(1000);
  await myAccountMyProfilePage.enterNewPasswordOnMyProfile(process.env.PASSWORD);
  await myAccountMyProfilePage.validateThePasswordCriteria();
  //await myAccountMyProfilePage.enterCurrentPasswordOnMyProfile(password);
  await myAccountMyProfilePage.enterCurrentPasswordOnMyProfile(password);
  await myAccountMyProfilePage.validateIncorrectMessageInMyProfile();
  
})

//SB-MyA283
test("My Profile - Validate the Password Hide/Show in My Profile Page",async({page})=>{ 
  const myaccountPage = new MyAccountPage(page);
  const myAccountMyProfilePage = new MyAccountMyProfilePage(page);
  const firstname = String.fromCharCode(65 + Math.floor(Math.random() * 26)) + [...Array(9)].map(() => String.fromCharCode(97 + Math.floor(Math.random() * 26))).join('');
  const lastname = String.fromCharCode(65 + Math.floor(Math.random() * 26)) + [...Array(9)].map(() => String.fromCharCode(97 + Math.floor(Math.random() * 26))).join('');
  const email = `${firstname.toLowerCase()}.${lastname.toLowerCase()}@automation.com`; 
  //await myaccountPage.displayMyAccountLeftNavigationLink();
  await myaccountPage.clickOnMyAccountLink();
  await myaccountPage.clickMyAccountMyProfileLink();
  const password = [...Array(6)].map(() => String.fromCharCode(Math.random() * 26 + 97 | 0)).join('') + String.fromCharCode(Math.random() * 26 + 65 | 0) + (Math.random() * 10 | 0);
  await myAccountMyProfilePage.enterCurrentPasswordOnMyProfile(password);
  //await myAccountMyProfilePage.validatePasswordShowLinkIsVisible();
  await myAccountMyProfilePage.clickOnShowInMyProfile();
  await myAccountMyProfilePage.validatePasswordIsShown();
  await myAccountMyProfilePage.readPasswordFromTextboxAndValidate(password);
  //await myAccountMyProfilePage.validatePasswordHideLinkIsVisible();
  await myAccountMyProfilePage.clickOnHideInMyProfile();
  await myAccountMyProfilePage.validatePasswordIsHidden();

})



  })
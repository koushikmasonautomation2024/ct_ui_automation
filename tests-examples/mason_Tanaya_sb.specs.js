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
      await signinPage.validateSignedInMessage(myaccountpage_data.signedin_message);
      await signinPage.waitForHiddenSignedInMessage();
      await page.waitForLoadState('networkidle');
      await homePage.clickOnHomePageSignIn();
      await page.goto(process.env.DASHBOARD_URL);
    }
    const masonHomePageScreenshot = await page.screenshot();
    await testInfo.attach('screenshot', { body: masonHomePageScreenshot, contentType: 'image/png' });
    //await page.screenshot({ path: './screenshots/MasonHomePage.png', fullPage: true });
  }catch (error) {
    // Handle the error here
    console.error("An error occurred in test.beforeEach:", error);
}
    
  })
  test("Display the Home Page",async({page},testInfo)=>{ 
    test.slow();
    const homePage = new HomePage(page);
    await homePage.closeSignedInDrawer();
    await homePage.displaySearchBar();
    await homePage.displaySignIn();
    await homePage.displayMiniCartIcon();
    await homePage.displayCategory();
    await homePage.displaySiteLogo(homepage_data.homepage_sitename_logo);
    await homePage.displayHeroBanner(homepage_data.homepage_first_herobanner_name);
    await homePage.displayHeroBanner(homepage_data.homepage_second_herobanner_name);
    await homePage.displayFooter(homepage_data.homepage_footer1_name);
    await homePage.displayFooter(homepage_data.homepage_footer2_name);
    await homePage.displayFooter(homepage_data.homepage_footer3_name);
    await homePage.displayFooter(homepage_data.homepage_footer4_name);
    await homePage.displayFooter(homepage_data.homepage_footer5_connectus_name);
    const homePageScreenshot = await page.screenshot();
    await testInfo.attach('screenshot', { body: homePageScreenshot, contentType: 'image/png' });        
  })

  test.skip("Validate user should be able to login in to site",async({page})=>{ 
    //test.slow();
    const homePage = new HomePage(page);
    await homePage.clickOnHomePageSignIn();
    const signinPage = new SignInPage(page);
    await signinPage.validateWelcomeTextSignInDialog(signinpage_data.signin_dailog_text);
    await signinPage.validateWelcomeSignInDialog();
    await signinPage.clickSignIn();
    await signinPage.validateSignInDialog();
    await signinPage.login(process.env.USERNAME,process.env.PASSWORD);
    await signinPage.clickSignIn();
           
  })

  test("Validate user should be able to login in to site and navigate to My account",async({page},testInfo)=>{ 
    //test.slow();
    const myaccountPage = new MyAccountPage(page);
    await myaccountPage.displayMyAccountLeftNavigationLink();
    await page.screenshot({ path: './screenshots/MyAccountDrawer.png', fullPage: true });
    await myaccountPage.clickOnMyAccountLink();
    await myaccountPage.viewMyAccountCreditDetails();
    await myaccountPage.displayOrderSection();
    await myaccountPage.displayAddressSection();
    await myaccountPage.displayViewMyProfileLink();
    await myaccountPage.displayViewSavedCCLink();
    await myaccountPage.displayViewOrdersLink();
    await myaccountPage.displayViewAddressesLink();
    const myAccountDashboardScreenshot = await page.screenshot();
    await testInfo.attach('screenshot', { body: myAccountDashboardScreenshot, contentType: 'image/png' });
    //await page.screenshot({ path: './screenshots/MyAccountDashboard.png', fullPage: true });
    
    
           
  })

  test("Validate user should be able to add new address in My account",async({page},testInfo)=>{ 
    //test.slow();
    const myaccountPage = new MyAccountPage(page);
    await myaccountPage.displayMyAccountLeftNavigationLink();
    await myaccountPage.clickOnMyAccountLink();
    await myaccountPage.displayAddressSection();
    await myaccountPage.displayViewAddressesLink();
    await myaccountPage.clickMyAccountViewAddressLink();
    await myaccountPage.clickAddNewAddressButton();
    await myaccountPage.displayAddNewAddressSection();
    await myaccountPage.enterFirstName(myaccountpage_data.myaccount_newaddress_firstname);
    await myaccountPage.enterLastName(myaccountpage_data.myaccount_newaddress_lastname);
    await myaccountPage.enterAddressline1(myaccountpage_data.myaccount_newaddress_addressline1);
    await myaccountPage.enterCity(myaccountpage_data.myaccount_newaddress_city);
    await myaccountPage.selectState(myaccountpage_data.myaccount_newaddress_state);
    await myaccountPage.enterZipcode(myaccountpage_data.myaccount_newaddress_zipcode);
    await myaccountPage.enterPhoneNumber(myaccountpage_data.myaccount_newaddress_phonenumber);
    await myaccountPage.selectSaveDefaultaddressCheckbox();
    await myaccountPage.clickSaveAddressButton();
    await page.waitForLoadState('networkidle');
    await myaccountPage.displaySavedAddressMessage(myaccountpage_data.myaccount_sb_savedaddress_message);
    await myaccountPage.validateDefaultShippingAddress(savedAddress);
    const myAccountSavedAddressScreenshot = await page.screenshot();
    await testInfo.attach('screenshot', { body: myAccountSavedAddressScreenshot, contentType: 'image/png' });
    //await page.screenshot({ path: './screenshots/MyAccountSavedAddress.png', fullPage: true });
    
    
           
  })

  test("Validate user should be redirected to the address page in My account",async({page},testInfo)=>{ 
    //test.slow();
    const myaccountPage = new MyAccountPage(page);
    await myaccountPage.displayMyAccountLeftNavigationLink();
    await myaccountPage.clickOnMyAccountLink();
    await myaccountPage.displayAddressPage();
    await myaccountPage.validateDefaultShippingAddress(savedAddress);
    const myAccountAddressScreenshot = await page.screenshot();
    await testInfo.attach('screenshot', { body: myAccountAddressScreenshot, contentType: 'image/png' });
    //await page.screenshot({ path: './screenshots/MyAccountAddresspage.png', fullPage: true });
           
  })

  test("Validate user should be able to remove any existing address page in My account",async({page},testInfo)=>{ 
    //test.slow();
    const myaccountPage = new MyAccountPage(page);
    await myaccountPage.displayMyAccountLeftNavigationLink();
    await myaccountPage.clickOnMyAccountLink();
    await myaccountPage.displayAddressPage();
    var defaultAddress = await myaccountPage.getEditAddressNames() + await myaccountPage.getEditAddressline1();
    await myaccountPage.clickRemoveAddressButton();
    await myaccountPage.validatedRemovedAddress(myaccountpage_data.myaccount_removedaddress_message,defaultAddress);
    const myAccountRemoveAddressScreenshot = await page.screenshot();
    await testInfo.attach('screenshot', { body: myAccountRemoveAddressScreenshot, contentType: 'image/png' });
    //await page.screenshot({ path: './screenshots/MyAccountRemoveAddresspage.png', fullPage: true });
           
  })

  test("Validate user should be able to edit any existing address page in My account",async({page},testInfo)=>{ 
    //test.slow();
    const myaccountPage = new MyAccountPage(page);
    await myaccountPage.displayMyAccountLeftNavigationLink();
    await myaccountPage.clickOnMyAccountLink();
    await myaccountPage.displayAddressPage();
    await myaccountPage.clickEditAddressButton();
    await myaccountPage.displayEditAddressSection();
    await myaccountPage.enterFirstName(myaccountpage_data.myaccount_editaddress_firstname);
    await myaccountPage.enterLastName(myaccountpage_data.myaccount_editaddress_lastname);
    await myaccountPage.enterAddressline1(myaccountpage_data.myaccount_editaddress_addressline1);
    await myaccountPage.selectSaveDefaultaddressCheckbox();
    await myaccountPage.clickSaveAddressButton();
    await myaccountPage.displayAddressPage();
    await myaccountPage.validateUpdatedAddressMessage(myaccountpage_data.myaccount_updatedAddressMessage);
    await myaccountPage.validateDefaultShippingAddress(editAddress);
    const myAccountEditAddressScreenshot = await page.screenshot();
    await testInfo.attach('screenshot', { body: myAccountEditAddressScreenshot, contentType: 'image/png' });
    //await page.screenshot({ path: './screenshots/MyAccountEditAddresspage.png', fullPage: true });
           
  })

  test("Validate user should be able to set any existing address as default address in My account",async({page},testInfo)=>{ 
    //test.slow();
    const myaccountPage = new MyAccountPage(page);
    await myaccountPage.displayMyAccountLeftNavigationLink();
    await myaccountPage.clickOnMyAccountLink();
    await myaccountPage.displayAddressPage();
    var defaultAddress = await myaccountPage.getEditAddressNames() + await myaccountPage.getEditAddressline1();
    await myaccountPage.clickSetasDefaultAddressButton();
    await page.waitForLoadState('networkidle');
    await myaccountPage.validateDefaultShippingAddressUpdateMessage(myaccountpage_data.myaccount_defaultaddress_message);
    var updatedDefaultAddress = await myaccountPage.getEditAddressNames() + await myaccountPage.getEditAddressline1();
    await myaccountPage.validateUpdatedDefaultAddress(updatedDefaultAddress,defaultAddress);
    const myAccountDefaultAddressUpdatedScreenshot = await page.screenshot();
    await testInfo.attach('screenshot', { body: myAccountDefaultAddressUpdatedScreenshot, contentType: 'image/png' });
    //await page.screenshot({ path: './screenshots/MyAccountDefaultAddressUpdated.png', fullPage: true });
           
  })

  test("Validate user should be able to navigate to My Profile page in My account",async({page},testInfo)=>{ 
    //test.slow();
    const myaccountPage = new MyAccountPage(page);
    await myaccountPage.displayMyAccountLeftNavigationLink();
    await myaccountPage.clickOnMyAccountLink();
    await myaccountPage.clickMyAccountMyProfileLink();
    await myaccountPage.validateMyProfilePage();
    const myAccountMyProfileScreenshot = await page.screenshot();
    await testInfo.attach('screenshot', { body: myAccountMyProfileScreenshot, contentType: 'image/png' });
    //await page.screenshot({ path: './screenshots/MyAccountMyProfilepage.png', fullPage: true });
           
  })

  test("Validate user should be able to update contact information in My Profile page in My account",async({page},testInfo)=>{ 
    //test.slow();
    const myaccountPage = new MyAccountPage(page);
    await myaccountPage.displayMyAccountLeftNavigationLink();
    await myaccountPage.clickOnMyAccountLink();
    await myaccountPage.clickMyAccountMyProfileLink();
    await myaccountPage.validateMyProfilePage();
    await myaccountPage.enterFirstName(myaccountpage_data.myaccount_myprofile_updatedfirstname);
    await myaccountPage.enterLastName(myaccountpage_data.myaccount_myprofile_updatedlastname);
    await myaccountPage.clickMyProfileSaveChangesButton();
    await myaccountPage.validateMyProfileUpdateMessage(myaccountpage_data.myaccount_myprofile_updatemessage);
    const myAccountMyProfileupdateScreenshot = await page.screenshot();
    await testInfo.attach('screenshot', { body: myAccountMyProfileupdateScreenshot, contentType: 'image/png' });
    //await page.screenshot({ path: './screenshots/MyAccountMyProfileupdatepage.png', fullPage: true });
           
  })

  test("Validate user should be able to navigate to Change password under My Profile section in My account",async({page},testInfo)=>{ 
    //test.slow();
    const myaccountPage = new MyAccountPage(page);
    await myaccountPage.displayMyAccountLeftNavigationLink();
    await myaccountPage.clickOnMyAccountLink();
    await myaccountPage.clickChangePasswordLink();
    await myaccountPage.validateChangePasswordSection();
    const myAccountMyProfileChangePasswordScreenshot = await page.screenshot();
    await testInfo.attach('screenshot', { body: myAccountMyProfileChangePasswordScreenshot, contentType: 'image/png' });
    //await page.screenshot({ path: './screenshots/MyAccountMyProfileChangePassword.png', fullPage: true });
           
  })

  test("Validate user should be able to navigate to Orders Page in My account",async({page},testInfo)=>{ 
    //test.slow();
    const myaccountPage = new MyAccountPage(page);
    await myaccountPage.displayMyAccountLeftNavigationLink();
    await myaccountPage.clickOnMyAccountLink();
    await myaccountPage.clickMyAccountOrderLink();
    await page.waitForLoadState('networkidle');
    await myaccountPage.validatedOrderSection();
    const myAccountOrdersScreenshot = await page.screenshot();
    await testInfo.attach('screenshot', { body: myAccountOrdersScreenshot, contentType: 'image/png' });
    //await page.screenshot({ path: './screenshots/MyAccountOrdersPage.png', fullPage: true });
           
  })

  test.skip("Validate user should be able to navigate to Single Orders Look up Page in My account",async({page},testInfo)=>{ 
    //test.slow();
    //await page.goto(process.env.DASHBOARD_URL);
    await page.waitForLoadState('networkidle');
    const myaccountPage = new MyAccountPage(page);
    await myaccountPage.displayMyAccountLeftNavigationLink();
    await myaccountPage.clickOnMyAccountLink();
    await myaccountPage.clickMyAccountOrderLink();
    await page.waitForLoadState('networkidle');
    await myaccountPage.validatedOrderSection();
    await myaccountPage.clickWithoutOrderButton();
    await myaccountPage.validateSingleOrderLookupSection();
    const myAccountSingleOrdersLookUpscrshoot = await page.screenshot();
    await testInfo.attach('screenshot', { body: myAccountSingleOrdersLookUpscrshoot, contentType: 'image/png' });
    //await page.screenshot({ path: './screenshots/MyAccountSingleOrdersLookUp.png', fullPage: true });
           
  })

  test("Validate user should be able to navigate to Order Details Page in My account",async({page},testInfo)=>{ 
    //test.slow();
    const myaccountPage = new MyAccountPage(page);
    await myaccountPage.displayMyAccountLeftNavigationLink();
    await myaccountPage.clickOnMyAccountLink();
    await myaccountPage.clickMyAccountOrderLink();
    await page.waitForLoadState('networkidle');
    await myaccountPage.validatedOrderSection();
    await myaccountPage.clickViewOrderDetailsLink();
    await myaccountPage.validateOrderDetailsPage();
    const myAccountOrderDetailsPagescrshoot = await page.screenshot();
    await testInfo.attach('screenshot', { body: myAccountOrderDetailsPagescrshoot, contentType: 'image/png' });
    //await page.screenshot({ path: './screenshots/MyAccountOrderDetailsPage.png', fullPage: true });
           
  })

  test("Validate user should be able to navigate to Stoneberry Credit Page in My account",async({page},testInfo)=>{ 
    const myaccountPage = new MyAccountPage(page);
    await myaccountPage.displayMyAccountLeftNavigationLink();
    await myaccountPage.clickOnMyAccountLink();
    await myaccountPage.clickMyAccountCreditLink();
    await myaccountPage.validateStoneberryCreditPage();
    const myAccountStoneberryCreditPageScreenshot = await page.screenshot();
    await testInfo.attach('screenshot', { body: myAccountStoneberryCreditPageScreenshot, contentType: 'image/png' });
    //await page.screenshot({ path: './screenshots/MyAccountStoneberryCreditPage.png', fullPage: true });
           
  })

  test("Validate user should be able to navigate to Make a Payment Page in My account",async({page},testInfo)=>{ 
    //test.slow();
    const myaccountPage = new MyAccountPage(page);
    await myaccountPage.displayMyAccountLeftNavigationLink();
    await myaccountPage.clickOnMyAccountLink();
    await myaccountPage.clickMyAccountMakeaPaymentLink();
    await myaccountPage.validateMakeaPaymentPage();
    const makeaPaymentPageScreenshot = await page.screenshot();
    await testInfo.attach('screenshot', { body: makeaPaymentPageScreenshot, contentType: 'image/png' });
    //await page.screenshot({ path: './screenshots/MyAccountMakeaPaymentPage.png', fullPage: true });
           
  })

  test("Validate user should be able to navigate to WishList Page in My account",async({page},testInfo)=>{ 
    //test.slow();
    await page.waitForLoadState('networkidle');
    const myaccountPage = new MyAccountPage(page);
    await myaccountPage.displayMyAccountLeftNavigationLink();
    await myaccountPage.clickOnMyAccountLink();
    await myaccountPage.validateMyAccountDashboardNavigation();
    await myaccountPage.clickMyAccountWishListLink();
    await myaccountPage.validateWishListPage();
    const wishlistScreenshot = await page.screenshot();
    await testInfo.attach('screenshot', { body: wishlistScreenshot, contentType: 'image/png' });
    //await page.screenshot({ path: './screenshots/MyAccountWishListPage.png', fullPage: true });
           
  })

  test("Validate user should be able to navigate to credit card page in My account",async({page},testInfo)=>{ 
    //test.slow();
    await page.waitForLoadState('networkidle');
    const myaccountPage = new MyAccountPage(page);
    await myaccountPage.displayMyAccountLeftNavigationLink();
    await myaccountPage.clickOnMyAccountLink();
    await myaccountPage.validateMyAccountDashboardNavigation();
    await myaccountPage.clickMyAccountSavedCCLink();
    await myaccountPage.validateSaveCreditCardPage();
    await myaccountPage.validateExistingCCDetails();
    const savedccScreenshot = await page.screenshot();
    await testInfo.attach('screenshot', { body: savedccScreenshot, contentType: 'image/png' });
    //await page.screenshot({ path: './screenshots/SavedCCPage.png', fullPage: true });
           
  })

  test("Validate user should be able to see the add new credit card option in saved credit card section on My account",async({page},testInfo)=>{ 
    //test.slow();
    await page.waitForLoadState('networkidle');
    const myaccountPage = new MyAccountPage(page);
    await myaccountPage.displayMyAccountLeftNavigationLink();
    await myaccountPage.clickOnMyAccountLink();
    await myaccountPage.validateMyAccountDashboardNavigation();
    await myaccountPage.clickMyAccountSavedCCLink();
    await myaccountPage.validateSaveCreditCardPage();
    await myaccountPage.validateExistingCCDetails();
    await myaccountPage.clickAddNewCC();
    await myaccountPage.validateNewCCSection();
    const addnewccScreenshot = await page.screenshot();
    await testInfo.attach('screenshot', { body: addnewccScreenshot, contentType: 'image/png' });
    //await page.screenshot({ path: './screenshots/SavedCCPage.png', fullPage: true });
           
  })

  test("Validate user should be able to see the add new credit card in saved credit card section on My account",async({page},testInfo)=>{ 
    //test.slow();
    await page.waitForLoadState('networkidle');
    const myaccountPage = new MyAccountPage(page);
    await myaccountPage.displayMyAccountLeftNavigationLink();
    await myaccountPage.clickOnMyAccountLink();
    await myaccountPage.validateMyAccountDashboardNavigation();
    await myaccountPage.clickMyAccountSavedCCLink();
    await myaccountPage.validateSaveCreditCardPage();
    await myaccountPage.validateExistingCCDetails();
    await myaccountPage.clickAddNewCC();
    await myaccountPage.validateNewCCSection();
    await myaccountPage.enterCCNumber(myaccountpage_data.myaccount_newcc_cardnumber);
    await myaccountPage.enterCCExpDate(myaccountpage_data.myaccount_newcc_cardexpdate);
    await myaccountPage.enterCCSecurityCode(myaccountpage_data.myaccount_newcc_cardseccode);
    await myaccountPage.clickDefaultCCCheckbox();
    await myaccountPage.clickSaveCardButton();
    await myaccountPage.validateAddNewCardMessage(myaccountpage_data.myaccount_savedcc_newcardadded_message);
    const lastFourDigitsCardNumber = myaccountpage_data.myaccount_newcc_cardnumber.slice(-4);
    await myaccountPage.validateAddNewCard('***'+lastFourDigitsCardNumber,myaccountpage_data.myaccount_newcc_cardexpdate);
    const addednewcardScreenshot = await page.screenshot();
    await testInfo.attach('screenshot', { body: addednewcardScreenshot, contentType: 'image/png' });
    //await page.screenshot({ path: './screenshots/SavedCCPage.png', fullPage: true });
           
  })

  //SB-LOGREG024
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
  const isReadOnly =  await resetPage.validateEmailIdIsReadOnly(process.env.RESET_USERNAME);
  expect(isReadOnly).toBe(true);
 //expect(isEditable).toBe(false);

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
  const info_tip_result = await resetPage.hoverAndReadInfo(resetpage_data.info_icon_text);
  expect(info_tip_result).toBe(true);
  
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

//SB-LOGREG009
test.only("Account - SignIn - Validate the Loader icon when user tries to sign-in",async({page})=>{ 
  const signinPage = new SignInPage(page);
  await signinPage.clickSignIn();
  //await signinPage.validateSignInDialog();
  await signinPage.login(process.env.USERNAME,process.env.PASSWORD);
  await signinPage.clickSignIn();
  await page.waitForTimeout(1000);
  await signinPage.checkLoaderwhileSignIn();

})

})
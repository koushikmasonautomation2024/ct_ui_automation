const { chromium } = require('playwright');
import {test,expect } from '@playwright/test';
import {HomePage} from '../pages/mason_home_page';
import {SignInPage} from '../pages/mason_signin_page';
import {MyAccountMakePaymentPage} from '../pages/mason_myAccountMakePayment_page';
import {MyAccountPage} from '../pages/mason_myaccount_page';
import { allure } from 'allure-playwright';
import { sign } from 'crypto';

const homepage_data =JSON.parse(JSON.stringify(require('../test_data/mason_sb_home_page_data.json')));
const resetpage_data =JSON.parse(JSON.stringify(require('../test_data/mason_reset_page_data.json')));
const signinpage_data =JSON.parse(JSON.stringify(require('../test_data/mason_signin_page_data.json')));
const myaccountpage_data =JSON.parse(JSON.stringify(require('../test_data/mason_sb_myaccount_page_data.json')));
const savedAddress = myaccountpage_data.myaccount_newaddress_firstname +" "+ myaccountpage_data.myaccount_newaddress_lastname +" "+ myaccountpage_data.myaccount_newaddress_addressline1;
const editAddress = myaccountpage_data.myaccount_editaddress_firstname +" "+ myaccountpage_data.myaccount_editaddress_lastname +" "+ myaccountpage_data.myaccount_editaddress_addressline1;

test.describe("Mason MakePayment Scenarios", ()=>{

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
      await signinPage.login(process.env.PAYMENT_USERNAME,process.env.PAYMENT_PASSWORD);
      await signinPage.clickSignIn();
    } else {
      const homePage = new HomePage(page);
      await homePage.clickOnHomePageSignIn();
      const signinPage = new SignInPage(page);
      await signinPage.validateWelcomeTextSignInDialog(signinpage_data.signin_dailog_text);
      await signinPage.validateWelcomeSignInDialog();
      await signinPage.clickSignIn();
      await signinPage.validateSignInDialog();
      await signinPage.login(process.env.PAYMENT_USERNAME,process.env.PAYMENT_PASSWORD);
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
  

  //SB-MyA119
  test("Validate user should be able to navigate to Make a Payment Page along with the New Credit card modal checks in My account",async({page},testInfo)=>{ 
    //test.slow();
    const myaccountPage = new MyAccountPage(page);
    const myaccountMakePaymentpage = new MyAccountMakePaymentPage(page);
    await myaccountPage.clickMyAccountMakeaPaymentLink();
    await myaccountMakePaymentpage.validateMakeaPaymentPage();  
    await myaccountMakePaymentpage.validateNewCreditCardRadioButton();
    await myaccountMakePaymentpage.validateSavedCreditCardRadioButton();
    await myaccountMakePaymentpage.addNewCreditCard();
    await myaccountMakePaymentpage.validateNewCreditCardModal();
  })

  //SB-MyA120
  test("Validate the securitycode tooltip text on hover in the New Credit card modal of Make Payment",async({page},testInfo)=>{ 
    //test.slow();
    const myaccountPage = new MyAccountPage(page);
    const myaccountMakePaymentpage = new MyAccountMakePaymentPage(page);
    await myaccountPage.clickMyAccountMakeaPaymentLink();
    await myaccountMakePaymentpage.validateMakeaPaymentPage();  
    await myaccountMakePaymentpage.validateNewCreditCardRadioButton();
    await myaccountMakePaymentpage.validateSavedCreditCardRadioButton();
    await myaccountMakePaymentpage.addNewCreditCard();
    await myaccountMakePaymentpage.validateSecurityCodeTooltiphover();
  })

//SB-MyA121
test("Validate the RadioButtons in the Billing Address in Make Payment page",async({page},testInfo)=>{ 
  //test.slow();
  const myaccountPage = new MyAccountPage(page);
  const myaccountMakePaymentpage = new MyAccountMakePaymentPage(page);
  await myaccountPage.clickMyAccountMakeaPaymentLink();
  await myaccountMakePaymentpage.addNewCreditCard();
  await myaccountMakePaymentpage.validateBillingAddressRadioButtons();

})

//SB-MyA124
test("Validate the New Address Modal in Make Payment page",async({page},testInfo)=>{ 
  //test.slow();
  const myaccountPage = new MyAccountPage(page);
  const myaccountMakePaymentpage = new MyAccountMakePaymentPage(page);
  await myaccountPage.clickMyAccountMakeaPaymentLink();
  await myaccountMakePaymentpage.addNewCreditCard();
  await myaccountMakePaymentpage.addNewAddress();
  await myaccountMakePaymentpage.validateNewAddressModal();

})

//SB-MyA125
test("Validate the Saved Address is selected by default if there are addresses added in Make Payment page",async({page},testInfo)=>{ 
  //test.slow();
  const myaccountPage = new MyAccountPage(page);
  const myaccountMakePaymentpage = new MyAccountMakePaymentPage(page);
  await myaccountPage.clickMyAccountMakeaPaymentLink();
  await myaccountMakePaymentpage.addNewCreditCard();
  await myaccountMakePaymentpage.validateSavedAddressisSelectedbyDefault();
  await myaccountMakePaymentpage.validateSavedAddressComboBox();

})

//SB-MyA126,27,28,29
test("Validate the ComboBox in the SavedAddress in Make Payment page",async({page},testInfo)=>{ 
  //test.slow();
  const myaccountPage = new MyAccountPage(page);
  const myaccountMakePaymentpage = new MyAccountMakePaymentPage(page);
  await myaccountPage.clickMyAccountMakeaPaymentLink();
  await myaccountMakePaymentpage.addNewCreditCard();
  await myaccountMakePaymentpage.validateSavedAddressisSelectedbyDefault();
  await myaccountMakePaymentpage.validateSavedAddressComboBox();
  await myaccountMakePaymentpage.validateSavedAddressList();

})

//SB-MyA133
test("Validate the SavedCC is selected by default when there is default billing address in Make Payment page",async({page},testInfo)=>{ 
  //test.slow();
  const myaccountPage = new MyAccountPage(page);
  const myaccountMakePaymentpage = new MyAccountMakePaymentPage(page);
  await myaccountPage.clickMyAccountMakeaPaymentLink();
  await myaccountMakePaymentpage.validateSavedCCisSelectedbyDefault();

})

//SB-MyA134
test("Validate the SavedCC details in the dropdown in Make Payment page",async({page},testInfo)=>{ 
  //test.slow();
  const myaccountPage = new MyAccountPage(page);
  const myaccountMakePaymentpage = new MyAccountMakePaymentPage(page);
  await myaccountPage.clickMyAccountMakeaPaymentLink();
  await myaccountMakePaymentpage.validateSavedCCisSelectedbyDefault();
  await myaccountMakePaymentpage.validateSavedCCDropDownField();

})

//SB-MyA135,36,37
test("Validate the selection of CC from savedCC List in Make Payment page",async({page},testInfo)=>{ 
  //test.slow();
  const myaccountPage = new MyAccountPage(page);
  const myaccountMakePaymentpage = new MyAccountMakePaymentPage(page);
  await myaccountPage.clickMyAccountMakeaPaymentLink();
  await myaccountMakePaymentpage.validateSavedCCisSelectedbyDefault();
  await myaccountMakePaymentpage.validateSavedCCDropDownField();
  await myaccountMakePaymentpage.clickAnOptionFromSavedCCList();

})


//SB-MyA138
test("Validate the selected CC details in Make Payment page",async({page},testInfo)=>{ 
  //test.slow();
  const myaccountPage = new MyAccountPage(page);
  const myaccountMakePaymentpage = new MyAccountMakePaymentPage(page);
  await myaccountPage.clickMyAccountMakeaPaymentLink();
  await myaccountMakePaymentpage.validateSavedCCisSelectedbyDefault();
  await myaccountMakePaymentpage.validateSavedCCDropDownField();
  await myaccountMakePaymentpage.clickAnOptionFromSavedCCList();
  await myaccountMakePaymentpage.validateEditCardlink();
  await myaccountMakePaymentpage.validateCardDetailOnPage();
  await myaccountMakePaymentpage.validateExpiryDetailOnPage();

})

//SB-MyA151,52
test("Validate the Payment section in Make Payment page",async({page},testInfo)=>{ 
  //test.slow();
  const myaccountPage = new MyAccountPage(page);
  const myaccountMakePaymentpage = new MyAccountMakePaymentPage(page);
  await myaccountPage.clickMyAccountMakeaPaymentLink();
  await myaccountMakePaymentpage.validateSavedCCisSelectedbyDefault();
  await myaccountMakePaymentpage.validateSavedCCDropDownField();
  await myaccountMakePaymentpage.clickAnOptionFromSavedCCList();
  await myaccountMakePaymentpage.validatePaymentsection();
  await myaccountMakePaymentpage.validateOtherAmountisEditable();

})


//SB-MyA156,57
test("Validate the Review Payment section in Make Payment page",async({page},testInfo)=>{ 
  //test.slow();
  const myaccountPage = new MyAccountPage(page);
  const myaccountMakePaymentpage = new MyAccountMakePaymentPage(page);
  await myaccountPage.clickMyAccountMakeaPaymentLink();
  await myaccountMakePaymentpage.validateSavedCCDropDownField();
  await myaccountMakePaymentpage.clickAnOptionFromSavedCCList();
  await myaccountMakePaymentpage.clickOnReviewPayment();
  await myaccountMakePaymentpage.validateReviewPaymentModal();


})


//SB-MyA158
test("Validate the Payment Success in Make Payment page",async({page},testInfo)=>{ 
  //test.slow();
  const myaccountPage = new MyAccountPage(page);
  const myaccountMakePaymentpage = new MyAccountMakePaymentPage(page);
  await myaccountPage.clickMyAccountMakeaPaymentLink();
  await myaccountMakePaymentpage.validateSavedCCDropDownField();
  await myaccountMakePaymentpage.clickAnOptionFromSavedCCList();
  await myaccountMakePaymentpage.clickOnReviewPayment();
  await myaccountMakePaymentpage.validateSubmitPayment();
  await myaccountMakePaymentpage.validatePaymentSuccessPage();


})

//SB-MyA160
test("Validate the Edit Option from Review Payment in Make Payment page",async({page},testInfo)=>{ 
  //test.slow();
  const myaccountPage = new MyAccountPage(page);
  const myaccountMakePaymentpage = new MyAccountMakePaymentPage(page);
  await myaccountPage.clickMyAccountMakeaPaymentLink();
  await myaccountMakePaymentpage.validateSavedCCDropDownField();
  await myaccountMakePaymentpage.clickAnOptionFromSavedCCList();
  await myaccountMakePaymentpage.clickOnReviewPayment();
  await myaccountMakePaymentpage.editPaymentFromReviewPayment();

})






})
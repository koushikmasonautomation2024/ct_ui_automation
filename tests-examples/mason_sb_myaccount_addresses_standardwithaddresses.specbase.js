const { chromium } = require('playwright');
import {test,expect } from '@playwright/test';
import {HomePageNew} from '../pages/mason_home_page1';
import {SignInPageNew} from '../pages/mason_signin_page1';
import {MyAccountPage} from '../pages/mason_myaccount_page';
import { allure } from 'allure-playwright';

const homepage_data =JSON.parse(JSON.stringify(require('../test_data/mason_sb_home_page_data.json')));
const signinpage_data =JSON.parse(JSON.stringify(require('../test_data/mason_signin_page_data.json')));
const signoutpage_data =JSON.parse(JSON.stringify(require('../test_data/mason_signout_page_data.json')));
const myaccountpage_data =JSON.parse(JSON.stringify(require('../test_data/mason_sb_myaccount_page_data.json')));
const savedAddress = myaccountpage_data.myaccount_newaddress_firstname +" "+ myaccountpage_data.myaccount_newaddress_lastname +" "+ myaccountpage_data.myaccount_newaddress_addressline1;
const editAddress = myaccountpage_data.myaccount_editaddress_firstname +" "+ myaccountpage_data.myaccount_editaddress_lastname +" "+ myaccountpage_data.myaccount_editaddress_addressline1;
let loginSuccessful = false;
test.describe("Mason MyAccount - Addresses - Standard With Addresses", ()=>{

   test.beforeEach(async({page,isMobile},testInfo)=>{
    test.slow();
    try {
      await page.goto(process.env.WEB_URL);
      await page.waitForLoadState('networkidle');
      if (isMobile == true) {
        const signinPage = new SignInPageNew(page);
        await signinPage.clickSignInImage();
        await signinPage.clickSignIn();
        await signinPage.validateSignInDialog();
        await signinPage.login(process.env.USERNAMEWITHADDRSS, process.env.PASSWORD);
        await signinPage.clickSignIn();
        await page.waitForLoadState('networkidle');
      } else {
        const homePage = new HomePageNew(page);
        await homePage.clickOnHomePageSignIn();
        const signinPage = new SignInPageNew(page);
        await signinPage.validateWelcomeTextSignInDialog(signinpage_data.signin_dailog_text);
        await signinPage.validateWelcomeSignInDialog();
        await signinPage.clickSignIn();
        await signinPage.validateSignInDialog();
        await signinPage.login(process.env.USERNAMEWITHADDRSS, process.env.PASSWORD);
        await signinPage.clickSignIn();
        const signinError = await signinPage.validateLoginError();
        //console.log('signinerror' + signinError);
        if (signinError) {
          console.error("Login failed:");
          loginSuccessful = false;
        } else {
          await signinPage.waitForMyAccountDashboardLoad();
          await signinPage.validateSignInMessage(signinpage_data.signin_success_text);
          await page.waitForLoadState('networkidle');
          loginSuccessful = true;
        }

      }
    } catch (error) {
      // Handle the error here
      console.error("Login failed:", error);
      loginSuccessful = false;
    }  
  })
  
  //Account - Addresses - Standard With Addresses - Test Cases ID-SB-MyA229/SB-MyA230/SB-MyA236/SB-MyA237
  test("Account - Addresses - Standard With Addresses - Verify functionality of add new Address",async({page},testInfo)=>{ 
    //test.slow();
    if (!loginSuccessful) {
      test.skip('Skipping test due to failed login');
    }
    const myaccountPage = new MyAccountPage(page);
    await myaccountPage.clickMyAccountAddressLink();
    await myaccountPage.displayAddressSection();
    await myaccountPage.clickAddNewAddressButton();
    await myaccountPage.displayAddNewAddressSection();
    await myaccountPage.validateAddNewAddress();
  })

  //Account - Addresses - Standard With Addresses - Test Cases ID-SB-MyA252/SB-MyA253/SB-MyA254/SB-MyA255
  test("Account - Addresses - Remove and Undo Remove Address - Verify clicking on 'Remove' button, the selected address gets deleted and the data removed from the Addresses page.",async({page},testInfo)=>{ 
    //test.slow();
    if (!loginSuccessful) {
      test.skip('Skipping test due to failed login');
    }
    const myaccountPage = new MyAccountPage(page);
    await myaccountPage.clickMyAccountAddressLink();
    await myaccountPage.displayAddressSection();
    await myaccountPage.undoRemoveAddress();
    await myaccountPage.removeAddress();
    
  })

  // //Account - Addresses - Standard With Addresses - Test Cases ID-SB-MyA254/SB-MyA255
  // test("Account - Addresses - Undo Remove Address - Verify clicking on the 'Undo' text link, application reverses the removal of the address.",async({page},testInfo)=>{ 
  //   //test.slow();
  //   const myaccountPage = new MyAccountPage(page);
  //   await myaccountPage.clickMyAccountAddressLink();
  //   await myaccountPage.displayAddressSection();
  //   await myaccountPage.undoRemoveAddress();

  // })

  //Account - Addresses - Standard With Addresses - Test Cases ID-SB-MyA244/SB-MyA249
  test("Account - Addresses - Edit Address - Verify clicking on Edit against any address, application expands edit address form with values pre-populated in it.",async({page},testInfo)=>{ 
    //test.slow();
    if (!loginSuccessful) {
      test.skip('Skipping test due to failed login');
    }
    const myaccountPage = new MyAccountPage(page);
    await myaccountPage.clickMyAccountAddressLink();
    await myaccountPage.editSavedAccountAddress();
    await myaccountPage.validateUpdateSavedAddress();
    
  })

  //Account - Addresses - Standard With Addresses - Test Cases ID-SB-MyA245/SB-MyA246
  test("Account - Addresses - Edit Address - Verify Address Line 2 (optional) field is collapsed upon load when data is not present.",async({page},testInfo)=>{ 
    //test.slow();
    if (!loginSuccessful) {
      test.skip('Skipping test due to failed login');
    }
    const myaccountPage = new MyAccountPage(page);
    await myaccountPage.clickMyAccountAddressLink();
    await myaccountPage.clickEditButton();
    await myaccountPage.validateAddressLine2();
    
  })

  //Account - Addresses - Standard With Addresses - Test Cases ID-SB-MyA247/SB-MyA248
  test("Account - Addresses - Edit Address - Verify clicking on Save button, application validates (missing required field, invalid field) and shows an error message to user.",async({page},testInfo)=>{ 
    //test.slow();
    if (!loginSuccessful) {
      test.skip('Skipping test due to failed login');
    }
    const myaccountPage = new MyAccountPage(page);
    await myaccountPage.clickMyAccountAddressLink();
    await myaccountPage.clickEditButton();
    await myaccountPage.enterInvalidDataForEditAddress();
    await myaccountPage.validateErrorMessage();
    
  })

  //Account - Addresses - Standard With Addresses - Test Cases ID-SB-MyA234/SB-MyA235
  test("Account - Addresses - Add Address - Verify clicking on Save button, application validates (missing required field, invalid field) and shows an error message to user.",async({page},testInfo)=>{ 
    //test.slow();
    if (!loginSuccessful) {
      test.skip('Skipping test due to failed login');
    }
    const myaccountPage = new MyAccountPage(page);
    await myaccountPage.clickMyAccountAddressLink();
    await myaccountPage.clickAddNewAddressButton();
    await myaccountPage.displayAddNewAddressSection();
    await myaccountPage.enterInvalidDataForAddAddress();
    await myaccountPage.validateErrorMessage();
    
  })

  //Account - Addresses - Standard With Addresses - Test Cases ID-SB-MyA251
  test("Account - Addresses - Cancel Edit Address - Verify Cancel link is shown below the Save button and clicking on it, application collapses the Edit address form.",async({page},testInfo)=>{ 
    //test.slow();
    if (!loginSuccessful) {
      test.skip('Skipping test due to failed login');
    }
    const myaccountPage = new MyAccountPage(page);
    await myaccountPage.clickMyAccountAddressLink();
    await myaccountPage.clickEditButton();
    await myaccountPage.clickCancelEditAddressButton();
    await myaccountPage.cancelEditAddress();
    
  })

  //Account - Addresses - Standard With Addresses - Test Cases ID-SB-MyA239/SB-MyA240
  test("Account - Addresses - Set as Default Address - Verify if the 'Set as default billing & shipping address' checkbox is selected then newly added address gets updated as the Default Billing & Shipping Address upon save..",async({page},testInfo)=>{ 
    //test.slow();
    if (!loginSuccessful) {
      test.skip('Skipping test due to failed login');
    }
    const myaccountPage = new MyAccountPage(page);
    await myaccountPage.clickMyAccountAddressLink();
    await myaccountPage.setDefaultAddress();
    await myaccountPage.validateDefaultShippingFirstSection();
    await myaccountPage.clickAddNewAddressButton();
    await myaccountPage.displayAddNewAddressSection();
    await myaccountPage.addNewDefaultShippingBillingAddress();
    
  })

  // //Account - Addresses - Standard With Addresses - Test Cases ID-SB-MyA238
  // test("Account - Addresses - Set as Default Address using Default Checkbox - Verify if the 'Set as default billing & shipping address' checkbox is selected then newly added address gets updated as the Default Billing & Shipping Address upon save..",async({page},testInfo)=>{ 
  //   //test.slow();
  //   const myaccountPage = new MyAccountPage(page);
  //   await myaccountPage.clickMyAccountAddressLink();
  //   await myaccountPage.clickAddNewAddressButton();
  //   await myaccountPage.displayAddNewAddressSection();
  //   await myaccountPage.addNewDefaultShippingBillingAddress();
  //   })

})
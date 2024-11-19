const { chromium } = require('playwright');
import {test,expect } from '@playwright/test';
import {HomePage} from '../pages/mason_home_page';
import {SignInPage} from '../pages/mason_signin_page';
import {MyAccountPage} from '../pages/mason_myaccount_page';
import { allure } from 'allure-playwright';

const homepage_data =JSON.parse(JSON.stringify(require('../test_data/mason_sb_home_page_data.json')));
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
      //await page.goto(process.env.DASHBOARD_URL);
    }
    const masonHomePageScreenshot = await page.screenshot();
    await testInfo.attach('screenshot', { body: masonHomePageScreenshot, contentType: 'image/png' });
    //await page.screenshot({ path: './screenshots/MasonHomePage.png', fullPage: true });
  }catch (error) {
    // Handle the error here
    console.error("An error occurred in test.beforeEach:", error);
}
    
  })
  test.only("Display the Home Page",async({page},testInfo)=>{ 
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

  test.only("Validate user should be able to login in to site and navigate to My account",async({page},testInfo)=>{ 
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

  test.only("Validate user should be able to add new address in My account",async({page},testInfo)=>{ 
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

})
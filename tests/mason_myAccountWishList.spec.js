const { chromium } = require('playwright');
import {test,expect } from '@playwright/test';
import {HomePage} from '../pages/mason_home_page';
import {SignInPage} from '../pages/mason_signin_page';
import {ResetPage} from '../pages/mason_reset_page';
import {MyAccountPage} from '../pages/mason_myaccount_page';
import {MyAccountWishListPage} from '../pages/mason_myAccountWishList_page';
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
      
    }
    const masonHomePageScreenshot = await page.screenshot();
    await testInfo.attach('screenshot', { body: masonHomePageScreenshot, contentType: 'image/png' });
    //await page.screenshot({ path: './screenshots/MasonHomePage.png', fullPage: true });
  }catch (error) {
    // Handle the error here
    console.error("An error occurred in test.beforeEach:", error);
}
    
  })
 
  //SB-MyA357, //SB-MyA326
  test("Validate user should be able to navigate to WishList Page in My account",async({page},testInfo)=>{ 
    //test.slow();
    const signinPage = new SignInPage(page);
    await signinPage.login(process.env.USERNAME,process.env.PASSWORD);
    await signinPage.clickSignIn();
    await page.waitForLoadState('networkidle');
    const myaccountPage = new MyAccountPage(page);
    const myaccountWishListPage = new MyAccountWishListPage(page);
    await myaccountPage.displayMyAccountLeftNavigationLink();
    await myaccountPage.clickOnMyAccountLink();
    //await myaccountPage.validateMyAccountDashboardNavigation();
    await myaccountPage.clickMyAccountWishListLink();
    await myaccountWishListPage.validateWishListPage();
    await myaccountWishListPage.noWishListMessageForNewUser();
    
           
  })

  //SB-MyA327
  test("Validate Breadcrumbs in WishList Page",async({page},testInfo)=>{ 
    //test.slow();
    const signinPage = new SignInPage(page);
    await signinPage.login(process.env.USERNAME,process.env.PASSWORD);
    await signinPage.clickSignIn();
    await page.waitForLoadState('networkidle');
    const myaccountPage = new MyAccountPage(page);
    const myaccountWishListPage = new MyAccountWishListPage(page);
    await myaccountPage.displayMyAccountLeftNavigationLink();
    await myaccountPage.clickOnMyAccountLink();
    //await myaccountPage.validateMyAccountDashboardNavigation();
    await myaccountPage.clickMyAccountWishListLink();
    await myaccountWishListPage.validateWishlistBreadcrumb();
  })

//SB-MyA330
test("Validate Item count is displayed near the title in WishList Page",async({page},testInfo)=>{ 
  //test.slow();
  const signinPage = new SignInPage(page);
  await signinPage.login(process.env.PAYMENT_USERNAME,process.env.PAYMENT_PASSWORD);
  await signinPage.clickSignIn();
  await page.waitForLoadState('networkidle');
  const myaccountPage = new MyAccountPage(page);
  const myaccountWishListPage = new MyAccountWishListPage(page);
  await myaccountPage.displayMyAccountLeftNavigationLink();
  await myaccountPage.clickOnMyAccountLink();
  //await myaccountPage.validateMyAccountDashboardNavigation();
  await myaccountPage.clickMyAccountWishListLink();
   await myaccountWishListPage.validateItemCountIsDisplayed();
  })

  //SB-MyA331
test("Validate WishListed item in WishList Page",async({page},testInfo)=>{ 
  //test.slow();
  const signinPage = new SignInPage(page);
  await signinPage.login(process.env.PAYMENT_USERNAME,process.env.PAYMENT_PASSWORD);
  await signinPage.clickSignIn();
  await page.waitForLoadState('networkidle');
  const myaccountPage = new MyAccountPage(page);
  const myaccountWishListPage = new MyAccountWishListPage(page);
  await myaccountPage.displayMyAccountLeftNavigationLink();
  await myaccountPage.clickOnMyAccountLink();
  //await myaccountPage.validateMyAccountDashboardNavigation();
  await myaccountPage.clickMyAccountWishListLink();
  await myaccountWishListPage.validateItemCountIsDisplayed();
  await myaccountWishListPage.validateTheWishListedItem();

})


//SB-MyA338
test("Validate Alignment of WishListed item in WishList Page",async({page},testInfo)=>{ 
  //test.slow();
  const signinPage = new SignInPage(page);
  await signinPage.login(process.env.PAYMENT_USERNAME,process.env.PAYMENT_PASSWORD);
  await signinPage.clickSignIn();
  await page.waitForLoadState('networkidle');
  const myaccountPage = new MyAccountPage(page);
  const myaccountWishListPage = new MyAccountWishListPage(page);
  await myaccountPage.displayMyAccountLeftNavigationLink();
  await myaccountPage.clickOnMyAccountLink();
  //await myaccountPage.validateMyAccountDashboardNavigation();
  await myaccountPage.clickMyAccountWishListLink();
  await myaccountWishListPage.validateItemCountIsDisplayed();
  await myaccountWishListPage.validateAlignmentInWishList();

})

//SB-MyA339
test.only("Validate Pricing of WishListed item in WishList Page is in the expected format",async({page},testInfo)=>{ 
  //test.slow();
  const signinPage = new SignInPage(page);
  await signinPage.login(process.env.PAYMENT_USERNAME,process.env.PAYMENT_PASSWORD);
  await signinPage.clickSignIn();
  await page.waitForLoadState('networkidle');
  const myaccountPage = new MyAccountPage(page);
  const myaccountWishListPage = new MyAccountWishListPage(page);
  await myaccountPage.displayMyAccountLeftNavigationLink();
  await myaccountPage.clickOnMyAccountLink();
  //await myaccountPage.validateMyAccountDashboardNavigation();
  await myaccountPage.clickMyAccountWishListLink();
  await page.reload();
  await page.waitForLoadState('networkidle');
  await myaccountPage.clickMyAccountWishListLink();
  await myaccountWishListPage.validateItemCountIsDisplayed();
  await myaccountWishListPage.validatePricingFormat();
})


//SB-MyA334
test("Validate Heart icon is filled in the Wishlist page for all the wishlisted product",async({page},testInfo)=>{ 
  //test.slow();
  const signinPage = new SignInPage(page);
  await signinPage.login(process.env.PAYMENT_USERNAME,process.env.PAYMENT_PASSWORD);
  await signinPage.clickSignIn();
  await page.waitForLoadState('networkidle');
  const myaccountPage = new MyAccountPage(page);
  const myaccountWishListPage = new MyAccountWishListPage(page);
  await myaccountPage.displayMyAccountLeftNavigationLink();
  await myaccountPage.clickOnMyAccountLink();
  //await myaccountPage.validateMyAccountDashboardNavigation();
  await myaccountPage.clickMyAccountWishListLink();
  await myaccountWishListPage.validateItemCountIsDisplayed();
  await myaccountWishListPage.validateHeartIconIsFilled();
})

//SB-MyA335
test("Validate Item Remove Success message when we click on wishlisted icon in wishList page",async({page},testInfo)=>{ 
  //test.slow();
  const signinPage = new SignInPage(page);
  await signinPage.login(process.env.PAYMENT_USERNAME,process.env.PAYMENT_PASSWORD);
  await signinPage.clickSignIn();
  await page.waitForLoadState('networkidle');
  const myaccountPage = new MyAccountPage(page);
  const myaccountWishListPage = new MyAccountWishListPage(page);
  await myaccountPage.displayMyAccountLeftNavigationLink();
  await myaccountPage.clickOnMyAccountLink();
  //await myaccountPage.validateMyAccountDashboardNavigation();
  await myaccountPage.clickMyAccountWishListLink();
  await myaccountWishListPage.validateItemCountIsDisplayed();
  await myaccountWishListPage.validateRemoveItemFromWishList();
})

})
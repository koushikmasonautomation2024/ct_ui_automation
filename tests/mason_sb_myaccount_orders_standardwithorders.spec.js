const { chromium } = require('playwright');
import {test,expect } from '@playwright/test';
import {HomePage} from '../pages/mason_home_page';
import {SignInPage} from '../pages/mason_signin_page';
import {MyAccountPage} from '../pages/mason_myaccount_page';
import { allure } from 'allure-playwright';

const homepage_data =JSON.parse(JSON.stringify(require('../test_data/mason_sb_home_page_data.json')));
const signinpage_data =JSON.parse(JSON.stringify(require('../test_data/mason_signin_page_data.json')));
const signoutpage_data =JSON.parse(JSON.stringify(require('../test_data/mason_signout_page_data.json')));
const myaccountpage_data =JSON.parse(JSON.stringify(require('../test_data/mason_sb_myaccount_page_data.json')));
const savedAddress = myaccountpage_data.myaccount_newaddress_firstname +" "+ myaccountpage_data.myaccount_newaddress_lastname +" "+ myaccountpage_data.myaccount_newaddress_addressline1;
const editAddress = myaccountpage_data.myaccount_editaddress_firstname +" "+ myaccountpage_data.myaccount_editaddress_lastname +" "+ myaccountpage_data.myaccount_editaddress_addressline1;

test.describe("Mason Commerce Tool Site", ()=>{

   test.beforeEach(async({page,isMobile},testInfo)=>{
    test.slow();
       try {
           await page.goto(process.env.WEB_URL);
           await page.waitForLoadState('networkidle');
           if(isMobile==true){
            const signinPage = new SignInPage(page);  
            await signinPage.clickSignInImage();
            await signinPage.clickSignIn();
            await signinPage.validateSignInDialog();
            await signinPage.login(process.env.USERNAME,process.env.PASSWORD);
            await signinPage.clickSignIn();
            await page.waitForLoadState('networkidle');
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
            await signinPage.waitForMyAccountDashboardLoad();
            await signinPage.validateSignInMessage(signinpage_data.signin_success_text);
            await page.waitForLoadState('networkidle');
          }
           const masonHomePageScreenshot = await page.screenshot();
           await testInfo.attach('screenshot', { body: masonHomePageScreenshot, contentType: 'image/png' });
       } catch (error) {
           // Handle the error here
           console.error("An error occurred in test.beforeEach:", error);
       }   
  })
  
  //Account - Orders - Standard With Orders - Test Cases ID-SB-MyA168/SB-MyA169/SB-MyA170/SB-MyA171
  test("Account - Orders - Standard With Orders - Verify display and functionality of the dynamic sort option dropdown",async({page},testInfo)=>{ 
    test.slow();
    const myaccountPage = new MyAccountPage(page);
    await myaccountPage.clickMyAccountOrderLink();
    await myaccountPage.validateOrdersSortDropdown();
    await myaccountPage.validateOrdersSelectedSortDropdownValue();
  })

  //Account - Orders - Standard With Orders - Test Cases ID-SB-MyA168/SB-MyA169/SB-MyA170/SB-MyA171/SB-MyA173/SB-MyA174
  test("Account - Orders - Standard With Orders - Verify display of order details including Order ID, Order Date, and Order Total",async({page},testInfo)=>{ 
    test.slow();
    const myaccountPage = new MyAccountPage(page);
    await myaccountPage.clickMyAccountOrderLink();
    await myaccountPage.validatedOrderNumberDisplaySection(myaccountpage_data.myaccount_orders_ordernumberprefix);
  })

  //Account - Orders - Standard With Orders - Test Cases ID-SB-MyA177/SB-MyA181
  test("Account - Orders Requiring Down Payment - Verify functionality of Make a Down Payment CTA and its redirection to the Make a Down Payment Drawer",async({page},testInfo)=>{ 
    test.slow();
    const myaccountPage = new MyAccountPage(page);
    await myaccountPage.clickMyAccountOrderLink();
    await myaccountPage.validateMakeADownPayment();
  })

})
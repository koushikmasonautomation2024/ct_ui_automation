const { chromium } = require('playwright');
import {test,expect } from '@playwright/test';
import {HomePage} from '../pages/mason_home_page';
import {SignInPage} from '../pages/mason_signin_page';
import {MyAccountPage} from '../pages/mason_myaccount_page';
import {NewUserMyAccountPage} from '../pages/mason_newuser_myaccount_page';
import { allure } from 'allure-playwright';

const homepage_data =JSON.parse(JSON.stringify(require('../test_data/mason_sb_home_page_data.json')));
const signinpage_data =JSON.parse(JSON.stringify(require('../test_data/mason_signin_page_data.json')));
const signoutpage_data =JSON.parse(JSON.stringify(require('../test_data/mason_signout_page_data.json')));
const myaccountpage_data =JSON.parse(JSON.stringify(require('../test_data/mason_sb_myaccount_page_data.json')));
const newuser_myaccountpage_data =JSON.parse(JSON.stringify(require('../test_data/mason_sb_newcustomer_myaccount_page_data.json')));
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
  //Account - My Account- Longstanding Customer - Left-hand Navigation-SB-MyA005
  test("New User Account - My Account-Left-hand Navigation - Verify all navigation links are clickable",async({page},testInfo)=>{ 
    test.slow();
    const myaccountPage = new MyAccountPage(page);
    await myaccountPage.verifyLeftNavLinks();
    await myaccountPage.verifyAllLinksAreClickable();
  })

  //Account - My Account- Longstanding Customer - Left-hand Navigation-SB-MyA005
  test("New User Account - My Account-Left-hand Navigation - Verify navigation link highlights current section",async({page},testInfo)=>{ 
    test.slow();
    const myaccountPage = new MyAccountPage(page);
    await myaccountPage.clickAndVerifyHighlightedLink();
          
  })

  //Account - My Account- Longstanding Customer - My Stoneberry Credit-SB-MyA043/SB-MyA044/SB-MyA045/SB-MyA046
  test.only("New User Account - My Stoneberry Credit - Verify display of Get Pre Qualified and Learn More links and redirection to the corresponding pages",async({page},testInfo)=>{ 
    test.slow();
    const newuser_myaccountPage = new NewUserMyAccountPage(page);
    await newuser_myaccountPage.validateNewUserStoneBerryCreditSection(newuser_myaccountpage_data.myaccount_sb_newuser_prequalifiedlinkname,newuser_myaccountpage_data.myaccount_sb_newuser_learnmorelinkname);
          
  })

  


})
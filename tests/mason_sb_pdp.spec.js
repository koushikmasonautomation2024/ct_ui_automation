const { chromium } = require('playwright');
import {test,expect } from '@playwright/test';
import {HomePageNew} from '../pages/mason_home_page1';
import {SignInPageNew} from '../pages/mason_signin_page1';
import {MyAccountPage} from '../pages/mason_myaccount_page';
import {PDPPage} from '../pages/mason_pdp_page';
import { allure } from 'allure-playwright';

const homepage_data =JSON.parse(JSON.stringify(require('../test_data/mason_sb_home_page_data.json')));
const signinpage_data =JSON.parse(JSON.stringify(require('../test_data/mason_signin_page_data.json')));
const signoutpage_data =JSON.parse(JSON.stringify(require('../test_data/mason_signout_page_data.json')));
const myaccountpage_data =JSON.parse(JSON.stringify(require('../test_data/mason_sb_myaccount_page_data.json')));
const savedAddress = myaccountpage_data.myaccount_newaddress_firstname +" "+ myaccountpage_data.myaccount_newaddress_lastname +" "+ myaccountpage_data.myaccount_newaddress_addressline1;
const editAddress = myaccountpage_data.myaccount_editaddress_firstname +" "+ myaccountpage_data.myaccount_editaddress_lastname +" "+ myaccountpage_data.myaccount_editaddress_addressline1;

test.describe("Mason PDP", ()=>{

   test.beforeEach(async({page,isMobile},testInfo)=>{
    test.slow();
       try {
           await page.goto(process.env.WEB_URL);
           await page.waitForLoadState('networkidle');
           if(isMobile==true){
            const signinPage = new SignInPageNew(page);  
            await signinPage.clickSignInImage();
            await signinPage.clickSignIn();
            await signinPage.validateSignInDialog();
            await signinPage.login(process.env.USERNAME,process.env.PASSWORD);
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
  
  //PDP - Display of Selected Variant Image - Test Cases ID-SB-PDP017/SB-PDP019
  test("PDP - Display of Selected Variant Image - Verify that selected variant’s image is displayed  as full sized to the left",async({page},testInfo)=>{ 
    const pdpPage = new PDPPage(page);
    await page.goto('https://dev--stoneberry-masoncompanies.netlify.app/product/black-shimmer-array-women-s-charlie-pump/1011530-16/');
    await pdpPage.verifyImageChangesOnVariantSelection();
  })

  //PDP - Image Navigation with Left and Right Arrows - Test Cases ID-SB-PDP026
  test("PDP - Image Navigation with Left and Right Arrows - Verify left and right navigation arrows on the main image displayed",async({page},testInfo)=>{ 
    const pdpPage = new PDPPage(page);
    await page.goto('https://dev--stoneberry-masoncompanies.netlify.app/product/black-shimmer-array-women-s-charlie-pump/1011530-16/');
    await pdpPage.clickLeftRightCarouselButton();
  })

  //PDP - Display of Additional Images as Thumbnails - Test Cases ID-SB-PDP028
  test("PDP - Display of Additional Images as Thumbnails - Verify additional images associated with variants thumbnail images,variant has more than 5 image associated with it, system shall display left and right navigation arrows.",async({page},testInfo)=>{ 
    const pdpPage = new PDPPage(page);
    await page.goto('https://dev--stoneberry-masoncompanies.netlify.app/product/black-shimmer-array-women-s-charlie-pump/1011530-16/');
    await pdpPage.thumbnailImageLeftRightArrowDisplay();
  })

  //PDP - Highlighting Selected Thumbnail Image - Test Cases ID-SB-PDP029
  test("PDP - Highlighting Selected Thumbnail Image - Verify that system can highlight with a black outline the thumbnail image that corresponds to the image currently being viewed as full sized.",async({page},testInfo)=>{ 
    const pdpPage = new PDPPage(page);
    await page.goto('https://dev--stoneberry-masoncompanies.netlify.app/product/black-shimmer-array-women-s-charlie-pump/1011530-16/');
    await pdpPage.validateThumbnailImageSelection();
  })

  //PDP - Product Data Display (Name, Item #, Reviews, Shop All Link, Color, Size, Size Chart Link, Pricing) - Test Cases ID-SB-PDP009/SB-PDP010/SB-PDP011
  test("PDP - Product Data Display (Name, Item #, Reviews, Shop All Link, Color, Size, Size Chart Link, Pricing) - Verify Display of various product data.",async({page},testInfo)=>{ 
    const pdpPage = new PDPPage(page);
    await page.goto('https://dev--stoneberry-masoncompanies.netlify.app/product/solo-lee-jeans-men-s-legendary-carpenter-pant/1366914-1/');
    await pdpPage.validateProductDetails();
  })

})
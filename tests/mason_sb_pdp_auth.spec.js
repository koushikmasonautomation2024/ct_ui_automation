const { chromium } = require('playwright');
import {test,expect } from '@playwright/test';
import {HomePageNew} from '../pages/mason_home_page1';
import {SignInPageNew} from '../pages/mason_signin_page1';
import {MyAccountPage} from '../pages/mason_myaccount_page';
import {PDPPage} from '../pages/mason_pdp_page';
import { allure } from 'allure-playwright';
import fs from 'fs';
require('dotenv').config();
const creditUserFile = './credituser.json';
const nonCreditUserFile = './noncredituser.json';
const newUserFile = './newuser.json';

const homepage_data =JSON.parse(JSON.stringify(require('../test_data/mason_sb_home_page_data.json')));
const signinpage_data =JSON.parse(JSON.stringify(require('../test_data/mason_signin_page_data.json')));
const signoutpage_data =JSON.parse(JSON.stringify(require('../test_data/mason_signout_page_data.json')));
const myaccountpage_data =JSON.parse(JSON.stringify(require('../test_data/mason_sb_myaccount_page_data.json')));
const savedAddress = myaccountpage_data.myaccount_newaddress_firstname +" "+ myaccountpage_data.myaccount_newaddress_lastname +" "+ myaccountpage_data.myaccount_newaddress_addressline1;
const editAddress = myaccountpage_data.myaccount_editaddress_firstname +" "+ myaccountpage_data.myaccount_editaddress_lastname +" "+ myaccountpage_data.myaccount_editaddress_addressline1;
let loginSuccessful = false;
test.describe("Mason PDP", ()=>{

   test.beforeEach(async({page,isMobile},testInfo)=>{
    test.slow();
    const storageStatePath = isMobile ? newUserFile : newUserFile;

    if (fs.existsSync(storageStatePath)) {
      await page.context().addCookies(JSON.parse(fs.readFileSync(storageStatePath, 'utf-8')).cookies);
      loginSuccessful = true;
    } else {
      console.error("Login state is not available, skipping test.");
      test.skip('Skipping test because login state is not available');
    }

    try {
      await page.goto(process.env.WEB_URL);
      await page.waitForLoadState('networkidle');
    } catch (error) {
      console.error("Navigation failed:", error);
      test.skip('Skipping test because navigation failed');
    }
  })
  
  //PDP - Display of Selected Variant Image - Test Cases ID-SB-PDP017/SB-PDP019
  test.only("PDP - Display of Selected Variant Image - Verify that selected variant’s image is displayed  as full sized to the left",async({page},testInfo)=>{ 
    if (!loginSuccessful) {
      test.skip('Skipping test due to failed login');
    }
    const pdpPage = new PDPPage(page);
    await page.goto('https://dev--stoneberry-masoncompanies.netlify.app/product/black-shimmer-array-women-s-charlie-pump/1011530-16/');
    await pdpPage.verifyImageChangesOnVariantSelection();
  })

  //PDP - Image Navigation with Left and Right Arrows - Test Cases ID-SB-PDP026
  test.only("PDP - Image Navigation with Left and Right Arrows - Verify left and right navigation arrows on the main image displayed",async({page},testInfo)=>{ 
    if (!loginSuccessful) {
      test.skip('Skipping test due to failed login');
    }
    const pdpPage = new PDPPage(page);
    await page.goto('https://dev--stoneberry-masoncompanies.netlify.app/product/black-shimmer-array-women-s-charlie-pump/1011530-16/');
    await pdpPage.clickLeftRightCarouselButton();
  })

  //PDP - Display of Additional Images as Thumbnails - Test Cases ID-SB-PDP028
  test.only("PDP - Display of Additional Images as Thumbnails - Verify additional images associated with variants thumbnail images,variant has more than 5 image associated with it, system shall display left and right navigation arrows.",async({page},testInfo)=>{ 
    if (!loginSuccessful) {
      test.skip('Skipping test due to failed login');
    }
    const pdpPage = new PDPPage(page);
    await page.goto('https://dev--stoneberry-masoncompanies.netlify.app/product/black-shimmer-array-women-s-charlie-pump/1011530-16/');
    await pdpPage.thumbnailImageLeftRightArrowDisplay();
  })

  //PDP - Highlighting Selected Thumbnail Image - Test Cases ID-SB-PDP029
  test.only("PDP - Highlighting Selected Thumbnail Image - Verify that system can highlight with a black outline the thumbnail image that corresponds to the image currently being viewed as full sized.",async({page},testInfo)=>{ 
    if (!loginSuccessful) {
      test.skip('Skipping test due to failed login');
    }
    const pdpPage = new PDPPage(page);
    await page.goto('https://dev--stoneberry-masoncompanies.netlify.app/product/black-shimmer-array-women-s-charlie-pump/1011530-16/');
    await pdpPage.validateThumbnailImageSelection();
  })

  //PDP - Product Data Display (Name, Item #, Reviews, Shop All Link, Color, Size, Size Chart Link, Pricing) - Test Cases ID-SB-PDP009/SB-PDP010/SB-PDP011/SB-PDP016
  test.only("PDP - Product Data Display (Name, Item #, Reviews, Shop All Link, Color, Size, Size Chart Link, Pricing) - Verify Display of various product data.",async({page},testInfo)=>{ 
    if (!loginSuccessful) {
      test.skip('Skipping test due to failed login');
    }
    const pdpPage = new PDPPage(page);
    await page.goto('https://dev--stoneberry-masoncompanies.netlify.app/product/black-shimmer-array-women-s-charlie-pump/1011530-16/');
    await pdpPage.validateProductDetails();
  })

  //PDP - Product Data Display (Name, Item #, Reviews, Shop All Link, Color, Size, Size Chart Link, Pricing) - Test Cases ID-SB-PDP012/SB-PDP013/SB-PDP014/SB-PDP015
  test.only("PDP - Product Data Display - Verify selection of size & color variants.",async({page},testInfo)=>{ 
    if (!loginSuccessful) {
      test.skip('Skipping test due to failed login');
    }
    const pdpPage = new PDPPage(page);
    await page.goto('https://dev--stoneberry-masoncompanies.netlify.app/product/black-shimmer-array-women-s-charlie-pump/1011530-16/');
    await pdpPage.validateSelectSizeValue();
    await pdpPage.validateSelectColorValue();
  })

  //PDP - Display Sale Pricing and Percentage Saved - Test Cases ID-SB-PDP043
  test.only("PDP - Display Sale Pricing and Percentage Saved - Verify Sitewide sale pricing shall be displayed bolded in red if the product is on sale followed by the regular retail price.",async({page},testInfo)=>{ 
    if (!loginSuccessful) {
      test.skip('Skipping test due to failed login');
    }
    const pdpPage = new PDPPage(page);
    await page.goto('https://dev--stoneberry-masoncompanies.netlify.app/product/black-shimmer-array-women-s-charlie-pump/1011530-16/');
    await pdpPage.validatePricingSection();  
  })

  //PDP - Display Dynamic Credit Messaging and Promotional Text - Test Cases ID-SB-PDP048
  test.only("PDP - Display Dynamic Credit Messaging and Promotional Text - Verify Dynamic Credit Specific Messaging and/or Promotional Text:",async({page},testInfo)=>{ 
    if (!loginSuccessful) {
      test.skip('Skipping test due to failed login');
    }
    const pdpPage = new PDPPage(page);
    await page.goto('https://dev--stoneberry-masoncompanies.netlify.app/product/black-shimmer-array-women-s-charlie-pump/1011530-16/');
    await pdpPage.validateCreditMessageSection();  
  })

  //PDP - Description and Specifications Display - Test Cases ID-SB-PDP048
  test.only("PDP - Description,Specifications and Shipping Display - Verify the Display of description,specifications and shipping section:",async({page},testInfo)=>{ 
    if (!loginSuccessful) {
      test.skip('Skipping test due to failed login');
    }
    const pdpPage = new PDPPage(page);
    await page.goto('https://dev--stoneberry-masoncompanies.netlify.app/product/black-shimmer-array-women-s-charlie-pump/1011530-16/');
    await pdpPage.validateDescription();
    await pdpPage.validateSpecifications();
    await pdpPage.validateShipping();  
  })

  //PDP - Ways to Wear It Section - Test Cases ID-SB-PDP067
  test.only("PDP - Ways to Wear It Section - Verify Ways to wear content:",async({page},testInfo)=>{ 
    if (!loginSuccessful) {
      test.skip('Skipping test due to failed login');
    }
    const pdpPage = new PDPPage(page);
    await page.goto('https://dev--stoneberry-masoncompanies.netlify.app/product/black-shimmer-array-women-s-charlie-pump/1011530-16/');
    await pdpPage.validateWaysToWearIt();  
  })

  //PDP - Reviews and Questions & Answers Display - Test Cases ID-SB-PDP084/SB-PDP085
  test.only("PDP - Reviews and Questions & Answers Display - Verify Power review and Q&A content:",async({page},testInfo)=>{ 
    if (!loginSuccessful) {
      test.skip('Skipping test due to failed login');
    }
    const pdpPage = new PDPPage(page);
    await page.goto('https://dev--stoneberry-masoncompanies.netlify.app/product/black-shimmer-array-women-s-charlie-pump/1011530-16/');
    await pdpPage.validateReviews();
    await pdpPage.validateQuestionsAnswers();  
  })

})
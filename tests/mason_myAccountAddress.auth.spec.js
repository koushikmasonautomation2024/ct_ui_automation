const { chromium } = require('playwright');
import {test,expect } from '@playwright/test';
import {HomePage} from '../pages/mason_home_page';
import {SignInPage} from '../pages/mason_signin_page';
import {ResetPage} from '../pages/mason_reset_page';
import {MyAccountPage} from '../pages/mason_myaccount_page';
import {MyAccountAddressPage} from '../pages/mason_myAccountAddress_page';
import { allure } from 'allure-playwright';
import { sign } from 'crypto';
import fs from 'fs';
require('dotenv').config();
const creditUserFile = './credituser.json';
const nonCreditUserFile = './noncredituser.json';
const newUserFile = './newuser.json';
const paymentUserFile = './paymentuser.json';

const homepage_data =JSON.parse(JSON.stringify(require('../test_data/mason_sb_home_page_data.json')));
const resetpage_data =JSON.parse(JSON.stringify(require('../test_data/mason_reset_page_data.json')));
const signinpage_data =JSON.parse(JSON.stringify(require('../test_data/mason_signin_page_data.json')));
const myaccountpage_data =JSON.parse(JSON.stringify(require('../test_data/mason_sb_myaccount_page_data.json')));

let loginSuccessful = false;
test.describe("Mason MyAccount New User", ()=>{

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
 
  
//SB-MyA227
  test("Validate Home -> My account -> Addresses breadcrumbs are shown in Address page",async({page},testInfo)=>{
    if (!loginSuccessful) {
      test.skip('Skipping test due to failed login');
    } 
    const myAccountAddressPage = new MyAccountAddressPage(page);
    const myAccountPage = new MyAccountPage(page);
    await myAccountPage.redirectToMyAccount();
    //await myAccountPage.clickOnMyAccountLink();
    await myAccountAddressPage.displayAddressPage();    
        
  })

  //SB-MyA228
  test("Validate Add new address link is shown aligned with the page title in Address page",async({page},testInfo)=>{ 
    if (!loginSuccessful) {
      test.skip('Skipping test due to failed login');
    }
    const myAccountAddressPage = new MyAccountAddressPage(page);
    const myAccountPage = new MyAccountPage(page);
    await myAccountPage.redirectToMyAccount();
    //await myAccountPage.clickOnMyAccountLink();
    await myAccountAddressPage.displayAddressPage();    
    await myAccountAddressPage.displayAddNewAddressLink();  
        
  })

  //SB-MyA259
  test("Validate message -There are currently no addresses saved to your account - when no addresses are available",async({page},testInfo)=>{ 
    if (!loginSuccessful) {
      test.skip('Skipping test due to failed login');
    }
    const myAccountAddressPage = new MyAccountAddressPage(page);
    const myAccountPage = new MyAccountPage(page);
    await myAccountPage.redirectToMyAccount();
    //await myAccountPage.clickOnMyAccountLink();
    await myAccountAddressPage.clickMyAccountAddressLink();
    await myAccountAddressPage.noAddressMessageForNewUser();

  })

  })
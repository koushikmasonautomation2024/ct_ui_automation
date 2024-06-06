
import { chromium } from '@playwright/test';
import fs from 'fs';
require('dotenv').config();
import {HomePageNew} from '../pages/mason_home_page1';
import {SignInPageNew} from '../pages/mason_signin_page1';
import {MyAccountPage} from '../pages/mason_myaccount_page';

const homepage_data =JSON.parse(JSON.stringify(require('../test_data/mason_sb_home_page_data.json')));
const signinpage_data =JSON.parse(JSON.stringify(require('../test_data/mason_signin_page_data.json')));
const signoutpage_data =JSON.parse(JSON.stringify(require('../test_data/mason_signout_page_data.json')));
const myaccountpage_data =JSON.parse(JSON.stringify(require('../test_data/mason_sb_myaccount_page_data.json')));

const creditUserFile = './credituser.json';
const nonCreditUserFile = './noncredituser.json';

export default async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  try {
    // Authenticate as credit user
    await page.goto(process.env.WEB_URL);
    await page.waitForLoadState('networkidle');
    const homePage = new HomePageNew(page);
    await homePage.clickOnHomePageSignIn();
    const signinPage = new SignInPageNew(page);
    await signinPage.validateWelcomeTextSignInDialog(signinpage_data.signin_dailog_text);
    await signinPage.validateWelcomeSignInDialog();
    await signinPage.clickSignIn();
    await signinPage.validateSignInDialog();
    await signinPage.login(process.env.CREDIT_USER, process.env.CREDIT_USER_PASSWORD);
    await signinPage.clickSignIn();
    await signinPage.waitForMyAccountDashboardLoad();
    await signinPage.validateSignInMessage(signinpage_data.signin_success_text);
    await page.waitForLoadState('networkidle');
    //await page.waitForURL(process.env.WEB_URL + '/dashboard');
    await page.context().storageState({ path: creditUserFile });
  } catch (error) {
    console.error("Admin login failed:", error);
  }

  try {
    // Authenticate as noncredituser
    await page.goto(process.env.WEB_URL);
    await page.waitForLoadState('networkidle');
    const homePage = new HomePageNew(page);
    await homePage.clickOnHomePageSignIn();
    const signinPage = new SignInPageNew(page);
    await signinPage.validateWelcomeTextSignInDialog(signinpage_data.signin_dailog_text);
    await signinPage.validateWelcomeSignInDialog();
    await signinPage.clickSignIn();
    await signinPage.validateSignInDialog();
    await signinPage.login(process.env.NON_CREDIT_USER, process.env.NON_CREDIT_PASSWORD);
    await signinPage.clickSignIn();
    await signinPage.waitForMyAccountDashboardLoad();
    await signinPage.validateSignInMessage(signinpage_data.signin_success_text);
    await page.waitForLoadState('networkidle');
    //await page.waitForURL(process.env.WEB_URL + '/dashboard');
    await page.context().storageState({ path: nonCreditUserFile });
  } catch (error) {
    console.error("User login failed:", error);
  }

  await browser.close();
};


// import { FullConfig } from "@playwright/test";
// import { config as _config } from 'dotenv';

// async function globalSetup(config) {
//     _config({
//       path: '.env',
//       override: true
//     });
//   }
  
//   export default globalSetup;
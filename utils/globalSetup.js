
import { chromium } from '@playwright/test';
import test, { expect } from 'playwright/test';
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
const newUserFile = './newuser.json';
const paymentUserFile = './paymentuser.json';
const profileUserFile = './profileuser.json';

export default async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  try {
    // Authenticate as new user
    await page.goto(process.env.WEB_URL);
    await page.waitForLoadState('networkidle');
    await page.getByRole('button', { name: 'My Account Sign In' }).click();
    await page.getByRole('button', { name: 'Sign In' }).click();
    await page.getByLabel('*Email Address').click();
    await page.getByLabel('*Email Address').fill(process.env.NEW_USER);
    await page.getByLabel('*Password').click();
    await page.getByLabel('*Password').fill(process.env.NON_CREDIT_PASSWORD);
    await page.getByRole('button', { name: 'Sign In' }).click({timeout:10000});
    //await expect(page.getByRole('heading', { name: 'My Account' })).toBeVisible();
    const signinPage = new SignInPageNew(page);
    await signinPage.waitForMyAccountDashboardLoad();
    await signinPage.validateSignInMessage(signinpage_data.signin_success_text);
    await page.waitForLoadState('networkidle');
    //await page.waitForURL(process.env.WEB_URL + '/dashboard');
    await page.context().storageState({ path: newUserFile });
  } catch (error) {
    console.error("Admin login failed:", error);
  }

  // try {
  //   // Authenticate as credit user
  //   await page.goto(process.env.WEB_URL);
  //   await page.waitForLoadState('networkidle');
  //   await page.getByRole('button', { name: 'My Account Sign In' }).click();
  //   await page.getByRole('button', { name: 'Sign In' }).click();
  //   await page.getByLabel('*Email Address').click();
  //   await page.getByLabel('*Email Address').fill(process.env.CREDIT_USER);
  //   await page.getByLabel('*Password').click();
  //   await page.getByLabel('*Password').fill(process.env.CREDIT_USER_PASSWORD);
  //   await page.getByRole('button', { name: 'Sign In' }).click();
  //   //await expect(page.getByRole('heading', { name: 'My Account' })).toBeVisible();
  //   const signinPage = new SignInPageNew(page);
  //   await signinPage.waitForMyAccountDashboardLoad();
  //   await signinPage.validateSignInMessage(signinpage_data.signin_success_text);
  //   await page.waitForLoadState('networkidle');
  //   //await page.waitForURL(process.env.WEB_URL + '/dashboard');
  //   await page.context().storageState({ path: creditUserFile });
  // } catch (error) {
  //   console.error("Admin login failed:", error);
  // }

  // try {
  //   // Authenticate as non credit user
  //   await page.goto(process.env.WEB_URL);
  //   await page.waitForLoadState('networkidle');
  //   await page.getByRole('button', { name: 'My Account Sign In' }).click();
  //   await page.getByRole('button', { name: 'Sign In' }).click();
  //   await page.getByLabel('*Email Address').click();
  //   await page.getByLabel('*Email Address').fill(process.env.NON_CREDIT_USER);
  //   await page.getByLabel('*Password').click();
  //   await page.getByLabel('*Password').fill(process.env.NON_CREDIT_PASSWORD);
  //   await page.getByRole('button', { name: 'Sign In' }).click();
  //   await expect(page.getByRole('heading', { name: 'My Account' })).toBeVisible();
  //   const signinPage = new SignInPageNew(page);
  //   await signinPage.waitForMyAccountDashboardLoad();
  //   await signinPage.validateSignInMessage(signinpage_data.signin_success_text);
  //   await page.waitForLoadState('networkidle');
  //   //await page.waitForURL(process.env.WEB_URL + '/dashboard');
  //   await page.context().storageState({ path: newUserFile });
  // } catch (error) {
  //   console.error("Admin login failed:", error);
  // }

  // try {
  //   // Authenticate as make a payment user
  //   await page.goto(process.env.WEB_URL);
  //   await page.waitForLoadState('networkidle');
  //   await page.getByRole('button', { name: 'My Account Sign In' }).click();
  //   await page.getByRole('button', { name: 'Sign In' }).click();
  //   await page.getByLabel('*Email Address').click();
  //   await page.getByLabel('*Email Address').fill(process.env.PAYMENT_USERNAME);
  //   await page.getByLabel('*Password').click();
  //   await page.getByLabel('*Password').fill(process.env.PAYMENT_PASSWORD);
  //   await page.getByRole('button', { name: 'Sign In' }).click();
  //   await expect(page.getByRole('heading', { name: 'My Account' })).toBeVisible();
  //   const signinPage = new SignInPageNew(page);
  //   await signinPage.waitForMyAccountDashboardLoad();
  //   await signinPage.validateSignInMessage(signinpage_data.signin_success_text);
  //   await page.waitForLoadState('networkidle');
  //   //await page.waitForURL(process.env.WEB_URL + '/dashboard');
  //   await page.context().storageState({ path: paymentUserFile });
  // } catch (error) {
  //   console.error("Admin login failed:", error);
  // }

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
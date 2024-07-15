
import { chromium } from '@playwright/test';
import {test as setup,  expect } from 'playwright/test';
import fs from 'fs';
require('dotenv').config();
import { HomePageNew } from '../pages/mason_home_page1';
import { SignInPageNew } from '../pages/mason_signin_page1';
import { MyAccountPage } from '../pages/mason_myaccount_page';

const homepage_data = JSON.parse(JSON.stringify(require('../test_data/mason_sb_home_page_data.json')));
const signinpage_data = JSON.parse(JSON.stringify(require('../test_data/mason_signin_page_data.json')));
const signoutpage_data = JSON.parse(JSON.stringify(require('../test_data/mason_signout_page_data.json')));
const myaccountpage_data = JSON.parse(JSON.stringify(require('../test_data/mason_sb_myaccount_page_data.json')));

const creditUserFile = './credituser.json';
const nonCreditUserFile = './noncredituser.json';
const newUserFile = './newuser.json';
const paymentUserFile = './paymentuser.json';
const profileUserFile = './profileuser.json';
const globalUser1File = './globaluser1.json';
const globalUser2File = './globaluser2.json';
const orderDetailsCancelOrderFile = './orderdetailscancelorder.json';
const shipAddressNoCardUser = './shipAddressNoCardUser.json';
const savedCardUser = './savedCardUser.json';
const creditUser2 = './creditUser2.json';
const creditUser3 = './creditUser3.json';
const creditUser4 = './creditUser4.json';

async function globalSetup(config) {
  const browser = await chromium.launch();
  //const page = await browser.newPage();

  // Authenticate as user1
  const page1 = await browser.newPage();
  await authenticateUser(page1, process.env.CREDIT_USER_3, creditUser3);
  await page1.close();

  // Authenticate as user2
  const page2 = await browser.newPage();
  await authenticateUser(page2, process.env.CREDIT_USER_4, creditUser4);
  await page2.close();

  await browser.close();
}

async function authenticateUser(page, userEmail, storageFile) {
  try {
    await page.goto(process.env.WEB_URL);
    await page.waitForLoadState('networkidle');
    await page.getByRole('button', { name: 'My Account Sign In' }).click();
    await page.getByRole('button', { name: 'Sign In' }).click();
    await page.getByLabel('*Email Address').click();
    await page.getByLabel('*Email Address').fill(userEmail);
    await page.getByLabel('*Password').click();
    await page.getByLabel('*Password').fill(process.env.CREDIT_USER_PASSWORD);
    await page.getByRole('button', { name: 'Sign In' }).click({ timeout: 10000 });
    
    const signinPage = new SignInPageNew(page);
    await signinPage.waitForMyAccountDashboardLoad();
    await signinPage.validateSignInMessage(signinpage_data.signin_success_text);
    await page.waitForLoadState('networkidle');
    await page.context().storageState({ path: storageFile });
  } catch (error) {
    console.error(`Authentication failed for ${userEmail}:`, error);
  }
}

export default globalSetup;

// export default async () => {
//   const browser = await chromium.launch();
//   const page = await browser.newPage();

//   try {
//     // Authenticate as new user
//     await page.goto(process.env.WEB_URL);
//     await page.waitForLoadState('networkidle');
//     await page.getByRole('button', { name: 'My Account Sign In' }).click();
//     await page.getByRole('button', { name: 'Sign In' }).click();
//     await page.getByLabel('*Email Address').click();
//     await page.getByLabel('*Email Address').fill(process.env.MY_PROFILE_USER);
//     await page.getByLabel('*Password').click();
//     await page.getByLabel('*Password').fill(process.env.PROFILE_PASSWORD);
//     await page.getByRole('button', { name: 'Sign In' }).click({timeout:10000});
//     //await expect(page.getByRole('heading', { name: 'My Account' })).toBeVisible();
//     const signinPage = new SignInPageNew(page);
//     await signinPage.waitForMyAccountDashboardLoad();
//     await signinPage.validateSignInMessage(signinpage_data.signin_success_text);
//     await page.waitForLoadState('networkidle');
//     //await page.waitForURL(process.env.WEB_URL + '/dashboard');
//     await page.context().storageState({ path: profileUserFile });
//   } catch (error) {
//     console.error("Admin login failed:", error);
//   }

//    await browser.close();
// };
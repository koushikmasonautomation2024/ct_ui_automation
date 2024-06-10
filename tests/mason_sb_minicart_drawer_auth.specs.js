const { chromium } = require('playwright');
import { test, expect } from '@playwright/test';
import { HomePageNew } from '../pages/mason_home_page1';
import { SignInPageNew } from '../pages/mason_signin_page1';
import { MyAccountPage } from '../pages/mason_myaccount_page';
import { PDPPage } from '../pages/mason_pdp_page';
import { CartDrawerPage } from '../pages/mason_cart_drawer_page';
import { allure } from 'allure-playwright';
import fs from 'fs';
require('dotenv').config();
const creditUserFile = './credituser.json';
const nonCreditUserFile = './noncredituser.json';
const newUserFile = './newuser.json';

const homepage_data = JSON.parse(JSON.stringify(require('../test_data/mason_sb_home_page_data.json')));
const signinpage_data = JSON.parse(JSON.stringify(require('../test_data/mason_signin_page_data.json')));
const signoutpage_data = JSON.parse(JSON.stringify(require('../test_data/mason_signout_page_data.json')));
const myaccountpage_data = JSON.parse(JSON.stringify(require('../test_data/mason_sb_myaccount_page_data.json')));
const pdp_data = JSON.parse(JSON.stringify(require('../test_data/mason_pdp_page_data.json')));
const minicart_data = JSON.parse(JSON.stringify(require('../test_data/mason_minicart_page_data.json')));

let loginSuccessful = false;
test.describe("Mason Cart Drawer", () => {

  test.beforeEach(async ({ page, isMobile }, testInfo) => {
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

  //Cart Drawer - Adding a product with variations to the cart - Test Cases ID-SB-Cart006/SB-Cart007
  test.only("Cart Drawer - Adding a product with variations to the cart - Verify Choose Options drawer gets open when user click on add to cart against a product which has multiple variants from PLP and after adding to cart Cart Drawer opens", async ({ page }, testInfo) => {
    if (!loginSuccessful) {
      test.skip('Skipping test due to failed login');
    }
    const homePage = new HomePageNew(page);
    await homePage.mouseHoverMegaMenu(homepage_data.categoryNameL1);
    await homePage.clickOnMegaMenuL2Category(homepage_data.l2CategoryName);
    await page.waitForLoadState('networkidle');
    const pdpPage = new PDPPage(page);
    const cartDrawerPage = new CartDrawerPage(page);
    await cartDrawerPage.clickAddtoCartPLP();
    await pdpPage.addtoCart();
    await pdpPage.miniCartDrawer();
    //await cartDrawerPage.validateMiniCartProductDetails();

  })


})
const { chromium } = require('playwright');
import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/mason_home_page';
import { MasonBLPPage } from '../pages/mason_blp_page';
import { MasonBIPPage } from '../pages/mason_bip_page';
import { MyAccountPage } from '../pages/mason_myaccount_page';
import { MyAccountAddressPage } from '../pages/mason_myAccountAddress_page';
import { allure } from 'allure-playwright';
import { sign } from 'crypto';

const homepage_data = JSON.parse(JSON.stringify(require('../test_data/mason_sb_home_page_data.json')));
const resetpage_data = JSON.parse(JSON.stringify(require('../test_data/mason_reset_page_data.json')));
const signinpage_data = JSON.parse(JSON.stringify(require('../test_data/mason_signin_page_data.json')));
const checkout_data = JSON.parse(JSON.stringify(require('../test_data/mason_checkout_page_data.json')));
const myaccountpage_data = JSON.parse(JSON.stringify(require('../test_data/mason_sb_myaccount_page_data.json')));
const savedAddress = myaccountpage_data.myaccount_newaddress_firstname + " " + myaccountpage_data.myaccount_newaddress_lastname + " " + myaccountpage_data.myaccount_newaddress_addressline1;
const editAddress = myaccountpage_data.myaccount_editaddress_firstname + " " + myaccountpage_data.myaccount_editaddress_lastname + " " + myaccountpage_data.myaccount_editaddress_addressline1;


test.describe("Mason BLP Page", () => {

  test.beforeEach(async ({ page, isMobile }, testInfo) => {
    test.slow();
    try {
      await page.goto(process.env.WEB_URL);
      await page.waitForLoadState('networkidle');
    } catch (error) {
      // Handle the error here
      console.error("An error occurred in test.beforeEach:", error);
    }
  });


  //SB-BLP001
  test("Validate navigation to BLP from Top Brands in homepage and breadcrumbs are shown in BLP", async ({ page }, testInfo) => {
    const blpPage = new MasonBLPPage(page);
    //await page.goto(process.env.BIP_URL);
    await blpPage.clickOnTopBrandsInHomePage();

  })

  //SB-BLP002
  test("Validate navigation to BLP from PDP and ensure breadcrumbs are shown in BLP", async ({ page }, testInfo) => {
    const blpPage = new MasonBLPPage(page);
    await page.goto(checkout_data.add_to_cart_pdp_url);
    //await page.goto(process.env.BIP_URL);
    await blpPage.validateNavigationFromPDP();

  })


  //SB-BLP003
  test("Validate navigation to BLP from BIP and ensure breadcrumbs are shown in BLP", async ({ page }, testInfo) => {
    const blpPage = new MasonBLPPage(page);
    const bipPage = new MasonBIPPage(page);
    await page.goto(process.env.BIP_URL);
    //await page.goto(process.env.BIP_URL);
    const randomAlphabet = await bipPage.validateAlphabetHeader();
    await blpPage.validateNavigationFromBIP(randomAlphabet);

  })



})
const { chromium } = require('playwright');
import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/mason_home_page';
import { SignInPage } from '../pages/mason_signin_page';
import { MasonBIPPage } from '../pages/mason_bip_page';
import { MyAccountPage } from '../pages/mason_myaccount_page';
import { MyAccountAddressPage } from '../pages/mason_myAccountAddress_page';
import { allure } from 'allure-playwright';
import { sign } from 'crypto';

const homepage_data = JSON.parse(JSON.stringify(require('../test_data/mason_sb_home_page_data.json')));
const resetpage_data = JSON.parse(JSON.stringify(require('../test_data/mason_reset_page_data.json')));
const signinpage_data = JSON.parse(JSON.stringify(require('../test_data/mason_signin_page_data.json')));
const myaccountpage_data = JSON.parse(JSON.stringify(require('../test_data/mason_sb_myaccount_page_data.json')));
const savedAddress = myaccountpage_data.myaccount_newaddress_firstname + " " + myaccountpage_data.myaccount_newaddress_lastname + " " + myaccountpage_data.myaccount_newaddress_addressline1;
const editAddress = myaccountpage_data.myaccount_editaddress_firstname + " " + myaccountpage_data.myaccount_editaddress_lastname + " " + myaccountpage_data.myaccount_editaddress_addressline1;

test.describe("Mason Commerce Tool Site", () => {

  test.beforeEach(async ({ page, isMobile }, testInfo) => {
    test.slow();
    try {
      //await page.goto(process.env.WEB_URL);
      await page.goto(process.env.BIP_URL);
      await page.waitForLoadState('networkidle');
    } catch (error) {
      // Handle the error here
      console.error("An error occurred in test.beforeEach:", error);
    }

  })


  //SB-BIP002
  test("Validate Home -> Brand breadcrumbs are shown in BIP", async ({ page }, testInfo) => {
    const bipPage = new MasonBIPPage(page);
    await bipPage.validateBrandBreadCrumb();
    await bipPage.validateBrandPageTitle();

  })

  //SB-BIP003 //SB-BIP004
  test("Validate the full-width banner present below the page title which supports images and videos", async ({ page }, testInfo) => {
    const bipPage = new MasonBIPPage(page);
    await bipPage.validateBrandPageTitle();
    await bipPage.validateBannerSection();

  })

  //SB-BIP005
  test("Validate the brands logos present below the full width banner", async ({ page }, testInfo) => {
    const bipPage = new MasonBIPPage(page);
    await bipPage.validateBrandPageTitle();
    await bipPage.validateTopBrandsSection();
  })

  //SB-BIP006 
  test("Validate the row of alphabet links below the top brands present", async ({ page }, testInfo) => {
    const bipPage = new MasonBIPPage(page);
    await bipPage.validateBrandPageTitle();
    await bipPage.validateAlphabetLinks();
    const randomAlphabet = await bipPage.validateAlphabetHeader();

  })

  //SB-BIP007
  test("Validate under each alphabets the brand name starting with that letter is present", async ({ page }, testInfo) => {
    const bipPage = new MasonBIPPage(page);
    await bipPage.validateBrandPageTitle();
    const randomAlphabet = await bipPage.validateAlphabetHeader();
    await bipPage.validateBrandsUnderRandomAlphabet(randomAlphabet);

  })



})
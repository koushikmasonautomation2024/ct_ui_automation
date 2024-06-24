const { chromium } = require('playwright');
import { test, expect } from '@playwright/test';
import { HomePageNew } from '../pages/mason_home_page1';
import { SignInPageNew } from '../pages/mason_signin_page1';
import { MyAccountPage } from '../pages/mason_myaccount_page';
import { PDPPage } from '../pages/mason_pdp_page';
import { CartDrawerPage } from '../pages/mason_cart_drawer_page';
import { CartPage } from '../pages/mason_cart_page';
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
test.describe("Mason Cart Page", () => {

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

  //Cart - Display Order Total - Test Cases ID-
  test("Cart - Display Order Total - Verify that the order total is displayed to the right of the page title.", async ({ page }, testInfo) => {
    if (!loginSuccessful) {
      test.skip('Skipping test due to failed login');
    }
    const pdpPage = new PDPPage(page);
    await page.goto(pdp_data.pdp_url_limitedStock);
    await pdpPage.addtoCart();
    const cartDrawerPage = new CartDrawerPage(page);
    await cartDrawerPage.miniCartClickViewCartButton();
    const cartPage = new CartPage(page);
    await cartPage.cartGetOrderTotal();
    
  })

  //Cart - Display Product Details - Test Cases ID-SB-Cart061
  test("Cart - Display Product Details - Verify that each product is displayed as a separate line item with relevant details.", async ({ page }, testInfo) => {
    if (!loginSuccessful) {
      test.skip('Skipping test due to failed login');
    }
    const pdpPage = new PDPPage(page);
    await page.goto(pdp_data.pdp_url_limitedStock);
    await pdpPage.addtoCart();
    const cartDrawerPage = new CartDrawerPage(page);
    await cartDrawerPage.miniCartClickViewCartButton();
    const cartPage = new CartPage(page);
    await cartPage.cartLineItemProductDetails();
    
  })

  //Cart - Quantity Field Functionality - Test Cases ID-SB-Cart061
  test("Cart - Quantity Field Functionality - Verify total price gets updated if user increases/decreases the quantity or applies a valid promo code.", async ({ page }, testInfo) => {
    if (!loginSuccessful) {
      test.skip('Skipping test due to failed login');
    }
    const pdpPage = new PDPPage(page);
    await page.goto(pdp_data.pdp_url);
    await pdpPage.clickOnPDPSizeVariantButton();
    await pdpPage.addtoCart();
    const cartDrawerPage = new CartDrawerPage(page);
    await cartDrawerPage.miniCartClickViewCartButton();
    const cartPage = new CartPage(page);
    await cartPage.cartUpdateQtyPlusMinus();
    
  })

  //Cart - Edit Item Functionality - Test Cases ID-SB-Cart088/SB-Cart089/SB-Cart090
  test("Cart - Edit Item Functionality - Verify that the Edit Item Drawer functions correctly, allowing users to modify variant options.", async ({ page }, testInfo) => {
    if (!loginSuccessful) {
      test.skip('Skipping test due to failed login');
    }
    const pdpPage = new PDPPage(page);
    await page.goto(pdp_data.pdp_url);
    await pdpPage.clickOnPDPSizeVariantButton();
    await pdpPage.addtoCart();
    await pdpPage.miniCartDrawer();
    const cartDrawerPage = new CartDrawerPage(page);
    await cartDrawerPage.miniCartClickViewCartButton();
    const cartPage = new CartPage(page);
    await cartPage.clickCartEditButton();
    await cartPage.validateEditCartDrawerProductDetails();
    await pdpPage.validatePricingSection();
    await pdpPage.validateCreditMessageSection();
    await pdpPage.sizeChartDisplay();
    
  })

  //Cart - Remove Item from Cart - Test Cases ID-SB-Cart078
  test("Cart - Remove Item from Cart - Verify application shows a success message '<Product Name> was successfully removed from your cart. Undo' at the top of the cart when user removes item from the cart.", async ({ page }, testInfo) => {
    if (!loginSuccessful) {
      test.skip('Skipping test due to failed login');
    }
    const pdpPage = new PDPPage(page);
    await page.goto(pdp_data.pdp_url);
    await pdpPage.clickOnPDPSizeVariantButton();
    await pdpPage.addtoCart();
    await pdpPage.miniCartDrawer();
    const cartDrawerPage = new CartDrawerPage(page);
    await cartDrawerPage.miniCartClickViewCartButton();
    const cartPage = new CartPage(page);
    const removedProdName = await cartPage.getCartFirstItemProductName();
    await cartPage.clickRemoveCartButton();
    await cartPage.cartRemoveSuccessMessage(`Removed ${removedProdName} item from the cart`);
    
  })

  //Cart - Remove Item from Cart - Test Cases ID-SB-Cart078
  test("Cart - Remove Item from Cart - Verify clicking on Undo at the end of the success message, application adds product back in the cart.", async ({ page }, testInfo) => {
    if (!loginSuccessful) {
      test.skip('Skipping test due to failed login');
    }
    const pdpPage = new PDPPage(page);
    await page.goto(pdp_data.pdp_url);
    await pdpPage.clickOnPDPSizeVariantButton();
    await pdpPage.addtoCart();
    await pdpPage.miniCartDrawer();
    const cartDrawerPage = new CartDrawerPage(page);
    await cartDrawerPage.miniCartClickViewCartButton();
    const cartPage = new CartPage(page);
    const removedProdName = await cartPage.getCartFirstItemProductName();
    const totalProdCount = await cartPage.cartGetTotalItemsCount();
    await cartPage.clickRemoveCartButton();
    await cartPage.cartRemoveSuccessMessage(`Removed ${removedProdName} item from the cart`);
    await cartPage.clickCartUndoButton();
    await cartPage.validateUndoCartItems(totalProdCount);
    
  })


})
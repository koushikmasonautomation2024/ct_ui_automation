const { chromium } = require('playwright');
import { test, expect } from '@playwright/test';
import { HomePageNew } from '../pages/mason_home_page1';
import { SignInPageNew } from '../pages/mason_signin_page1';
import { MyAccountPage } from '../pages/mason_myaccount_page';
import { PDPPage } from '../pages/mason_pdp_page';
import { CartDrawerPage } from '../pages/mason_cart_drawer_page';
import { CartPage } from '../pages/mason_cart_page';
import { EmptyCartPage } from '../pages/mason_emptycart_page';
import {OrderDetailsPage} from '../pages/mason_orderdetails_page';
import { allure } from 'allure-playwright';
import fs from 'fs';
require('dotenv').config();
const creditUserFile = './credituser.json';
const nonCreditUserFile = './noncredituser.json';
const newUserFile = './newuser.json';
const globalUser1File = './globaluser1.json';
const orderDetailsCancelOrderFile = './orderdetailscancelorder.json';

const homepage_data = JSON.parse(JSON.stringify(require('../test_data/mason_sb_home_page_data.json')));
const signinpage_data = JSON.parse(JSON.stringify(require('../test_data/mason_signin_page_data.json')));
const signoutpage_data = JSON.parse(JSON.stringify(require('../test_data/mason_signout_page_data.json')));
const myaccountpage_data = JSON.parse(JSON.stringify(require('../test_data/mason_sb_myaccount_page_data.json')));
const pdp_data = JSON.parse(JSON.stringify(require('../test_data/mason_pdp_page_data.json')));
const minicart_data = JSON.parse(JSON.stringify(require('../test_data/mason_minicart_page_data.json')));
const cart_data = JSON.parse(JSON.stringify(require('../test_data/mason_cart_page_data.json')));

let loginSuccessful = false;
test.describe("Mason Order Details Page", () => {

  test.beforeEach(async ({ page, isMobile }, testInfo) => {
    test.slow();
    const storageStatePath = isMobile ? orderDetailsCancelOrderFile : orderDetailsCancelOrderFile;

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
  test.afterEach(async ({ page }) => {
    const start = Date.now();

    // Perform tasks in parallel
    await Promise.all([
        process.env.TAKE_SCREENSHOTS && page.screenshot({ path: 'screenshot.png' }),
        page.close(),
        //context.close()
    ]);

    console.log(`AfterHooks completed in ${Date.now() - start}ms`);
  });

  //Order Details - Order Cancellation - Test Cases ID-SB-MyA194
  test("My Account Order details - Order Cancellation - Verify Cancel button displayed if order is Pending Shipment.", async ({ page }, testInfo) => {
    if (!loginSuccessful) {
      test.skip('Skipping test due to failed login');
    }
    const myaccountPage = new MyAccountPage(page);
    await myaccountPage.redirectToMyAccount();
    await myaccountPage.clickMyAccountOrderLink();
    const orderDetailsPage = new OrderDetailsPage(page);
    await orderDetailsPage.validateCancelOrderInOrderDetails();

  })
  //Order Details - Order Cancellation - Test Cases ID-SB-MyA194/SB-MyA200
  test("My Account Order details - Order Cancellation - Verify Cancel button does not show if order is already Processed and Shipped.", async ({ page }, testInfo) => {
    if (!loginSuccessful) {
      test.skip('Skipping test due to failed login');
    }
    const myaccountPage = new MyAccountPage(page);
    await myaccountPage.redirectToMyAccount();
    await myaccountPage.clickMyAccountOrderLink();
    const orderDetailsPage = new OrderDetailsPage(page);
    await orderDetailsPage.validateNoCancelOrderInOrderDetails();

  })

  //Order Details - Order Cancellation - Test Cases ID-SB-MyA195
  test("My Account Order details - Order Cancellation - Verify clicking on Cancel on, application opens a cancel modal along with following options:- Yes, Cancel the Order- No, Go back to the Order- X option.", async ({ page }, testInfo) => {
    if (!loginSuccessful) {
      test.skip('Skipping test due to failed login');
    }
    const myaccountPage = new MyAccountPage(page);
    await myaccountPage.redirectToMyAccount();
    await myaccountPage.clickMyAccountOrderLink();
    const orderDetailsPage = new OrderDetailsPage(page);
    await orderDetailsPage.validateCancelOrderInOrderDetails();
    await orderDetailsPage.clickCancelOrderButton();
    await orderDetailsPage.validateCancelOrderModal();

  })

  //Order Details - Order Cancellation - Test Cases ID-SB-MyA196
  test("My Account Order details - Order Cancellation - Verify clicking on X closes the cancel order modal.", async ({ page }, testInfo) => {
    if (!loginSuccessful) {
      test.skip('Skipping test due to failed login');
    }
    const myaccountPage = new MyAccountPage(page);
    await myaccountPage.redirectToMyAccount();
    await myaccountPage.clickMyAccountOrderLink();
    const orderDetailsPage = new OrderDetailsPage(page);
    await orderDetailsPage.validateCancelOrderInOrderDetails();
    await orderDetailsPage.clickCancelOrderButton();
    await orderDetailsPage.validateCancelOrderModal();
    await orderDetailsPage.clickCloseCancelOrderButton();

  })

  //Order Details - Order Cancellation - Test Cases ID-SB-MyA196
  test("My Account Order details - Order Cancellation - Verify clicking on No,Go Back closes the cancel order modal.", async ({ page }, testInfo) => {
    if (!loginSuccessful) {
      test.skip('Skipping test due to failed login');
    }
    const myaccountPage = new MyAccountPage(page);
    await myaccountPage.redirectToMyAccount();
    await myaccountPage.clickMyAccountOrderLink();
    const orderDetailsPage = new OrderDetailsPage(page);
    await orderDetailsPage.validateCancelOrderInOrderDetails();
    await orderDetailsPage.clickCancelOrderButton();
    await orderDetailsPage.validateCancelOrderModal();
    await orderDetailsPage.clickNoGoBackOrderButton();

  })

  //Order Details - Order Cancellation - Test Cases ID-SB-MyA199
  test("My Account Order details - Order Cancellation - Verify if an item within a multiple item order has not been processed or shipped, application displays 'Cancel Item' button with the text 'Changed your mind?' within the bottom righthand corner of the item detail card.", async ({ page }, testInfo) => {
    if (!loginSuccessful) {
      test.skip('Skipping test due to failed login');
    }
    const myaccountPage = new MyAccountPage(page);
    await myaccountPage.redirectToMyAccount();
    await myaccountPage.clickMyAccountOrderLink();
    const orderDetailsPage = new OrderDetailsPage(page);
    await orderDetailsPage.validateCancelOrderInOrderDetails();
    await orderDetailsPage.validateCancelItemButton();

  })

  //Order Details - Order Cancellation - Test Cases ID-SB-MyA201
  test("My Account Order details - Order Cancellation - Verify clicking on Cancel Item on, application opens a cancel item modal along with following options:- Yes, Cancel the product- No, Go back to the Order- X option", async ({ page }, testInfo) => {
    if (!loginSuccessful) {
      test.skip('Skipping test due to failed login');
    }
    const myaccountPage = new MyAccountPage(page);
    await myaccountPage.redirectToMyAccount();
    await myaccountPage.clickMyAccountOrderLink();
    const orderDetailsPage = new OrderDetailsPage(page);
    await orderDetailsPage.validateCancelOrderInOrderDetails();
    await orderDetailsPage.clickCancelItemButton();
    await orderDetailsPage.validateCancelItemModal();

  })

  //Order Details - Order Cancellation - Test Cases ID-SB-MyA196
  test("My Account Order details - Order Cancellation - Verify clicking on X closes the cancel Item modal.", async ({ page }, testInfo) => {
    if (!loginSuccessful) {
      test.skip('Skipping test due to failed login');
    }
    const myaccountPage = new MyAccountPage(page);
    await myaccountPage.redirectToMyAccount();
    await myaccountPage.clickMyAccountOrderLink();
    const orderDetailsPage = new OrderDetailsPage(page);
    await orderDetailsPage.validateCancelOrderInOrderDetails();
    await orderDetailsPage.clickCancelItemButton();
    await orderDetailsPage.validateCancelItemModal();
    await orderDetailsPage.clickCloseCancelItemModalButton();

  })

  //Order Details - Order Cancellation - Test Cases ID-SB-MyA196
  test("My Account Order details - Order Cancellation - Verify clicking on No,Go Back closes the cancel Item modal.", async ({ page }, testInfo) => {
    if (!loginSuccessful) {
      test.skip('Skipping test due to failed login');
    }
    const myaccountPage = new MyAccountPage(page);
    await myaccountPage.redirectToMyAccount();
    await myaccountPage.clickMyAccountOrderLink();
    const orderDetailsPage = new OrderDetailsPage(page);
    await orderDetailsPage.validateCancelOrderInOrderDetails();
    await orderDetailsPage.clickCancelItemButton();
    await orderDetailsPage.validateCancelItemModal();
    await orderDetailsPage.clickNoGoBackOrderButton();

  })

  //Order Details - Order Cancellation - Test Cases ID-SB-MyA202/SB-MyA203
  test("My Account Order details - Order Cancellation - Verify clicking on 'Cancel Item' button, modal gets closed, page gets refreshed and application shows the order status as 'Cancelled' on the applicable item.", async ({ page }, testInfo) => {
    if (!loginSuccessful) {
      test.skip('Skipping test due to failed login');
    }
    const myaccountPage = new MyAccountPage(page);
    await myaccountPage.redirectToMyAccount();
    await myaccountPage.clickMyAccountOrderLink();
    const orderDetailsPage = new OrderDetailsPage(page);
    await orderDetailsPage.validateCancelOrderInOrderDetails();
    await orderDetailsPage.validateCanceledItem();

  })

  //Order Details - Order Cancellation - Test Cases ID-SB-MyA197/SB-MyA198
  test("My Account Order details - Order Cancellation - Verify clicking on Yes, application closes the modal, refreshes the page and order status gets changed to Canceled.", async ({ page }, testInfo) => {
    if (!loginSuccessful) {
      test.skip('Skipping test due to failed login');
    }
    const myaccountPage = new MyAccountPage(page);
    await myaccountPage.redirectToMyAccount();
    await myaccountPage.clickMyAccountOrderLink();
    const orderDetailsPage = new OrderDetailsPage(page);
    await orderDetailsPage.validateCancelOrderInOrderDetails();
    const orderNumber = await orderDetailsPage.getOrderNumberInOrderDetails();
    await orderDetailsPage.clickCancelOrderButton();
    await orderDetailsPage.validatedCanceledOrder(orderNumber);

  })

})


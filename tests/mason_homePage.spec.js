const { chromium } = require('playwright');
import {test,expect } from '@playwright/test';
import {HomePage} from '../pages/mason_home_page';
import {SignInPage} from '../pages/mason_signin_page';
import {ResetPage} from '../pages/mason_reset_page';
import {MyAccountPage} from '../pages/mason_myaccount_page';
import { allure } from 'allure-playwright';
import { sign } from 'crypto';

const homepage_data =JSON.parse(JSON.stringify(require('../test_data/mason_sb_home_page_data.json')));
const resetpage_data =JSON.parse(JSON.stringify(require('../test_data/mason_reset_page_data.json')));
const signinpage_data =JSON.parse(JSON.stringify(require('../test_data/mason_signin_page_data.json')));
const myaccountpage_data =JSON.parse(JSON.stringify(require('../test_data/mason_sb_myaccount_page_data.json')));
const savedAddress = myaccountpage_data.myaccount_newaddress_firstname +" "+ myaccountpage_data.myaccount_newaddress_lastname +" "+ myaccountpage_data.myaccount_newaddress_addressline1;
const editAddress = myaccountpage_data.myaccount_editaddress_firstname +" "+ myaccountpage_data.myaccount_editaddress_lastname +" "+ myaccountpage_data.myaccount_editaddress_addressline1;

test.describe("Mason HomePage Scenarios", ()=>{

   test.beforeEach(async({page,isMobile},testInfo)=>{
    test.slow();
    try{  
    await page.goto(process.env.WEB_URL);
    await page.waitForLoadState('networkidle');
    if(isMobile==true){
      const signinPage = new SignInPage(page);  
      await signinPage.clickSignInImage();
      await signinPage.clickSignIn();
      await signinPage.validateSignInDialog();
      await signinPage.login(process.env.USERNAME,process.env.PASSWORD);
      await signinPage.clickSignIn();
    } else {
      // const homePage = new HomePage(page);
      // await homePage.clickOnHomePageSignIn();
      // const signinPage = new SignInPage(page);
      // await signinPage.validateWelcomeTextSignInDialog(signinpage_data.signin_dailog_text);
      // await signinPage.validateWelcomeSignInDialog();
      // await signinPage.clickSignIn();
      // await signinPage.validateSignInDialog();
      
    }
    const masonHomePageScreenshot = await page.screenshot();
    await testInfo.attach('screenshot', { body: masonHomePageScreenshot, contentType: 'image/png' });
    //await page.screenshot({ path: './screenshots/MasonHomePage.png', fullPage: true });
  }catch (error) {
    // Handle the error here
    console.error("An error occurred in test.beforeEach:", error);
}
    
  })
  
//SB-MM002
  test("MegaNav - Validate L1 categories are visible when User hovers on Departments",async({page})=>{ 
    //test.slow();
    const homePage = new HomePage(page);
    // await homePage.clickOnHomePageSignIn();
    await homePage.categoryL1ToBeVisibleOnDepartmentHover();
    const l1Count = await homePage.countAllL1Categories();
    console.log(l1Count);
    
})

//SB-MM003
test("MegaNav - Validate L1 is bold and L2+L3 categories are visible when User hovers on Category L1",async({page})=>{ 
  //test.slow();
  const homePage = new HomePage(page);
  // await homePage.clickOnHomePageSignIn();
  await homePage.categoryL1ToBeVisibleOnDepartmentHover();
  const l1Count = await homePage.countAllL1Categories();
  // console.log(l1Count);
  const [l1CategoryText,index] = await homePage.getRandomL1CategoryText();
  console.log(l1CategoryText);
  await homePage.checkIfcategoryL1isBold(l1CategoryText);
  await homePage.l2andl3TobeVisibleOnL1Hover(index);
  
})

//SB-MM004
test("MegaNav - Validate an overlay when User hovers on Departments",async({page})=>{ 
  //test.slow();
  const homePage = new HomePage(page);
  // await homePage.clickOnHomePageSignIn();
  await homePage.categoryL1ToBeVisibleOnDepartmentHover();
  await homePage.ensureGreyOverlayOnCategoryHover();
})

//SB-MM007 
test("MegaNav - Validate User is redirected to L1 when clicked on the hyperlink",async({page})=>{ 
  //test.slow();
  const homePage = new HomePage(page);
  const l2_index=2;
  // await homePage.clickOnHomePageSignIn();
  
  await homePage.categoryL1ToBeVisibleOnDepartmentHover();
  const [l1CategoryText,index] = await homePage.getRandomL1CategoryText();
  await homePage.navigateToCategoryL1(l1CategoryText);
  
})

//SB-MM007
test("MegaNav - Validate User is redirected to L2 when clicked on the hyperlink",async({page})=>{ 
  //test.slow();
  const homePage = new HomePage(page);
  const l2_index=2;
  // await homePage.clickOnHomePageSignIn();
  const l2category="Toys";
  await homePage.categoryL1ToBeVisibleOnDepartmentHover();
  //const [l1CategoryText,index] = await homePage.getRandomL1CategoryText();
  await homePage.checkIfcategoryL1isBold(l2category);
  const [l2Text, l3Text]=await homePage.getRandomL2L3CategoryText(l2_index);
  console.log(l2Text);
  console.log(l3Text);
  await homePage.navigateToCategoryL1(l2Text);

})

//SB-MM008
test("MegaNav - Validate User is redirected to L3 when clicked on the hyperlink",async({page})=>{ 
  //test.slow();
  const homePage = new HomePage(page);
  const l2_index=2;
  // await homePage.clickOnHomePageSignIn();
  const l2category="Toys";
  await homePage.categoryL1ToBeVisibleOnDepartmentHover();
  //const [l1CategoryText,index] = await homePage.getRandomL1CategoryText();
  await homePage.checkIfcategoryL1isBold(l2category);
  const [l2Text, l3Text]=await homePage.getRandomL2L3CategoryText(l2_index);
  console.log(l2Text);
  console.log(l3Text);
  await homePage.navigateToCategoryL1(l3Text);

})

//Ensure that clicking any area outside of the Mega Menu collapses it.
test("MegaNav - Validate no overlay when User clicks on any area outside of the Mega Menu",async({page})=>{ 
  //test.slow();
  const homePage = new HomePage(page);
  // await homePage.clickOnHomePageSignIn();
  await homePage.categoryL1ToBeVisibleOnDepartmentHover();
  await homePage.ensureNoOverlayWhenClickedOutside();
})



})
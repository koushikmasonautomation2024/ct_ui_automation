const { chromium } = require('playwright');
import {test,expect } from '@playwright/test';
import {HomePage} from '../pages/mason_home_page';
import {SignInPage} from '../pages/mason_signin_page';
import {MasonPLPPage} from '../pages/mason_plp_page';
import {MyAccountPage} from '../pages/mason_myaccount_page';
import {MyAccountAddressPage} from '../pages/mason_myAccountAddress_page';
import { allure } from 'allure-playwright';
import { sign } from 'crypto';
import { pl } from '@faker-js/faker';

const homepage_data =JSON.parse(JSON.stringify(require('../test_data/mason_sb_home_page_data.json')));
const resetpage_data =JSON.parse(JSON.stringify(require('../test_data/mason_reset_page_data.json')));
const signinpage_data =JSON.parse(JSON.stringify(require('../test_data/mason_signin_page_data.json')));
const myaccountpage_data =JSON.parse(JSON.stringify(require('../test_data/mason_sb_myaccount_page_data.json')));
const savedAddress = myaccountpage_data.myaccount_newaddress_firstname +" "+ myaccountpage_data.myaccount_newaddress_lastname +" "+ myaccountpage_data.myaccount_newaddress_addressline1;
const editAddress = myaccountpage_data.myaccount_editaddress_firstname +" "+ myaccountpage_data.myaccount_editaddress_lastname +" "+ myaccountpage_data.myaccount_editaddress_addressline1;

test.describe("Mason PLP Scenarios", ()=>{

   test.beforeEach(async({page,isMobile},testInfo)=>{
    test.slow();
    try{  
    //await page.goto(process.env.WEB_URL);
    await page.goto(process.env.WEB_URL);
    await page.waitForLoadState('networkidle');
    if(isMobile==true){
      
    } else {
      
    }
    const masonHomePageScreenshot = await page.screenshot();
    await testInfo.attach('screenshot', { body: masonHomePageScreenshot, contentType: 'image/png' });
    //await page.screenshot({ path: './screenshots/MasonHomePage.png', fullPage: true });
  }catch (error) {
    // Handle the error here
    console.error("An error occurred in test.beforeEach:", error);
}
    
  })
 
  
 // SB-PLP005
  //SB-MM008 //SB-PLP004
test("Validate User is redirected to L3 when clicked on the hyperlink and check the breadcrumb",async({page})=>{ 
  //test.slow();
  const homePage = new HomePage(page);
  const plpPage = new MasonPLPPage(page);
  const l2_index=1;
  const l2category="Clothing, Shoes + Bags";
  await homePage.categoryL1ToBeVisibleOnDepartmentHover();
  //const [l2category,l2_index] = await homePage.getRandomL1CategoryText();
  await homePage.checkIfcategoryL1isBold(l2category);
  const [l2Text, l3Text]=await homePage.getRandomL2L3CategoryText(l2_index);
  console.log(l2Text);
  console.log(l3Text);
  await homePage.navigateToCategoryL1(l3Text);
  await plpPage.validateItemCount();
  await plpPage.validateFilter();

})

//SB-MM007// SB-PLP005 //SB-PLP004
test("Validate User is redirected to L2 when clicked on the hyperlink and check the breadcrumb",async({page})=>{ 
  //test.slow();
  const homePage = new HomePage(page);
  const plpPage = new MasonPLPPage(page);
  const l2_index=2;
  const l2category="Toys";
  await homePage.categoryL1ToBeVisibleOnDepartmentHover();
  //const [l2category,l2_index] = await homePage.getRandomL1CategoryText();
  await homePage.checkIfcategoryL1isBold(l2category);
  const [l2Text, l3Text]=await homePage.getRandomL2L3CategoryText(l2_index);
  console.log(l2Text);
  console.log(l3Text);
  await homePage.navigateToCategoryL1(l2Text);
  await plpPage.validateItemCount();
})

//SB-PLP046//SB-PLP047
test("Validate Filters in L3 when clicked on the hyperlink",async({page})=>{ 
  //test.slow();
  const homePage = new HomePage(page);
  const plpPage = new MasonPLPPage(page);
  const l2_index=1;
  const l2category="Clothing, Shoes + Bags";
  const l3Text="Shirts";
  await homePage.categoryL1ToBeVisibleOnDepartmentHover();
  //const [l2category,l2_index] = await homePage.getRandomL1CategoryText();
  await homePage.checkIfcategoryL1isBold(l2category);
  // const [l2Text, l3Text]=await homePage.getRandomL2L3CategoryText(l2_index);
  // console.log(l2Text);
  // console.log(l3Text);
  await homePage.navigateToCategoryL1(l3Text);
  //await page.waitForLoadState('networkidle');
  await page.waitForTimeout(3000);
  await plpPage.validateItemCount();
  await plpPage.validatePresenceOfFilter();
  await plpPage.validateCheckboxesForAllFilters();
})

//SB-PLP048
test("Validate Single Filter applied in L3 PLP",async({page})=>{ 
  //test.slow();
  const homePage = new HomePage(page);
  const plpPage = new MasonPLPPage(page);
  const l2_index=1;
  const l2category="Clothing, Shoes + Bags";
  const l3Text="Tops";
  const numOptionsPerCategory = 1;
  await homePage.categoryL1ToBeVisibleOnDepartmentHover();
  //const [l2category,l2_index] = await homePage.getRandomL1CategoryText();
  await homePage.checkIfcategoryL1isBold(l2category);
  // const [l2Text, l3Text]=await homePage.getRandomL2L3CategoryText(l2_index);
  // console.log(l2Text);
  // console.log(l3Text);
  await homePage.navigateToCategoryL1(l3Text);
  //await page.waitForLoadState('networkidle');
  await page.waitForTimeout(3000);
  await plpPage.validateItemCount();
  await plpPage.validatePresenceOfFilter();
  await plpPage.validateCheckboxesForAllFilters();
  //const selectedFilter =await plpPage.randomlySelectFilterCheckbox();
  const selectedFilter=await plpPage.randomlySelectMultipleFiltersOptions(numOptionsPerCategory);
  await plpPage.validateAppliedFilters(selectedFilter);
  console.log(selectedFilter);
})

//SB-PLP049
test.only("Validate Multiple Filters applied in L3 PLP",async({page})=>{ 
  //test.slow();
  const homePage = new HomePage(page);
  const plpPage = new MasonPLPPage(page);
  const l2_index=1;
  const l2category="Clothing, Shoes + Bags";
  const l3Text="Athletic";
  await homePage.categoryL1ToBeVisibleOnDepartmentHover();
  //const [l2category,l2_index] = await homePage.getRandomL1CategoryText();
  await homePage.checkIfcategoryL1isBold(l2category);
  // const [l2Text, l3Text]=await homePage.getRandomL2L3CategoryText(l2_index);
  // console.log(l2Text);
  // console.log(l3Text);
  await homePage.navigateToCategoryL1(l3Text);
  //await page.waitForLoadState('networkidle');
  await page.waitForTimeout(3000);
  await plpPage.validateItemCount();
  await plpPage.validatePresenceOfFilter();
  await plpPage.validateCheckboxesForAllFilters();
  await page.waitForTimeout(3000);
  const numOptionsPerCategory = 2;
  //const selectedFilter =await plpPage.randomlySelectFilterCheckbox();
  const selectedFilter=await plpPage.randomlySelectMultipleFiltersOptions(numOptionsPerCategory);
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(3000);
  await plpPage.validateAppliedFilters(selectedFilter);
 console.log(selectedFilter);
})


})
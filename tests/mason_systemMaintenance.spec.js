const { chromium } = require('playwright');
import {test,expect } from '@playwright/test';
import {HomePage} from '../pages/mason_home_page';
import {SignInPage} from '../pages/mason_signin_page';
import {SystemMaintenancePage} from '../pages/mason_system_maintenance_page';
import {MyAccountPage} from '../pages/mason_myaccount_page';
import {MyAccountAddressPage} from '../pages/mason_myAccountAddress_page';
import { allure } from 'allure-playwright';
import { sign } from 'crypto';



test.describe("Mason System Maintenance Tests", ()=>{

   test.beforeEach(async({page,isMobile},testInfo)=>{
    test.slow();
    try{  
    await page.goto(process.env.SYSTEM_MAINTENANCE_URL);
    await page.waitForLoadState('networkidle');
    if(isMobile==true){
      const signinPage = new SignInPage(page);  
      await signinPage.clickSignInImage();
      await signinPage.clickSignIn();
      await signinPage.validateSignInDialog();
      await signinPage.login(process.env.USERNAME,process.env.PASSWORD);
      await signinPage.clickSignIn();
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
 
  
//SB-SM001
  test("Validate the stoneberry logo at the center of the system maintenance page",async({page},testInfo)=>{ 
        const sysMainPage=new SystemMaintenancePage(page);
        await sysMainPage.validateLogoDisplay();
        await sysMainPage.validateLogoAtCentre();
        await sysMainPage.validateSystemMaintenanceText();
        await sysMainPage.validateSystemTextPositionUnderLogo();
        
  })

//SB-SM002
test("Validate the subtitle and it's position of the system maintenance page",async({page},testInfo)=>{ 
  const sysMainPage=new SystemMaintenancePage(page);
  await sysMainPage.validateSystemMaintenanceSubtitle();
  await sysMainPage.validateSystemTextPositionUnderLogo();
  
})

//SB-SM003
test("Validate the subtitle text and it's position of the system maintenance page",async({page},testInfo)=>{ 
  const sysMainPage=new SystemMaintenancePage(page);
  await sysMainPage.validateSystemMaintenanceText();
  await sysMainPage.validateSystemTextPositionUnderSubTitle();
  
})

test.only("Validate email, call section system maintenance page",async({page},testInfo)=>{ 
  const sysMainPage=new SystemMaintenancePage(page);
  await sysMainPage.validateEmailSection();
  await sysMainPage.validateCallSection();
  await sysMainPage.validateThankYouMessage();
  await sysMainPage.clickOnMail();
  
})

  

  })
const { chromium } = require('playwright');
import {test,expect } from '@playwright/test';
import {HomePage} from '../pages/mason_home_page';
import {SignInPage} from '../pages/mason_signin_page';
import {MyAccountPage} from '../pages/mason_myaccount_page';
import { allure } from 'allure-playwright';

const homepage_data =JSON.parse(JSON.stringify(require('../test_data/mason_sb_home_page_data.json')));
const signinpage_data =JSON.parse(JSON.stringify(require('../test_data/mason_signin_page_data.json')));
const signoutpage_data =JSON.parse(JSON.stringify(require('../test_data/mason_signout_page_data.json')));
const myaccountpage_data =JSON.parse(JSON.stringify(require('../test_data/mason_sb_myaccount_page_data.json')));
const savedAddress = myaccountpage_data.myaccount_newaddress_firstname +" "+ myaccountpage_data.myaccount_newaddress_lastname +" "+ myaccountpage_data.myaccount_newaddress_addressline1;
const editAddress = myaccountpage_data.myaccount_editaddress_firstname +" "+ myaccountpage_data.myaccount_editaddress_lastname +" "+ myaccountpage_data.myaccount_editaddress_addressline1;

test.describe("Mason Commerce Tool Site", ()=>{

   test.beforeEach(async({page,isMobile},testInfo)=>{
    test.slow();
       try {
           await page.goto(process.env.WEB_URL);
           await page.waitForLoadState('networkidle');
           if(isMobile==true){
            const signinPage = new SignInPage(page);  
            await signinPage.clickSignInImage();
            await signinPage.clickSignIn();
            await signinPage.validateSignInDialog();
            await signinPage.login(process.env.USERNAME,process.env.PASSWORD);
            await signinPage.clickSignIn();
            await page.waitForLoadState('networkidle');
          } else {
            const homePage = new HomePage(page);
            await homePage.clickOnHomePageSignIn();
            const signinPage = new SignInPage(page);
            await signinPage.validateWelcomeTextSignInDialog(signinpage_data.signin_dailog_text);
            await signinPage.validateWelcomeSignInDialog();
            await signinPage.clickSignIn();
            await signinPage.validateSignInDialog();
            await signinPage.login(process.env.USERNAME,process.env.PASSWORD);
            await signinPage.clickSignIn();
            await signinPage.waitForMyAccountDashboardLoad();
            await signinPage.validateSignInMessage(signinpage_data.signin_success_text);
            await page.waitForLoadState('networkidle');
          }
           const masonHomePageScreenshot = await page.screenshot();
           await testInfo.attach('screenshot', { body: masonHomePageScreenshot, contentType: 'image/png' });
       } catch (error) {
           // Handle the error here
           console.error("An error occurred in test.beforeEach:", error);
       }   
  })
    //Account - Credit Cards - Standard With Saved Cards - Test Cases ID-SB-MyA293/SB-MyA294
  test("Account - Credit Cards - Standard With Saved Cards - Verify user gets navigate to credit card page by either clicking on the 'Saved Credit Cards' link from the left navigation menu present on the account pages.",async({page},testInfo)=>{ 
    //test.slow();
    const myaccountPage = new MyAccountPage(page);
    await myaccountPage.clickMyAccountSavedCCLink();
    await myaccountPage.validateSaveCreditCardPage();
    await myaccountPage.validateDefaultSavedCreditCardSection();
    })

    //Account - Credit Cards - Standard With Saved Cards - Test Cases ID-SB-MyA297/SB-MyA298
  test("Account - Credit Cards - Standard With Saved Cards - Verify Add card form shows following fields associated with credit card:- Card number- Expiry date (mm//yy)- Security code (? icon)- Save as default card checkbox- Save card button.",async({page},testInfo)=>{ 
    //test.slow();
    const myaccountPage = new MyAccountPage(page);
    await myaccountPage.clickMyAccountSavedCCLink();
    await myaccountPage.clickAddNewCC();
    await myaccountPage.validateNewCCSection();
    await myaccountPage.validateSavedAddress();
    await myaccountPage.editAddressButtonDisplay();
    })

    //Account - Credit Cards - Standard With Saved Cards - Test Cases ID-SB-My307/SB-My308
  test("Account - Credit Cards - Standard With Saved Cards - Verify on adding a new card successfully, application shows the newly added card in the list.",async({page},testInfo)=>{ 
    //test.slow();
    const myaccountPage = new MyAccountPage(page);
    await myaccountPage.clickMyAccountSavedCCLink();
    await myaccountPage.clickAddNewCC();
    await myaccountPage.validateNewCCSection();
    await myaccountPage.enterCCNumber(myaccountpage_data.myaccount_newcc_cardnumber);
    await myaccountPage.enterCCExpDate(myaccountpage_data.myaccount_newcc_cardexpdate);
    await myaccountPage.enterCCSecurityCode(myaccountpage_data.myaccount_newcc_cardseccode);
    await myaccountPage.clickDefaultCCCheckbox();
    await myaccountPage.clickSaveCardButton();
    await myaccountPage.validatedSuccessMessage();
    await myaccountPage.validateDefaultSavedCreditCardSection();
    })

    //Account - Credit Cards - Standard With Saved Cards - Test Cases ID-SB-MyA309
  test("Account - Credit Cards - Standard With Saved Cards - Verify application always shows default Credit Card as first along with a checkmark encompassed by a green circle and the text “DEFAULT CREDIT CARD”.",async({page},testInfo)=>{ 
    //test.slow();
    const myaccountPage = new MyAccountPage(page);
    await myaccountPage.clickMyAccountSavedCCLink();
    await myaccountPage.setDefaultCreditCard();
    })

    //Account - Credit Cards - Standard With Saved Cards - Test Cases ID-SB-MyA316/SB-MyA318
  test("Account - Credit Cards - Standard With Saved Cards - Verify clicking on Remove option, application removes the selected card and a success message 'Your credit card was successfully removed' is shown.",async({page},testInfo)=>{ 
    //test.slow();
    const myaccountPage = new MyAccountPage(page);
    await myaccountPage.clickMyAccountSavedCCLink();
    await myaccountPage.removeCreditCard();
    })

    //Account - Credit Cards - Standard With Saved Cards - Test Cases ID-SB-MyA317
  test("Account - Credit Cards - Standard With Saved Cards - Verify 'Undo' option is shown at the end of the success message and clicking on it, application reverses the removal of the credit card.",async({page},testInfo)=>{ 
    //test.slow();
    const myaccountPage = new MyAccountPage(page);
    await myaccountPage.clickMyAccountSavedCCLink();
    await myaccountPage.undoRemoveCreditCard();
    })

    //Account - Credit Cards - Standard With Saved Cards - Test Cases ID-SB-MyA312
  test.only("Account - Credit Cards - Standard With Saved Cards - Verify clicking on Edit button, application expands the edit card form with pre-populated data- Expiry date- Billing address.",async({page},testInfo)=>{ 
    //test.slow();
    const myaccountPage = new MyAccountPage(page);
    await myaccountPage.clickMyAccountSavedCCLink();
    await myaccountPage.validateDefaultSavedCreditCardSection();
    await myaccountPage.clickEditButton();
    await myaccountPage.editCreditCard(myaccountpage_data.myaccount_newcc_cardnumber);
    await myaccountPage.validateSavedAddress();

    })

    //Account - Credit Cards - Standard With Saved Cards - Test Cases ID-SB-MyA315
  test.only("Account - Credit Cards - Standard With Saved Cards - Verify user is able to edit the credit card details with new billing address.",async({page},testInfo)=>{ 
    //test.slow();
    const myaccountPage = new MyAccountPage(page);
    await myaccountPage.clickMyAccountSavedCCLink();
    await myaccountPage.validateDefaultSavedCreditCardSection();
    await myaccountPage.clickEditButton();
    await myaccountPage.editCreditCard(myaccountpage_data.myaccount_newcc_cardnumber);
    await myaccountPage.clickNewCreditCardNewAddressOption();
    await myaccountPage.fillNewAddress();
    await myaccountPage.clickSaveCardButton();
    await myaccountPage.updateCreditCardSuccessMessage();

    })

    //Account - Credit Cards - Standard With Saved Cards - Test Cases ID-SB-MyA312
  test.only("Account - Credit Cards - Standard With Saved Cards - Verify user is able to edit the credit card details with any other saved address from the account.",async({page},testInfo)=>{ 
    //test.slow();
    const myaccountPage = new MyAccountPage(page);
    await myaccountPage.clickMyAccountSavedCCLink();
    await myaccountPage.validateDefaultSavedCreditCardSection();
    await myaccountPage.clickEditButton();
    await myaccountPage.editCreditCard(myaccountpage_data.myaccount_newcc_cardnumber);
    await myaccountPage.validateSavedAddress();
    await myaccountPage.clickSaveCardButton();
    await myaccountPage.updateCreditCardSuccessMessage();

    })


})
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
  //Account - My Account- Longstanding Customer - Left-hand Navigation-SB-MyA005
  test("Account - My Account-Left-hand Navigation - Verify all navigation links are clickable",async({page},testInfo)=>{ 
    test.slow();
    const myaccountPage = new MyAccountPage(page);
    await myaccountPage.verifyLeftNavLinks();
    await myaccountPage.verifyAllLinksAreClickable();
  })

  //Account - My Account- Longstanding Customer - Left-hand Navigation-SB-MyA005
  test("Account - My Account-Left-hand Navigation - Verify navigation link highlights current section",async({page},testInfo)=>{ 
    test.slow();
    const myaccountPage = new MyAccountPage(page);
    await myaccountPage.clickAndVerifyHighlightedLink();
          
  })

  //Account - My Account- Longstanding Customer - My Stoneberry Credit-SB-MyA005/SB-MyA063
  test("Account - My Stoneberry Credit - Verify display of current credit limit and available credit",async({page},testInfo)=>{ 
    test.slow();
    const myaccountPage = new MyAccountPage(page);
    await myaccountPage.clickMyAccountCreditLink();
    await myaccountPage.creditOverviewSection();
          
  })

  //Account - My Account- Longstanding Customer - My Stoneberry Credit-SB-MyA010/SB-MyA064
  test("Account - My Stoneberry Credit - Verify functionality of help icon for Available Credit",async({page},testInfo)=>{ 
    test.slow();
    const myaccountPage = new MyAccountPage(page);
    await myaccountPage.clickMyAccountCreditLink();
    await myaccountPage.helpIconTooltip(myaccountpage_data.myaccount_tooltip_availablecredit);
          
  })

  //Account - My Account- Longstanding Customer - Payments-SB-MyA011/SB-MyA068
  test("Account - Payments - Verify display of total balance, minimum due, and payment due date",async({page},testInfo)=>{ 
    test.slow();
    const myaccountPage = new MyAccountPage(page);
    await myaccountPage.clickMyAccountCreditLink();
    await myaccountPage.paymentOverviewSection();
          
  })

  //Account - My Account- Longstanding Customer - Payments-SB-MyA012/SB-MyA069
  test("Account - Payments - Verify functionality of help icon for Payment Section",async({page},testInfo)=>{ 
    test.slow();
    const myaccountPage = new MyAccountPage(page);
    await myaccountPage.clickMyAccountCreditLink();
    await myaccountPage.helpIconTooltip(myaccountpage_data.myaccount_tooltip_totalbalance);
          
  })

  //Account - My Account- Longstanding Customer - Payments-SB-MyA013/SB-MyA070
  test("Account - Payments - Verify navigation to payment page when click on Make payment button",async({page},testInfo)=>{ 
    test.slow();
    const myaccountPage = new MyAccountPage(page);
    await myaccountPage.clickMyAccountCreditLink();
    await myaccountPage.clickMakeAPaymentButton();
          
  })

  //Account - My Account- Longstanding Customer - Orders-SB-MyA015
  test("Account - Orders - Verify display of order data in Orders Page",async({page},testInfo)=>{ 
    test.slow();
    const myaccountPage = new MyAccountPage(page);
    await myaccountPage.clickMyAccountOrderLink();
    await myaccountPage.validatedOrderNumberDisplaySection(myaccountpage_data.myaccount_orders_ordernumberprefix);
          
  })

  //Account - My Account- Longstanding Customer - Orders-SB-MyA018
  test("Account - Orders - Verify clicking on product name or image thumbnail, redirects user to order details page",async({page},testInfo)=>{ 
    test.slow();
    const myaccountPage = new MyAccountPage(page);
    await myaccountPage.clickMyAccountOrderLink();
    await myaccountPage.clickOnProductNamePlacedOrder();
          
  })

  //Account - My Account- Longstanding Customer - Address-SB-MyA023
  test("Account - Address - Verify Default address is shown in the Addresses section along with View Addresses link",async({page},testInfo)=>{ 
    test.slow();
    const myaccountPage = new MyAccountPage(page);
    await myaccountPage.clickMyAccountAddressLink();
    await myaccountPage.validateDefaultShippingandBillingAddressSection();
    await myaccountPage.validateEditAndRemoveButtonDisplayForMyAccount();
          
  })

  //Account - My Account- Longstanding Customer - My Profile-SB-MyA026/SB-MyA028
  test("Account - My Profile - Verify my profile section shows: - User's First and last name - Email address",async({page},testInfo)=>{ 
    test.slow();
    const myaccountPage = new MyAccountPage(page);
    await myaccountPage.clickMyAccountMyProfileLink();
    await myaccountPage.validateMyProfilePage();
          
  })

  //Account - My Account- Longstanding Customer - Change Password-SB-MyA027
  test("Account - Change Password - Verify navigation to Change password page when click on the link from account home page",async({page},testInfo)=>{ 
    test.slow();
    const myaccountPage = new MyAccountPage(page);
    await myaccountPage.clickChangePasswordLink();
    await myaccountPage.validateChangePasswordSection();
          
  })

  //Account - My Account- Longstanding Customer - Saved Credit Cards-SB-MyA029
  test("Account - Saved Credit Cards - Verify Credit card section shows:- Default card details (Credit card svg image, last 4 digits of the card and expiry date)",async({page},testInfo)=>{ 
    test.slow();
    const myaccountPage = new MyAccountPage(page);
    await myaccountPage.clickMyAccountSavedCCLink();
    await myaccountPage.validateDefaultSavedCreditCardSection();
    await myaccountPage.validateEditAndRemoveButtonDisplayForMyAccount();
          
  })

  //Account - My Account- Longstanding Customer - View Orders-SB-MyA022
  test("Account - Orders - Verify clicking on the View Orders link from My Account Dashboard redirect user to the Orders page)",async({page},testInfo)=>{ 
    test.slow();
    const myaccountPage = new MyAccountPage(page);
    await myaccountPage.clickMyAccountViewOrderLink();
  })

  //Account - My Account- Longstanding Customer - View My Profile-SB-MyA028
  test("Account - View My Profile - Verify clicking on the View My Profile link from My Account Dashboard redirect user to the My Profile page)",async({page},testInfo)=>{ 
    test.slow();
    const myaccountPage = new MyAccountPage(page);
    await myaccountPage.clickMyAccountViewMyProfileLink();
  })

  //Account - My Account- Longstanding Customer - View Addresses-SB-MyA024
  test("Account - View Addresses - Verify clicking on the View Addresses link from My Account Dashboard redirect user to the Addresses page)",async({page},testInfo)=>{ 
    test.slow();
    const myaccountPage = new MyAccountPage(page);
    await myaccountPage.clickMyAccountViewAddressLink();
  })

  //Account - My Account- Longstanding Customer - View Saved Credit Card-SB-MyA030
  test("Account - View Saved Credit Card - Verify clicking on the  View Saved Credit Card link from My Account Dashboard redirect user to the Credit Card page)",async({page},testInfo)=>{ 
    test.slow();
    const myaccountPage = new MyAccountPage(page);
    await myaccountPage.clickMyAccountViewSavedCCLink();
  })

  //Account - My Account- Longstanding Customer - View Wishlist-SB-MyA034
  test("Account - View Wishlist - Verify clicking on the View Wishlist link from My Account Dashboard redirect user to the Wishlist page)",async({page},testInfo)=>{ 
    test.slow();
    const myaccountPage = new MyAccountPage(page);
    await myaccountPage.clickMyAccountViewWishListLink();
  })

  //Account - My Account- Longstanding Customer - Wish List-SB-MyA034/SB-MyA033
  test("Account - Wish List - Verify navigation Wish list page when click on wish list link and Wishlist section shows:- Product image thumbnails)",async({page},testInfo)=>{ 
    test.slow();
    const myaccountPage = new MyAccountPage(page);
    await myaccountPage.clickMyAccountWishListLink();
    await myaccountPage.validateProductImagesWishlist();
  })

  //Account - My Stoneberry Credit - Overview Section-SB-MyA065
  test("Account - My Stoneberry Credit - Verify redirection upon clicking Start Shopping CTA",async({page},testInfo)=>{ 
    test.slow();
    const myaccountPage = new MyAccountPage(page);
    await myaccountPage.clickMyAccountCreditLink();
    await myaccountPage.startShoppingButtonDisplay();
    await myaccountPage.clickStartShoppingButton();      
  })

  //Account - My Stoneberry Credit - Overview Section-SB-MyA066/SB-MyA067
  test("Account - My Stoneberry Credit - Verify: If available credit value is greater than or equal to the threshold set for the courtesy nav (currently $75), the available credit should display in green else black",async({page},testInfo)=>{ 
    test.slow();
    const myaccountPage = new MyAccountPage(page);
    await myaccountPage.clickMyAccountCreditLink();
    await myaccountPage.startShoppingButtonDisplay();
    await myaccountPage.validateAvailableCreditValueColor();
          
  })

  //Account - My Stoneberry Credit - Payment Section-SB-MyA066/SB-MyA067
  test("Account - My Stoneberry Credit - Verify display of Make a Payment CTA based on Total Balance",async({page},testInfo)=>{ 
    test.slow();
    const myaccountPage = new MyAccountPage(page);
    await myaccountPage.clickMyAccountCreditLink();
    await myaccountPage.makeAPaymentButtonDisplay();        
  })

  //Account - My Stoneberry Credit - Account Information Section-SB-MyA072/SB-MyA073/SB-MyA074/SB-MyA075/SB-MyA076/SB-MyA077/SB-MyA078/SB-MyA079/SB-MyA080/SB-MyA081
  test("Account - My Stoneberry Credit - Verify display of Customer Account #, Account Status, Amount Past Due, Last Statement Date, and Next Statement Date",async({page},testInfo)=>{ 
    test.slow();
    const myaccountPage = new MyAccountPage(page);
    await myaccountPage.clickMyAccountCreditLink();
    await myaccountPage.validateMakeAPaymentAccountInformation(); 
    await myaccountPage.validateCreditStatementAddress();
    await myaccountPage.helpIconTooltip(myaccountpage_data.myaccount_makeapayment_accountstatus_tooltip);       
  })

  //Account - My Stoneberry Credit - Account Information Section-SB-MyA082/SB-MyA083/SB-MyA084/SB-MyA085/SB-MyA086
  test("Account - My Stoneberry Credit - Verify application shows the address in edit mode when click on edit",async({page},testInfo)=>{ 
    test.slow();
    const myaccountPage = new MyAccountPage(page);
    await myaccountPage.clickMyAccountCreditLink();
    await myaccountPage.validateCreditStatementAddress();
    await myaccountPage.clickEditCreditStatementAddress();
    await myaccountPage.validateEditCreditStatementAddress();  
  })

  //Account - My Stoneberry Credit - Account Information Section-SB-MyA087/SB-MyA088/SB-MyA089/SB-MyA090/SB-MyA091
  test("Account - My Stoneberry Credit -Recent Account Transactions Section - Verify display of transaction date, status, and description",async({page},testInfo)=>{ 
    test.slow();
    const myaccountPage = new MyAccountPage(page);
    await myaccountPage.clickMyAccountCreditLink();
    await myaccountPage.validateRecentAccountTransactionsColumnHeader();
    await myaccountPage.validateRecentAccountTransactionsDateColumnData();
    await myaccountPage.validateRecentAccountTransactionsStatusColumnData();
    await myaccountPage.validateRecentAccountTransactionsDescriptionColumnData();
    await myaccountPage.validateRecentAccountTransactionsPurchaseChargeColumnData();
    await myaccountPage.validateRecentAccountTransactionsPaymentCreditColumnData();
  })

  //Account - My Stoneberry Credit - Account Information Section-SB-MyA168/SB-MyA169/SB-MyA170/SB-MyA171
  test("Account - Orders - Standard With Orders - Verify display and functionality of the dynamic sort option dropdown",async({page},testInfo)=>{ 
    test.slow();
    const myaccountPage = new MyAccountPage(page);
    await myaccountPage.clickMyAccountOrderLink();
    await myaccountPage.validateOrdersSortDropdown();
    await myaccountPage.validateOrdersSelectedSortDropdownValue();
  })

  //Account - My Stoneberry Credit - Account Information Section-SB-MyA168/SB-MyA169/SB-MyA170/SB-MyA171/SB-MyA173/SB-MyA174
  test("Account - Orders - Standard With Orders - Verify display of order details including Order ID, Order Date, and Order Total",async({page},testInfo)=>{ 
    test.slow();
    const myaccountPage = new MyAccountPage(page);
    await myaccountPage.clickMyAccountOrderLink();
    await myaccountPage.validatedOrderNumberDisplaySection(myaccountpage_data.myaccount_orders_ordernumberprefix);
  })

  //Account - My Stoneberry Credit - Account Information Section-SB-MyA177/SB-MyA181
  test("Account - Orders Requiring Down Payment - Verify functionality of Make a Down Payment CTA and its redirection to the Make a Down Payment Drawer",async({page},testInfo)=>{ 
    test.slow();
    const myaccountPage = new MyAccountPage(page);
    await myaccountPage.clickMyAccountOrderLink();
    await myaccountPage.validateMakeADownPayment();
  })

  //Account - My Stoneberry Credit - Account Information Section-SB-MyA229/SB-MyA230/SB-MyA236/SB-MyA237
  test("Account - Addresses - Standard With Addresses - Verify functionality of add new Address",async({page},testInfo)=>{ 
    //test.slow();
    const myaccountPage = new MyAccountPage(page);
    await myaccountPage.clickMyAccountAddressLink();
    await myaccountPage.displayAddressSection();
    await myaccountPage.clickAddNewAddressButton();
    await myaccountPage.displayAddNewAddressSection();
    await myaccountPage.validateAddNewAddress();
  })

  //Account - My Stoneberry Credit - Account Information Section-SB-MyA252/SB-MyA253
  test("Account - Addresses - Remove Address - Verify clicking on 'Remove' button, the selected address gets deleted and the data removed from the Addresses page.",async({page},testInfo)=>{ 
    //test.slow();
    const myaccountPage = new MyAccountPage(page);
    await myaccountPage.clickMyAccountAddressLink();
    await myaccountPage.displayAddressSection();
    await myaccountPage.removeAddress();
  })

  //Account - My Stoneberry Credit - Account Information Section-SB-MyA254/SB-MyA255
  test("Account - Addresses - Undo Remove Address - Verify clicking on the 'Undo' text link, application reverses the removal of the address.",async({page},testInfo)=>{ 
    //test.slow();
    const myaccountPage = new MyAccountPage(page);
    await myaccountPage.clickMyAccountAddressLink();
    await myaccountPage.displayAddressSection();
    await myaccountPage.undoRemoveAddress();

  })

  //Account - My Stoneberry Credit - Account Information Section-SB-MyA244/SB-MyA249
  test("Account - Addresses - Edit Address - Verify clicking on Edit against any address, application expands edit address form with values pre-populated in it.",async({page},testInfo)=>{ 
    //test.slow();
    const myaccountPage = new MyAccountPage(page);
    await myaccountPage.clickMyAccountAddressLink();
    await myaccountPage.editSavedAccountAddress();
    await myaccountPage.validateUpdateSavedAddress();
    
  })

  //Account - My Stoneberry Credit - Account Information Section-SB-MyA245/SB-MyA246
  test("Account - Addresses - Edit Address - Verify Address Line 2 (optional) field is collapsed upon load when data is not present.",async({page},testInfo)=>{ 
    //test.slow();
    const myaccountPage = new MyAccountPage(page);
    await myaccountPage.clickMyAccountAddressLink();
    await myaccountPage.clickEditButton();
    await myaccountPage.validateAddressLine2();
    
  })

  //Account - My Stoneberry Credit - Account Information Section-SB-MyA247/SB-MyA248
  test("Account - Addresses - Edit Address - Verify clicking on Save button, application validates (missing required field, invalid field) and shows an error message to user.",async({page},testInfo)=>{ 
    //test.slow();
    const myaccountPage = new MyAccountPage(page);
    await myaccountPage.clickMyAccountAddressLink();
    await myaccountPage.clickEditButton();
    await myaccountPage.enterInvalidDataForEditAddress();
    await myaccountPage.validateErrorMessage();
    
  })

  //Account - My Stoneberry Credit - Account Information Section-SB-MyA234/SB-MyA235
  test("Account - Addresses - Add Address - Verify clicking on Save button, application validates (missing required field, invalid field) and shows an error message to user.",async({page},testInfo)=>{ 
    //test.slow();
    const myaccountPage = new MyAccountPage(page);
    await myaccountPage.clickMyAccountAddressLink();
    await myaccountPage.clickAddNewAddressButton();
    await myaccountPage.displayAddNewAddressSection();
    await myaccountPage.enterInvalidDataForAddAddress();
    await myaccountPage.validateErrorMessage();
    
  })

  //Account - My Stoneberry Credit - Account Information Section-SB-MyA251
  test("Account - Addresses - Cancel Edit Address - Verify Cancel link is shown below the Save button and clicking on it, application collapses the Edit address form.",async({page},testInfo)=>{ 
    //test.slow();
    const myaccountPage = new MyAccountPage(page);
    await myaccountPage.clickMyAccountAddressLink();
    await myaccountPage.clickEditButton();
    await myaccountPage.clickCancelEditAddressButton();
    await myaccountPage.cancelEditAddress();
    
  })

  //Account - My Stoneberry Credit - Account Information Section-SB-MyA239/SB-MyA240
  test("Account - Addresses - Set as Default Address - Verify if the 'Set as default billing & shipping address' checkbox is selected then newly added address gets updated as the Default Billing & Shipping Address upon save..",async({page},testInfo)=>{ 
    //test.slow();
    const myaccountPage = new MyAccountPage(page);
    await myaccountPage.clickMyAccountAddressLink();
    await myaccountPage.setDefaultAddress();
    await myaccountPage.validateDefaultShippingFirstSection();
    
  })

  //Account - My Stoneberry Credit - Account Information Section-SB-MyA238
  test("Account - Addresses - Set as Default Address using Default Checkbox - Verify if the 'Set as default billing & shipping address' checkbox is selected then newly added address gets updated as the Default Billing & Shipping Address upon save..",async({page},testInfo)=>{ 
    //test.slow();
    const myaccountPage = new MyAccountPage(page);
    await myaccountPage.clickMyAccountAddressLink();
    await myaccountPage.clickAddNewAddressButton();
    await myaccountPage.displayAddNewAddressSection();
    await myaccountPage.addNewDefaultShippingBillingAddress();
    })

    //Account - My Stoneberry Credit - Account Information Section-SB-MyA293/SB-MyA294
  test("Account - Credit Cards - Standard With Saved Cards - Verify user gets navigate to credit card page by either clicking on the 'Saved Credit Cards' link from the left navigation menu present on the account pages.",async({page},testInfo)=>{ 
    //test.slow();
    const myaccountPage = new MyAccountPage(page);
    await myaccountPage.clickMyAccountSavedCCLink();
    await myaccountPage.validateSaveCreditCardPage();
    await myaccountPage.validateDefaultSavedCreditCardSection();
    })

    //Account - My Stoneberry Credit - Account Information Section-SB-MyA297/SB-MyA298
  test("Account - Credit Cards - Standard With Saved Cards - Verify Add card form shows following fields associated with credit card:- Card number- Expiry date (mm//yy)- Security code (? icon)- Save as default card checkbox- Save card button.",async({page},testInfo)=>{ 
    //test.slow();
    const myaccountPage = new MyAccountPage(page);
    await myaccountPage.clickMyAccountSavedCCLink();
    await myaccountPage.clickAddNewCC();
    await myaccountPage.validateNewCCSection();
    await myaccountPage.validateSavedAddress();
    await myaccountPage.editAddressButtonDisplay();
    })

    //Account - My Stoneberry Credit - Account Information Section-SB-My307/SB-My308
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

    //Account - My Stoneberry Credit - Account Information Section-SB-MyA309
  test("Account - Credit Cards - Standard With Saved Cards - Verify application always shows default Credit Card as first along with a checkmark encompassed by a green circle and the text “DEFAULT CREDIT CARD”.",async({page},testInfo)=>{ 
    //test.slow();
    const myaccountPage = new MyAccountPage(page);
    await myaccountPage.clickMyAccountSavedCCLink();
    await myaccountPage.setDefaultCreditCard();
    })

    //Account - My Stoneberry Credit - Account Information Section-SB-MyA316/SB-MyA318
  test("Account - Credit Cards - Standard With Saved Cards - Verify clicking on Remove option, application removes the selected card and a success message 'Your credit card was successfully removed' is shown.",async({page},testInfo)=>{ 
    //test.slow();
    const myaccountPage = new MyAccountPage(page);
    await myaccountPage.clickMyAccountSavedCCLink();
    await myaccountPage.removeCreditCard();
    })

    //Account - My Stoneberry Credit - Account Information Section-SB-MyA317
  test("Account - Credit Cards - Standard With Saved Cards - Verify 'Undo' option is shown at the end of the success message and clicking on it, application reverses the removal of the credit card.",async({page},testInfo)=>{ 
    //test.slow();
    const myaccountPage = new MyAccountPage(page);
    await myaccountPage.clickMyAccountSavedCCLink();
    await myaccountPage.undoRemoveCreditCard();
    })

    //Account - My Stoneberry Credit - Account Information Section-SB-MyA312
  test("Account - Credit Cards - Standard With Saved Cards - Verify clicking on Edit button, application expands the edit card form with pre-populated data- Expiry date- Billing address.",async({page},testInfo)=>{ 
    //test.slow();
    const myaccountPage = new MyAccountPage(page);
    await myaccountPage.clickMyAccountSavedCCLink();
    await myaccountPage.validateDefaultSavedCreditCardSection();
    await myaccountPage.clickEditButton();
    await myaccountPage.editCreditCard(myaccountpage_data.myaccount_newcc_cardnumber);
    await myaccountPage.validateSavedAddress();

    })

    //Account - My Stoneberry Credit - Account Information Section-SB-MyA315
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

    //Account - My Stoneberry Credit - Account Information Section-SB-MyA312
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
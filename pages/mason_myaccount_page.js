import test, { expect } from 'playwright/test';
const myaccountpage_locator =JSON.parse(JSON.stringify(require('../object_repositories/mason_myaccount_page_repo.json')));
const accountpage_data =JSON.parse(JSON.stringify(require('../test_data/mason_sb_myaccount_page_data.json')));


exports.MyAccountPage = class MyAccountPage{
    constructor(page){
        this.page=page;
        this.myaccount_credit_link=page.getByRole('link', { name: myaccountpage_locator.myaccount_credit_link,exact:true }).first();
        this.myaccount_makepayment_link=page.getByRole('link', { name: myaccountpage_locator.myaccount_makepayment_link, exact:true }).first();
        this.myaccount_orders_link=page.getByRole('link', { name: myaccountpage_locator.myaccount_orders_link, exact:true }); 
        this.myaccount_addresses_link=page.getByRole('link', { name: myaccountpage_locator.myaccount_addresses_link, exact:true });
        this.myaccount_savedcreditcards_link=page.getByRole('link', { name: myaccountpage_locator.myaccount_savedcreditcards_link,exact:true });      
        this.myaccount_wishlist_link=page.getByRole('link', { name: myaccountpage_locator.myaccount_wishlist_link,exact:true }).first();
        this.myaccount_orderStatus_link=page.getByRole('link', { name: myaccountpage_locator.myaccount_orderStatus_link, exact:true });
        this.myaccount_needhelp_link=page.getByRole('link', { name: myaccountpage_locator.myaccount_needhelp_link });
        this.myaccount_myprofile_link=page.getByRole('link', { name: myaccountpage_locator.myaccount_myprofile_link, exact:true });
        this.myaccount_orders_section=page.getByRole('heading', { name: myaccountpage_locator.myaccount_orders_section }).nth(1);
        this.myaccount_viewmyprofile_link=page.getByRole('link', { name: myaccountpage_locator.myaccount_viewmyprofile_link });
        this.myaccount_viewsavedcc_link=page.getByRole('link', { name: myaccountpage_locator.myaccount_viewsavedcc_link });
        this.myaccount_vieworders_link=page.getByRole('link', { name: myaccountpage_locator.myaccount_vieworders_link });
        this.myaccount_viewaddresses_link=page.getByRole('link', { name: myaccountpage_locator.myaccount_viewaddresses_link });
        this.myaccount_myaccount_link=page.getByRole('link', { name: myaccountpage_locator.myaccount_myaccount_link });
        this.myaccount_credit_payments=page.getByRole('heading', { name: myaccountpage_locator.myaccount_credit_payments });
        this.myaccount_credit_paymentdue=page.getByRole('heading', { name: myaccountpage_locator.myaccount_credit_paymentdue });
        this.myaccount_credit_minimumdue=page.getByRole('heading', { name: myaccountpage_locator.myaccount_credit_minimumdue });
        this.myaccount_credit_totalbalance=page.getByRole('heading', { name: myaccountpage_locator.myaccount_credit_totalbalance });
        this.myaccount_addnewaddress_section=page.locator('section').filter({ hasText: myaccountpage_locator.myaccount_addnewaddress_section });
        this.myaccount_addnewaddress_firstname=page.getByLabel(myaccountpage_locator.myaccount_addnewaddress_firstname);
        this.myaccount_addnewaddress_lastname=page.getByLabel(myaccountpage_locator.myaccount_addnewaddress_lastname);
        this.myaccount_addnewaddress_addressline1=page.getByLabel(myaccountpage_locator.myaccount_addnewaddress_addressline1);
        this.myaccount_addnewaddress_city=page.getByLabel(myaccountpage_locator.myaccount_addnewaddress_city);
        this.myaccount_addnewaddress_zipcode=page.getByLabel(myaccountpage_locator.myaccount_addnewaddress_zipcode);
        this.myaccount_addnewaddress_phonenumber=page.getByLabel(myaccountpage_locator.myaccount_addnewaddress_phonenumber);
        this.myaccount_addnewaddress_savedefaultaddcheckbox=page.getByRole(myaccountpage_locator.myaccount_addnewaddress_savedefaultaddcheckbox);
        this.myaccount_addnewaddress_selectstate_dropdown=page.getByRole(myaccountpage_locator.myaccount_addnewaddress_selectstate_dropdown);
        this.myaccount_addnewaddress_button=page.getByRole('heading', { name: myaccountpage_locator.myaccount_addnewaddress_button }).getByRole('button');
        this.myaccount_addnewaddress_saveaddressbutton=page.getByRole('button', { name: myaccountpage_locator.myaccount_addnewaddress_saveaddressbutton });
        this.myaccount_orders_lastorderdropdown=page.getByRole('button', { name: myaccountpage_locator.myaccount_orders_lastorderdropdown });
        this.myaccount_orders_searchorderplaceholder=page.getByLabel(myaccountpage_locator.myaccount_orders_searchorderplaceholder);
        this.myaccount_myprofile_contactinformation=page.getByRole('heading', { name: myaccountpage_locator.myaccount_myprofile_contactinformation });
        this.myaccount_myprofile_savechanges_button=page.getByRole('button', { name: myaccountpage_locator.myaccount_myprofile_savechanges_button });
        this.myaccount_myprofile_changepassword=page.locator(myaccountpage_locator.myaccount_myprofile_changepassword);
        this.myaccount_savedcc_addccdebitcard_button=page.getByRole('button', { name: myaccountpage_locator.myaccount_savedcc_addccdebitcard_button });
        this.myaccount_savedaddress_edit_button=page.getByRole('button', { name: myaccountpage_locator.myaccount_savedaddress_edit_button }).first();
        this.myaccount_savedaddress_remove_button=page.getByRole('button', { name: myaccountpage_locator.myaccount_savedaddress_remove_button }).first();
        this.myaccount_savedaddress_setasdefault_button=page.getByRole('button', { name: myaccountpage_locator.myaccount_savedaddress_setasdefault_button });
        this.myaccount_savedaddress_cancel_button=page.getByRole('button', { name: myaccountpage_locator.myaccount_savedaddress_cancel_button }).first();
        this.myaccount_savedaddress_getnames=page.locator(myaccountpage_locator.myaccount_savedaddress_getnames);
        this.myaccount_savedaddress_getaddressline1=page.locator(myaccountpage_locator.myaccount_savedaddress_getaddressline1);
        this.myaccount_editaddress_section=page.getByText(myaccountpage_locator.myaccount_editaddress_section);
        this.myaccount_myprofile_email=page.getByLabel(myaccountpage_locator.myaccount_myprofile_email);
        this.myaccount_changepassword_link = page.getByRole('link', { name: myaccountpage_locator.myaccount_changepassword,exact:true }).first();
        this.myaccount_changepassword_button = page.getByRole('button', { name: myaccountpage_locator.myaccount_changepassword });
        this.myaccount_changepassword_currentpassword=page.getByLabel(myaccountpage_locator.myaccount_changepassword_currentpassword);
        this.myaccount_changepassword_newpassword=page.getByLabel(myaccountpage_locator.myaccount_changepassword_newpassword);
        this.myaccount_orders_vieworderdetails=page.getByRole('link', { name: myaccountpage_locator.myaccount_orders_vieworderdetails }).first();
        this.myaccount_orders_withoutordersbutton=page.getByRole('button', { name: myaccountpage_locator.myaccount_orders_withoutordersbutton });
        this.myaccount_orders_singleorderlookup=page.getByRole('heading', { name: myaccountpage_locator.myaccount_orders_singleorderlookup });
        this.myaccount_singleorder_ordernumbertextbox=page.getByLabel(myaccountpage_locator.myaccount_singleorder_ordernumbertextbox);
        this.myaccount_singleorder_billingzipcodetextbox=page.getByLabel(myaccountpage_locator.myaccount_singleorder_billingzipcodetextbox);
        this.myaccount_singleorder_viewordersbutton=page.getByRole('button', { name: myaccountpage_locator.myaccount_singleorder_viewordersbutton });
        this.myaccount_savedcc_addccdebitcard_button=page.getByRole('heading', { name: myaccountpage_locator.myaccount_savedcc_addccdebitcard_button }).getByRole('button');
        this.myaccount_cc_savecard_number=page.locator(myaccountpage_locator.myaccount_cc_savecard_number);
        this.myaccount_cc_savecard_expdate=page.locator(myaccountpage_locator.myaccount_cc_savecard_expdate).first();
        this.myaccount_cc_cardnumber_textbox=page.getByLabel(myaccountpage_locator.myaccount_cc_cardnumber_textbox);
        this.myaccount_cc_expirydate_textbox=page.getByLabel(myaccountpage_locator.myaccount_cc_expirydate_textbox);
        this.myaccount_cc_securitycode_textbox=page.getByLabel(myaccountpage_locator.myaccount_cc_securitycode_textbox);
        this.myaccount_cc_savecard_button=page.getByRole('button', { name: myaccountpage_locator.myaccount_cc_savecard_button });
        this.myaccount_savedefaultcc_checkbox=page.locator('form').getByRole(myaccountpage_locator.myaccount_savedefaultcc_checkbox);

        this.address_breadcrumb=page.getByText(myaccountpage_locator.address_breadcrumb);
    }

    async displayMyAccountLeftNavigationLink(){
        await this.page.waitForLoadState('networkidle');
        await expect(this.myaccount_credit_link).toBeVisible();
        await expect(this.myaccount_makepayment_link).toBeVisible();
        await expect(this.myaccount_orders_link).toBeVisible();
        await expect(this.myaccount_addresses_link).toBeVisible();
        await expect(this.myaccount_savedcreditcards_link).toBeVisible();
        await expect(this.myaccount_wishlist_link).toBeVisible();
        //await expect(this.myaccount_needhelp_link).toBeVisible();
        await expect(this.myaccount_myprofile_link).toBeVisible();

    }

    async displayOrderSection(){
        await expect(this.myaccount_orders_section).toBeVisible();
    }

    async displayAddressSection(){
        await expect(this.page.locator('body')).toContainText(myaccountpage_locator.myaccount_addresses_section);
    }

    async displayViewMyProfileLink(){
        await expect(this.myaccount_viewmyprofile_link).toBeVisible();
    }

    async displayViewSavedCCLink(){
        await expect(this.myaccount_viewsavedcc_link).toBeVisible();
    }
    async displayViewOrdersLink(){
        await expect(this.myaccount_vieworders_link).toBeVisible();
    }
    async displayViewAddressesLink(){
        await expect(this.myaccount_viewaddresses_link).toBeVisible();
    }

    async clickMyAccountCreditLink(){
        await this.myaccount_credit_link.click();
    }
    async clickMyAccountMakeaPaymentLink(){
        await this.myaccount_makepayment_link.click();
    }
    async clickMyAccountOrderLink(){
        await this.myaccount_orders_link.click();
    }

    async clickMyAccountOrderStatusLink(){
        await this.myaccount_orderStatus_link.click();
    }

    async clickMyAccountAddressLink(){
        await this.myaccount_addresses_link.click();
    }
    async clickMyAccountSavedCCLink(){
        await this.myaccount_savedcreditcards_link.click();
    }
    async clickMyAccountWishListLink(){
        await this.myaccount_wishlist_link.first().click();
    }
    async clickMyAccountNeedHelpLink(){
        await this.myaccount_needhelp_link.click();
    }
    async clickMyAccountMyProfileLink(){
        
        //await this.myaccount_myprofile_link.toBeVisible();
        await this.myaccount_myprofile_link.click();
        const my_profile_button = await this.page.getByRole('link', { name: myaccountpage_locator.myaccount_myprofile_link, exact:true });
        await my_profile_button.click();
        // Fluent wait using waitForFunction to check URL condition
        const regexPattern = /.*myprofile/; 
        await this.page.waitForFunction(
          (regex) => new RegExp(regex).test(document.location.href),
          regexPattern.toString(),
          { timeout: 30000, polling: 1000 } // Maximum timeout of 30 seconds, polling interval of 1 second
        );
    }


    async clickMyAccountViewSavedCCLink(){
        await this.myaccount_viewsavedcc_link.click();
    }
    async clickMyAccountViewMyProfileLink(){
        await this.myaccount_viewmyprofile_link.click();
    }
    async clickMyAccountViewOrderLink(){
        await this.myaccount_vieworders_link.click();
    }
    async clickMyAccountViewAddressLink(){
        await this.myaccount_viewaddresses_link.click();
    }
    async clickAddNewAddressButton(){
        await this.myaccount_addnewaddress_button.click();
    }

    async viewMyAccountDefaultAddress(defaultAddress){
        await expect(this.page.locator('body')).toContainText(defaultAddress);
    }
    async viewMyAccountMyProfileDetails(userProfile){
        await expect(this.page.locator('body')).toContainText(userProfile);
    }
    async clickOnMyAccountLink(){
        await this.myaccount_myaccount_link.click();
        await this.page.waitForURL('**/account/dashboard/');
    }
    async viewMyAccountCreditDetails(){
        await expect(this.myaccount_credit_payments).toBeVisible();
        await expect(this.page.locator('body')).toContainText(myaccountpage_locator.myaccount_credit_creditlimit);
        await expect(this.page.locator('body')).toContainText(myaccountpage_locator.myaccount_credit_availablecredit);
        await expect(this.page.locator('body')).toContainText(myaccountpage_locator.myaccount_credit_paymentdue);
        await expect(this.page.locator('body')).toContainText(myaccountpage_locator.myaccount_credit_minimumdue);
        await expect(this.page.locator('body')).toContainText(myaccountpage_locator.myaccount_credit_totalbalance);
        
    }

    async noDefaultAddressSaved(nodefaultaddresses){
        await expect(this.page.locator('body')).toContainText(nodefaultaddresses);
    }

    async displayAddNewAddressSection(){
        await expect(this.page.locator('section').filter({ hasText: myaccountpage_locator.myaccount_addnewaddress_section }).nth(3)).toBeVisible();
    }

    async enterFirstName(enterFirstName){
        await this.myaccount_addnewaddress_firstname.fill(enterFirstName);
    }
    async enterLastName(enterLastName){
        await this.myaccount_addnewaddress_lastname.fill(enterLastName);
    }
    async enterAddressline1(enterAddressline1){
        await this.myaccount_addnewaddress_addressline1.fill(enterAddressline1);
    }
    async enterCity(enterCity){
        await this.myaccount_addnewaddress_city.fill(enterCity);
    }
    async selectState(selectState){
        await this.myaccount_addnewaddress_selectstate_dropdown.selectOption(selectState);
    }
    async enterZipcode(enterZipcode){
        await this.myaccount_addnewaddress_zipcode.fill(enterZipcode);
    }
    async enterPhoneNumber(enterPhonenumber){
        await this.myaccount_addnewaddress_phonenumber.fill(enterPhonenumber);
    }
    async selectSaveDefaultaddressCheckbox(){
        await this.myaccount_addnewaddress_savedefaultaddcheckbox.click();
    }
    async clickSaveAddressButton(){
        await this.myaccount_addnewaddress_saveaddressbutton.click();
    }
    async displaySavedAddressMessage(successAddressMessage){
        await expect(this.page.locator('body')).toContainText(successAddressMessage);
    }

    async displayOrdersPage(){
        await expect(page.locator('section').filter({ hasText: /^Orders$/ }).getByRole('paragraph')).toBeVisible();
    }

    async displayLastOrderDropdown(){
        await expect(this.myaccount_orders_lastorderdropdown).toBeVisible();
    }

    async displaySearchOrderPlaceHolder(){
        await expect(this.myaccount_orders_searchorderplaceholder).toBeVisible();
    }

    async displayOrderNumberDetails(){
        await expect(page.locator('body')).toContainText(myaccountpage_locator.myaccount_orders_ordernumberdetails);
        
    }

    async displayAddressPage(){
        await this.clickMyAccountAddressLink();
        await expect(this.page).toHaveURL(/.*addresses/);
        await this.displayAddressSection();
        await expect(this.myaccount_addnewaddress_button).toBeVisible();
        await expect(this.address_breadcrumb).toBeVisible();
    }

    async validateDefaultShippingAddress(addedAddress){
        await this.page.getByText('Default Billing & Shipping Address').waitFor({ state: 'visible' });
        await expect(this.page.getByText('Default Billing & Shipping Address'+addedAddress)).toBeVisible();

    }

    async validateRemovedDefaultShippingAddress(addedAddress){
        await expect(this.page.getByText('Default Billing & Shipping Address'+addedAddress)).toBeHidden();

    }

    async clickEditAddressButton(){
        await this.myaccount_savedaddress_edit_button.click();
    }

    async clickRemoveAddressButton(){
        await this.myaccount_savedaddress_remove_button.click();
    }

    async clickSetasDefaultAddressButton(){
        await this.myaccount_savedaddress_setasdefault_button.first().click();
    }

    async clickCancelEditAddressButton(){
        await this.myaccount_savedaddress_cancel_button.click();
    }

    async displayEditAddressSection(){
        await expect(this.myaccount_editaddress_section).toBeVisible();
    }

    async validatedRemovedAddress(removeAddressMessage,removedAddress){
        await expect(this.page.locator('body')).toContainText(removeAddressMessage);
        await expect(this.page.getByText('Default Billing & Shipping Address:'+removedAddress)).toBeHidden();

    }

    async getEditAddressNames(){
        await this.myaccount_savedaddress_getnames.waitFor({ state: 'visible' });
        var firstName = await this.myaccount_savedaddress_getnames.allTextContents();
        return firstName;
        
    }

    async getEditAddressline1(){
        var addressline1 = await this.myaccount_savedaddress_getaddressline1.allTextContents();
        return addressline1;
    }

    async validateUpdatedAddressMessage(updatedAddressMessage){
        await expect(this.page.locator('body')).toContainText(updatedAddressMessage);
    }

    async getDefaultShippingAddress(){
        console.log('default shipping address:' + await this.page.locator('section').filter({ hasText: /^Default Billing & Shipping Address:$/ }).allTextContents());

    }

    async validateDefaultShippingAddressUpdateMessage(defaultAddUpdatedMessage){
        await expect(this.page.locator('body')).toContainText(defaultAddUpdatedMessage);
    }

    async validateUpdatedDefaultAddress(updatedAddress,defaultAddress){
        expect(updatedAddress).not.toEqual(defaultAddress);
    }

    async validateMyProfilePage(){
        await expect(this.page).toHaveURL(/.*myprofile/);
        await expect(this.page.locator('body')).toContainText(myaccountpage_locator.myaccount_myprofile_headertext);
        await expect(this.page.getByRole('heading', { name: myaccountpage_locator.myaccount_myprofile_contactinformation })).toBeVisible();
        await expect(this.myaccount_addnewaddress_firstname).toBeVisible();
        await expect(this.myaccount_addnewaddress_lastname).toBeVisible();
        await expect(this.myaccount_myprofile_email).toBeVisible();
        await expect(this.myaccount_myprofile_savechanges_button).toBeVisible();
        await expect(this.page.getByText('HomeMy AccountMy Profile')).toBeVisible();
    }

    async validateMyProfileUpdateMessage(){
        try {
            await expect(this.page.locator('body')).toContainText(accountpage_data.myaccount_myprofile_updatemessage);
            
        } catch (error) {
            throw new Error('Failed to validate profile update message:'+ error);
        }
        
    }

    async clickMyProfileSaveChangesButton(){
        await this.myaccount_myprofile_savechanges_button.click();
    }

    async clickChangePasswordLink(){
        await this.myaccount_changepassword_link.click();
    }

    async clickChangePasswordButton(){
        await this.myaccount_changepassword_button.click();
    }

    async validateChangePasswordSection(){
        await expect(this.page).toHaveURL(/.*#changePassword/);
        await expect(this.myaccount_myprofile_changepassword).toBeVisible();
        await expect(this.myaccount_changepassword_currentpassword).toBeVisible();
        await expect(this.myaccount_changepassword_newpassword).toBeVisible();
        await expect(this.myaccount_changepassword_button).toBeVisible();
    }

    async validatedOrderSection(){
        await expect(this.page).toHaveURL(/.*orders/);
        await expect(this.page.getByText('HomeMy AccountOrders')).toBeVisible();
        const orders = await this.page.$$(myaccountpage_locator.myaccount_orders_ordernumber);
        expect(orders.length).toBeGreaterThan(0);
        await expect(this.myaccount_orders_searchorderplaceholder).toBeVisible();
        await expect(this.myaccount_orders_vieworderdetails).toBeVisible();
        //await expect(this.myaccount_orders_withoutordersbutton).toBeVisible();
    }

    async clickViewOrderDetailsLink(){
        await this.myaccount_orders_vieworderdetails.click();
    }

    async clickWithoutOrderButton(){
        await this.myaccount_orders_withoutordersbutton.click();
    }

    async clickViewOrdersButton(){
        await this.myaccount_singleorder_viewordersbutton.click();
    }

    async validateSingleOrderLookupSection(){
        await expect(this.myaccount_orders_singleorderlookup).toBeVisible();
        await expect(this.myaccount_singleorder_ordernumbertextbox).toBeVisible();
        await expect(this.myaccount_singleorder_billingzipcodetextbox).toBeVisible();
        await expect(this.myaccount_singleorder_viewordersbutton).toBeVisible();
    }

    async validateOrderDetailsPage(){
        await expect(this.page).toHaveURL(/.*orderDetails/);
    }

    async validateStoneberryCreditPage(){
        await expect(this.page).toHaveURL(/.*stoneberryCredit/);
    }

    async validateMakeaPaymentPage(){
        await expect(this.page).toHaveURL(/.*payment/);
    }

    async validateWishListPage(){
        await expect(this.page).toHaveURL(/.*wishlist/);
    }

    async validateMyAccountDashboardNavigation(){
        await expect(this.page).toHaveURL(/.*dashboard/);
    }

    async displaySavedCCHeaderText(){
        const regex = new RegExp(`^${myaccountpage_locator.myaccount_savedcc_headertext}$`);
        await expect(this.page.locator('section').filter({ hasText: regex })).toBeVisible();
    }

    async clickAddNewCC(){
        await this.myaccount_savedcc_addccdebitcard_button.click();
        
    }

    async validateSaveCreditCardPage(){
        this.displaySavedCCHeaderText();
        await expect(this.page.getByRole('list')).toContainText('HomeMy AccountSaved Credit Cards');
        await expect(this.myaccount_savedcc_addccdebitcard_button).toBeVisible();
    }

    async validateExistingCCDetails(){
        await expect(this.page.locator('body')).toContainText('Default Credit Card');
        this.getCCNumber();
        this.getCCExpDate();
        

    }

    async getCCNumber(){
        await this.myaccount_cc_savecard_number.waitFor({ state: 'visible' });
        var cardNumber = await this.myaccount_cc_savecard_number.allTextContents();
        //console.log('Credit Card Number:' + cardNumber);
        return cardNumber;

    }

    async getCCExpDate(){
        await this.myaccount_cc_savecard_expdate.waitFor({ state: 'visible' });
        var cardExpDate = await this.myaccount_cc_savecard_expdate.allTextContents();
        //console.log('Credit Card Number:' + cardExpDate);
        return cardExpDate;

    }

    async displaySavedCCNewAddressOptions(){
        const regex = new RegExp(`^${myaccountpage_locator.myaccount_savecc_newaddressradiobutton}$`);
        await expect(this.page.locator('section').filter({ hasText: regex })).toBeVisible();
    }

    async displaySavedCCSavedAddressOptions(){
        const regex = new RegExp(`^${myaccountpage_locator.myaccount_savecc_savedaddressradiobutton}$`);
        await expect(this.page.locator('section').filter({ hasText: regex })).toBeVisible();
    }

    async enterCCNumber(enterCardNumber){
        await this.myaccount_cc_cardnumber_textbox.fill(enterCardNumber);

    }

    async enterCCExpDate(enterCardExpDate){
        await this.myaccount_cc_expirydate_textbox.fill(enterCardExpDate);
    }

    async enterCCSecurityCode(enterCardSecCode){
        await this.myaccount_cc_securitycode_textbox.fill(enterCardSecCode);
    }

    async clickSaveCardButton(){
        await this.myaccount_cc_savecard_button.click();
    }

    async validateNewCCSection(){
        await expect(this.myaccount_cc_cardnumber_textbox).toBeVisible();
        await expect(this.myaccount_cc_expirydate_textbox).toBeVisible();
        await expect(this.myaccount_cc_securitycode_textbox).toBeVisible();
        await expect(this.myaccount_cc_savecard_button).toBeVisible();
        await this.displaySavedCCNewAddressOptions();
        await this.displaySavedCCSavedAddressOptions();
        await expect(this.myaccount_savedefaultcc_checkbox).toBeVisible();
    }

    async clickDefaultCCCheckbox(){
        await this.myaccount_savedefaultcc_checkbox.click();
    }

    async validateAddNewCardMessage(addnewCardMessage){
        await expect(this.page.locator('body')).toContainText(addnewCardMessage);
    }

    async validateAddNewCard(ccNumber,ccSecCode){
        await expect(this.page.locator('body')).toContainText(ccNumber);
        await expect(this.page.locator('body')).toContainText('Expires'+ " " + ccSecCode);

    }

    



    
}
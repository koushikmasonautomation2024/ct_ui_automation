import test, { expect } from 'playwright/test';
const homepage_locator =JSON.parse(JSON.stringify(require('../object_repositories/mason_home_page_repo.json')));

exports.HomePage = class HomePage{
    constructor(page){
        this.page=page;
        this.homepage_searchbarplaceholder=page.getByPlaceholder(homepage_locator.homepage_searchbarplaceholder);
        this.homepage_searchbutton=page.getByLabel(homepage_locator.homepage_searchbutton, { exact: true });
        //this.homepage_signin=page.getByRole('button', { name: homepage_locator.homepage_signin,exact:true });
        this.homepage_signin=page.locator(homepage_locator.homepage_signin);   
        this.homepage_cart=page.getByRole('button', { name: homepage_locator.homepage_cart }); 
        this.homepage_category=page.getByRole('button', { name: homepage_locator.homepage_category }); 
        this.minicart_drawer_heading=page.getByRole('button', { name: homepage_locator.minicart_drawer_heading });
        this.minicart_drawer_subtotalsection=page.getByText(homepage_locator.minicart_drawer_subtotalsection);
        this.minicart_drawer_viewcart_button=page.getByRole('button', { name: homepage_locator.minicart_drawer_viewcart_button });
        this.minicart_drawer_checkout_button=page.getByRole('button', { name: homepage_locator.minicart_drawer_checkout_button });
        this.footer_signupemail_textbox=page.getByPlaceholder(homepage_locator.footer_signupemail_textbox);
        this.footer_signup_button=page.getByRole('button', { name: homepage_locator.footer_signup_button });
                     
    }

    async displaySearchBar(){
        await this.homepage_searchbarplaceholder.waitFor({ state: 'visible' });
        await this.homepage_searchbutton.waitFor({ state: 'visible' });
        await expect(this.homepage_searchbarplaceholder).toBeVisible();
        await expect(this.homepage_searchbutton).toBeVisible();
    }

    async displaySignIn(){
        await this.homepage_signin.waitFor({ state: 'visible' });
        await expect(this.homepage_signin).toBeVisible();
    }

    async displayMiniCartIcon(){
        await this.homepage_cart.waitFor({ state: 'visible' });
        await expect(this.homepage_cart).toBeVisible();
    }

    async clickMiniCartIcon(){
        await this.homepage_cart.waitFor({ state: 'visible' });
        await this.homepage_cart.click();
    }

    async displayCategory(){
        await this.homepage_category.waitFor({ state: 'visible' });
        await expect(this.homepage_category).toBeVisible();
    }
    async displaySiteLogo(brandLogoName){
        await expect(this.page.getByRole('link', { name: brandLogoName, exact: true })).toBeVisible();
    }

    async clickSiteLogo(brandLogoName){
        await this.page.getByRole('link', { name: brandLogoName, exact: true }).click();
        
    }

    async homePageRedirectionValidation(homePageUrl){
        await expect(this.page).toHaveURL(homePageUrl);
    }
    async displayHeroBanner(bannerName){
        await expect(this.page.getByRole('link', { name: bannerName })).toBeVisible();
    }
    async displayPromotionalBanner(promotionalBannerContent){
        await expect(this.page.getByRole('banner').locator('div').filter({ hasText: promotionalBannerContent }).nth(2)).toBeVisible();
    }

    async displayGlobalBanner(bannerText){
        await expect(page.locator('div').filter({ hasText: new RegExp("^" + bannerText + "$") }).first()).toBeVisible();

    }

    async displayFooter(footerName){
        await expect(this.page.getByText(footerName)).toBeVisible();
    }

    async displayFooterLinks(footerLinkName){
        await expect(this.page.getByRole('link', { name: footerLinkName, exact: true })).toBeVisible();
    }

    async clickOnHomePageSignIn(){
        await this.homepage_signin.click();
    }

    async closeSignedInDrawer(){
        await this.page.getByRole('button').nth(1).click();
    }

    async staticPageNavigation(staticPageUrl){
        await this.page.goto(staticPageUrl);
    }

    async pageScrollBy(deltaX, deltaY){
        await this.page.mouse.wheel(deltaX, deltaY);

    }

    async displayPDPStickyAddtoCartButton(){
        await expect(this.page.locator(homepage_locator.stickyheader_pdp)).toBeVisible();
    }

    async mouseHoverMegaMenu(categoryNameL1){
        await this.homepage_category.hover();
        await this.page.getByText(categoryNameL1).hover();
        await expect(this.page.getByText(categoryNameL1)).toBeVisible();
    }

    async clickOnMegaMenuL2Category(l2CategoryName){
        //await this.page.getByLabel('Main Menu').locator('div').filter({ hasText: 'Womens ClothingAll Womens' })
        await this.page.getByRole('link', { name: l2CategoryName }).click();
    }

    async validateCLPNavigationUrl(clpUrl){
        const expectedURL = new RegExp(`.*${clpUrl}`);
        await expect(this.page).toHaveURL(expectedURL);

    }

    async enterSearchTerm(searchTerm){
        await this.homepage_searchbarplaceholder.fill(searchTerm);
        await this.page.waitForTimeout(500);
    }

    async hiddenSearchPlaceholderText(){
        await expect(this.page.getByLabel('Search', { exact: true })).toBeEnabled();
    }

    async emptyMiniCartDrawerSection(){
        await expect(this.page.getByRole('dialog').locator('section').filter({ hasText: '✕' }).nth(1)).toBeVisible();
    }

    async validatedEmptyMiniCartDrawer(){
        await expect(this.minicart_drawer_heading).toBeVisible();
        await expect(this.minicart_drawer_subtotalsection).toBeVisible();
        await expect(this.minicart_drawer_viewcart_button).toBeVisible();
        await expect(this.minicart_drawer_checkout_button).toBeVisible();
    }

    async enterFooterEmailNewsLetter(newsLetterEmail){
        await this.footer_signupemail_textbox.fill(newsLetterEmail);
    }

    async displayFooterEmailNewsLetter(){
        await expect(this.footer_signupemail_textbox).toBeVisible();
    }

    async displayFooterSignUpButton(){
        await expect(this.footer_signup_button).toBeVisible();
    }

    async clickFooterSignUpButton(){
        await this.footer_signup_button.click();
    }

    async validateFooterNewsLetterSignUpContent(newsletterSignUpContent){
        await expect(this.page.getByText(newsletterSignUpContent)).toBeVisible();

    }
    async validateFooterNewsLetterSignUpEmailContent(newsletterSignUpEmailContent){
        await expect(this.page.getByText(newsletterSignUpEmailContent)).toBeVisible();

    }

    async validateOtherSitesLinks(otherSitesLinkName){
        await expect(this.page.getByRole('link', { name: otherSitesLinkName, exact: true })).toBeVisible();
        
    }

    async validateOtherSitesSection(otherSitesSectionLabelName){
        await expect(this.page.locator('ul').filter({ hasText: otherSitesSectionLabelName })).toBeVisible();

    }

    async clickFooterLink(footerLinkName){
        await this.page.getByRole('link', { name: footerLinkName, exact: true }).click();
    }

    async validateCopyRightSection(copyrightText,contactNumber,contactUsLinkName){
        await expect(this.page.getByText(copyrightText)).toBeVisible();
        await expect(this.page.getByRole('link', { name: contactNumber })).toBeVisible();
        await expect(this.page.getByRole('link', { name: contactUsLinkName }).nth(1)).toBeVisible();
    }

    async validateCopyrightLegalText(copyrightLegalText){
        await expect(this.page.getByText(copyrightLegalText)).toBeVisible();
    }

    async getCategoryImageTilesCount(){
        // Get line count inside grid elements
        await expect(this.page.locator('(//div[@class=" block md:block lg:block"]/section/ul)[1]//li')).toHaveCount(4);
    }

    async getTopCategoryImageTilesCount(){
        // Get line count inside grid elements
        await expect(this.page.locator('(//div[@class=" block md:block lg:block"]/section/ul)[2]//li')).toHaveCount(18);
    }

    async categoryImageDisplayValidation(imageAltText){
        await expect(this.page.getByAltText(imageAltText).first()).toBeVisible();
    }

    async categoryLinkValidation(catLinkName){
        await expect(this.page.getByRole('link', { name: catLinkName }).first()).toBeVisible();
    }

    async topCategoriesImageDisplayValidation(){
        // Define the CSS selector for the grid container
        const gridSelector = '.grid.grid-cols-3.md\\:grid-cols-6 > li';

        // Get all the grid items
        const gridItems = await this.page.$$(gridSelector);

        // Loop through each grid item
        for (const item of gridItems) {
            // Get the link element inside the grid item
            const linkElement = await item.$('a');

            // Get the text content of the link element
            const linkText = await linkElement.textContent();

            // Validate the link text
            if (linkText.trim() === "") {
                console.error('Link text is empty');
            } else {
                console.log('Link text is correct:', linkText.trim());
            }

            // Get the image element inside the link element
            const imageElement = await linkElement.$('img');

            // Validate if image element exists
            if (!imageElement) {
                console.error('Image element not found');
            } else {
                // Validate if image is visible
                const isVisible = await imageElement.isVisible();
                console.log('Is image visible:', isVisible);

                // Validate the alt attribute of the image
                const altText = await imageElement.getAttribute('alt');
                if (altText === "") {
                    console.error('Alt text is empty');
                } else {
                    console.log('Alt text is correct:', altText);
                }
            }
        }
    }

    async getTopBrandsImageTilesCount(){
        // Get line count inside grid elements
        await expect(this.page.locator('(//div[@class=" block md:block lg:block"]/section/ul)[3]//li')).toHaveCount(4);
    }

    async getBrandsImageTilesCount(){
        // Get line count inside grid elements
        await expect(this.page.locator('(//div[@class=" block md:block lg:block"]/section/ul)[4]//li')).toHaveCount(6);
    }

    async brandsImageDisplayValidation(){
        // Define the CSS selector for the logo container .grid.grid-cols-3.md\\:grid-cols-6 > li  .flex.flex-wrap.items-center.justify-center.gap-x-5.gap-y-6.md\\:justify-between.md\\:gap-x-6 
        const logoSelector = '.flex.flex-wrap.items-center.justify-center.gap-x-5.gap-y-6.md\\:justify-between.md\\:gap-x-6 > li';

        // Wait for the logo container to appear
        await this.page.waitForSelector(logoSelector);

        // Get all the logo items
        const logoItems = await this.page.$$(logoSelector);

        // Loop through each logo item
        for (const item of logoItems) {
            try {
                // Get the link element inside the logo item
                const linkElement = await item.$('a');

                if (linkElement) {
                    // Get the image element inside the link element
                    const imageElement = await linkElement.$('img');

                    // Get the src attribute of the image
                    const srcAttribute = await imageElement.getAttribute('src');

                    // Get the alt attribute of the image
                    const altAttribute = await imageElement.getAttribute('alt');

                    //console.log('Link:', await linkElement.getAttribute('href'));
                    //console.log('Image source:', srcAttribute);
                    console.log('Alt text:', altAttribute);
                } else {
                    console.log('Link element not found for logo item.');
                }
            } catch (error) {
                console.error('Error processing logo item:', error);
            }
        }
    }

    async seasonalSavingsAndViewAlllink(){
        await expect(this.page.getByText('Seasonal Savings')).toBeVisible();
        await expect(this.page.locator('section').filter({ hasText: /^Seasonal SavingsView All$/ }).getByRole('link')).toBeVisible();
    }

    async signUpModalDisplayValidation(enterEmail){
        await this.page.getByRole('button', { name: 'Sign Up' }).click();
        await expect(this.page.frameLocator('iframe[title="ZD - D - 01 - Lightbox - FOOTER"]').getByPlaceholder('Enter your email address')).toBeVisible();
        await expect(this.page.frameLocator('iframe[title="ZD - D - 01 - Lightbox - FOOTER"]').getByLabel('Close Modal')).toBeVisible();
        await expect(this.page.frameLocator('iframe[title="ZD - D - 01 - Lightbox - FOOTER"]').getByLabel('Submit Modal Form')).toBeVisible();
        await this.page.frameLocator('iframe[title="ZD - D - 01 - Lightbox - FOOTER"]').getByPlaceholder('Enter your email address').fill(enterEmail);
        await this.page.frameLocator('iframe[title="ZD - D - 01 - Lightbox - FOOTER"]').getByLabel('Submit Modal Form').click();
        await expect(this.page.frameLocator('iframe[title="ZD - D - 01 - Lightbox - FOOTER"]').getByText(/^.*$/).first()).toBeHidden();
    }

}

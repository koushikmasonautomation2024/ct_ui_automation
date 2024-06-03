import test, { expect } from 'playwright/test';
const homepage_locator =JSON.parse(JSON.stringify(require('../object_repositories/mason_home_page_repo.json')));

exports.HomePage = class HomePage{
    constructor(page){
        this.page=page;
        this.homepage_searchbarplaceholder=page.getByPlaceholder(homepage_locator.homepage_searchbarplaceholder);
        this.homepage_searchbutton=page.getByLabel(homepage_locator.homepage_searchbutton, { exact: true });
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
    async displayFooter(footerName){
        await expect(this.page.getByText(footerName)).toBeVisible();
    }

    async clickOnHomePageSignIn(){
        await this.homepage_signin.click();
    }

    async closeSignedInDrawer(){
        await this.page.getByRole('button').nth(1).click();
    }

    async categoryL1ToBeVisibleOnDepartmentHover()
    {
        await this.homepage_category.hover();
        // Wait for the L1 categories to become visible
        await this.page.waitForSelector(homepage_locator.homepage_l1category, { state: 'visible' });
    }


    async countAllL1Categories()
    {
        await this.homepage_category.hover();
        // Wait for the L1 categories to become visible
        //await this.page.waitForSelector('#mainMenu > ul > li', { state: 'visible' });
        // Count all the L1 categories
        const l1Categories = await this.page.$$(homepage_locator.homepage_l1category);
        const l1Count = l1Categories.length;
        return l1Count;
    }

    async checkIfcategoryL1isBold(l1Category){
        //await (this.page.$(`a:text("${l1Category}")`)).hover();
        //await this.page.waitForSelector(homepage_locator.homepage_l1category, { state: 'visible' });
        const element = await this.page.$(`a:text("${l1Category}")`);
      //  const element = await this.page.$('a:text("Clothing, Shoes + Bags")');
  
        if (element) {
            
            await element.hover();
            const fontWeight = await element.evaluate(el => window.getComputedStyle(el).fontWeight);
            const isBold = parseInt(fontWeight) >= 700 || fontWeight === 'bold';
            expect(isBold).toBe(true);
        } else {
            console.log('Element not found.');
        }
    }

    async getRandomL1CategoryText() {
        const elements = await this.page.$$(homepage_locator.l1categoryText);
        await elements[0].waitForElementState('visible');

        
        // const texts = [];
        // for (let element of elements) {
        //   const text = await element.innerText();
        //   texts.push(text);
        // }

        const midpoint = Math.ceil(elements.length / 2);

        // Extract texts from the first half of the elements
        const texts = [];
        for (let i = 0; i < midpoint; i++) {
            const text = await elements[i].innerText();
            texts.push(text);
        }
        const randomIndex = Math.floor(Math.random() * texts.length);
        console.log(texts[randomIndex]);
        return [texts[randomIndex],randomIndex];
      }

    async l2andl3TobeVisibleOnL1Hover(index)
    {
        const l2Selector = homepage_locator.l2category.replace('${index + 1}', index + 1);
        const l3Selector = homepage_locator.l3category.replace('${index + 1}', index + 1);
        try {
            // Check if L2 element is visible
            await this.page.waitForSelector(l2Selector, { visible: true, timeout: 5000 });
            // Check if L3 element is visible
            await this.page.waitForSelector(l3Selector, { visible: true, timeout: 5000 });
        } catch (error) {
            // Handle timeout error
            console.error("L2 or L3 elements are not available within the timeout.");
}

}  

async ensureGreyOverlayOnCategoryHover()
{
    // Hover over "departments" menu item
    await this.homepage_category.hover();
    // Evaluate whether the element is beneath the overlay
   
    const pageUnderneathLocator = homepage_locator.page_underneath; 
    const isBeneathOverlay = await this.page.evaluate((locator) => {
        const element = document.evaluate(locator, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        if (!element) return false; // Return false if the element is not found

        const rect = element.getBoundingClientRect();
        return !(rect.top >= 0 && rect.left >= 0 && rect.bottom <= window.innerHeight && rect.right <= window.innerWidth);
    }, pageUnderneathLocator);

  // Assert that the element is beneath the overlay
  expect(isBeneathOverlay).toBe(true);

  


/*const isOverlayAdded = await this.page.isVisible('overlay_selector');

// // Step 3: Check if the current page gets disabled
// const isPageDisabled = await this.page.evaluate((isOverlayAdded) => {
//   const element = document.evaluate('//body/div[1]/div[2]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
//   const elementRect = element.getBoundingClientRect();
//   return isOverlayAdded && (elementRect.top >= window.innerHeight || elementRect.bottom <= 0);
// }, isOverlayAdded); // Pass isOverlayAdded as an argument

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
// // Step 4: Assertion
// expect(isPageDisabled).toBe(true);*/

}


async navigateToCategoryL1(l1Category){
    //await this.homepage_category.click();
    const l1CategoryElement = `a:text-is("${l1Category}")`;
    await this.page.waitForSelector(l1CategoryElement, { visible: true });
    const elements = await this.page.$$(l1CategoryElement);
    await elements[0].click();
    
       
    await this.page.waitForSelector(homepage_locator.l1breadcrumb, { visible: true });

    // Extract the text content of all <a> elements within the breadcrumb
    const breadcrumbLinks = await this.page.evaluate(() => {
        const links = Array.from(document.querySelectorAll('nav[aria-label="Breadcrumb"] a'));
        return links.map(link => link.textContent.trim());
    });

    // Check if any of the breadcrumb links contain the categoryName
    const isCategoryNavigated = breadcrumbLinks.some(linkText => linkText.includes(l1Category));
    expect(isCategoryNavigated).toBe(true);
    
}

async getRandomL2L3CategoryText(index){
    const l2Selector = homepage_locator.l2categoryText.replace('${index + 1}', index + 1);
        const l3Selector = homepage_locator.l2categoryText.replace('${index + 1}', index + 1);
        try {
            // Check if L2 element is visible
            await this.page.waitForSelector(l2Selector, { visible: true, timeout: 5000 });
            // Check if L3 element is visible
            await this.page.waitForSelector(l3Selector, { visible: true, timeout: 5000 });
}
catch (error) {
    // Handle timeout error
    console.error("L2 or L3 elements are not available within the timeout.");
}
    // Read the text from all L2 elements
    const l2Texts = await this.page.$$eval(l2Selector, elements => elements.map(element => element.textContent.trim()));
    // Read the text from all L3 elements
    const l3Texts = await this.page.$$eval(l3Selector, elements => elements.map(element => element.textContent.trim()));

    // Function to get a random element from an array
    function getRandomElement(array) {
        return array[Math.floor(Math.random() * array.length)];
    }

    // Get a random L2 text and a random L3 text
    const randomL2Text = getRandomElement(l2Texts);
    const randomL3Text = getRandomElement(l3Texts);
    return [randomL2Text,randomL3Text];
}

async ensureNoOverlayWhenClickedOutside()
{
    // Hover over "departments" menu item
    await this.homepage_category.hover();
    // Evaluate whether the element is beneath the overlay
    //const navigationPromise = this.page.waitForNavigation();
    await this.homepage_searchbarplaceholder.click();
    //await navigationPromise;

    const isL1CategoryVisible = await this.page.isVisible(homepage_locator.homepage_l1category);
    expect(isL1CategoryVisible).toBeFalsy();
    
  

}

}
import test, { expect } from 'playwright/test';

exports.CartDrawerPage = class CartDrawerPage {
    constructor(page) {
        this.miniCartPricingSection = page.locator('section.flex.flex-col.gap-1');
        this.miniCartFirstProductName = page.locator('ul.grid.gap-4.p-4 a>p');
        this.addtoCartButtonPLP = page.locator('section.flex.w-full.items-end.gap-4 button');

    }

    async validateMiniCartProdcutColorSizePricing() {
        const cspContent = this.miniCartPricingSection.locator('p');
        // Verify the color of the Product value
        expect(cspContent.nth(0)).toBeTruthy();
        // Verify the size of the Product value
        expect(cspContent.nth(1)).toBeTruthy();
        // Verify the sale price of the Product value
        expect(cspContent.nth(2)).toBeTruthy();
        // Verify the monthly price of the Product value
        expect(cspContent.nth(3)).toBeTruthy();

    }

    async miniCartGetProductName() {
        const productName = await this.miniCartFirstProductName.textContent();
        expect(productName).toBeTruthy();
    }

    async miniCartGetProductItemNumber() {
        const productItemNumber = await this.miniCartFirstProductName.locator('xpath=following-sibling::p').textContent();
        expect(productItemNumber).toBeTruthy();
    
    }

    async validateMiniCartProductDetails() {
        await this.page.getByRole('button', { name: 'My Cart' }).waitFor({state:'visible'});
        // Locate the container element that holds all products
        const productsContainer = await this.page.locator('ul.grid.gap-4.p-4');

        // Get all product items within the container
        const productItems = await productsContainer.$$('li.rounded-sm.border.border-foggyGray.bg-white.p-4');

        // Loop through each product item and validate its contents
        for (const productItem of productItems) {
            // Extract product name
            const productName = await productItem.$eval('p.text-sm.font-semibold.leading-[19.6px].text-black', el => el.textContent.trim());
            expect(productName).toBeTruthy();
            console.log('Product Name:', productName);

            // Extract product image source
            const productImageSrc = await productItem.$eval('section.flex.gap-4 a[href] svg', el => el.getAttribute('src'));
            expect(productImageSrc).toBeTruthy();
            console.log('Product Image Source:', productImageSrc);


            // Extract other product details
            const sections = await this.page.$$('section.flex.flex-col.gap-1');

            for (const section of sections) {
                const pTags = await section.$$('p');
                for (const pTag of pTags) {
                    const textContent = await pTag.textContent();
                    expect(textContent).toBeTruthy();
                    console.log(textContent.trim());
                }
            }
        }
    }

    async clickAddtoCartPLP() {
        // Function to click on a button randomly
        //const plpAddtoCartButton = await this.addtoCartButtonPLP;
        // Get the count of buttons
        const buttonCount = await this.addtoCartButtonPLP.count();

        if (buttonCount > 0) {
            // Select a random button index
            const randomIndex = Math.floor(Math.random() * buttonCount);

            // Click the randomly selected button
            await this.addtoCartButtonPLP.nth(randomIndex).click();
            console.log(`Clicked button with index: ${randomIndex}`);
        } else {
            console.log('No buttons found');
        }
        
    }

    async navigateToPLP(categoryName){
        await this.page.getByRole('link', { name: categoryName }).first().click();
    }
}
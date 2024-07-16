import test, { expect } from 'playwright/test';
import { allowedNodeEnvironmentFlags } from 'process';
import { PDPPage } from '../pages/mason_pdp_page';

const productStockLeft = 'strong.text-stoneberry-onlyLeft';

exports.CartDrawerPage = class CartDrawerPage {
    constructor(page) {
        this.page = page;
        this.miniCartPricingSection = page.locator('section.flex.flex-col.gap-1');
        this.miniCartFirstProductName = page.locator('ul.grid.gap-4.p-4 a>p');
        this.addtoCartButtonPLP = page.locator('button:has-text("Add to Cart")');
        this.plpProductImages = page.locator('section.productItemParent  a');
        this.miniCartQtyMinusButton = page.locator('div[role="dialog"] ul.grid.gap-4.p-4 div.flex > button:nth-child(1)');
        this.miniCartQtyPlusButton = page.locator('div[role="dialog"] ul.grid.gap-4.p-4 div.flex > button:nth-child(3)');
        this.miniCartDefaultQtyPlusButton = page.locator('div.flex > button:nth-child(2)');
        this.miniCartQtyInputTextBox = page.locator('input.numberInputCounter');
        this.miniCartIcon = page.locator('img[alt="Mini Cart"]');
        this.miniCartProductSection = page.locator('div[role="dialog"] ul.grid.gap-4.p-4');
        this.miniCartRemoveButton = page.locator('button:has-text("Remove")');
        this.miniCartLimitedStockMessage = page.locator('section.mt-4.flex.gap-2');
        this.miniCartSubTotal = page.locator('strong.text-base.leading-\\[20\\.8px\\].text-black', { hasText: 'Subtotal' });
        this.miniCartViewCartButton = page.getByRole('button', { name: 'View Cart' });
        this.miniCartCheckoutButton = page.getByRole('button', { name: 'Check Out' });
        this.addtoCartButton = page.getByRole('button', { name: 'Add to Cart' });
        this.chooseOptions = page.getByText('Choose Options');

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
        await this.page.getByRole('button', { name: 'My Cart' }).waitFor({ state: 'visible' });
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
        // Get the count of buttons on the PLP page
        await this.addtoCartButtonPLP.first().waitFor({ state: 'visible' });
        const buttonCountPLP = await this.addtoCartButtonPLP.count();
        const pdpPage = new PDPPage(this.page);
        if (buttonCountPLP > 0) {
            // Select a random button index on the PLP page
            const randomIndexPLP = Math.floor(Math.random() * buttonCountPLP);

            // Click the randomly selected button on the PLP page
            await this.addtoCartButtonPLP.nth(randomIndexPLP).click();

            // Wait for the choose cart drawer to appear
            await this.chooseOptions.waitFor({ state: 'visible' });

            // Get the "Add to Cart" button in the cart drawer
            const addToCartButtonInDrawer = this.addtoCartButton;

            // Check if the "Add to Cart" button in the cart drawer is enabled
            if (await addToCartButtonInDrawer.isEnabled()) {
                // Click the "Add to Cart" button in the cart drawer
                await addToCartButtonInDrawer.click();
                await pdpPage.miniCartDrawer();
                console.log('Item added to cart successfully');
            } else {
                console.log('Add to Cart button in the cart drawer is disabled');
                 await pdpPage.clickOnPDPColorVariantButton();
                 await pdpPage.clickOnPDPSizeVariantButton();
                 await addToCartButtonInDrawer.click();
                 await pdpPage.miniCartDrawer();
            }
        } else {
            console.log('No buttons found on the PLP page');
        }
    }

    async navigateToPLP(categoryName) {
        await this.page.getByRole('link', { name: categoryName }).first().click();
    }

    async navigatePLPToPDP() {
        const plpProdImageCount = await this.plpProductImages.count();

        if (plpProdImageCount > 0) {
            // Select a random button index
            const randomIndex = Math.floor(Math.random() * plpProdImageCount);

            // Click the randomly selected button
            await this.plpProductImages.nth(randomIndex).click();
            await this.page.waitForURL('**/product/**');
            console.log(`Clicked product with index: ${randomIndex}`);
        } else {
            console.log('No buttons found');
        }

    }

    async removeMiniCartItemsMinusSign() {
        const productsContainer = await this.miniCartProductSection;
        // Get all product items within the container
        const productItems = await productsContainer.locator('li.rounded-sm.border.border-foggyGray.bg-white.p-4').first();

        const initialInputValue = await this.miniCartQtyInputTextBox.nth(1).inputValue();
        if (initialInputValue == 1) {
            await this.miniCartQtyMinusButton.first().click();
            //need to write code for the delete item message
            //await expect(productItems).toBeHidden();
        } else {
            await this.miniCartQtyInputTextBox.nth(1).fill('1');
            await this.miniCartQtyInputTextBox.nth(1).press('Tab');
            await this.miniCartQtyMinusButton.first().click();
            //need to write code for the delete item message
            //await expect(productItems).toBeHidden();
        }

    }

    async removeMiniCartItemsQtyTextBox() {
        const productsContainer = await this.miniCartProductSection;
        // Get all product items within the container
        const productItems = await productsContainer.locator('li.rounded-sm.border.border-foggyGray.bg-white.p-4').first();

        const initialInputValue = await this.miniCartQtyInputTextBox.nth(1).inputValue();
        if (initialInputValue == 1) {
            await this.miniCartQtyInputTextBox.nth(1).fill('0');
            await this.miniCartQtyInputTextBox.nth(1).press('Tab');
            //need to write code for the delete item message
            //await expect(productItems).toBeHidden();
        } else {
            await this.miniCartQtyInputTextBox.nth(1).fill('0');
            await this.miniCartQtyInputTextBox.nth(1).press('Tab');
            await this.miniCartQtyMinusButton.first().click();
            //need to write code for the delete item message
            //await expect(productItems).toBeHidden();
        }

    }

    async removeMiniCartItemsRemoveButton() {
        await this.miniCartRemoveButton.first().click();
    }

    async getProductStockCount() {
        //await this.page.waitForLoadState('networkidle');

        // Select the strong element containing the stock information
        const stockElement = await this.page.waitForSelector(productStockLeft);
        await stockElement.waitForElementState('visible');

        // Get the inner text of the stock element
        const stockText = await stockElement.innerText();
        console.log(stockText);  // Output: Only 2 left in Stock

        // Define a regular expression to extract the number
        const stockRegex = /\d+/;

        // Extract the number from the text
        const stockCount = stockText.match(stockRegex)[0];
        console.log(`Stock count: ${stockCount}`);  // Output: 2

        return stockCount;
    }

    async updateQtyForMinStock() {
        const productQtyLeft = this.getProductStockCount();
        await this.miniCartQtyInputTextBox.fill(productQtyLeft);
    }

    async miniCartUpdateInStockQty() {
        // Wait for the section to be visible
        await this.miniCartLimitedStockMessage.waitFor({ state: 'visible' });

        // Verify if the section is displayed
        const isSectionVisible = await this.miniCartLimitedStockMessage.isVisible();

        if (isSectionVisible) {
            // Extract the text content from the section
            const sectionText = await this.miniCartLimitedStockMessage.textContent();

            // Use a regular expression to extract the numeric part
            const numericPart = sectionText.match(/\d+/)[0];
            const numericValue = parseInt(numericPart);
            // Increment the numeric part by 1
            const incrementedValue = numericValue + 1;

            // Fill the input text box with the incremented value
            await this.miniCartQtyInputTextBox.nth(1).fill(incrementedValue.toString());
            await this.miniCartQtyInputTextBox.nth(1).press('Tab');
            const updateQty = await this.miniCartQtyInputTextBox.nth(1).inputValue();
            const numericUpdateQty = parseInt(updateQty);
            expect(numericUpdateQty).not.toBeGreaterThan(numericValue);
            console.log(`The numeric part extracted and incremented is: ${incrementedValue}`);
            console.log(`The numeric part extracted from the section is: ${numericPart}`);

        } else {
            console.log('The section is not displayed.');
        }
    }

    async miniCartQtyUpdateByTypeIn() {
        await this.miniCartQtyInputTextBox.nth(1).fill('99');
        await this.miniCartQtyInputTextBox.nth(1).press('Tab');
        await expect(this.miniCartQtyInputTextBox.nth(1)).toBeEditable({ timeout: 15000 });
        await this.miniCartLimitedStockMessage.first().waitFor({ state: 'visible' });
        const updateQty = await this.miniCartQtyInputTextBox.nth(1).inputValue();
        const numericUpdateQty = parseInt(updateQty);

        const isSectionVisible = await this.miniCartLimitedStockMessage.first().isVisible();
        if (isSectionVisible) {
            // Extract the text content from the section
            const sectionText = await this.miniCartLimitedStockMessage.first().textContent();
            const numericPart = sectionText.match(/\d+/)[0];
            const numericValue = parseInt(numericPart);
            expect(numericUpdateQty).toEqual(numericValue);
        } else {
            console.log('The section is not displayed.');
        }

    }

    async miniCartUpdateQtyMinusPlusSign() {
        const initialInputValue = await this.miniCartQtyInputTextBox.nth(1).inputValue();
        if (initialInputValue == 1) {
            await this.miniCartQtyPlusButton.first().click();
            await expect(this.miniCartQtyInputTextBox.nth(1)).toBeEditable({ timeout: 15000 });
            await expect(this.miniCartQtyInputTextBox.nth(1)).toHaveValue((parseInt(initialInputValue) + 1).toString());
        } else {
            // Click the minus button to decrease the quantity
            await this.miniCartQtyMinusButton.first().click();
            await expect(this.miniCartQtyInputTextBox.nth(1)).toBeEditable({ timeout: 15000 });
            await expect(this.miniCartQtyInputTextBox.nth(1)).toHaveValue((parseInt(initialInputValue) - 1).toString());
        }

    }

    async miniCartGetTotalItemsCount() {
        const miniCartItems = this.miniCartSubTotal.locator('xpath=following-sibling::p[1]');
        const miniCartItemsCount = await miniCartItems.textContent();
        return miniCartItemsCount;

    }

    async miniCartClickViewCartButton() {
        await this.miniCartViewCartButton.click();
        await this.page.waitForURL(/.*cart/);
    }

    async miniCartClickCheckoutButton() {
        await this.miniCartCheckoutButton.click();
        await this.page.waitForURL(/.*checkout/);
    }

    async navigateToCheckoutShipping() {
        // Locate the step1 radio button and ensure it is checked
        const step1Radio = this.page.locator('#step1');
        await expect(step1Radio).toBeChecked();

        // Locate the step-label and ensure it has the value 1
        const stepLabel = this.page.locator('label[for="step1"] .step-label');
        await expect(stepLabel).toHaveText('1');

        // Locate the associated label's text (Shipping) and ensure it is correct
        const labelText = this.page.locator('label[for="step1"] ~ h2');
        await expect(labelText).toHaveText('Shipping');

    }

    async cartDrawerSuccessMessage() {
        // Locate the paragraph element with the specified class
        const messageLocator = this.page.locator('p.text-forestGreen.font-medium.leading-6').nth(1);

        // Verify the paragraph contains the text "items added to cart"
        await expect(messageLocator).toContainText('item added to cart');
    }
}

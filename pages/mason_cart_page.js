import test, { expect } from 'playwright/test';

const cartProductNameLinkLocator = 'p.text-base.font-bold.leading-\\[20\\.8px\\].text-black';
const cartItemTotalPriceLocator = 'p:has-text("Total Price:") strong';
const cartAvailabilityLocator = 'p:has-text("Availability:") strong';
const cartEditButton = 'button:has-text("Edit")';
const cartRemoveButton = 'button:has-text("Remove")';
const cartSaveForLaterButton = 'button:has-text("Save for Later")';
const cartQtyInputLocator = 'input.numberInputCounter';
const cartEditItemDrawerHeader = 'strong:has-text("Edit Item")';
const cartEditItemDrawerCloseButton = 'section.z-10.flex button';
const pdp_colorvariant_button_locator = 'section.flex.flex-wrap.items-center.gap-5 button[aria-label="choose color button"]';
const pdp_sizevariant_button_locator = 'section.flex.flex-wrap.items-center.gap-2\\.5.pt-4 button[aria-label="choose color button"]';
const sizechart_button_text = 'Size Chart';


exports.CartPage = class CartPage {
    constructor(page) {
        this.page = page;
        this.cartShoppingCartHeaderText = page.locator('strong', { hasText: 'Shopping Cart' });
        this.cartTotalItems = this.cartShoppingCartHeaderText.locator('xpath=following-sibling::p[1]');
        this.cartOrderTotalText = page.locator('p.text-base.font-normal.leading-\\[22\\.4px\\]', { hasText: 'Order Total' });
        this.cartOrderTotal = this.cartOrderTotalText.locator('xpath=preceding-sibling::strong[1]');
        this.cartProductItems = page.locator('ul.grid.gap-3.p-3 li');
        this.productNameLocator = page.locator('h1.text-lg.font-bold.leading-7.lg\\:text-\\[22px\\]');
        this.cartProductNameLocator = page.locator('p.text-base.font-bold.leading-\\[20\\.8px\\].text-black');
        this.reviewsLocator = page.locator('section.flex.items-center.pt-2 p.pl-2\\.5.text-sm.font-normal.leading-5');
        this.linkLocator = page.locator('section.pt-18 a.underline-inset-2.text-sm.font-normal.leading-5.underline');
        this.sizechart_button = page.getByRole('button', { name: sizechart_button_text });
        this.priceSectionLocator = page.locator('section.flex.items-center.gap-x-1.pt-30');
        this.paymentSectionLocator = page.locator('section.flex.items-center.gap-1.pt-5');
        this.creditMessageLocator = page.locator('section.mt-4.py-5');
        this.qtyMinusButton = page.locator('div.flex > button:nth-child(1)');
        this.qtyPlusButton = page.locator('div.flex > button:nth-child(3)');
        this.defaultQtyPlusButton = page.locator('div.flex > button:nth-child(2)');
        this.qtyInputTextBox = page.locator('input.numberInputCounter');
        this.qtyText = page.getByText('Qty:');
        this.availabilityText = page.getByText('Availability:');
        this.pdp_colorvariant_button = page.locator(pdp_colorvariant_button_locator);
        this.pdp_sizevariant_button = page.locator(pdp_sizevariant_button_locator);
        this.updateCartButton = page.getByRole('button', { name: 'Update Cart' });
        this.cancelUpdateCartButton = page.getByRole('button', { name: 'Cancel' });
        this.removeCartButton = page.getByRole('button', { name: 'Remove' });
        this.cartSuccessMessage = page.locator('p.text-forestGreen.font-medium.leading-6');
        this.cartUndoButton = page.getByRole('button', { name: 'Undo' });

    }

    async cartGetTotalItemsCount() {
        // Extract the text content of the <p> tag
        const cartItemsCount = await this.cartTotalItems.textContent();
        return cartItemsCount;
    }

    async cartGetOrderTotal() {
        const orderTotalStrongText = await this.cartOrderTotal.textContent();
        // Expected order total value
        const dollarAmountPattern = /\$\d{1,3}(,\d{3})*(\.\d{2})?/;
        // Verify that the <strong> tag contains the expected order total
        expect(orderTotalStrongText).toBeTruthy();
        // Print the content to the console for verification
        console.log(`Content of the <strong> tag: ${orderTotalStrongText}`);
    }

    async cartLineItemProductDetails() {
        await this.cartProductItems.first().waitFor({ state: 'visible' });
        // Get the count of product items
        const productCount = await this.cartProductItems.count();
        expect(productCount).toBeGreaterThan(0); // Ensure there is at least one product item

        // Iterate through each product item
        for (let i = 0; i < productCount; i++) {
            const productItem = await this.cartProductItems.nth(i);

            // Verify the product image
            const productImage = productItem.locator('a[href*="/product/"] img').first();
            await expect(productImage).toBeVisible();

            // Verify the product name link and text
            const productNameLink = productItem.locator('a[href*="/product/"]').first();
            await expect(productNameLink).toBeVisible();
            const productNameText = await productNameLink.locator(cartProductNameLinkLocator).textContent();
            expect(productNameText).toBeTruthy();

            // Verify the item number
            const itemNumber = productItem.locator('p:has-text("Item  #:")').first();
            await expect(itemNumber).toBeVisible();
            const itemNumberText = await itemNumber.locator('span:nth-of-type(2)').textContent();
            expect(itemNumberText).toMatch(/\d+/); // Ensure it contains a number

            // Verify the total price
            const totalPrice = productItem.locator(cartItemTotalPriceLocator).first();
            await expect(totalPrice).toBeVisible();
            const totalPriceText = await totalPrice.textContent();
            expect(totalPriceText).toMatch(/\$\d{1,3}(,\d{3})*(\.\d{2})?/); // Match dollar amount format

            // Verify the individual price
            const individualPrice = productItem.locator('p.break-words:has-text("$")').nth(0);
            await expect(individualPrice).toBeVisible();
            const individualPriceText = await individualPrice.textContent();
            expect(individualPriceText).toMatch(/\$\d{1,3}(,\d{3})*(\.\d{2})?/); // Match dollar amount format

            // Verify the availability
            const availability = productItem.locator(cartAvailabilityLocator).first();
            await expect(availability).toBeVisible();
            const availabilityText = await availability.textContent();
            expect(availabilityText).toBeTruthy();

            //we will enable this code once we had a confirmation that cart page should display all items size, color etc
            // // Verify the flex flex-col gap-1 section p tag content
            // const flexColSection = productItem.locator('section.flex.flex-col.gap-1');
            // const flexColPTags = flexColSection.locator('p');
            // const flexColPCount = await flexColPTags.count();
            // expect(flexColPCount).toBeGreaterThan(0); // Ensure there is at least one <p> tag

            // for (let j = 0; j < flexColPCount; j++) {
            //     const pTag = await flexColPTags.nth(j);
            //     expect(pTag).toBeVisible(); // Ensure each <p> tag has text content
            //     // const pTagText = await flexColPTags.nth(j).textContent();
            //     // expect(pTagText).toBeTruthy(); // Ensure each <p> tag has text content
            // }

            // Verify the Edit button
            const editButton = productItem.locator(cartEditButton).first();
            await expect(editButton).toBeVisible();

            // Verify the Remove button
            const removeButton = productItem.locator(cartRemoveButton).first();
            await expect(removeButton).toBeVisible();

            // Verify the Save for Later button
            const saveForLaterButton = productItem.locator(cartSaveForLaterButton).first();
            await expect(saveForLaterButton).toBeVisible();
        }
    }

    async cartUpdateQtyPlusMinus() {
        // Locate the first product item
        const firstProductItem = this.cartProductItems.first();

        // Verify initial total price
        const totalPriceLocator = firstProductItem.locator(cartItemTotalPriceLocator).first();
        await expect(totalPriceLocator).toBeVisible();
        const initialTotalPriceText = await totalPriceLocator.textContent();
        const initialTotalPrice = parseFloat(initialTotalPriceText.replace(/[^0-9.-]+/g, ''));

        // Locate the quantity input and plus/minus buttons
        const quantityInput = firstProductItem.locator(cartQtyInputLocator).first();
        const plusButton = firstProductItem.locator('button').nth(1);
        const minusButton = firstProductItem.locator('button').nth(0);

        // Get initial quantity
        const initialQuantity = await quantityInput.inputValue();
        const initialQuantityNumber = parseInt(initialQuantity);

        // Click the plus button
        await plusButton.click();
        await expect(quantityInput).toBeEditable({ timeout: 20000 });

        // Verify the updated total price
        const updatedTotalPriceTextPlus = await totalPriceLocator.textContent();
        const updatedTotalPricePlus = parseFloat(updatedTotalPriceTextPlus.replace(/[^0-9.-]+/g, ''));
        const expectedTotalPricePlus = initialTotalPrice * (initialQuantityNumber + 1) / initialQuantityNumber;
        expect(updatedTotalPricePlus).toBeCloseTo(expectedTotalPricePlus, 2);

        // Click the minus button
        await minusButton.click();
        await expect(quantityInput).toBeEditable({ timeout: 20000 });

        // Verify the updated total price
        const updatedTotalPriceTextMinus = await totalPriceLocator.textContent();
        const updatedTotalPriceMinus = parseFloat(updatedTotalPriceTextMinus.replace(/[^0-9.-]+/g, ''));
        const expectedTotalPriceMinus = initialTotalPrice;
        expect(updatedTotalPriceMinus).toBeCloseTo(expectedTotalPriceMinus, 2);
    }

    async clickCartEditButton() {
        await this.page.locator(cartEditButton).first().click();
        await this.page.locator(cartEditItemDrawerHeader).waitFor({ state: 'visible' });

    }

    async clickCloseCartEditDrawer() {
        await this.page.locator(cartEditItemDrawerCloseButton).click();
    }

    async validateEditCartDrawerProductDetails() {
        // Locate the product name element and extract text content
        await this.productNameLocator.waitFor({ state: 'visible' });
        const productName = await this.productNameLocator.textContent();
        console.log(`Product Name: ${productName}`);

        // Try to locate the reviews element and extract text content
        await this.page.locator('section.flex.gap-x-0\\.5.pl-2\\.5').waitFor({ state: 'visible' });
        let reviewsText = '';
        let noReviewsPresent = false;
        try {
            // Check if "No Reviews" element is present
            if (await this.page.locator('section.flex.gap-x-0\\.5.pl-2\\.5 >> text=No Reviews').count() > 0) {
                noReviewsPresent = true;
                console.log('No reviews present for the product.');
            } else {
                // Check if review count element is present
                reviewsText = await this.page.locator('section.flex.gap-x-0\\.5.pl-2\\.5 >> text=(\\d+ Reviews)').textContent();
                console.log(`Reviews: ${reviewsText}`);
            }
        } catch (error) {
            console.log('No reviews element present for the product.');
        }

        // Perform validations
        expect(productName).toBeTruthy(); // Ensure product name is not empty
        if (!noReviewsPresent && reviewsText) {
            expect(reviewsText).toMatch(/\(\d+ Reviews\)/); // Ensure reviews text matches the expected pattern
        }

        const colorButtons = this.pdp_colorvariant_button;
        // Verify that the color buttons are visible
        for (let i = 0; i < await colorButtons.count(); i++) {
            const colorButton = colorButtons.nth(i);
            await expect(colorButton).toBeVisible();
            // const isVisible = await button.isVisible();
            // console.log(`Button ${i + 1} is visible: ${isVisible}`);
        }

        const sizeButtons = this.pdp_sizevariant_button;
        // Verify that the color buttons are visible
        for (let i = 0; i < await sizeButtons.count(); i++) {
            const sizeButton = sizeButtons.nth(i);
            await expect(sizeButton).toBeVisible();
            // const isVisible = await button.isVisible();
            // console.log(`Button ${i + 1} is visible: ${isVisible}`);
        }

        await expect(this.updateCartButton).toBeVisible();
        await expect(this.cancelUpdateCartButton).toBeVisible();

    }

    async clickRemoveCartButton() {
        await this.removeCartButton.first().click();

    }

    async getCartFirstItemProductName() {
        await this.cartProductNameLocator.first().waitFor({ state: 'visible' });
        const productName = await this.cartProductNameLocator.first().textContent();
        return productName;
    }

    async cartRemoveSuccessMessage(removedMessage) {
        await this.cartSuccessMessage.nth(1).waitFor({ state: 'visible' });
        await expect(this.cartSuccessMessage.nth(1)).toContainText(removedMessage);
        await expect(this.cartUndoButton).toBeVisible();
    }

    async clickCartUndoButton() {
        await this.cartUndoButton.click();
        await this.page.waitForTimeout(10000);
        
    }

    async validateUndoCartItems(undoProductCount) {
        await this.cartTotalItems.waitFor({state:'visible'});
        expect(await this.cartTotalItems.textContent()).toBe(undoProductCount);
    }
}
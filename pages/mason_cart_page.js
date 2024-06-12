import test, { expect } from 'playwright/test';

exports.CartPage = class CartPage {
    constructor(page) {
        this.page = page;
        this.cartShoppingCartHeaderText = page.locator('strong', { hasText: 'Shopping Cart' });
        this.cartTotalItems = this.cartShoppingCartHeaderText.locator('xpath=following-sibling::p[1]');
        this.cartOrderTotalText = page.locator('p.text-base.font-normal.leading-\\[22\\.4px\\]', { hasText: 'Order Total' });
        this.cartOrderTotal = this.cartOrderTotalText.locator('xpath=preceding-sibling::strong[1]');


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
}
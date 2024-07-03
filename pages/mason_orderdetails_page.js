import test, { expect } from 'playwright/test';

const orderStatus_ReturnedText = 'Returned';
const orderStatus_CancenceledText = 'Canceled';
const orderStatus_DeliveredText = 'Delivered';
const orderStatus_ShippedText = 'Shipped on';
const orderStatus_PendingShipmentText = 'Pending Shipment';
const order_Section = 'section.mb-7.border';
const product_Section = 'section.mt-4.flex.items-center';
const order_SummaryText = 'Order Summary';
const cancelOrderModal_Text = 'Are you sure you want to cancel your order?';
const cancelOrderModal_HeadingText = 'Cancel order';
const cancelItemModal_HeadingText = 'Cancel item';
const cancelItemModal_Text = 'Are you sure you want to cancel this item?';
const orderDetailsAwatingShipmentSection = 'Awaiting ShipmentPending Shipment';
const orderDetails_CanceledItem_SuccessMessage = 'Your Item has been canceled.';
const orderDetailsOrderSummarySubTotal = /^Subtotal\s*\(\d+\s*items\):\s*$/;
const orderDetailsOrderSummaryShipping = 'Shipping:';
const orderDetailsOrderSummaryEstSurcharge = 'Shipping Surcharge:';
const orderDetailsOrderSummarySalesTax = 'Sales Tax:';
const orderDetailsOrderSummaryOrderTotal = 'Order Total:';
const tooltipButton = 'button[aria-label="tooltip"]';
const orderDetailsShippingSectionText = 'Shipping';
const orderDetailsShippingSectionAddressText = 'Shipping Address';
const orderDetailsShippingSectionShippingMethodText = 'Shipping Method';
const name = /^[A-Za-z\s]+$/;
const addressLine1 = /^\d+\s[A-Za-z\s]+$/;
const cityStateZip = /^[A-Za-z\s]+,\s[A-Z]{2},\s\d{5}-\d{4}$/;
const phone = /^\(\d{3}\)\s\d{3}-\d{4}$/;
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const orderDetailsShippingAddress = 'section.ml-3.pt-9:has-text("Shipping Address")';
const orderDetailsBillingAddress = 'section.mb-9.pr-22:has-text("Billing Address")';
const orderDetailsBillingAddressContactInfo = 'section.mb-9.pr-22:has-text("Contact Info")';
const orderDetailsAccountNumber = 'section.mb-9.mt-8.lg\\:mb-6.lg\\:mt-0:has-text("Payment")';
const orderDetailsShippedSection = 'section.border-radius-\\[6px\\].mt-6:has-text("Shipped")';
const trackShipmentText = 'section.mb-\\[30px\\]:has-text("Track Shipment")';

exports.OrderDetailsPage = class OrderDetailsPage {

    constructor(page) {
        this.page = page;
        this.orderDetailsLink = page.locator('section.border-b a:has-text("View Order Details")');
        this.orderDetailsCancelOrderButton = page.getByRole('button', { name: 'Cancel order' });
        this.orderDetailsCancelItemButton = page.getByRole('button', { name: 'Cancel item' });
        this.orderDetailsCancelOrderModalCancelButton = page.getByRole('button', { name: 'Yes, Cancel order' });
        this.orderDetailsCancelOrderModalNoGoBackButton = page.getByRole('button', { name: 'No, Go Back to Order' });
        this.orderDetailsCancelItemButton = page.getByRole('button', { name: 'Cancel item' });
        this.orderDetailsCancelOrderModalCancelItemButton = page.getByRole('button', { name: 'Yes, Cancel item' });
        this.orderDetailsCancelOrderModalCloseIcon = page.locator('section').filter({ hasText: 'Cancel orderAre you sure you' }).getByRole('button');
        this.orderDetailsCancelItemModalCloseIcon = page.locator('section').filter({ hasText: 'Cancel itemAre you sure you' }).getByRole('button');
        this.orderDetailsCanceledItemHeading = page.getByRole('heading', { name: 'Canceled', exact: true });
        this.orderDetailsCanceledItemOnHeading = page.getByRole('heading', { name: 'Canceled on' });

    }

    async validateCancelOrderInOrderDetails() {
        // Step 1: Locate all order sections on the page
        await this.page.locator(order_Section).first().waitFor({ state: 'visible' });
        const orderSections = await this.page.locator(order_Section);

        // Step 2: Loop through each order section
        const totalOrders = await orderSections.count();
        for (let i = 0; i < totalOrders; i++) {
            const orderSection = orderSections.nth(i);

            // Step 3: Locate the product sections within the current order section
            const productSections = orderSection.locator(product_Section);
            const totalProductSectionsCount = await productSections.count();

            // Step 4: Locate all <p> tags with the text "Pending Shipment" within the product sections
            const pendingShipmentTags = orderSection.locator(`section.truncate > p:has-text("${orderStatus_PendingShipmentText}")`);
            const totalTagsCount = await pendingShipmentTags.count();

            // Step 5: Verify if the count of <p> tags matches the count of product sections
            if (totalTagsCount === totalProductSectionsCount) {
                let allPendingShipment = true;
                for (let j = 0; j < totalTagsCount; j++) {
                    const textContent = await pendingShipmentTags.nth(j).textContent();
                    if (textContent.trim() !== orderStatus_PendingShipmentText) {
                        allPendingShipment = false;
                        break;
                    }
                }

                // If all <p> tags contain "Pending Shipment", click the "View Order Details" link within the current order section
                if (allPendingShipment) {
                    const orderDetailsLink = orderSection.locator('a:has-text("View Order Details")');
                    if (await orderDetailsLink.isVisible()) {
                        await orderDetailsLink.click();
                        console.log('Clicked on the "View Order Details" link for order', await orderSection.locator('h2').textContent());
                        await this.orderDetailsCancelOrderButton.waitFor({ state: 'visible' });
                        await expect(this.orderDetailsCancelOrderButton).toBeVisible();
                        break;  // Exit the loop after clicking the first valid order link
                    } else {
                        console.log('"View Order Details" link is not visible for order', await orderSection.locator('h2').textContent());
                    }
                } else {
                    console.log('Not all products have "Pending Shipment" status for order', await orderSection.locator('h2').textContent());

                }
            } else {
                console.log('The number of "Pending Shipment" <p> tags does not match the number of product sections for order', await orderSection.locator('h2').textContent());
            }
        }
    }

    async validateNoCancelOrderInOrderDetails() {
        // Step 1: Locate all order sections on the page
        await this.page.locator(order_Section).first().waitFor({ state: 'visible' });
        const orderSections = await this.page.locator(order_Section);

        // Step 2: Loop through each order section
        const totalOrders = await orderSections.count();
        for (let i = 0; i < totalOrders; i++) {
            const orderSection = orderSections.nth(i);

            // Step 3: Locate the product sections within the current order section
            const productSections = orderSection.locator(product_Section);
            const totalProductSectionsCount = await productSections.count();

            // Step 4: Locate all <p> tags with the text "Pending Shipment" within the product sections
            const pendingShipmentTags = orderSection.locator(`section.truncate > p:has-text("${orderStatus_PendingShipmentText}")`);
            const totalTagsCount = await pendingShipmentTags.count();

            // Step 5: Verify if the count of <p> tags matches the count of product sections
            if (totalTagsCount === totalProductSectionsCount) {
                let allPendingShipment = true;
                for (let j = 0; j < totalTagsCount; j++) {
                    const textContent = await pendingShipmentTags.nth(j).textContent();
                    if (textContent.trim() !== orderStatus_PendingShipmentText) {
                        allPendingShipment = false;
                        break;
                    }
                }

                // If all <p> tags contain "Pending Shipment", click the "View Order Details" link within the current order section
                if (!allPendingShipment) {
                    const orderDetailsLink = orderSection.locator('a:has-text("View Order Details")');
                    if (await orderDetailsLink.isVisible()) {
                        await orderDetailsLink.click();
                        console.log('Clicked on the "View Order Details" link for order', await orderSection.locator('h2').textContent());
                        //await this.orderDetailsCancelOrderButton.waitFor({ state: 'visible' });
                        await expect(this.orderDetailsCancelOrderButton).toBeHidden();
                        break;
                    } else {
                        console.log('"View Order Details" link is not visible for order', await orderSection.locator('h2').textContent());
                    }
                } else {
                    console.log('Not all products have "Pending Shipment" status for order', await orderSection.locator('h2').textContent());

                }
            } else {
                console.log('The number of "Pending Shipment" <p> tags does not match the number of product sections for order', await orderSection.locator('h2').textContent());
                this.orderDetailsLink.nth(i).click();
                await expect(this.page).toHaveURL(/.*\/account\/orders\/orderdetails\/\?orderId=\d+&zipCode=\d+$/);
                await this.page.getByText(order_SummaryText).waitFor({ state: 'visible' });
                await expect(this.orderDetailsCancelOrderButton).toBeHidden();
                break;

            }
        }

    }

    async clickCancelOrderButton() {
        await this.orderDetailsCancelOrderButton.click();
    }

    async clickCancelItemButton() {
        await this.orderDetailsCancelItemButton.first().click();
    }

    async clickCloseCancelOrderButton() {
        await this.orderDetailsCancelOrderModalCloseIcon.click();
        await expect(this.page.getByText(order_SummaryText)).toBeVisible();
    }

    async clickCloseCancelItemModalButton() {
        await this.orderDetailsCancelItemModalCloseIcon.click();
        await expect(this.page.getByText(order_SummaryText)).toBeVisible();
    }

    async clickCancelOrderCancelItemButton() {
        await this.orderDetailsCancelOrderModalCancelItemButton.click();
    }

    async clickNoGoBackOrderButton() {
        await this.orderDetailsCancelOrderModalNoGoBackButton.click();
        await expect(this.page.getByText(order_SummaryText)).toBeVisible();
    }

    async validateCancelOrderModal() {
        await this.page.getByRole('heading', { name: cancelOrderModal_HeadingText }).waitFor({ state: 'visible' });
        await expect(this.page.getByRole('heading', { name: cancelOrderModal_HeadingText })).toBeVisible();
        await expect(this.page.getByText(cancelOrderModal_Text)).toBeVisible();
        await expect(this.orderDetailsCancelOrderModalCancelButton).toBeVisible();
        await expect(this.orderDetailsCancelOrderModalNoGoBackButton).toBeVisible();
        await expect(this.orderDetailsCancelOrderModalCloseIcon).toBeVisible();
    }

    async validateCancelItemModal() {
        await this.page.getByRole('heading', { name: cancelItemModal_HeadingText }).waitFor({ state: 'visible' });
        await expect(this.page.getByRole('heading', { name: cancelItemModal_HeadingText })).toBeVisible();
        await expect(this.page.getByText(cancelItemModal_Text)).toBeVisible();
        await expect(this.orderDetailsCancelOrderModalCancelItemButton).toBeVisible();
        await expect(this.orderDetailsCancelOrderModalNoGoBackButton).toBeVisible();
        await expect(this.orderDetailsCancelItemModalCloseIcon).toBeVisible();
    }

    async validateCancelItemButton() {
        // Step 1: Locate the "Awaiting Shipment" section
        const awaitingShipmentSection = this.page.getByText(orderDetailsAwatingShipmentSection).nth(1);

        // Step 2: Wait for the section to be visible
        await awaitingShipmentSection.waitFor({ state: 'visible' });

        // Step 3: Locate all product sections within the "Awaiting Shipment" section
        const productSections = awaitingShipmentSection.locator('section.border-radius-\\[6px\\].mb-\\[31px\\]');
        const totalProductSectionsCount = await productSections.count();

        // Step 4: Loop through each product section to verify the "Cancel item" button
        for (let i = 0; i < totalProductSectionsCount; i++) {
            const productSection = productSections.nth(i);
            const cancelItemButton = productSection.locator('button:has-text("Cancel item")');

            // Check if the "Cancel item" button is visible
            if (await cancelItemButton.isVisible()) {
                console.log('The "Cancel item" button is displayed for product', await productSection.locator('p.font-bold a').textContent());
            } else {
                console.log('The "Cancel item" button is NOT displayed for product', await productSection.locator('p.font-bold a').textContent());
            }

            // Assert the visibility of the cancel button
            await expect(cancelItemButton).toBeVisible();
        }
    }

    async validateCanceledItem() {
        // Step 1: Locate the "Awaiting Shipment" section
        const awaitingShipmentSection = this.page.getByText(orderDetailsAwatingShipmentSection).nth(1);

        // Step 2: Wait for the section to be visible
        await awaitingShipmentSection.waitFor({ state: 'visible' });

        // Step 3: Locate all product sections within the "Awaiting Shipment" section
        const productSections = awaitingShipmentSection.locator('section.border-radius-\\[6px\\].mb-\\[31px\\]');
        const totalProductSectionsCount = await productSections.count();

        // Step 4: Loop through each product section to verify the "Cancel item" button
        for (let i = 0; i < totalProductSectionsCount; i++) {
            const productSection = productSections.nth(i);
            const cancelItemButton = productSection.locator('button:has-text("Cancel item")');

            // Check if the "Cancel item" button is visible
            if (await cancelItemButton.isVisible()) {
                const productName = await productSection.locator('a').first().textContent();
                await cancelItemButton.click();
                await this.clickCancelOrderCancelItemButton();
                await expect(this.page.getByText(`${productName} was successfully canceled in your order.`)).toBeVisible();
                console.log('The "Cancel item" button is displayed for product', await productSection.locator('p.font-bold a').textContent());
            } else {
                console.log('The "Cancel item" button is NOT displayed for product', await productSection.locator('p.font-bold a').textContent());
            }

            // Assert the visibility of the canceled item
            await expect(this.orderDetailsCanceledItemHeading).toBeVisible();
        }

    }

    async getOrderNumberInOrderDetails() {
        const orderNumber = await this.page.locator('h2.text-2xl.font-bold.text-black').textContent();
        return orderNumber;
    }

    async validatedCanceledOrder(orderNumber) {
        await this.orderDetailsCancelOrderModalCancelButton.click();
        await expect(this.page.getByText(`${orderNumber} was successfully canceled.`)).toBeVisible();
        await expect(this.orderDetailsCanceledItemHeading).toBeVisible();
    }

    async clickViewOrderDetailsLink() {
        await this.orderDetailsLink.first().click();
        await this.page.getByText(order_SummaryText).waitFor({ state: 'visible' });
        await expect(this.page.getByText(order_SummaryText)).toBeVisible();
    }

    async validateOrderDetailsOrderSummary() {
        // Define expected labels
        const expectedLabels = [
            orderDetailsOrderSummarySubTotal,
            orderDetailsOrderSummaryShipping,
            orderDetailsOrderSummaryEstSurcharge,
            orderDetailsOrderSummarySalesTax,
            orderDetailsOrderSummaryOrderTotal
        ];

        // Check visibility for each label
        for (const label of expectedLabels) {
            await expect(this.page.getByText(label)).toBeVisible();
        }

        // Extract and validate text content
        const subTotalText = await this.page.getByText(orderDetailsOrderSummarySubTotal).locator('..').locator('p:last-child').textContent();
        const estShippingText = await this.page.getByText(orderDetailsOrderSummaryShipping).locator('..').locator('..').locator('p:last-child').textContent();
        const shippingTooltipButton = this.page.getByText(orderDetailsOrderSummaryShipping).locator('..').locator(tooltipButton);
        await expect(shippingTooltipButton).toBeVisible();
        const estSurchargeText = await this.page.getByText(orderDetailsOrderSummaryEstSurcharge).locator('..').locator('..').locator('p:last-child').textContent();
        const estSalesTaxText = await this.page.getByText(orderDetailsOrderSummarySalesTax).locator('..').locator('..').locator('p:last-child').textContent();
        const salesTaxTooltipButton = this.page.getByText(orderDetailsOrderSummarySalesTax).locator('..').locator(tooltipButton);
        await expect(salesTaxTooltipButton).toBeVisible();
        const orderTotalText = await this.page.getByText(orderDetailsOrderSummaryOrderTotal).locator('..').locator('p:last-child').textContent();

        // Match each value against the currency format regex
        expect(subTotalText.trim()).toMatch(/^\$\d+(\.\d{2})?$/);
        expect(estShippingText.trim()).toMatch(/^\$\d+(\.\d{2})?$/);
        expect(estSurchargeText.trim()).toMatch(/^\$\d+(\.\d{2})?$/);
        expect(estSalesTaxText.trim()).toMatch(/^\$\d+(\.\d{2})?$/);
        expect(orderTotalText.trim()).toMatch(/^\$\d+(\.\d{2})?$/);

    }

    async validateOrderDetailsShippingDetails() {
        await expect(this.page.getByText(orderDetailsShippingSectionText, { exact: true })).toBeVisible();
        await expect(this.page.getByText(orderDetailsShippingSectionAddressText, { exact: true })).toBeVisible();
        await expect(this.page.getByText(orderDetailsShippingSectionShippingMethodText, { exact: true })).toBeVisible();
        const shippingAddressSection = this.page.locator(orderDetailsShippingAddress);

        const shippingAddressText = await shippingAddressSection.locator('p').nth(1).textContent();
        expect(shippingAddressText.trim()).toBeTruthy();

        const nameText = await shippingAddressSection.locator('p').nth(2).textContent();
        expect(nameText.trim()).toBeTruthy();

        const addressLine1Text = await shippingAddressSection.locator('p').nth(3).textContent();
        expect(addressLine1Text.trim()).toBeTruthy();

        const cityStateZipText = await shippingAddressSection.locator('p').nth(4).textContent();
        expect(cityStateZipText.trim()).toBeTruthy();

        const phoneText = await shippingAddressSection.locator('p').nth(5).textContent();
        expect(phoneText.trim()).toBeTruthy();

        const shippingMethodText = await shippingAddressSection.locator('p').nth(6).textContent();
        expect(shippingMethodText.trim()).toBeTruthy();

        const shippingMethod = await shippingAddressSection.locator('p').nth(7).textContent();
        expect(shippingMethod.trim()).toBeTruthy();
    }

    async validateOrderDetailsBillingAddress() {
        // Locate the billing address section
        const billingAddressSection = this.page.locator(orderDetailsBillingAddress);

        // Extract and validate each p tag content within the billing address section
        const billingAddressText = await billingAddressSection.locator('p').nth(0).textContent();
        expect(billingAddressText.trim()).toBeTruthy();

        const nameText = await billingAddressSection.locator('p').nth(1).textContent();
        expect(nameText.trim()).toBeTruthy();

        const addressLine1Text = await billingAddressSection.locator('p').nth(2).textContent();
        expect(addressLine1Text.trim()).toBeTruthy();

        const cityStateZipText = await billingAddressSection.locator('p').nth(3).textContent();
        expect(cityStateZipText.trim()).toBeTruthy();

        const phoneText = await billingAddressSection.locator('p').nth(4).textContent();
        expect(phoneText.trim()).toBeTruthy();

        // Extract and validate the email address
        const contactInfoText = await billingAddressSection.locator('p').nth(5).textContent();
        expect(contactInfoText.trim()).toBeTruthy();

        const emailText = await billingAddressSection.locator('p').nth(6).textContent();
        expect(emailText.trim()).toBeTruthy();
    }

    async validateOrderDetailsPaymentSection() {
        const accountNumberSection = this.page.locator(orderDetailsAccountNumber);
        const paymentMethodText = await accountNumberSection.locator('p').nth(1).textContent();
        expect(paymentMethodText.trim()).toBeTruthy();
        //const paymentMethodsvg = this.page.locator('section.ml-3.lg\\:ml-0 section section p.mb-6 svg');
        const paymentMethodsvg = await accountNumberSection.locator('section').locator('section').locator('p.mb-6 svg');
        expect(paymentMethodsvg).toBeVisible();
        const accountNumberText = await accountNumberSection.locator('p').nth(3).textContent();
        expect(accountNumberText.trim()).toBeTruthy();
        const accountNumberDetails = await accountNumberSection.locator('p').nth(4).textContent();
        expect(accountNumberDetails.trim()).toBeTruthy();
    }

    async validateShippedOrderInOrderDetails() {
        // Step 1: Locate all order sections on the page
        await this.page.locator(order_Section).first().waitFor({ state: 'visible' });
    
        // Step 2: Loop through each order section
        const orderSections = await this.page.locator(order_Section);
        const totalOrders = await orderSections.count();
    
        for (let i = 0; i < totalOrders; i++) {
            const orderSection = orderSections.nth(i);
    
            // Step 3: Locate the product sections and "Shipped on" <p> tags within the current order section
            const productSections = orderSection.locator(product_Section);
            const totalProductSectionsCount = await productSections.count();
            const shippedTags = orderSection.locator(`section.truncate > p:has-text("${orderStatus_ShippedText}")`);
            const totalTagsCount = await shippedTags.count();
    
            // Step 4: Verify if all products have "Shipped on" status
            if (totalTagsCount > 0) {
                const orderDetailsLink = orderSection.locator('a:has-text("View Order Details")');
    
                if (await orderDetailsLink.isVisible()) {
                    await orderDetailsLink.click();
                    console.log('Clicked on the "View Order Details" link for order', await orderSection.locator('h2').textContent());
                    const shippedSection = this.page.locator(orderDetailsShippedSection);
                    const shippedText = await shippedSection.locator('h1').nth(0).textContent();
                    expect(shippedText.trim()).toBeTruthy();
                    const shippedOnText = await shippedSection.locator('h1').nth(1).textContent();
                    expect(shippedOnText.trim()).toBeTruthy();
                    const trackShipment = await this.page.locator(trackShipmentText).nth(0).textContent();
                    expect(trackShipment.trim()).toBeTruthy();
                    const trackShipmentNumber = await this.page.locator(trackShipmentText).locator('a').nth(0).textContent();
                    expect(trackShipmentNumber.trim()).toBeTruthy();
                    break;  // Exit the loop after clicking the first valid order link
                } else {
                    console.log('"View Order Details" link is not visible for order', await orderSection.locator('h2').textContent());
                }
            } else {
                console.log('Not all products have "Shipped" status or count mismatch for order', await orderSection.locator('h2').textContent());
            }
        }
    }

    async clickOnTrackShipmentNumber(){
        await this.page.locator('section.mb-\\[30px\\] a').nth(1).click();
        await this.page.waitForURL('**/fedextrack/**');
    }
}
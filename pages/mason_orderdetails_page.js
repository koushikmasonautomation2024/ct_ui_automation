import test, { expect } from 'playwright/test';

const orderStatus_ReturnedText = 'Returned';
const orderStatus_CancenceledText = 'Canceled';
const orderStatus_DeliveredText = 'Delivered';
const orderStatus_ShippedText = 'Shipped';
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

    async getOrderNumberInOrderDetails(){
        const orderNumber = await this.page.locator('text-2xl font-bold text-black').textContent();
        return orderNumber;
    }

    async validatedCanceledOrder(orderNumber){
        await this.orderDetailsCancelOrderModalCancelButton.click();
        await expect(this.page.getByText(`${orderNumber} was successfully canceled.` )).toBeVisible();
        await expect(this.orderDetailsCanceledItemHeading).toBeVisible();
    }
}
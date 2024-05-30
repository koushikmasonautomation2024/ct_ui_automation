import { count } from 'console';
import test, { expect } from 'playwright/test';
const myaccountpage_locator =JSON.parse(JSON.stringify(require('../object_repositories/mason_myaccount_page_repo.json')));
const accountpage_data =JSON.parse(JSON.stringify(require('../test_data/mason_sb_myaccount_page_data.json')));

exports.MyAccountWishListPage = class MyAccountWishListPage{
    constructor(page){
        this.page=page;
        this.myaccount_savedcc_addccdebitcard_button=page.getByRole('button', { name: myaccountpage_locator.myaccount_savedcc_addccdebitcard_button });
        this.noWishListMessage=page.getByText(accountpage_data.myaccount_no_wishlist_message);
        this.wishlist_remove_success=this.page.getByText(accountpage_data.wishlist_remove_success_message);
    }

    
    
    async validateWishListPage(){
        await expect(this.page).toHaveURL(/.*wishlist/);
    }

    async noWishListMessageForNewUser(){
        await expect(this.noWishListMessage).toBeVisible();
    }

    async validateWishlistBreadcrumb(){
        await expect(this.page.getByText(myaccountpage_locator.wishlist_breadcrumb)).toBeVisible();    
    }

    async validateItemCountIsDisplayed(){
        // Check that the 'Wish ListX Items' text is visible
        const wishListElement = await this.page.getByText(/Wish List\d+ Items/);
        await expect(wishListElement).toBeVisible();

        // Extract the product count from the text
        const wishListText = await wishListElement.innerText();
        const productCountMatch = wishListText.match(/Wish List(\d+) Items/);
        const productCount = productCountMatch ? productCountMatch[1] + ' Items' : '';
        
        // Verify the product count is shown in the page title
        const pageTitle = await this.page.title();
        console.log(pageTitle);
        // Assert that the page title contains the product count
        expect(pageTitle).toContain(productCount);

        // Get text content of h1 and strong elements
        const wishlistText = await this.page.$eval('section.flex h1', element => element.textContent.trim());
        const itemCountInTitle = await this.page.$eval('section.flex strong', element => element.textContent.trim());

        // Check if both h1 and strong contain the pattern
        const pattern = /Wish List (\d+) Items/;
        const isMatching = pattern.test(wishlistText) && pattern.test(itemCountInTitle);

        // Define the regular expression to extract the number from "Items"
        const regex = /(\d+) Items/;

        // Extract the number of items from the strong text
        const match = regex.exec(itemCountInTitle);
        const itemCount = match ? match[1] : null;

        const itemCountNum = parseInt(itemCount, 10);
        console.log(itemCountNum);
        
    }

    async validateTheWishListedItem(){
        
        // Select all <li> elements containing product images
        const productItems = await this.page.$$(myaccountpage_locator.wishlist_items);
        const itemCount = productItems.length;
        console.log(`Total product items: ${itemCount}`);

        // Iterate over each product item
        for (const item of productItems) {
            // Find the image within the current <li>
            const img = await item.$('img');
            expect(img).not.toBeNull();

            // Find the wishlist icon within the current <li>
            const wishlistIcon = await item.$(myaccountpage_locator.wishlist_icon);
            expect(wishlistIcon).not.toBeNull();

            // Verify Product label
            // const label = await item.$('h6.font-medium.leading-5');
            // expect(label).not.toBeNull();

            // Verify Brand/Product name
            const productName = await item.$(myaccountpage_locator.wishlist_productname);
            expect(productName).not.toBeNull();

            // Verify Pricing
            const pricing = await item.$(myaccountpage_locator.wishlist_pricing);
            expect(pricing).not.toBeNull();

            // Verify Product reviews
            const reviews = await item.$(myaccountpage_locator.wishlist_productReview);
            expect(reviews).not.toBeNull();

            let anyOutOfStock = false;

        // Iterate through each product and check if it is out of stock
        for (let i = 0; i < itemCount; i++) {
            const product = productItems[i];
            const outOfStockButton = await product.$('button:has-text("'+myaccountpage_locator.wishlist_out_of_stock+'")');

            if (outOfStockButton) {
            const isDisabled = await outOfStockButton.isDisabled();
            expect(isDisabled).toBe(true);
            //console.log("Out of stock is disabled")
            }
            else{
                const addToCartButton = await product.$('button:has-text("'+myaccountpage_locator.wishlist_add_to_cart+'")');
                const isDisabled = await addToCartButton.isDisabled();
                expect(isDisabled).toBe(false);
                //console.log("Add to cart is enabled")
            }

        }

    }
    }


    async validateAlignmentInWishList(){
        const productItems = await this.page.$$(myaccountpage_locator.wishlist_items);
        const itemCount = productItems.length;
        console.log(`Total product items: ${itemCount}`);

        // Iterate over each product item
        for (const item of productItems) {
        const pricing = await item.$(myaccountpage_locator.wishlist_pricing);
        const pricingRect = await pricing.boundingBox();
        //const pricingBottom = pricingRect.bottom;

        const productName = await item.$(myaccountpage_locator.wishlist_productname);
        const productInfoRect = await productName.boundingBox();
        //const productInfoBottom = productInfoRect.bottom;

        const reviews = await item.$(myaccountpage_locator.wishlist_productReview);
        const reviewInfoRect = await reviews.boundingBox();
        //const reviewInfoBottom = reviewInfoRect.bottom;

        // console.log('Pricing Rect:', pricingRect);
        // console.log('Product Info Rect:', productInfoRect);
        
        // Verify pricing is below product name and above reviews
        expect(pricingRect.y).toBeGreaterThan(productInfoRect.y);
        expect(pricingRect.y).toBeLessThan(reviewInfoRect.y);

        // Verify pricing is in the same horizontal row for all products
        expect(pricingRect.x).toBe(productInfoRect.x);

 

        //expect(pricingBottom).toBeLessThanOrEqual(productInfoBottom, 'Pricing should appear at the bottom of product information');
        //expect(reviewInfoBottom).toBeLessThanOrEqual(pricingBottom, 'Pricing should appear at the top of product review');

    }
}

async validatePricingFormat(){
    
    await this.page.waitForLoadState('networkidle');
    const productItems = await this.page.$$(myaccountpage_locator.wishlist_items);
        const itemCount = productItems.length;
        console.log(`Total product items: ${itemCount}`);

        // Iterate over each product item
            for (const item of productItems) {
            const pricing = await item.waitForSelector(myaccountpage_locator.wishlist_pricing);
            await pricing.waitForElementState('visible');

            

            const regularPriceText = await pricing.innerText();
            console.log(regularPriceText);

        // Define a regular expression to match dollar and cent format (e.g., $xx.xx)
            const priceRegex = /^\$\d+\.\d{2}$/;

        // Verify regular price format
            expect(regularPriceText).toMatch(priceRegex);

}
}

async validateHeartIconIsFilled(){
    const productItems = await this.page.$$(myaccountpage_locator.wishlist_items);
        const itemCount = productItems.length;
        console.log(`Total product items: ${itemCount}`);

        for (let i = 0; i < itemCount; i++) {
            const productItem = productItems[i];
            const wishlistIcon = await productItem.$(myaccountpage_locator.wishlist_icon);
            expect(wishlistIcon).not.toBeNull();
    
            const pathLocator = this.page.locator(myaccountpage_locator.wishlist_items)
                                        .nth(i)
                                        .locator(myaccountpage_locator.wishlist_icon)
                                        .locator('svg path');
            
            await pathLocator.waitFor({ state: 'visible' });
    
            const fillAttribute = await pathLocator.getAttribute('fill');
            console.log(`Path fill attribute for product ${i}: ${fillAttribute}`);
            expect(fillAttribute).toBe('#002C4E');
        }
}

async validateRemoveItemFromWishList(){
        
    const productItems = await this.page.$$(myaccountpage_locator.wishlist_items);
    const initialItemCount = productItems.length;
    const initialPageTitle = await this.page.title();
    console.log(initialPageTitle);

    if (initialItemCount === 0) {
        console.log('Wishlist is empty. Skipping removal validation.');
        return; // Exit the function early if wishlist is empty
    }

    // Get a random index to remove a product
    const randomIndex = Math.floor(Math.random() * productItems.length);
    const itemToRemove = productItems[randomIndex];

    // Find the wishlist icon within the item to be removed
    const wishlistIconToRemove = await itemToRemove.$(myaccountpage_locator.wishlist_icon);

    // Click on the wishlist icon to remove the item
    await wishlistIconToRemove.click();

    // Wait for the success message to appear
    await expect(this.page.getByText(accountpage_data.wishlist_remove_partMessage)).toBeVisible();
    const successMessage = await this.page.getByText(accountpage_data.wishlist_remove_partMessage);
   // await successMessage.waitForElementState('visible');
    const successMessageinnerText = await successMessage.textContent();
    // const successMessageSelector = myaccountpage_locator.wishlist_remove_success;
    // const successMessageElement = await this.page.waitForSelector(successMessageSelector);
    // // Extract the product name from the success message
    // const successMessageText = await successMessageElement.innerText();
    const removedProduct = successMessageinnerText.match(new RegExp(accountpage_data.wishlist_remove_success_message))[1];

    //console.log(removedProduct);

    // Get the updated product count
    const updatedProductItems = await this.page.$$(myaccountpage_locator.wishlist_items);
    const updatedItemCount = updatedProductItems.length;

    // Verify that the count has decreased by one
    expect(updatedItemCount).toBe(initialItemCount - 1);

    // Verify that the success message contains the correct product name
    expect(successMessageinnerText).toContain(removedProduct);


    // Check the page title after removing the item
    // Wait for the section to appear
  const wishListSection = await this.page.waitForSelector('section.flex');

  

  // Get text content of h1 and strong elements
  const wishlistText = await this.page.$eval('section.flex h1', element => element.textContent.trim());
  const itemCountInTitle = await this.page.$eval('section.flex strong', element => element.textContent.trim());

  // Check if both h1 and strong contain the pattern
  const pattern = /Wish List (\d+) Items/;
  const isMatching = pattern.test(wishlistText) && pattern.test(itemCountInTitle);
   // Define the regular expression
   
   // Define the regular expression to extract the number from "Items"
  const regex = /(\d+) Items/;

  // Extract the number of items from the strong text
  const match = regex.exec(itemCountInTitle);
  const itemCount = match ? match[1] : null;

  const itemCountNum = parseInt(itemCount, 10);

    // Assert that the page title contains the updated product count
    expect(itemCountNum).toBe(updatedItemCount);
    
}


}
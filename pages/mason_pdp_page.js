import test, { expect } from 'playwright/test';

const pdp_colorvariant_button_locator='section.flex.flex-wrap.items-center.gap-5 button[aria-label="choose color button"]';
const pdp_product_big_image='img[data-nimg="1"]';
const carousel_rightArrowButtonLocator = 'button.absolute.right-4';
const carousel_leftArrowButtonLocator = 'button.absolute.left-4';
const pdp_thumbnail_img = 'div.min-w-0[aria-roledescription="slide"]';
const thumbnailimg_rightArrowButtonLocator = 'button.absolute.right-0';
const thumbnailimg_leftArrowButtonLocator = 'button.absolute.left-0';
const selected_thumbnail_blackborderlocator = 'div.min-w-0[aria-roledescription="slide"] img.border-black';


exports.PDPPage = class PDPPage{
    constructor(page){
        this.page=page;
        this.pdp_colorvariant_button=page.locator(pdp_colorvariant_button_locator);
        this.carousel_rightArrowButton = this.page.locator(carousel_rightArrowButtonLocator);
        this.carousel_leftArrowButton = this.page.locator(carousel_leftArrowButtonLocator);
        this.thumbnail_image = this.page.locator(pdp_thumbnail_img);
        this.thumbnailimg_rightArrowButton=this.page.locator(thumbnailimg_rightArrowButtonLocator);
        this.thumbnailimg_leftArrowButton=this.page.locator(thumbnailimg_leftArrowButtonLocator);
        this.selected_thumbnail_blackborder = this.page.locator(selected_thumbnail_blackborderlocator);
        this.productNameLocator = this.page.locator('h1.text-lg.font-bold.leading-7.lg\\:text-\\[22px\\]');
        this.reviewsLocator = this.page.locator('section.flex.items-center.pt-2 p.pl-2\\.5.text-sm.font-normal.leading-5');
        this.linkLocator = this.page.locator('section.pt-18 a.underline-inset-2.text-sm.font-normal.leading-5.underline');

        
    }

    async clickOnPDPColorVariantButton(){
        await this.pdp_colorvariant_button.first().waitFor({state:'visible'});
        const selectVariant = await this.pdp_colorvariant_button;
        // Get the count of buttons
        const variantCount = await selectVariant.count();

        if (variantCount > 0) {
            // Select a random button index
            const randomIndex = Math.floor(Math.random() * variantCount);

            // Click the randomly selected button
            await selectVariant.nth(randomIndex).click();
            console.log(`Clicked button with index: ${randomIndex}`);
        } else {
            console.log('No buttons found');
        }
    }

    async  verifyImageChangesOnVariantSelection() {
        //const firstProductImage = await this.page.locator(pdp_product_big_image).first();
        // Step 1: Capture the initial image URL
        const initialImageUrl = await this.page.getAttribute(pdp_product_big_image, 'src');
        console.log('Initial Image URL:', initialImageUrl);
    
        // Step 2: Select a variant
        await this.clickOnPDPColorVariantButton();
    
        // Step 3: Wait for the image to change
        //await this.page.waitForSelector(firstProductImage, { state: 'detached' });
       // await this.page.waitForSelector(firstProductImage, { state: 'attached' });
    
        // Step 4: Capture the new image URL
        const newImageUrl = await this.page.getAttribute(pdp_product_big_image, 'src');
        console.log('New Image URL:', newImageUrl);
    
        // Step 5: Compare the initial and new URLs to verify the change
        expect(initialImageUrl).not.toBe(newImageUrl);
    }

    async clickLeftRightCarouselButton(){
        await this.carousel_rightArrowButton.waitFor({state:'visible'});
        const initialImageUrl = await this.page.getAttribute(pdp_product_big_image, 'src');
        console.log('Initial Image URL:', initialImageUrl);
        await this.carousel_rightArrowButton.click();
        console.log('Clicked the right arrow button');

        const isLeftArrowVisible = await this.carousel_leftArrowButton.isVisible();
        if (isLeftArrowVisible) {
            // Click the left arrow button if it is visible
            await this.carousel_leftArrowButton.click();
            console.log('Clicked the left arrow button');
            // Capture the new image URL
            const newImageUrl = await this.page.getAttribute(pdp_product_big_image, 'src');
            console.log('New Image URL:', newImageUrl);
            // Compare the initial and new URLs to verify the change
            expect(initialImageUrl).not.toBe(newImageUrl);

        } else {
            console.log('Left arrow button is not visible');
        }

    }

async thumbnailImageLeftRightArrowDisplay(){
    await this.thumbnail_image.first().waitFor({ state: 'visible' });
    const selectImageVariant = await this.thumbnail_image;
    // Get the count of thumbnail images
    const imgVariantCount = await selectImageVariant.count();

    if (imgVariantCount > 5) {
        await expect(this.thumbnailimg_rightArrowButton).toBeVisible();
        await expect(this.thumbnailimg_leftArrowButton).toBeVisible();
    } else {
        await expect(this.thumbnailimg_rightArrowButton).toBeHidden();
        await expect(this.thumbnailimg_leftArrowButton).toBeHidden();
    }

}

async validateThumbnailImageSelection(){
    await this.thumbnail_image.first().waitFor({ state: 'visible' });
    const selectImageVariant = await this.thumbnail_image;
    // Get the count of thumbnail images
    const imgVariantCount = await selectImageVariant.count();

    if (imgVariantCount > 0) {
        // Select a random image index
        const randomIndex = Math.floor(Math.random() * imgVariantCount);

        // Click the randomly selected thumbnail image
        await selectImageVariant.nth(randomIndex).click();
        await expect(this.selected_thumbnail_blackborder).toBeVisible();
        const initialImageUrl = await this.selected_thumbnail_blackborder.getAttribute('src');
        const initialBaseUrl = initialImageUrl.split('?')[0];
        console.log('Initial Image URL:', initialBaseUrl);
        const newImageUrl = await this.page.getAttribute(pdp_product_big_image, 'src');
        const newBaseUrl = newImageUrl.split('?')[0];
        console.log('New Image URL:', newBaseUrl);
        expect(initialBaseUrl).toBe(newBaseUrl);
        
    } else {
        console.log('No Thumbnail Image Found');
    }
}

async  validateProductDetails() {
    // Locate the product name element and extract text content
    //const productNameLocator = this.page.locator('h1.text-lg.font-bold.leading-7.lg\\:text-\\[22px\\]');
    await this.productNameLocator.waitFor({state:'visible'});
    const productName = await this.productNameLocator.textContent();
    console.log(`Product Name: ${productName}`);
    
    // Locate the reviews element and extract text content
    //const reviewsLocator = this.page.locator('section.flex.items-center.pt-2 p.pl-2\\.5.text-sm.font-normal.leading-5');
    const reviewsText = await this.reviewsLocator.textContent();
    console.log(`Reviews: ${reviewsText}`);
    
    // Locate the link element and extract the href attribute and text content
    //const linkLocator = this.page.locator('section.pt-18 a.underline-inset-2.text-sm.font-normal.leading-5.underline');
    const linkHref = await this.linkLocator.getAttribute('href');
    const linkText = await this.linkLocator.textContent();
    const parts = linkText.split(" ");
    const linkTextName = parts.slice(2).join(" ");
    console.log(`Link: ${linkText} - Href: ${linkHref}`);
    
    // Perform validations
    expect(productName).toBeTruthy(); // Ensure product name is not empty
    expect(reviewsText).toMatch(/\(\d+ Reviews\)/); // Ensure reviews text matches the expected pattern
    expect(linkText).toBe('Shop All ' + linkTextName ); // Ensure link text matches expected value
    expect(linkHref).toBe('#'); // Ensure link href matches expected value
  }


}
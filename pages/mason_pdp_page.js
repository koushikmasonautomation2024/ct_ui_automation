import test, { expect } from 'playwright/test';

const pdp_colorvariant_button_locator = 'section.flex.flex-wrap.items-center.gap-5 button[aria-label="choose color button"]';
const pdp_sizevariant_button_locator = 'section.flex.flex-wrap.items-center.gap-2\\.5.pt-4 button[aria-label="choose color button"]';
const pdp_product_big_image = 'img[data-nimg="1"]';
const carousel_rightArrowButtonLocator = 'button.absolute.right-4';
const carousel_leftArrowButtonLocator = 'button.absolute.left-4';
const pdp_thumbnail_img = 'div.min-w-0[aria-roledescription="slide"]';
const thumbnailimg_rightArrowButtonLocator = 'button.absolute.right-0';
const thumbnailimg_leftArrowButtonLocator = 'button.absolute.left-0';
const selected_thumbnail_blackborderlocator = 'div.min-w-0[aria-roledescription="slide"] img.border-black';
const sizechart_button_text = 'Size Chart';


exports.PDPPage = class PDPPage {
    constructor(page) {
        this.page = page;
        this.pdp_colorvariant_button = page.locator(pdp_colorvariant_button_locator);
        this.pdp_sizevariant_button = page.locator(pdp_sizevariant_button_locator);
        this.carousel_rightArrowButton = page.locator(carousel_rightArrowButtonLocator);
        this.carousel_leftArrowButton = page.locator(carousel_leftArrowButtonLocator);
        this.thumbnail_image = page.locator(pdp_thumbnail_img);
        this.thumbnailimg_rightArrowButton = page.locator(thumbnailimg_rightArrowButtonLocator);
        this.thumbnailimg_leftArrowButton = page.locator(thumbnailimg_leftArrowButtonLocator);
        this.selected_thumbnail_blackborder = page.locator(selected_thumbnail_blackborderlocator);
        this.productNameLocator = page.locator('h1.text-lg.font-bold.leading-7.lg\\:text-\\[22px\\]');
        this.reviewsLocator = page.locator('section.flex.items-center.pt-2 p.pl-2\\.5.text-sm.font-normal.leading-5');
        this.linkLocator = page.locator('section.pt-18 a.underline-inset-2.text-sm.font-normal.leading-5.underline');
        this.sizechart_button = page.getByRole('button', { name: sizechart_button_text });
        this.priceSectionLocator = page.locator('section.flex.items-center.gap-x-1.pt-30');
        this.paymentSectionLocator = page.locator('section.flex.items-center.gap-1.pt-5');
        this.creditMessageLocator = page.locator('section.mt-4.py-5');


    }

    async clickOnPDPColorVariantButton() {
        await this.pdp_colorvariant_button.first().waitFor({ state: 'visible' });
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

    async verifyImageChangesOnVariantSelection() {
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

    async clickLeftRightCarouselButton() {
        await this.carousel_rightArrowButton.waitFor({ state: 'visible' });
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

    async thumbnailImageLeftRightArrowDisplay() {
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

    async validateThumbnailImageSelection() {
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

    async validateProductDetails() {
        // Locate the product name element and extract text content
        //const productNameLocator = this.page.locator('h1.text-lg.font-bold.leading-7.lg\\:text-\\[22px\\]');
        await this.productNameLocator.waitFor({ state: 'visible' });
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
        expect(linkText).toBe('Shop All ' + linkTextName); // Ensure link text matches expected value
        expect(linkHref).toBe('#'); // Ensure link href matches the expected value

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

        await this.sizeChartDisplay();

    }

    async sizeChartDisplay() {
        await expect(this.sizechart_button).toBeVisible();
        await this.sizechart_button.click();
        await this.page.waitForSelector('button[data-state="open"]');
        const button = await this.page.locator('button:has-text("Size Chart")');
        const dataState = await button.getAttribute('data-state');
        expect(dataState).toMatch('open');
    }

    async validateSelectSizeValue() {
        await this.clickOnPDPSizeVariantButton();
        const selectedSizeValue = await this.page.locator('p:has-text("Size") + strong.font-bold').textContent();
        expect(selectedSizeValue).toBeTruthy();

    }

    async clickOnPDPSizeVariantButton() {
        await this.pdp_sizevariant_button.first().waitFor({ state: 'visible' });
        const selectSizeVariant = await this.pdp_sizevariant_button;
        // Get the count of buttons
        const sizeVariantCount = await selectSizeVariant.count();

        if (sizeVariantCount > 0) {
            // Select a random button index
            const randomIndex = Math.floor(Math.random() * sizeVariantCount);

            // Click the randomly selected button
            await selectSizeVariant.nth(randomIndex).click();
            console.log(`Clicked button with index: ${randomIndex}`);
        } else {
            console.log('No buttons found');
        }
    }

    async validateSelectColorValue() {
        await this.clickOnPDPColorVariantButton();
        const selectedColorValue = await this.page.locator('p:has-text("Color") + strong.font-bold').textContent();
        expect(selectedColorValue).toBeTruthy();

    }

    async validatePricingSection() {
        // Locate the first section and extract its text
        const priceText = await this.priceSectionLocator.locator('strong.text-xl.font-bold').textContent();

        // Validate the text content of the first section
        expect(priceText).toMatch(/^\$\d{1,3}\.\d{2}$/);

        // Locate the second section and extract its text
        const orText = await this.paymentSectionLocator.locator('p.inline-block.text-sm.font-normal').first().textContent();
        const monthlyText = await this.paymentSectionLocator.locator('strong.inline-block.text-lg.font-bold').textContent();
        const creditText = await this.paymentSectionLocator.locator('p.inline-block.text-sm.font-normal').nth(1).textContent();

        // Validate the text content of the second section
        expect(orText.trim()).toMatch('or');
        expect(monthlyText.trim()).toMatch(/^\$\d{1,3}\.\d{2}\/month\*$/);
        expect(creditText.trim()).toMatch('with Stoneberry credit');
    }

    async validateCreditMessageSection() {
        await this.page.waitForLoadState('networkidle');
        // Check if the section is visible
        const creditMessageVisible = await this.creditMessageLocator.isVisible();
        if (creditMessageVisible) {
            const h1Text = await this.creditMessageLocator.locator('h1.text-2xl.font-extrabold.leading-8').textContent();
            expect(h1Text.trim()).toMatch(/.+?/);
            const pText = await this.creditMessageLocator.locator('p.inline-block.text-base.font-bold.leading-5').textContent();
            expect(pText.trim()).toMatch(/.+?/);
            const aText = await this.creditMessageLocator.locator('a.text-sm.font-normal.leading-5.underline').textContent();
            expect(aText.trim()).toBe('Get Started');
        } else {
            console.log('Credit Message Not Available For This Product');
        }

    }

    async validateDescription() {
        await this.clickOnDescription();
        const desciptionButton = await this.page.locator('button:has-text("Description")');
        const dataState = await desciptionButton.getAttribute('data-state');
        expect(dataState).toMatch('open');
    }

    async clickOnDescription() {
        await this.page.locator('button:has-text("Description")').click();
    }

    async clickOnSpecifications() {
        await this.page.locator('button:has-text("Specifications")').click();
    }

    async validateSpecifications() {
        await this.clickOnSpecifications();
        const specificationsButton = await this.page.locator('button:has-text("Specifications")');
        const dataState = await specificationsButton.getAttribute('data-state');
        expect(dataState).toMatch('open');
    }

    async clickOnShipping() {
        await this.page.locator('button:has-text("Shipping")').click();
    }

    async validateShipping() {
        await this.clickOnShipping();
        const shippingButton = await this.page.locator('button:has-text("Shipping")');
        const dataState = await shippingButton.getAttribute('data-state');
        expect(dataState).toMatch('open');
    }

    async validateWaysToWearIt() {
        // Locate all sections within the main section
        const sections = this.page.locator('section.grid.grid-cols-2.gap-5.lg\\:grid-cols-4 > section');

        // Count the total number of sections
        const sectionCount = await sections.count();
        expect(sectionCount).toBe(4); // Ensure there are 4 sections

        // Validate each section's content
        for (let i = 0; i < sectionCount; i++) {
            const section = sections.nth(i);

            // Validate the image with href
            const image = section.locator('a > img');
            await expect(image).toBeVisible();

            // Ensure the href attribute is present
            const href = await image.evaluate(node => node.parentElement.getAttribute('href'));
            expect(href).toBeTruthy();

            // Validate the title text and description
            const title = section.locator('section.py-4.text-center a > strong');
            await expect(title).toBeVisible();

            const description = section.locator('section.py-4.text-center p > a');
            await expect(description).toBeVisible();
        }
    }

    async clickOnReviews() {
        await this.page.locator('button:has-text("Reviews")').click();
    }

    async validateReviews() {
        const reviewsButton = await this.page.locator('button:has-text("Reviews")');
        const dataState = await reviewsButton.getAttribute('data-state');
        if (dataState === "closed") {
            await this.clickOnReviews();
            const dataStateAfterClick = await reviewsButton.getAttribute('data-state');
            expect(dataStateAfterClick).toMatch('open');
            await expect(this.page.locator('div[id="pr-reviewdisplay"]')).toBeVisible();
        } else {
            expect(dataState).toMatch('open');
            await expect(this.page.locator('div[id="pr-reviewdisplay"]')).toBeVisible();

        }
    }

    async clickOnQuestionsAnswers() {
        await this.page.locator('button:has-text("Questions & Answers")').click();
    }

    async validateQuestionsAnswers() {
        const qaButton = await this.page.locator('button:has-text("Questions & Answers")');
        const dataState = await qaButton.getAttribute('data-state');
        if (dataState === "closed") {
            await this.clickOnQuestionsAnswers();
            await this.page.locator('div[id="pr-q-a"]').waitFor({ state: 'visible' });
            const dataStateAfterClick = await qaButton.getAttribute('data-state');
            expect(dataStateAfterClick).toMatch('open');
            await expect(this.page.locator('div[id="pr-q-a"]')).toBeVisible();
        } else {
            expect(dataState).toMatch('open');
            await expect(this.page.locator('div[id="pr-q-a"]')).toBeVisible();

        }
    }


}
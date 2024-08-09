import test, { expect } from 'playwright/test';
const homepage_locator = JSON.parse(JSON.stringify(require('../object_repositories/mason_home_page_repo.json')));
const accountpage_data = JSON.parse(JSON.stringify(require('../test_data/mason_sb_myaccount_page_data.json')));

const brand_breadcrumb = "HomeBrands";
const item_count = "items";
const filter_options = 'div[data-state="open"]';
const filter_title = 'h3[data-radix-collection-item]';
const filter_search = 'input[type="search"]';
const filter_container = '.border-b > h3';
const filter_checkbox = '.border-b input[type="checkbox"]';
const filter_option_button = '[data-radix-collection-item]';
const filters_list = 'ul.grid li';
const filter_view_more = 'button:has-text("View More")';
const sort_by = 'select.ais-SortBy-select';


exports.MasonPLPPage = class MasonPLPPage {
    constructor(page) {
        this.page = page;
        //this.itemCount = page.getByText(item_count);
        this.itemCountElement = page.locator(`p:has-text("${item_count}")`);
    }

    async categoryL1ToBeVisibleOnDepartmentHover() {
        await this.homepage_category.hover();
        // Wait for the L1 categories to become visible
        await this.page.waitForSelector(homepage_locator.homepage_l1category, { state: 'visible' });
    }


    async validateItemCount() {
        await expect(this.itemCountElement).toBeVisible();
        const regex = /(\d+) items/i;

        const actualText = await this.itemCountElement.innerText();
        console.log(actualText);
        // Check if the actual text contains the search value
        const containsSearchValue = regex.test(actualText);
        expect(containsSearchValue).toBe(true);
    }

    async validatePresenceOfFilter() {
        //Also checking for the Search bar
        const filterContainers = await this.page.$$(filter_options);
        for (const filterContainer of filterContainers) {
            const filterTitle = await filterContainer.$(filter_title);
            if (filterTitle) {
                const searchBar = await filterContainer.$(filter_search);
                expect(searchBar).toBeTruthy(`Search bar for filter "${await filterTitle.textContent()}" is not present.`);
            }
        }
    }

    async validateCheckboxesForAllFilters() {
        // Locate the parent elements that contain the filters
        const parentElements = await this.page.$$(filter_container);

        // Loop through each parent element
        for (const parentElement of parentElements) {
            // Extract the filter name
            const filterName = await parentElement.innerText();

            // Construct the selector for the checkbox associated with the filter
            const checkboxSelector = `h3:has-text("${filterName}") + div input[type="checkbox"]`;

            // Use expect to check if the checkbox element exists
            await this.page.waitForSelector(checkboxSelector, { timeout: 5000 });
        }
    }

    async validateAppliedFilters(selectedFilters) {
        for (const selectedFilter of selectedFilters) {
            // Extract the number from the labelText
            const matches = selectedFilter.match(/\((\d+)\)/);
            const itemCount = matches ? parseInt(matches[1]) : 0;

            // Exclude the count value from the section text
            const sectionText = selectedFilter.replace(/\(\d+\)/, '').trim();

            if (itemCount > 1) {
                // Check if the section indicating filter application is present
                const filterSection = await this.page.$(`section.flex:has-text("${sectionText}")`);
                //expect(filterSection).not.toBeNull();

                // Check if the section is visible
                const isSectionVisible = await filterSection.isVisible();
                expect(isSectionVisible).toBe(true);

                // Optionally, validate item count
                await this.validateItemCount();
            } else {
                console.log(`Filter "${sectionText}" applied successfully.`);
            }
        }
    }


    async randomlySelectFilterCheckbox() {
        // Find all checkbox elements within the filter
        const checkboxElements = await this.page.$$(filter_checkbox);

        // Randomly select one checkbox element
        const randomIndex = Math.floor(Math.random() * checkboxElements.length);
        const randomCheckbox = checkboxElements[randomIndex];

        // Get the text content of the checkbox itself
        const selectedFilter = await randomCheckbox.evaluate(node => node.parentNode.textContent.trim());
        console.log(selectedFilter);
        // Click on the selected checkbox
        await randomCheckbox.click();

        // Optionally, you can wait for some time to let the page update after selecting the checkbox
        await this.page.waitForTimeout(2000); // Wait for 2 seconds (adjust the duration as needed)
        return selectedFilter;
    }


    async randomlySelectMultipleFiltersOptions(numOptionsPerCategory) {
        const filterOptions = {}; // Object to store checkbox elements by category

        // Find all checkbox elements within the filter
        const checkboxElements = await this.page.$$(filter_checkbox);

        // Group checkbox elements by their category (filter name)
        checkboxElements.forEach(checkbox => {
            const labelText = checkbox.evaluate(node => node.parentNode.textContent.trim());
            if (labelText in filterOptions) {
                filterOptions[labelText].push(checkbox);
            } else {
                filterOptions[labelText] = [checkbox];
            }
        })

        // Randomly select multiple checkboxes from each category
        const selectedOptions = [];
        for (const category in filterOptions) {
            const checkboxes = filterOptions[category];
            for (let i = 0; i < numOptionsPerCategory; i++) {
                const randomIndex = Math.floor(Math.random() * checkboxes.length);
                const randomCheckbox = checkboxes[randomIndex];
                await randomCheckbox.click();
                selectedOptions.push(await randomCheckbox.evaluate(node => node.parentNode.textContent.trim()));
            }
        }

        // Wait for some time to let the page update after selecting the checkboxes
        await this.page.waitForTimeout(2000); // Adjust the duration as needed

        return selectedOptions;
    }

    async validateFilterExpandClose() {
        // Get all filter buttons
        const filterButtons = await this.page.$$(filter_option_button);

        // Iterate through each filter button
        for (const button of filterButtons) {
            // Click the filter button
            // Wait for the filters to expand/collapse
            await this.page.waitForTimeout(1000);

            // Verify if the filters are expanded/collapsed
            const isExpanded = await button.evaluate(button => button.getAttribute('aria-expanded') === 'true');
            expect(isExpanded).toBeTruthy();

            // Click the filter button again to collapse
            await button.click();

            // Wait for the filters to collapse/expand
            //await this.page.waitForTimeout(1000);

            // Verify if the filters are collapsed/expanded
            const isCollapsed = await button.evaluate(button => button.getAttribute('aria-expanded') === 'false');
            expect(isCollapsed).toBeTruthy();
        }
    }


    async validateViewMoreOption() {
        // Get all filter buttons
        const filterButtons = await this.page.$$(filter_option_button);

        // Iterate through each filter button
        for (const button of filterButtons) {
            // Check if the filter has more than 8 options
            const filterOptions = await this.page.$$(filters_list);
            if (filterOptions.length > 8) {
                // Verify if the 'View More' link is visible
                const viewMoreButtons = await this.page.$$(filter_view_more);
                if (viewMoreButtons.length > 0) {
                    // Click on 'View More' link
                    await viewMoreButtons[0].click();

                    // Check if the filter has more than 16 options
                    if (filterOptions.length > 16) {
                        // Verify if the 'View More' link is still visible
                        const viewMoreButtonsAfterClick = await this.page.$$(filter_view_more);
                        if (viewMoreButtonsAfterClick.length > 0) {
                            // Click on 'View More' link again
                            await viewMoreButtonsAfterClick[0].click();

                            // Wait for the options to load
                            await this.page.waitForTimeout(1000);
                        }
                    }
                }
            } else {
                console.log('Filter has less than 8 options.');
            }
        }
    }

    async validateSortBy() {
        //await expect(this.page.getByText('Sort By:')).toBeVisible();
        await (this.page.getByText('Sort By:').nth(1)).waitFor({ state: "visible" });
        //await expect(this.page.getByRole('combobox')).toBeVisible();
    }

    async validateFeatureIsDefaultSort() {

        // Verify the default selection
        const defaultOption = await this.page.locator('li[aria-selected="true"]');
        const defaultText = await defaultOption.innerText();
        expect(defaultText).toEqual('Featured');
    }


    async validateSortOptions() {

        const sortingOptions = [
            'Featured',
            'Price: Low to High',
            'Price: High to Low',
            'Best-Selling',
            'Highest-Rated',
            'Newest'
        ];



        const options = await this.page.$$('ul[role="listbox"] li[role="option"]');

        // Extract text from each option
        const optionTexts = await Promise.all(options.map(option => option.innerText()));
        expect(optionTexts).toEqual([
            'Featured',
            'Price: Low to High',
            'Price: High to Low',
            'Best-Selling',
            'Highest-Rated',
            'Newest'
        ]);
    }

    async clickSortBy() {
        //const button = await this.page.locator('button[aria-labelledby="headlessui-listbox-button-:rk0:"]');
        //await this.page.waitForSelector('button[id="headlessui-listbox-button-:rk0:"]', { state: 'visible' });

        // Click the button
        //await this.page.click('button[id="headlessui-listbox-button-:rk0:"]');
        await this.page.getByRole('button', { name: 'Featured' }).click();
        // await button.click();
    }


    async selectSortOption() {

        // Get all options in the dropdown
        const options = await this.page.$$('ul[role="listbox"] li[role="option"]');

        // Select a random option
        const randomIndex = Math.floor(Math.random() * options.length);
        const randomOption = options[randomIndex];
        const randomText = await randomOption.innerText();
        await randomOption.click();
        console.log(randomText);
        //  await this.page.getByRole('button', { name: randomOption }).click();
        // Verify that the selected option matches the clicked option
        const selectedOption = await this.page.locator('li[aria-selected="true"]');
        const selectedText = await selectedOption.innerText();
        expect(selectedText).toEqual(randomText);
    }


    async clickAddToCart() {
        const add_to_cart = await this.page.getByRole('button', { name: 'Add to Cart' }).first();
        await add_to_cart.waitFor({ state: "visible" });
        await add_to_cart.click();
    }

    async clickOnViewMoreDetails() {
        await (this.page.getByRole('button', { name: 'View More Details' })).waitFor({ state: "visible" });
        await (this.page.getByRole('button', { name: 'View More Details' })).click();
        await (this.page.getByRole('button', { name: 'Add to Wish List' })).waitFor({ state: "visible" });
    }

    async clickAddToCartInChooseOptionDrawer() {
        try {
            // Wait for the button to appear (if necessary)
            await this.page.waitForSelector('(//section[contains(@class, "sticky")]//button)[2]');

            // Get the second "Add to Cart" button's inner text
            const buttonText = await this.page.evaluate(() => {
                const button = document.evaluate('(//section[contains(@class, "sticky")]//button)[2]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
                return button.textContent.trim();
            });

            // Check if the inner text is "Add to Cart"
            if (buttonText === "Add to Cart") {
                // Click the button
                await this.page.click('(//section[contains(@class, "sticky")]//button)[2]');
                console.log('Clicked the "Add to Cart" button');
                await this.page.getByText("My Cart").waitFor({ state: "visible" });
            } else {
                // Log the inner text if it's not "Add to Cart"
                console.log('Inner text of the button:', buttonText);
            }
        } catch (error) {
            console.error('Error:', error);
        }

    }



    async validateChooseOptionDrawer() {
        await (this.page.getByText('Choose Options')).waitFor({ State: "visible" });
        //await (this.page.getByRole('button', { name: 'Add to Cart' })).waitFor({state:"visible"});
        try {
            await this.page.waitForSelector('button:has-text("Add to Cart"), button:has-text("Personalize")', { state: 'visible' });
            console.log('Add to Cart or Personalize button found.');
        } catch (error) {
            console.log('Add to Cart or Personalize button not found.');
        }
        await (this.page.getByRole('button', { name: 'View More Details' })).waitFor({ state: "visible" });
    }

    async closeChooseOptionDrawer() {
        await this.page.locator('section').filter({ hasText: /^Choose Options$/ }).getByRole('button').click();

    }

    async validateImageInChooseOptionDrawer() {
        // Wait for the image element to be visible
        const imgSelector = 'img[loading="lazy"]';
        await this.page.waitForSelector(imgSelector, { state: 'visible' });
    }

    async validateNavigationArrows() {
        try {
            // Wait for the image and right navigation button to load within the relative div
            const divSelector = 'div.relative';
            await this.page.waitForSelector(divSelector);

            // Check if the right navigation button is present inside the div
            const rightButtonSelector = `${divSelector} button.absolute.right-4`;
            const isRightButtonPresent = await this.page.waitForSelector(rightButtonSelector, { state: 'visible' }).then(() => true).catch(() => false);

            // Log a message if the right navigation button is not found
            if (!isRightButtonPresent) {
                console.log('Right navigation button not found as there is only one image.');
            } else {
                // Click on the right navigation button if it's available
                await this.page.click(rightButtonSelector);
                console.log('Clicked on the right navigation button.');

                // After clicking on the right button, wait for the left button to appear
                const leftButtonSelector = `${divSelector} button.absolute.left-4`;
                const isLeftButtonPresent = await this.page.waitForSelector(leftButtonSelector, { state: 'visible' }).then(() => true).catch(() => false);

                // Log a message if the left navigation button is not found
                if (!isLeftButtonPresent) {
                    console.log('Left navigation button not found.');
                } else {
                    // Click on the left navigation button if it's available
                    await this.page.click(leftButtonSelector);
                    console.log('Clicked on the left navigation button.');
                }
            }
        } catch (error) {
            console.error('Error validating navigation arrows:', error);
        }
    }


    async validateMonthlyCreditInfo() {
        await expect(this.page.getByLabel('tooltip')).toBeVisible();
        await this.page.getByLabel('tooltip').click();
        await expect(this.page.getByText('Price Per Month').nth(1)).toBeVisible();
        await expect(this.page.getByText('The price per month reflects').first()).toBeVisible();
        await expect(this.page.getByRole('link', { name: 'terms and conditions' }).first()).toBeVisible();
        await this.page.locator('.absolute > path').first().click();
    }


    async validateArrivesBy() {
        await (this.page.getByText('Arrives by')).waitFor({ state: "visible" });
    }


    async validateTermsAndConditionsNavigation() {
        await this.page.getByRole('link', { name: 'terms and conditions' }).first().click();
    }

    async validateCreditText() {
        await expect(this.page.getByRole('heading', { name: 'BUY NOW, PAY LATER' })).toBeVisible();
        await expect(this.page.getByText('Get pre-qualified instantly!')).toBeVisible();
        await expect(this.page.getByRole('link', { name: 'Get Started' })).toBeVisible();
    }

    async clickGetStartedLink() {
        await (this.page.getByRole('link', { name: 'Get Started' })).click();
        await expect(this.page).toHaveURL(/.*credit-limit-prequalification/);
    }

    async clickThroughSwipers() {
        let morePages = true;

        while (morePages) {
            const swiperInstances = this.page.locator('.swiper');
            const swiperCount = await swiperInstances.count();

            console.log(`Found ${swiperCount} swiper instances.`);

            if (swiperCount === 0) {
                morePages = false;
                break;
            }

            for (let i = 0; i < swiperCount; i++) {
                const swiper = swiperInstances.nth(i);
                const swiperNextButton = swiper.locator('.swiper-button-next');
                const isButtonPresent = await swiperNextButton.count() > 0;
                const isButtonEnabled = await swiperNextButton.evaluate(button => !button.classList.contains('swiper-button-disabled'));

                if (!isButtonPresent || !isButtonEnabled) {
                    morePages = false;
                    break;
                }

                try {
                    await swiperNextButton.click();
                    await this.page.waitForTimeout(2000);
                    const newCount = await swiper.locator('.swiper-button-next').count();
                    if (newCount === 0 || !(await swiperNextButton.evaluate(button => !button.classList.contains('swiper-button-disabled')))) {
                        morePages = false;
                        break;
                    }
                } catch (error) {
                    console.error('Error clicking swiper button:', error);
                    morePages = false;
                }
            }
        }
    }


    async logProductDetails(productElement) {
        const title = await productElement.locator('p.min-h-10').innerText().catch(() => 'No title');
        const price = await productElement.locator('p.flex span').innerText().catch(() => 'No price');
        const monthlyPrice = await productElement.locator('strong.inline-block').innerText().catch(() => 'No monthly price');
        //const imageUrl = await productElement.locator('a').getAttribute('alt').catch(() => 'No image URL');
        const imageUrl = await productElement.evaluate(element => {
            const images = Array.from(element.querySelectorAll('a.flex img'));
            return images.map(img => img.alt);
        }).catch(() => 'No image URL');
        const reviews = await productElement.locator('section.flex.items-center.gap-2 p.text-sm').innerText().catch(() => 'No reviews');
        const colorVariants = await productElement.evaluate(element => {
            const images = Array.from(element.querySelectorAll('div[aria-hidden="true"] img'));
            return images.map(img => img.alt);
        }).catch(() => 'No color variants');
        //const addToCartButton = productElement.locator('button[aria-haspopup="dialog"]');

        console.log({
            title,
            price,
            monthlyPrice,
            imageUrl,
            reviews,
            colorVariants
            //addToCartButton: await addToCartButton.isVisible() ? 'Present' : 'Not Present'
        });
    }


    async logProductDetailsOld() {
        await this.page.evaluate(() => {
            const productItems = document.querySelectorAll('li.ais-Hits-item');

            productItems.forEach(item => {
                const imageTag = item.querySelector('.swiper-slide img');
                const imageUrl = imageTag ? imageTag.src : 'No image';
                console.log(`Image URL: ${imageUrl}`);

                const titleTag = item.querySelector('a p');
                const title = titleTag ? titleTag.textContent.trim() : 'No title';
                console.log(`Title: ${title}`);

                const priceTag = item.querySelector('.flex.flex-wrap span');
                const price = priceTag ? priceTag.textContent.trim() : 'No price';
                console.log(`Price: ${price}`);

                const ratingTags = item.querySelectorAll('.my-3.min-h\\[32px\\] svg');
                const rating = ratingTags.length ? `Rating count: ${ratingTags.length}` : 'No rating';
                console.log(rating);

                const colorVariantElements = item.querySelectorAll('div.h-7.w-7');
                const colorVariants = [];
                colorVariantElements.forEach(colorElement => {
                    const color = colorElement.textContent.trim();
                    colorVariants.push(color);
                });

                console.log(`Color Variants: ${colorVariants.length ? colorVariants.join(', ') : 'No color variants'}`);
            });
        });
    }


    // Verify product details
    async verifyProducts() {
        //const firstProduct = this.page.locator('.ais-Hits-item').first();
        await this.page.waitForTimeout(3000);
        await this.logProductDetailsOld();
        const items = this.page.locator('.ais-Hits-item');
        const count = await items.count();

        if (count > 0) {
            const product = items.nth(0);
            await this.logProductDetails(product);

        }
        await this.clickThroughSwipers();

    }


    async checkItemCountBeforeRunningTest() {
        const hasItems = await this.page.evaluate(() => {
            const pElements = Array.from(document.querySelectorAll('p'));
            return pElements.some(p => p.textContent.trim() === '0 items');
        });

        if (hasItems) {
            console.log('No items found. Skipping test.');
        } else {
            await this.verifyProducts();
        }
    }

}
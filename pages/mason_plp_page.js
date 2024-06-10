import test, { expect } from 'playwright/test';
const homepage_locator =JSON.parse(JSON.stringify(require('../object_repositories/mason_home_page_repo.json')));
const accountpage_data =JSON.parse(JSON.stringify(require('../test_data/mason_sb_myaccount_page_data.json')));

const brand_breadcrumb="HomeBrands";
const item_count="items";
const filter_options='div[data-state="open"]';
const filter_title='h3[data-radix-collection-item]';
const filter_search='input[type="search"]';
const filter_container='.border-b > h3';


exports.MasonPLPPage = class MasonPLPPage{
    constructor(page){
        this.page=page;
        //this.itemCount = page.getByText(item_count);
        this.itemCountElement = page.locator(`p:has-text("${item_count}")`);
    }

    async categoryL1ToBeVisibleOnDepartmentHover()
    {
        await this.homepage_category.hover();
        // Wait for the L1 categories to become visible
        await this.page.waitForSelector(homepage_locator.homepage_l1category, { state: 'visible' });
    }

    
    async validateItemCount(){
        await expect(this.itemCountElement).toBeVisible();
        const regex = /(\d+) items/i;
    
        const actualText = await this.itemCountElement.innerText();
            console.log(actualText);
            // Check if the actual text contains the search value
            const containsSearchValue = regex.test(actualText);
            expect(containsSearchValue).toBe(true);
    }

    async validatePresenceOfFilter(){
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
        const checkboxSelector =  `h3:has-text("${filterName}") + div input[type="checkbox"]`;

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
    const checkboxElements = await this.page.$$('.border-b input[type="checkbox"]');

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
    const checkboxElements = await this.page.$$('.border-b input[type="checkbox"]');

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
}
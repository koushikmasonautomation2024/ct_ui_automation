import test, { expect } from 'playwright/test';
const homepage_locator =JSON.parse(JSON.stringify(require('../object_repositories/mason_home_page_repo.json')));
const accountpage_data =JSON.parse(JSON.stringify(require('../test_data/mason_sb_myaccount_page_data.json')));

const brand_breadcrumb="HomeBrands";
const item_count="items";
const filter_options='div[data-state="open"]';
const filter_title='h3[data-radix-collection-item]';
const filter_search='input[type="search"]';
const filter_container='.border-b > h3';
const filter_checkbox='.border-b input[type="checkbox"]';
const filter_option_button='[data-radix-collection-item]';
const filters_list='ul.grid li';
const filter_view_more='button:has-text("View More")';
const sort_by='select.ais-SortBy-select';


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

async validateFilterExpandClose(){
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
    await this.page.waitForTimeout(1000);

    // Verify if the filters are collapsed/expanded
    const isCollapsed = await button.evaluate(button => button.getAttribute('aria-expanded') === 'false');
    expect(isCollapsed).toBeTruthy();
  }
}


async validateViewMoreOption(){
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

async validateSortBy(){
    await expect(this.page.getByText('Sort By:')).toBeVisible();
    await expect(this.page.getByRole('combobox')).toBeVisible();
}

async validateFeatureIsDefaultSort(){
    const optionElement = await this.page.$(`.ais-SortBy-option`);
        const optionText = await optionElement.textContent();
        expect(optionText).toContain("Featured");
}


async validateSortOptions(){
    await this.page.getByRole('combobox').click();
    const sortingOptions = ['Best-Selling','Price - Low to High','Price - High to Low', 'Highest-Rated','Newest'];

      // Validate if the sorting options can be toggled on or off
    // for (const option of sortingOptions) {
    //     const sortOptions = await this.page.$$(`option:has-text("${option}")`);
    //     expect(sortOptions).toBeVisible();
    //     console.log(option);
    // }
    // Validate if the sorting options are visible
    for (const option of sortingOptions) {
        await expect(this.page.getByRole('combobox')).toContainText(option);
        console.log(`${option} is visible`);
    }
}


async selectSortOption(){
    await this.page.getByRole('combobox').click();
    const sortingOptions = ['Best-Selling','Price - Low to High','Price - High to Low', 'Highest-Rated','Newest'];
    const randomOptionIndex = Math.floor(Math.random() * sortingOptions.length);
    const randomOption = sortingOptions[randomOptionIndex];
    console.log(randomOption);
    await this.page.getByRole('combobox').selectOption(randomOption);
}
}

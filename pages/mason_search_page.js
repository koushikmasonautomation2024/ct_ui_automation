import test, { expect } from 'playwright/test';
const myaccountpage_locator =JSON.parse(JSON.stringify(require('../object_repositories/mason_myaccount_page_repo.json')));
const accountpage_data =JSON.parse(JSON.stringify(require('../test_data/mason_sb_myaccount_page_data.json')));

const search_placeholder = "What can we help you find";
const search_icon="Search";
const no_search_result_text="Sorry, there are no results";
const search_tips="Please check spelling, try a more general search, or use fewer keywords.";
const need_help="Need Help?";
const view_faq="View FAQs";
const chat_with_us="Chat with Us";
const email="Email";
const call_number="Call Us 1-800-704-5480";
const category_grid="//ul[@class='grid  gap-5 grid-cols-3 md:grid-cols-6']/li";
const search_result_title="Result for";
const item_count="Items";
const popular_searches="Popular Searches";
const popular_search_container="div.m-2.flex.flex-wrap.gap-2\\.5";
const popular_search_terms="div.flex.gap-1\\.5.rounded-md.border.border-foggyGray.p-2";

exports.SearchPage = class SearchPage{
    constructor(page){
        this.page=page;
        this.search_placeholder=page.getByPlaceholder(search_placeholder);
        this.searchicon=page.getByLabel(search_icon, { exact: true });
        this.no_search_result_text=page.getByText(no_search_result_text);
        this.search_tips=page.getByText(search_tips);
        this.need_help=page.getByText(need_help);
        this.view_faq=page.getByRole('link', { name: view_faq });
        this.chat_with_us=page.getByRole('link', { name: chat_with_us });
        this.email=page.getByRole('link', { name: email });
        this.call_number=page.getByRole('link', { name: call_number });
        this.search_result_title=page.getByText(search_result_title);
        this.itemCount = page.getByText(item_count);
        this.popular_searches=page.getByText(popular_searches);
    }

    async validateSearchField(search_value){
        await expect(this.search_placeholder).toBeVisible();
        await this.search_placeholder.click();
        await this.search_placeholder.fill(search_value);
        await this.searchicon.click();
        // Wait for the URL to match either a search results page or a no-result page
        await this.page.waitForNavigation();
        await this.page.waitForURL(`**/?q=${search_value}`);
    }

    async validateWrongSearchPageTitle(search_value){
        await expect(this.no_search_result_text).toBeVisible();
         // Get the inner text of the no search result text element
        const actualText = await this.no_search_result_text.innerText();
        console.log(actualText);
        // Check if the actual text contains the search value
        const containsSearchValue = actualText.includes(search_value);

        // Assert that the actual text contains the search value
        expect(containsSearchValue).toBe(true);
    }

    async validateValidSearchPageTitle(search_value){
        await expect(this.search_result_title).toBeVisible({ timeout: 10000 });
         // Get the inner text of the no search result text element
        const actualText = await this.search_result_title.innerText();
        console.log(actualText);
        // Check if the actual text contains the search value
        const containsSearchValue = actualText.includes(search_value);

        // Assert that the actual text contains the search value
        expect(containsSearchValue).toBe(true);
    }

    async validateSearchTips(){
        await expect(this.search_tips).toBeVisible({ timeout: 10000 });
    }

    async validateNeedHelpsection(){
       // await this.page.waitForTimeout(2000);
        await expect(this.need_help).toBeVisible({ timeout: 10000 });
        await expect(this.view_faq).toBeVisible();
        await expect(this.chat_with_us).toBeVisible();
        await expect(this.email).toBeVisible();
        await expect(this.call_number).toBeVisible();
    }


    async clickFaqlink(){
        await this.view_faq.click();
        //await expect(this.page).toHaveURL(/.*addresses/);

    }

    async clickChatWithUslink(){
        await this.chat_with_us.click();
        //await expect(this.page).toHaveURL(/.*addresses/);

    }

    async clickEmailLink(){
        await this.email.click();
        //await expect(this.page).toHaveURL(/.*addresses/);
    }

    async validateCallNumber(){
        const linkText = await this.call_number.innerText();
        console.log(linkText);
    // Check that the link text includes the expected phone number
        expect(linkText).toContain('1-800-704-5480');
        //await expect(this.call_number).toContain('1-800-704-5480');
    }

    async validateTopCategoryImageandTitle(){
        await this.page.waitForSelector('.grid');

        // Get all the category tiles
        const categoryTiles = await this.page.$$(category_grid);

        // Expectations
        expect(categoryTiles.length).toBe(6 * 3); // Check the total number of tiles

        // Iterate through each category tile
        for (const tile of categoryTiles) {
        // Get category title and image URL
        const title = await tile.$eval('p', (p) => p.innerText);
        const imageURL = await tile.$eval('img', (img) => img.getAttribute('src'));
            console.log(title);
            console.log(imageURL);
        // Expectations
        expect(title).toBeTruthy();
        expect(imageURL).toBeTruthy();
    }
    
}

async validateItemCount(){
    await expect(this.search_result_title).toBeVisible();
    //const regex = /(\d+) Items/;
    const regex = /(\d+) items/i;

    const actualText = await this.search_result_title.innerText();
        console.log(actualText);
        // Check if the actual text contains the search value
        const containsSearchValue = regex.test(actualText);
        expect(containsSearchValue).toBe(true);
}


async validatePopularSearch(){
        await this.search_placeholder.click();
        await expect(this.popular_searches).toBeVisible();
   
    }


async validateRecentSearches(search_value){
    await this.search_placeholder.click();
    await expect(this.page.getByRole('link', { name: search_value, exact: true })).toBeVisible();
    await expect(this.page.locator('li').filter({ hasText: new RegExp(`^${search_value}$`) }).getByRole('button')).toBeVisible();
}

async validateClickOnRecentSearch(search_value){
    await this.search_placeholder.click();
    await this.page.getByRole('link', { name: search_value, exact: true }).click();
    await this.page.waitForNavigation();
    await this.page.waitForURL(`**/?q=${search_value}`);
}

async validateRemoveRecentSearchEntry(search_value){
    await this.search_placeholder.click();
    await expect(this.page.locator('li').filter({ hasText: new RegExp(`^${search_value}$`) }).getByRole('button')).toBeVisible();
    await (this.page.locator('li').filter({ hasText: new RegExp(`^${search_value}$`) }).getByRole('button')).click();
    await expect(this.page.locator('li').filter({ hasText: new RegExp(`^${search_value}$`) }).getByRole('button')).not.toBeVisible();
}


async validatePopularSearchItemsCount(){
    // Verify the popular search terms container is visible
    const popularSearchTermsContainer = this.page.locator(popular_search_container);
    await expect(popularSearchTermsContainer).toBeVisible();

    // Get all popular search term elements
    const popularSearchTerms = popularSearchTermsContainer.locator(popular_search_terms);
    const searchTermCount = await popularSearchTerms.count();

    // Verify there are exactly 10 popular search terms displayed
    expect(searchTermCount).toBe(10);
}

}
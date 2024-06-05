import test, { expect } from 'playwright/test';
const homepage_locator =JSON.parse(JSON.stringify(require('../object_repositories/mason_home_page_repo.json')));
const accountpage_data =JSON.parse(JSON.stringify(require('../test_data/mason_sb_myaccount_page_data.json')));

const brand_breadcrumb="HomeBrands";
const brand_title="Brands";
const top_brands="Top Brands";
const brand_logo_section="section.w-full:has(h2:has-text('Top Brands'))";
const alphabets = "ABCDEFGHIJKLMNOPQRSTUVWXYZ#";
const brand_index="Brand Index"

exports.MasonPLPPage = class MasonPLPPage{
    constructor(page){
        this.page=page;
        this.brand_title=page.getByRole('heading', { name: brand_title, exact: true })
        this.brand_breadcrumb=page.getByText(brand_breadcrumb);
        this.top_brands=page.locator('section').filter({ hasText: top_brands }).locator('section');
        this.alphabets_link=page.getByText(alphabets);
        this.brand_index=page.getByRole('heading', { name: brand_index });
        
    }

    
    async validateBrandBreadCrumb(){
        await expect(this.brand_breadcrumb).toBeVisible();
    }

    async categoryL1ToBeVisibleOnDepartmentHover()
    {
        await this.homepage_category.hover();
        // Wait for the L1 categories to become visible
        await this.page.waitForSelector(homepage_locator.homepage_l1category, { state: 'visible' });
    }

}
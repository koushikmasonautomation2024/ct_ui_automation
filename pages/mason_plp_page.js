import test, { expect } from 'playwright/test';
const homepage_locator =JSON.parse(JSON.stringify(require('../object_repositories/mason_home_page_repo.json')));
const accountpage_data =JSON.parse(JSON.stringify(require('../test_data/mason_sb_myaccount_page_data.json')));

const brand_breadcrumb="HomeBrands";
const homeText='ol.flex li a:text("Home")';
const crumb_text='ol.flex li a:text("Slippers")';


exports.MasonPLPPage = class MasonPLPPage{
    constructor(page){
        this.page=page;
        this.home_text=page.locator(homeText);
        this.crumb_text=page.locator(crumb_text);
        
    }

    async categoryL1ToBeVisibleOnDepartmentHover()
    {
        await this.homepage_category.hover();
        // Wait for the L1 categories to become visible
        await this.page.waitForSelector(homepage_locator.homepage_l1category, { state: 'visible' });
    }

    async validatePLPBreadCrumb(){
         await expect(this.home_text).toBeVisible();
         await expect(this.crumb_text).toBeVisible();

    
    }

}
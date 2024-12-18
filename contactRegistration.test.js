const { chromium } = require('playwright');

describe('Contact Form Registration Test', () => {
    let browser;
    let page;

    beforeAll(async () =>{
        // browser = await chromium.launch();
        browser = await chromium.launch({ headless: false });
    });

    beforeEach(async () =>{
        //reinstantiate instance of page launching new chromium browser for each test
        page = await browser.newPage();
        //go to the website
        await page.goto('https://orikan-ui-automation-test.azurewebsites.net/');

        //fill the email, password, and confirmPassword fields
        await page.fill('#emailAddress', 'john@gmail.com');
        await page.fill('#password', '12345');
        await page.fill('#confirmPassword', '12345');
        //click next button to submit form
        await page.click('.wizard-button.primary');

        //wait for the page to load before testing
        const firstNameField = await page.locator('#firstName');
        await firstNameField.waitFor({ state: 'attached' }); 

    });

    afterAll(async () =>{
        //close browser when test suite is finished running
        if(browser){
            await browser.close(); 
        }
        
    });

    afterEach(async () =>{
        // Close new page after each test
        if(page){
            await page.close();
        }
        
    });

    /**Test case 1 POSITIVE CASE: This test case fills out all required fields with valid inputs */
    it('should fill out all required fields and move on to the next page', async () =>{
        //fill first name field
        await page.fill('#firstName', 'John');
        // //fill middle name field
        await page.fill('#middleName', 'Lucas');
        // //fill last name field
        await page.fill('#lastName', 'Ramsay');
        // //fill address line 1 field
        await page.fill('#addressLine1', '500 Bourke Street');
        // //fill postcode field
        await page.fill('#postcode', '3000');
        
        //fill city with 
        await page.fill('#city', 'Melbourne');
        //select the option with label Victoria as the state
        await page.selectOption('#state', { label: 'Victoria' });

        //set the next button
        const nextButton = await page.locator('.wizard-button.primary');
        // Wait for the button to be present in the dom and visible in the dom before clicking
        await nextButton.waitFor({ state: 'attached' });
        await nextButton.waitFor({ state: 'visible' });
        // Click the next button
        await nextButton.click();

        //wait for the next page to load
        const cardHolderNameField = await page.locator('#cardHolderName');
        await cardHolderNameField.waitFor({ state: 'attached' }); 
        // Assert that the #cardHolderName field is visible
        const isVisible = await cardHolderNameField.isVisible();
        expect(isVisible).toBe(true); 
    });

    /**Test case 2 NEGATIVE CASE: This test case fills out all required fields that require keyboard input with 1 whitespace */
    it('should fill out all required fields with one whitespace character and not move on to the next page', async () =>{
        //fill first name field
        await page.fill('#firstName', ' ');
        // //fill middle name field
        await page.fill('#middleName', ' ');
        // //fill last name field
        await page.fill('#lastName', ' ');
        // //fill address line 1 field
        await page.fill('#addressLine1', ' ');
        // //fill postcode field
        await page.fill('#postcode', ' ');
        
        //fill city with 
        await page.fill('#city', ' ');
        //select the option with label Victoria as the state
        // await page.selectOption('#state', { label: 'Victoria' });
        await page.selectOption('#state', { label: 'Tasmania' });

        //set the next button
        const nextButton = await page.locator('.wizard-button.primary');
        // Wait for the button to be present in the dom and visible in the dom before clicking
        await nextButton.waitFor({ state: 'attached' });
        await nextButton.waitFor({ state: 'visible' });
        // Click the next button
        await nextButton.click();

        //wait for the next page to load
        const cardHolderNameField = await page.locator('#cardHolderName');
        await cardHolderNameField.waitFor({ state: 'attached' }); 
        // Assert that the #cardHolderName field is visible
        const isVisible = await cardHolderNameField.isVisible();
        expect(isVisible).not.toBe(true); 
    });

    /**Test case 3 NEGATIVE CASE: This test case does not fill out the required fields and checks to see if error message is thrown */

});
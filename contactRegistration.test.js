const { chromium } = require('playwright');

describe('Contact Form Registration Test', () => {
    let browser;
    let page;

    beforeAll(async () =>{
        browser = await chromium.launch();
        // browser = await chromium.launch({ headless: false });
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
    it('should fill out all required fields and check if moved on to the next page', async () =>{
        //fill first name field with valid input
        await page.fill('#firstName', 'John');
        //fill middle name field with valid input
        await page.fill('#middleName', 'Lucas');
        //fill last name field with valid input
        await page.fill('#lastName', 'Ramsay');
        //fill address line 1 field with valid input
        await page.fill('#addressLine1', '500 Bourke Street');
        //fill postcode field with valid input
        await page.fill('#postcode', '3000');
        
        //fill city with valid input
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
    it('should fill out all required fields with one whitespace character and check if site has not moved on to the next page', async () =>{
        //fill fields with single whitespace
        await page.fill('#firstName', ' ');
        await page.fill('#middleName', ' ');
        await page.fill('#lastName', ' ');
        await page.fill('#addressLine1', ' ');
        await page.fill('#postcode', ' ');

        await page.fill('#city', ' ');
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

    /**Test case 2 NEGATIVE CASE: This test case fills out all required fields that require keyboard input with invalid special characters */
    it('should fill out all required fields with one whitespace character and check if the site has not moved on to the next page', async () =>{
        //fill fields with invalid characters
        await page.fill('#firstName', '#@^&$%');
        await page.fill('#middleName', '#@^&$%');
        await page.fill('#lastName', '#@^&$%');
        await page.fill('#addressLine1', '#@^&$%');
        await page.fill('#postcode', '#@^&$%');
        await page.fill('#city', '#@^&$%');
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

    /**Test case 3 NEGATIVE CASE: This test case does not fill out required fields and checks if error messages are thrown for each field */
    it('should fill out all required fields with one whitespace character and check if the site has not moved on to the next page', async () =>{
        //fill first name field with valid input
        await page.fill('#firstName', '');
        //fill last name field with valid input
        await page.fill('#lastName', '');
        //fill address line 1 field with valid input
        await page.fill('#addressLine1', '');
        //fill postcode field with valid input
        await page.fill('#postcode', '');
        
        //fill city with valid input
        await page.fill('#city', '');
        //select the option with label Tasmania as the state
        await page.selectOption('#state', { label: 'Tasmania' });

        //await error messages appearance
        const errorMessage = await page.locator('div.validation.error span');
        //await all error messages
        const firstNameErrorMessage = await errorMessage.locator('text=First Name is required');
        const lastNameErrorMessage = await errorMessage.locator('text=Last Name is required');
        const addressLine1ErrorMessage = await errorMessage.locator('text=Last Name is required');
        const postcodeErrorMessage = await errorMessage.locator('text=Last Name is required');
        const cityErrorMessage = await errorMessage.locator('text=Last Name is required');

        //validate all error messages
        expect(await firstNameErrorMessage.isVisible()).toBe(true);
        expect(await lastNameErrorMessage.isVisible()).toBe(true);
        expect(await addressLine1ErrorMessage.isVisible()).toBe(true);
        expect(await postcodeErrorMessage.isVisible()).toBe(true);
        expect(await cityErrorMessage.isVisible()).toBe(true);
    });

    /**Test case 4 NEGATIVE CASE: This test case does not fill out first and last name and checks if error messages are thrown for both */
    it('should not fill first name and last name and check if error messages are thrown for both', async () =>{
        //do not fill first and last name fields
        await page.fill('#firstName', '');
        await page.fill('#lastName', '');

        //await error messages appearance
        const errorMessage = await page.locator('div.validation.error span');
        //await firstname and lastname error messages 
        const firstNameErrorMessage = await errorMessage.locator('text=First Name is required');
        const lastNameErrorMessage = await errorMessage.locator('text=Last Name is required');
        
        //validate error messages
        expect(await firstNameErrorMessage.isVisible()).toBe(true);
        expect(await lastNameErrorMessage.isVisible()).toBe(true);
    });

    /**Test case 5 NEGATIVE CASE: This test case DOES NOT fill out first name but fills out the last name and checks if error messages are thrown for only the first name */
    it('should not fill out first name and fill out last name and check if error messages are thrown for only the first name', async () =>{
        //do not fill first name but fill last name
        await page.fill('#firstName', '');
        await page.fill('#lastName', 'Johnson');

        //await error messages appearance
        const errorMessage = await page.locator('div.validation.error span');
        //await firstname and lastname error messages 
        const firstNameErrorMessage = await errorMessage.locator('text=First Name is required');
        const lastNameErrorMessage = await errorMessage.locator('text=Last Name is required');
        
        //validate if first name error message is present
        expect(await firstNameErrorMessage.isVisible()).toBe(true);
        //validate if last name error message IS NOT present
        expect(await lastNameErrorMessage.isVisible()).not.toBe(true);
    });

    /**Test case 6 NEGATIVE CASE: This test case fills out the first name but DOES NOT fill out the last name and checks if error messages are thrown for only the last name */
    it('should fill out the first name and not fill out last name and check if error message is thrown only for last name', async () =>{
        //do not fill first and last name fields
        await page.fill('#firstName', 'John');
        await page.fill('#lastName', '');

        //await error messages appearance
        const errorMessage = await page.locator('div.validation.error span');
        //await firstname and lastname error messages 
        const firstNameErrorMessage = await errorMessage.locator('text=First Name is required');
        const lastNameErrorMessage = await errorMessage.locator('text=Last Name is required');
        
        //validate if first name error message IS NOT present
        expect(await firstNameErrorMessage.isVisible()).not.toBe(true);
        //validate if last name error message present
        expect(await lastNameErrorMessage.isVisible()).toBe(true);
    });

    /**Test case 7 NEGATIVE CASE: This test fills out first and last name and checks if there is only one space 
     * between first and last name in the automatically filled out preferred full name field.
     */
    it('should fill out all required fields with one whitespace character and check if site has not moved on to the next page', async () =>{
        //fill first and last name
        await page.fill('#firstName', 'John');
        await page.fill('#lastName', 'Doe');
        
        // Locate the preferredFullName field by its id and check that it is correct
        const preferredFullNameField = await page.locator('#preferredFullName');
        const value = await preferredFullNameField.inputValue();
        expect(value).toBe('John Doe'); 
    });

    /**Test case 8 NEGATIVE CASE: This test fills out postcode with value of length 1 checks if there is a corresponding error
     */
    it('should fill postcode with invalid postcode of length 1 and check if an error is thrown', async () =>{
        //fill postcode with value of length 1
        await page.fill('#postcode', '3');
        //await error messages appearance
        const errorMessage = await page.locator('div.validation.error span');
        //await firstname and lastname error messages 
        const postcodeErrorMessage = await errorMessage.locator('text=Please enter a valid postcode');
        //validate if the error message is thrown
        expect(await postcodeErrorMessage.isVisible()).toBe(true);
    });

    /**Test case 9 NEGATIVE CASE: This test fills out postcode with value of length 2 checks if there is a corresponding error
     */
    it('should fill postcode with invalid postcode of length 2 and check if an error is thrown', async () =>{
        //fill postcode with value of length 2
        await page.fill('#postcode', '33');
        //await error messages appearance
        const errorMessage = await page.locator('div.validation.error span');
        //await firstname and lastname error messages 
        const postcodeErrorMessage = await errorMessage.locator('text=Please enter a valid postcode');
        //validate if the error message is thrown
        expect(await postcodeErrorMessage.isVisible()).toBe(true);
    });

    /**Test case 10 NEGATIVE CASE: This test fills out postcode with value of length 12 checks if there is a corresponding error
     */
    it('should fill postcode with invalid postcode of length 12 and check if an error is thrown', async () =>{
        //fill postcode with value of length 12
        await page.fill('#postcode', '333333333333');
        //await error messages appearance
        const errorMessage = await page.locator('div.validation.error span');
        //await firstname and lastname error messages 
        const postcodeErrorMessage = await errorMessage.locator('text=Please enter a valid postcode');
        //validate if the error message is thrown
        expect(await postcodeErrorMessage.isVisible()).toBe(true);
    });
    
});
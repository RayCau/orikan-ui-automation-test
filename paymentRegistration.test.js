const { chromium } = require('playwright');

describe ('Payment Form Registration Test', () => {
    let browser;
    let page;

    beforeAll(async () => {
        //launch the browser
        browser = await chromium.launch();
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

        //fill the form with valid input to move to next page
         await page.fill('#firstName', 'John');
         await page.fill('#middleName', 'Lucas');
         await page.fill('#lastName', 'Ramsay');
         await page.fill('#addressLine1', '500 Bourke Street');
         await page.fill('#postcode', '3000');
         await page.fill('#city', 'Melbourne');
         await page.selectOption('#state', { label: 'Tasmania' });
         //set the next button
         const nextButton = await page.locator('.wizard-button.primary');
         // Wait for the button to be present in the dom and visible in the dom before clicking
         await nextButton.waitFor({ state: 'attached' });
         await nextButton.waitFor({ state: 'visible' });
         // Click the next button to move on the payment registration page.
         await nextButton.click();
 
         //wait for the next page to load and wait for card holder name field to be present in the dom
         const cardHolderNameField = await page.locator('#cardHolderName');
         await cardHolderNameField.waitFor({ state: 'attached' }); 
    });

    afterAll(async () => {
        if(browser){
            browser.close();
        }
    })

    afterEach(async()=>{
        if(page){
            page.close();
        }
    })


    /** Test Case 1 SUCCESS: Fill all payment fields with valid visa input and check if the next page has loaded */
    it('should fill all payment fields with valid visa input and check if the next page has loaded', async () =>{
        //fill card holder name with valid input
        await page.fill('#cardHolderName', 'John Halo');
        //select the card type visa radio option
        await page.locator('#cardTypeVISA').click();
        //fill card number with valid input
        await page.fill('#cardNumber', '4639259659502382');
        //fill the card CVV with valid input
        await page.fill('#cardCVV', '719');
        //select expiry month
        await page.selectOption('#cardExpiryMonth', { label: 'August' });
        //select expiry year
        await page.fill('#cardExpiryYear', '2028');

        //set the next button
        const nextButton = await page.locator('.wizard-button.primary');
        // Wait for the button to be present in the dom and visible in the dom before clicking
        await nextButton.waitFor({ state: 'attached' });
        await nextButton.waitFor({ state: 'visible' });
        // Click the next button
        await nextButton.click();

        //wait for the next page to load; terms and conditions
        const termsAndConditionsElement = await page.locator('#termsAndConditions');
        await termsAndConditionsElement.waitFor({ state: 'attached' }); 
        // Assert that the terms and conditions element is visible
        const isVisible = await termsAndConditionsElement.isVisible();
        expect(isVisible).toBe(true); 
    });

    /** Test Case 2 SUCCESS: Fill all payment fields with valid mastercard input and check if the next page has loaded */
    it('should fill all payment fields with valid input and check if the next page has loaded', async () =>{
        //fill card holder name with valid mastercard input
        await page.fill('#cardHolderName', 'John Halo');
        //select the card type mastercard radio option
        await page.locator('#cardTypeMastercard').click();
        //fill card number with valid input
        await page.fill('#cardNumber', '5386396864229724');
        //fill the card CVV with valid input
        await page.fill('#cardCVV', '535');
        //select expiry month
        await page.selectOption('#cardExpiryMonth', { label: 'November' });
        //select expiry year
        await page.fill('#cardExpiryYear', '2029');

        //set the next button
        const nextButton = await page.locator('.wizard-button.primary');
        // Wait for the button to be present in the dom and visible in the dom before clicking
        await nextButton.waitFor({ state: 'attached' });
        await nextButton.waitFor({ state: 'visible' });
        // Click the next button
        await nextButton.click();

        //wait for the next page to load; terms and conditions
        const termsAndConditionsElement = await page.locator('#termsAndConditions');
        await termsAndConditionsElement.waitFor({ state: 'attached' }); 
        // Assert that the terms and conditions element is visible
        const isVisible = await termsAndConditionsElement.isVisible();
        expect(isVisible).toBe(true); 
    });
});

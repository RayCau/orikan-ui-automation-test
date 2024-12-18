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


    /** Test Case 1 POSITIVE case: Fill all payment fields with valid visa input and check if the next page has loaded */
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

    /** Test Case 2 POSITIVE case: Fill all payment fields with valid mastercard input and check if the next page has loaded */
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

    /** Test Case 3 NEGATIVE case: This test does not fill any of the required fields and checks if error messages are thrown for each */
    it('should not fill any payment fields and check if error messages have been provided', async () =>{
        
        //set next button
        const nextButton = await page.locator('.wizard-button.primary');
        // Wait for the button to be present in the dom and visible in the dom before clicking
        await nextButton.waitFor({ state: 'attached' });
        await nextButton.waitFor({ state: 'visible' });
        // Click the next button
        await nextButton.click();

        //await error messages appearance
        const errorMessage = await page.locator('div.validation.error span');
        //await all error messages
        const cardHolderNameErrorMessage = await errorMessage.locator('text=Cardholder Name is required');
        const cardTypeErrorMessage = await errorMessage.locator('text=Card Type is required');
        const cardNumberErrorMessage = await errorMessage.locator('text=Card Number is required');
        const cardCVVErrorMessage = await errorMessage.locator('text=Card CVV is required');
        const cardExpiryMonthErrorMessage = await errorMessage.locator('text=Card Expiry Month is required');
        const cardExpiryYearErrorMessage = await errorMessage.locator('text=Card Expiry Year is required');
        //validate all error messages
        expect(await cardHolderNameErrorMessage.isVisible()).toBe(true);
        expect(await cardTypeErrorMessage.isVisible()).toBe(true);
        expect(await cardNumberErrorMessage.isVisible()).toBe(true);
        expect(await cardCVVErrorMessage.isVisible()).toBe(true);
        expect(await cardExpiryMonthErrorMessage.isVisible()).toBe(true);
        expect(await cardExpiryYearErrorMessage.isVisible()).toBe(true);
    });

    /** Test Case 4 NEGATIVE case: This test fills the card holder name with invalid characters and checks for a corresponding error message */
    it('should provide invalid characters in Card Holder Name and check for a corresponding error message', async () =>{
        
        await page.fill('#cardHolderName', '&^%^&%');
        //await error message appearance
        const errorMessage = await page.locator('div.validation.error span');
        //await all error messages
        const cardHolderNameErrorMessage = await errorMessage.locator('text=Please input a valid Cardholder Name');
        //validate all error messages
        expect(await cardHolderNameErrorMessage.isVisible()).toBe(true);
    });

    /** Test Case 5 NEGATIVE case: This test fills the card holder name with invalid NUMERIC characters and checks for a corresponding error message */
    it('should provide invalid numeric characters in Card Holder Name and check for a corresponding error message', async () =>{
        
        await page.fill('#cardHolderName', '123');
        //await error message appearance
        const errorMessage = await page.locator('div.validation.error span');
        //await all error messages
        const cardHolderNameErrorMessage = await errorMessage.locator('text=Please input a valid Cardholder Name');
        //validate all error messages
        expect(await cardHolderNameErrorMessage.isVisible()).toBe(true);
    });

    /** Test Case 6 NEGATIVE case: This test fills the card number field with input of invalid short length and checks for a corresponding error message */
    it('should provide invalid short length card number and check for a corresponding error message', async () =>{
        
        await page.fill('#cardNumber', '5');
        //await error message appearance
        const errorMessage = await page.locator('div.validation.error span');
        //await all error messages
        const cardHolderNameErrorMessage = await errorMessage.locator('text=Please input a valid Card Number');
        //validate all error messages
        expect(await cardHolderNameErrorMessage.isVisible()).toBe(true);
    });

    /** Test Case 7 NEGATIVE case: This test fills the card number field with input of invalid enormous length and checks for a corresponding error message */
    it('should provide invalid enormous length card number and check for a corresponding error message', async () =>{
        
        //fill card number with invalid input
        await page.fill('#cardNumber', '55555555555555555555555555555');
        //await error message appearance
        const errorMessage = await page.locator('div.validation.error span');
        //await all error messages
        const cardHolderNameErrorMessage = await errorMessage.locator('text=Please input a valid Card Number');
        //validate all error messages
        expect(await cardHolderNameErrorMessage.isVisible()).toBe(true);
    });

    /** Test Case 8 NEGATIVE case: This test fills the card number field with input of valid length but is not valid according to Luhn's algorithm and checks for a corresponding error message */
    it('should provide valid length card number but not valid according to Luhns algorithm and check for a corresponding error message', async () =>{
        
        //fill card number with valid length input but invalid by luhn's algorithm standard
        await page.fill('#cardNumber', '1111111111111111');
        //await error message appearance
        const errorMessage = await page.locator('div.validation.error span');
        //await all error messages
        const cardHolderNameErrorMessage = await errorMessage.locator('text=Please input a valid Card Number');
        //validate all error messages
        expect(await cardHolderNameErrorMessage.isVisible()).toBe(true);
    });

    /** Test Case 9 NEGATIVE case: This test fills the card CVV field with input of invalid length 1 and checks for corresponding error message */
    it('should fill the card CVV field with input of invalid length 1 and checks for corresponding error message', async () =>{
        await page.fill('#cardCVV', '1');
        //await error message appearance
        const errorMessage = await page.locator('div.validation.error span');
        //await all error messages
        const cardHolderNameErrorMessage = await errorMessage.locator('text=Please input a valid card CVV');
        //validate all error messages
        expect(await cardHolderNameErrorMessage.isVisible()).toBe(true);
    });

    /** Test Case 10 NEGATIVE case: This test fills the card CVV field with input of invalid length 2 and checks for corresponding error message */
    it('should fill the card CVV field with input of invalid length 2 and checks for corresponding error message', async () =>{
        await page.fill('#cardCVV', '12');
        //await error message appearance
        const errorMessage = await page.locator('div.validation.error span');
        //await all error messages
        const cardHolderNameErrorMessage = await errorMessage.locator('text=Please input a valid card CVV');
        //validate all error messages
        expect(await cardHolderNameErrorMessage.isVisible()).toBe(true);
    });

    /** Test Case 11 NEGATIVE case: This test fills the card CVV field with input of invalid length >3 and checks for corresponding error message */
    it('should fill the card CVV field with input of invalid length >3 and checks for corresponding error message', async () =>{
        await page.fill('#cardCVV', '12345');
        //await error message appearance
        const errorMessage = await page.locator('div.validation.error span');
        //await all error messages
        const cardHolderNameErrorMessage = await errorMessage.locator('text=Please input a valid card CVV');
        //validate all error messages
        expect(await cardHolderNameErrorMessage.isVisible()).toBe(true);
    });

    /** Test Case 11 NEGATIVE case: This test fills the card expiry year field with input of past year and checks for corresponding error message */
    it('should fill the card expiry year field with input of past year and check for corresponding error message', async () =>{
        // Get the current year
        const currYear = new Date().getFullYear(); 
        //fill card expiry year with year in the past
        await page.fill('#cardExpiryYear', (currYear - 1).toString());
        //await error message appearance
        const errorMessage = await page.locator('div.validation.error span');
        //await all error messages
        const cardHolderNameErrorMessage = await errorMessage.locator('text=Please input a valid card expiry year');
        //validate all error messages
        expect(await cardHolderNameErrorMessage.isVisible()).toBe(true);
    });

    /** Test Case 11 NEGATIVE case: This test fills the card expiry year field with input of year too far into the future and checks for corresponding error message */
    it('should fill the card expiry year field with input of year too far into the future and check for corresponding error message', async () =>{
        // Get the current year
        const currYear = new Date().getFullYear(); 
        //fill card expiry year with year in the past
        await page.fill('#cardExpiryYear', (currYear + 30).toString());
        //await error message appearance
        const errorMessage = await page.locator('div.validation.error span');
        //await all error messages
        const cardHolderNameErrorMessage = await errorMessage.locator('text=Please input a valid card expiry year');
        //validate all error messages
        expect(await cardHolderNameErrorMessage.isVisible()).toBe(true);
    });
});

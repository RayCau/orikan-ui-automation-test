const { chromium } = require('playwright');

describe ('Payment Form Registration Test', () => {
    let browser;
    let page;

    beforeAll(async () => {
        //launch the browser
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

        //fill the form with valid input to move to next page
         await page.fill('#firstName', 'John');
         await page.fill('#middleName', 'Lucas');
         await page.fill('#lastName', 'Ramsay');
         await page.fill('#addressLine1', '500 Bourke Street');
         await page.fill('#postcode', '3000');
         await page.fill('#city', 'Melbourne');
         await page.selectOption('#state', { label: 'Tasmania' });
         //set the next button
         const nextButton1 = await page.locator('.wizard-button.primary');
         // Wait for the button to be present in the dom and visible in the dom before clicking
         await nextButton1.waitFor({ state: 'attached' });
         await nextButton1.waitFor({ state: 'visible' });
         // Click the next button to move on the payment registration page.
         await nextButton1.click();
 
         //wait for the next page to load and wait for card holder name field to be present in the dom
         const cardHolderNameField = await page.locator('#cardHolderName');
         await cardHolderNameField.waitFor({ state: 'attached' }); 

         //fill card holder name with valid input
        await page.fill('#cardHolderName', 'John Ramsay Lucas');
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
        const nextButton2 = await page.locator('.wizard-button.primary');
        // Wait for the button to be present in the dom and visible in the dom before clicking
        await nextButton2.waitFor({ state: 'attached' });
        await nextButton2.waitFor({ state: 'visible' });
        // Click the next button
        await nextButton2.click();
        //wait for the next page to load and wait for TERMS AND CONDITIONS to be present in the dom
        const termsAndConditions = await page.locator('#termsAndConditions');
        await termsAndConditions.waitFor({ state: 'attached' }); 
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

    /** Test Case 1 POSITIVE case: Scroll to the bottom of the terms and conditions, click the agree button and submit the form */
    it('should scroll to bottom of terms and condition text area, click the agree button and submit', async () =>{
        await page.evaluate(() => {
            // set textArea
            const termsAndConditions = document.querySelector('#termsAndConditions');
            // Scroll to the bottom of terms and conditions
            termsAndConditions.scrollTop = termsAndConditions.scrollHeight; 
        });

        await page.locator('#agreedToTerms').check();

        const submitButton = await page.locator('.wizard-button.primary');
        // Wait for the submit button to be present in the dom and visible in the dom before clicking
        await submitButton.waitFor({ state: 'attached' });
        await submitButton.waitFor({ state: 'visible' });
        // Click the submit button
        await submitButton.click();

        // Wait for the wizard content to be present in the DOM
        await page.waitForSelector('.wizard-content');
        //select the response message via the class which the 2nd paragraph resides 
        await page.waitForSelector('.ng-untouched.ng-pristine.ng-valid p:nth-of-type(2)', { state: 'visible' });
        // Get the text content of the message
        const completionMessage = await page.textContent('.ng-untouched.ng-pristine.ng-valid p:nth-of-type(2)');
        // Validate the completion message
        expect(completionMessage.trim()).toBe('Your user account john@gmail.com has been successfully registered.');
    });

    /** Test Case 2 NEGATIVE case: Do not scroll to the bottom of terms and conditions click the submit button and check if error is thrown*/
    it('should scroll to bottom of terms and condition text area, click the agree button and submit', async () =>{
        const submitButton = await page.locator('.wizard-button.primary');
        // Wait for the submit button to be present in the dom and visible in the dom before clicking
        await submitButton.waitFor({ state: 'attached' });
        await submitButton.waitFor({ state: 'visible' });
        // Click the submit button
        await submitButton.click();

        const errorMessage = await page.locator('.validation.error span');
        const readTCErrorMessage = await errorMessage.locator('text=You must first read all the terms and conditions before submitting');
        // await page.pause();
        expect(await readTCErrorMessage.isVisible()).toBe(true);
    });

    /** Test Case 3 NEGATIVE case: Scroll to the bottom of terms and conditions click the submit button without clicking agree and check if error is thrown*/
    it('should scroll to bottom of terms and condition text area, click the agree button and submit', async () =>{
        await page.evaluate(() => {
            // set terms and conditions area
            const termsAndConditions = document.querySelector('#termsAndConditions');
            // Scroll to the bottom of terms and conditions
            termsAndConditions.scrollTop = termsAndConditions.scrollHeight; 
        });

        // Click the Submit button without agreeing to the terms
        const submitButton = await page.locator('.wizard-button.primary');
        await submitButton.waitFor({ state: 'attached' });
        await submitButton.waitFor({ state: 'visible' });
        await submitButton.click();

         // Find the error message that should be shown if the user hasn't agreed to terms
        const errorMessage = await page.locator('.validation.error span');
        const agreeErrorMessage = await errorMessage.locator('text=You must agree to these terms and conditions before submitting');

        // Assert that the error message is visible
        expect(await agreeErrorMessage.isVisible()).toBe(true);
    });
});

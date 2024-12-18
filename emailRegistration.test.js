const { chromium } = require('playwright');

describe('Email Form Registration Test', () => {
  let browser;
  let page;

  beforeAll(async () => {
    //store instance of launched chromium browser in browser obj
    browser = await chromium.launch();
  });

  beforeEach(async () => {
    //reinstantiate instance of page launching new chromium browser for each test
    page = await browser.newPage();
    //go to the website
    await page.goto('https://orikan-ui-automation-test.azurewebsites.net/');
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


    /** Test case 1 POSITIVE CASE: Form submission test case should submit */
    it('should fill out the email form field with simple input and submit successfully', async () => {
        //fill the email, password, and confirmPassword fields
        await page.fill('#emailAddress', 'john@gmail.com');
        await page.fill('#password', '12345');
        await page.fill('#confirmPassword', '12345');
        //click next button to submit form
        await page.click('.wizard-button.primary');
        //wait for success message and verify the success message
        const successMessage = await page.textContent('.toast-message.success.active'); 
        expect(successMessage).toBe('Email address is available for registration');
    });

    /** Test case 2 POSITIVE CASE: Form submission with alphanumeric email */
    it('should fill out the email form field with alphanumeric email and submit successfully', async () => {
        await page.fill('#emailAddress', 'john.halo123@gmail.com');
        await page.fill('#password', '12345');
        await page.fill('#confirmPassword', '12345');

        await page.click('.wizard-button.primary');

        const successMessage = await page.textContent('.toast-message.success.active'); 
        expect(successMessage).toBe('Email address is available for registration');
    });

    /**  Test case 3 POSITIVE CASE: Form submission alternative email */
    it('should fill out the email form field with alternate email and submit succesfully', async () =>{
        await page.fill('#emailAddress','john.halo@company.com');
        await page.fill('#password', '12345');
        await page.fill('#confirmPassword', '12345');

        await page.click('.wizard-button.primary');

        const successMessage = await page.textContent('.toast-message.success.active');
        expect (successMessage).toBe('Email address is available for registration');
    });

    /** Test case 4 NEGATIVE CASE: Form submission should throw an error message under email field because there is no input. */
    it('should NOT fill the email field and throw error message under the email field', async () =>{
        //do not fill email address field
        //input valid password
        await page.fill('#emailAddress', '');
        await page.fill('#password', '12345');
        await page.fill('#confirmPassword', '12345');
        await page.click('.wizard-button.primary');

        // Validate error message
        const errorMessage = await page.textContent('div.validation.error span');
        expect(errorMessage).toBe('Email Address is required');
    });

    /** Test case 5 NEGATIVE CASE: Form submission should throw an error message for password field since it is not filled. */
    it('should not fill the password field and throw error message under the field.', async () =>{
        await page.fill('#emailAddress', 'valid@company.com');
        await page.fill('#password', '');
        await page.fill('#confirmPassword', '12345');
        await page.click('.wizard-button.primary');

        const errorMessage = await page.textContent('div.validation.error span');
        expect(errorMessage).toBe('Password is required.');
    });

    /** Test case 6 NEGATIVE CASE: Form submission should throw an error message for confirmPassword field since it is not filled. */
    it('should not fill the confirmPassword field and throw error message under the field.', async () =>{
        await page.fill('#emailAddress', 'valid@company.com');
        await page.fill('#password', '12345');
        await page.fill('#confirmPassword', '');
        await page.click('.wizard-button.primary');

        const errorMessage = await page.textContent('div.validation.error span');
        expect(errorMessage).toBe('Confirm Password is required');
    });

    /** Test case 7 NEGATIVE CASE: Form submission should throw an error message since the email is already registered. */
    it('should test if an error message pop-up is thrown when an email is used that is already registered', async () =>{
        //input pre-registered email
        await page.fill('#emailAddress', 'adam@orikan.com');
        //input valid password and confirmPassword
        await page.fill('#password','12345');
        await page.fill('#confirmPassword', '12345');
        //click next button
        await page.click('.wizard-button.primary');

        //validate toast message error thrown is valid
        const errorMessage = await page.textContent('.toast-message.error.active');
        expect(errorMessage).toBe('Email address is already registered');
    })

    /** Test case 8 NEGATIVE CASE: Test for case insensitivity in the system */
    it('should test if an error message pop-up is thrown when an email with capitalised letters is used but is already registered', async () =>{
        //input pre-registered email with alternate capitalisation
        await page.fill('#emailAddress', 'Adam@Orikan.com');
        //input valid password and confirmPassword
        await page.fill('#password','12345');
        await page.fill('#confirmPassword', '12345');
        //click next button
        await page.click('.wizard-button.primary');

        //validate toast message error thrown is valid
        const errorMessage = await page.textContent('.toast-message.error.active');
        expect(errorMessage).toBe('Email address is already registered');
    })

    /** Test case 9 NEGATIVE CASE: User should NOT be able to click on the next button after clicking it once, so the button must be disabled after the first click. */
    it('should test if the button is disabled after the first click', async () =>{
        await page.fill('#emailAddress', 'valid@company.com');
        await page.fill('#password','1234');
        await page.fill('#confirmPassword', '1234');

        await page.click('.wizard-button.primary');
        const boolIsButtonDisabled = await page.isDisabled('.wizard-button.primary');
        expect(boolIsButtonDisabled).toBe(true);
    });
    
    /**
     * Test Case 10: When the user clicks the next button on an unsuccessful registration, 
     * the page indicator should not fill in the next page as though the user has moved on.
     */
    it('should test if the circle wizard icon for contact does not fill when clicking next or unsuccessful email registration', async () =>{
      //valid email input
      await page.fill('#emailAddress', 'valid@company.com');
      //blank invalid password input
      await page.fill('#password','');
      await page.fill('#confirmPassword', '');

      //click next button
      await page.click('.wizard-button.primary');
      
      //locate the circle pertaining to the contact page of the form 
      const contactCircle = page.locator('app-wizard-page-item[title="Contact"] circle.wizard-icon');
      //check that it is not filled
      expect(fillValue).not.toBeNull();
      expect(await contactCircle.getAttribute('fill')).toBe('none');
  });
});

const { chromium } = require("playwright")
// const expect = require("expect")

;(async () => {
  const browser = await chromium.launch({ headless: false, slowMo: 1200 })
  const context = await browser.newContext()
  const page = await context.newPage()

  await page.goto("https://fakeshop-woad.vercel.app/login")

  await page.click("text='Don't have an account? Sign Up'")

  const testCases = [
    {
      description: "Full name is empty",
      fullName: "",
      email: "testuser@example.com",
      password: "testpassword",
      confirmPassword: "testpassword",
      expectedMessage: "Please enter your name",
    },
    {
      description: "Password is different from the confirm password",
      fullName: "Test User",
      email: "testuser@example.com",
      password: "testpassword",
      confirmPassword: "disfrepassword",
      expectedMessage: "Not correct , please enter again",
    },
    {
      description: "Password shorter than 6 characters",
      fullName: "Test User",
      email: "testuser@example.com",
      password: "test",
      confirmPassword: "test",
      expectedMessage: "Please enter as least as 6 character",
    },
    {
      description: "Email already exists",
      fullName: "Test User",
      email: "testuser@example.com",
      password: "testtest",
      confirmPassword: "testtest",
      expectedMessage: "✖️This email already exists",
    },
    {
      description: "Email valid",
      fullName: "Test User",
      email: "testuser@example",
      password: "testtest",
      confirmPassword: "testtest",
      expectedMessage: "Please enter valid email",
    },
    {
      description: "Successful account registration",
      fullName: "Tin Juan Khong Anh",
      email: "juannhaem11111@example.com",
      password: "testtest",
      confirmPassword: "testtest",
      expectedMessage: "✅Register successfully.",
    },
  ]

  let passedTests = 0

  for (const testCase of testCases) {
    await page.fill('input[name="userName"]', testCase.fullName)
    await page.fill('input[name="email"]', testCase.email)
    await page.fill('input[name="password"]', testCase.password)
    await page.fill('input[name="retypePassword"]', testCase.confirmPassword)

    await page.click('button[type="submit"]')

    // await page.waitForSelector('text="' + testCase.expectedMessage + '"')
    try {
      await page.waitForSelector('text="' + testCase.expectedMessage + '"', {
        timeout: 6000,
      })
    } catch (error) {
      console.log("Test failed")
    }

    const errorMessage = await page.isVisible(
      'text="' + testCase.expectedMessage + '"'
    )
    if (errorMessage) {
      console.log(testCase.description + ": Passed")
      passedTests++
    } else {
      console.log(testCase.description + ": Failed")
    }
  }

  console.log("Passed " + passedTests + "/" + testCases.length + " tests")

  await browser.close()
})()

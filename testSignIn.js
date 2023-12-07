const { chromium } = require("playwright")
// const expect = require("expect")

;(async () => {
  const browser = await chromium.launch({ headless: false, slowMo: 1200 })
  const context = await browser.newContext()
  const page = await context.newPage()

  await page.goto("https://fakeshop-woad.vercel.app/login")

  const testCases = [
    {
      description: "Email and password is empty",
      email: "",
      password: "",
      expectedMessage: "Hãy nhập Email của bạn !",
    },
    {
      description: "Email is empty",
      email: "",
      password: "testtest",
      expectedMessage: "Hãy nhập Email của bạn !",
    },
    {
      description: "Password is empty",
      email: "juannhaem@example.com",
      password: "",
      expectedMessage: "Hãy nhập Password của bạn !",
    },
    {
      description: "Valid Email",
      email: "tinjuankoa@123.",
      password: "",
      expectedMessage: "Hãy nhập Email hợp lệ !",
    },
    {
      description: "Wrong password",
      email: "juannhaem@example.com",
      password: "test",
      expectedMessage: "✖️Login Failed",
    },
    {
      description: "Login Successfully",
      email: "botamhuyet@gmail.com",
      password: "botamhuyet",
      expectedMessage: "✅Login Successfully",
    },
  ]

  let passedTests = 0

  for (const testCase of testCases) {
    await page.fill('input[name="email"]', testCase.email)
    await page.fill('input[name="password"]', testCase.password)

    await page.click('button[type="submit"]')

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

  //   console.log("Passed " + passedTests + "/" + testCases.length + " tests")

  await page.evaluate(() => {
    window.scrollBy(0, window.innerHeight + 300)
  })

  await page.waitForTimeout(1000)

  const firstProduct = await page.$(".productItem-imgContainer")

  await firstProduct.hover()
  await page.waitForTimeout(2000)

  await firstProduct.click()

  try {
    await page.waitForSelector(
      'text="Fjallraven - Foldsack No. 1 Backpack, Fits 15 Laptops"',
      { timeout: 10000 }
    )
    console.log("Navigation to product: Passed")
    passedTests++
  } catch (error) {
    console.log("Navigation to product: Failed")
    console.log("Error: ", error)
  }

  console.log("Passed " + passedTests + "/" + (testCases.length + 1) + " tests")

  await browser.close()
})()

import { faker } from "@faker-js/faker"

import { test, expect } from "../fixtures/tokenizedPage"
import { euAddress, euAddress2, euAddress3 } from "../utils/addresses"

test.describe("without addresses", () => {
  const customerEmail = faker.internet.email().toLocaleLowerCase()
  const customerPassword = faker.internet.password()

  test.use({
    defaultParams: {
      order: "with-items",
      customer: {
        email: customerEmail,
        password: customerPassword,
      },
      lineItemsAttributes: [
        { sku_code: "CANVASAU000000FFFFFF1824", quantity: 1 },
      ],
    },
  })

  test("multiple address changes", async ({ checkoutPage }) => {
    await checkoutPage.checkOrderSummary("Order Summary")

    await checkoutPage.page.locator(`text=${customerEmail}`)

    await checkoutPage.setBillingAddress(euAddress)

    await checkoutPage.checkStep("Customer", "open")

    await checkoutPage.save("Customer")

    await checkoutPage.checkStep("Shipping", "open")

    await checkoutPage.clickStep("Customer")

    await checkoutPage.checkBillingAddress(euAddress)

    await checkoutPage.shipToDifferentAddress()

    await checkoutPage.checkShipToDifferentAddressValue(true)

    await checkoutPage.setShippingAddress()

    await checkoutPage.save("Customer")

    await checkoutPage.clickStep("Customer")
    await checkoutPage.checkBillingAddress(euAddress)
    await checkoutPage.checkShippingAddress(euAddress2)

    await checkoutPage.setBillingAddress(euAddress3)

    await checkoutPage.save("Customer")
    await checkoutPage.clickStep("Customer")

    await checkoutPage.checkBillingAddress(euAddress3)
    await checkoutPage.checkShippingAddress(euAddress2)

    await checkoutPage.shipToDifferentAddress()

    await checkoutPage.checkShipToDifferentAddressValue(false)

    await checkoutPage.save("Customer")

    await checkoutPage.clickStep("Customer")

    await checkoutPage.checkShipToDifferentAddressValue(false)

    const element = await checkoutPage.page.locator(
      'h3:has-text("Shipping Address")'
    )

    await expect(element).not.toBeVisible()
  })
})

test.describe("same addresses", () => {
  const customerEmail = faker.internet.email().toLocaleLowerCase()
  const customerPassword = faker.internet.password()

  test.use({
    defaultParams: {
      order: "with-items",
      customer: {
        email: customerEmail,
        password: customerPassword,
      },
      lineItemsAttributes: [
        { sku_code: "CANVASAU000000FFFFFF1824", quantity: 1 },
      ],
      addresses: {
        billingAddress: euAddress,
        sameShippingAddress: true,
      },
    },
  })

  test("multiple updates", async ({ checkoutPage }) => {
    await checkoutPage.checkOrderSummary("Order Summary")

    await checkoutPage.page.locator(`text=${customerEmail}`)

    await checkoutPage.checkStep("Customer", "close")

    await checkoutPage.clickStep("Customer")

    await checkoutPage.checkBillingAddress(euAddress)

    await checkoutPage.setBillingAddress(euAddress3)

    await checkoutPage.save("Customer")

    await checkoutPage.clickStep("Customer")

    await checkoutPage.checkBillingAddress(euAddress3)
    await checkoutPage.clickStep("Customer")

    await checkoutPage.shipToDifferentAddress()

    await checkoutPage.setShippingAddress(euAddress2)

    await checkoutPage.save("Customer")

    await checkoutPage.clickStep("Customer")

    await checkoutPage.checkShippingAddress(euAddress2)

    await checkoutPage.shipToDifferentAddress()

    await checkoutPage.checkShipToDifferentAddressValue(false)

    await checkoutPage.save("Customer")

    await checkoutPage.clickStep("Customer")

    await checkoutPage.checkShipToDifferentAddressValue(false)

    const element = await checkoutPage.page.locator(
      'h3:has-text("Shipping Address")'
    )

    await expect(element).not.toBeVisible()
  })
})

test.describe("different addresses", () => {
  const customerEmail = faker.internet.email().toLocaleLowerCase()
  const customerPassword = faker.internet.password()

  test.use({
    defaultParams: {
      order: "with-items",
      customer: {
        email: customerEmail,
        password: customerPassword,
      },
      lineItemsAttributes: [
        { sku_code: "CANVASAU000000FFFFFF1824", quantity: 1 },
      ],
      addresses: {
        billingAddress: euAddress,
        shippingAddress: euAddress2,
      },
    },
  })

  test("check addresses", async ({ checkoutPage }) => {
    await checkoutPage.checkOrderSummary("Order Summary")

    await checkoutPage.page.locator(`text=${customerEmail}`)

    await checkoutPage.checkStep("Customer", "close")

    await checkoutPage.clickStep("Customer")

    await checkoutPage.checkBillingAddress(euAddress)
    await checkoutPage.checkShippingAddress(euAddress2)
  })
})

test.describe("address on wallet", () => {
  const customerEmail = faker.internet.email().toLocaleLowerCase()
  const customerPassword = faker.internet.password()

  test.use({
    defaultParams: {
      order: "with-items",
      customer: {
        email: customerEmail,
        password: customerPassword,
      },
      lineItemsAttributes: [
        { sku_code: "CANVASAU000000FFFFFF1824", quantity: 1 },
      ],
    },
  })

  test("save one address on wallet", async ({ checkoutPage }) => {
    await checkoutPage.checkOrderSummary("Order Summary")

    await checkoutPage.setBillingAddress(euAddress)

    const element = checkoutPage.getSaveAddressBookCheckbox("billing")
    await expect(element).not.toBeChecked()
    await element.check()

    await checkoutPage.save("Customer")
    await checkoutPage.selectShippingMethod({ text: "Standard Shipping" })

    await checkoutPage.save("Shipping")

    await checkoutPage.selectPayment("stripe")

    await checkoutPage.setPayment("stripe")

    await checkoutPage.save("Payment")
  })

  test("use address on wallet", async ({ checkoutPage }) => {
    await checkoutPage.checkOrderSummary("Order Summary")

    await checkoutPage.checkStep("Customer", "close")
    await checkoutPage.checkStep("Shipping", "open")

    await checkoutPage.clickStep("Customer")
    await checkoutPage.checkStep("Customer", "open")

    await checkoutPage.checkSelectedAddressBook({
      type: "billing",
      address: euAddress,
    })

    const element = checkoutPage.getSaveAddressBookCheckbox("billing")

    await expect(element).toHaveCount(0)

    await checkoutPage.save("Customer")

    await checkoutPage.clickStep("Customer")

    await checkoutPage.checkSelectedAddressBook({
      type: "billing",
      address: euAddress,
    })
    await checkoutPage.openNewAddress("billing")

    await checkoutPage.setBillingAddress(euAddress2)

    await checkoutPage.save("Customer")

    await checkoutPage.clickStep("Customer")

    await checkoutPage.checkBillingAddress(euAddress2)

    await checkoutPage.shipToDifferentAddress()

    await checkoutPage.openNewAddress("shipping")

    await checkoutPage.setShippingAddress(euAddress)

    await checkoutPage.save("Customer")

    await checkoutPage.clickStep("Customer")

    await checkoutPage.checkShippingAddress(euAddress)

    await checkoutPage.closeNewAddress("shipping")

    await checkoutPage.selectAddressOnBook({ type: "shipping", index: 0 })

    await checkoutPage.page.waitForTimeout(1000)

    await checkoutPage.save("Customer")

    await checkoutPage.clickStep("Customer")

    await checkoutPage.checkBillingAddress(euAddress2)

    await checkoutPage.checkSelectedAddressBook({
      type: "shipping",
      address: euAddress,
    })

    await checkoutPage.closeNewAddress("billing")
    await checkoutPage.selectAddressOnBook({ type: "billing", index: 0 })
    await checkoutPage.page.waitForTimeout(1000)

    await checkoutPage.save("Customer")

    await checkoutPage.clickStep("Customer")

    await checkoutPage.checkSelectedAddressBook({
      type: "billing",
      address: euAddress,
    })

    await checkoutPage.checkShipToDifferentAddressValue(false)

    await checkoutPage.save("Customer")
    await checkoutPage.selectShippingMethod({ text: "Standard Shipping" })

    await checkoutPage.save("Shipping")
    await checkoutPage.selectPayment("stripe")

    await checkoutPage.setPayment("stripe")

    await checkoutPage.save("Payment")
  })
})

test.describe("two address on wallet", () => {
  const customerEmail = faker.internet.email().toLocaleLowerCase()
  const customerPassword = faker.internet.password()

  test.use({
    defaultParams: {
      order: "with-items",
      customer: {
        email: customerEmail,
        password: customerPassword,
      },
      lineItemsAttributes: [
        { sku_code: "CANVASAU000000FFFFFF1824", quantity: 1 },
      ],
      customerAddresses: [euAddress, euAddress2],
    },
  })

  test("check addresses", async ({ checkoutPage }) => {
    await checkoutPage.checkOrderSummary("Order Summary")

    await checkoutPage.page.locator(`text=${customerEmail}`)

    await checkoutPage.checkStep("Customer", "open")

    const element = await checkoutPage.page.locator(
      "[data-cy=customer-billing-address]"
    )
    await expect(element).toHaveCount(2)

    await checkoutPage.selectAddressOnBook({ type: "billing", index: 0 })
    await checkoutPage.page.waitForTimeout(1000)

    await checkoutPage.save("Customer")

    await checkoutPage.checkStep("Customer", "close")
    await checkoutPage.checkStep("Shipping", "open")

    await checkoutPage.clickStep("Customer")

    await checkoutPage.checkSelectedAddressBook({
      type: "billing",
      address: euAddress,
    })

    await checkoutPage.selectAddressOnBook({ type: "billing", index: 1 })
    await checkoutPage.page.waitForTimeout(1000)

    await checkoutPage.save("Customer")
    await checkoutPage.clickStep("Customer")

    await checkoutPage.checkSelectedAddressBook({
      type: "billing",
      address: euAddress2,
    })

    await checkoutPage.openNewAddress("billing")

    await checkoutPage.setBillingAddress(euAddress2)

    await checkoutPage.save("Customer")

    await checkoutPage.clickStep("Customer")

    await checkoutPage.checkBillingAddress(euAddress2)

    await checkoutPage.shipToDifferentAddress()

    await checkoutPage.openNewAddress("shipping")

    await checkoutPage.setShippingAddress(euAddress3)

    await checkoutPage.save("Customer")
    await checkoutPage.clickStep("Customer")

    await checkoutPage.checkBillingAddress(euAddress2)

    await checkoutPage.checkShippingAddress(euAddress3)

    await checkoutPage.closeNewAddress("shipping")

    await checkoutPage.selectAddressOnBook({ type: "shipping", index: 1 })

    await checkoutPage.page.waitForTimeout(1000)

    await checkoutPage.save("Customer")
    await checkoutPage.clickStep("Customer")

    await checkoutPage.checkBillingAddress(euAddress2)
    await checkoutPage.checkSelectedAddressBook({
      type: "shipping",
      address: euAddress2,
    })
    await checkoutPage.closeNewAddress("billing")

    await checkoutPage.selectAddressOnBook({ type: "billing", index: 1 })

    await checkoutPage.page.waitForTimeout(1000)
    await checkoutPage.save("Customer")

    await checkoutPage.clickStep("Customer")

    await checkoutPage.checkSelectedAddressBook({
      type: "billing",
      address: euAddress,
    })
  })
})

test.describe("two address on wallet and code lock", () => {
  const customerEmail = faker.internet.email().toLocaleLowerCase()
  const customerPassword = faker.internet.password()

  test.use({
    defaultParams: {
      order: "with-items",
      orderAttributes: {
        shipping_country_code_lock: "IT",
      },
      customer: {
        email: customerEmail,
        password: customerPassword,
      },
      lineItemsAttributes: [
        { sku_code: "CANVASAU000000FFFFFF1824", quantity: 1 },
      ],
      customerAddresses: [euAddress, euAddress2],
    },
  })

  test("check addresses", async ({ checkoutPage }) => {
    await checkoutPage.checkOrderSummary("Order Summary")

    await checkoutPage.page.locator(`text=${customerEmail}`)

    await checkoutPage.checkStep("Customer", "open")

    let element = await checkoutPage.page.locator(
      "[data-cy=customer-billing-address]"
    )
    await expect(element).toHaveCount(2)

    await checkoutPage.selectAddressOnBook({ type: "billing", index: 0 })
    await checkoutPage.page.waitForTimeout(1000)

    await checkoutPage.save("Customer")

    await checkoutPage.checkStep("Customer", "close")
    await checkoutPage.checkStep("Shipping", "open")

    await checkoutPage.clickStep("Customer")

    await checkoutPage.checkSelectedAddressBook({
      type: "billing",
      address: euAddress,
    })

    await checkoutPage.checkShipToDifferentAddressValue(false)
    await checkoutPage.checkShipToDifferentAddressEnabled(true)

    element = await checkoutPage.page.locator("[data-cy=shipping-address]")

    await expect(element).not.toBeVisible()

    await checkoutPage.selectAddressOnBook({ type: "billing", index: 1 })
    await checkoutPage.page.waitForTimeout(1000)

    await checkoutPage.checkShipToDifferentAddressValue(true)
    await checkoutPage.checkShipToDifferentAddressEnabled(false)

    element = await checkoutPage.page.locator(
      "[data-cy=shipping-address] >> text=Shipping Address"
    )

    await expect(element).toBeVisible()

    element = await checkoutPage.page.locator(
      `[data-cy=customer-shipping-address]:near(:text("Shipping Address")) >> text=(IT)`
    )
    await expect(element).toHaveCount(1)

    element = await checkoutPage.page.locator(
      `[data-cy=customer-shipping-address]:near(:text("Shipping Address")) >> text=(FR)`
    )
    await expect(element).toHaveCount(0)

    await checkoutPage.checkSelectedAddressBook({
      type: "shipping",
      address: euAddress,
    })

    element = await checkoutPage.page.locator(
      "[data-test-id=save-customer-button]"
    )
    await expect(element).toBeEnabled()

    await checkoutPage.checkSelectedAddressBook({
      type: "billing",
      address: euAddress2,
    })

    await checkoutPage.save("Customer")
    await checkoutPage.clickStep("Customer")

    await checkoutPage.checkSelectedAddressBook({
      type: "billing",
      address: euAddress2,
    })

    await checkoutPage.openNewAddress("billing")

    await checkoutPage.setBillingAddress(euAddress2)

    await checkoutPage.save("Customer")

    await checkoutPage.clickStep("Customer")

    await checkoutPage.checkBillingAddress(euAddress2)

    await checkoutPage.checkSelectedAddressBook({
      type: "shipping",
      address: euAddress,
    })

    await checkoutPage.checkShipToDifferentAddressValue(true)
    await checkoutPage.checkShipToDifferentAddressEnabled(false)

    await checkoutPage.selectCountry("billing_address", "IT")
    await checkoutPage.selectState("billing_address", "FI")

    await checkoutPage.checkShipToDifferentAddressValue(true)
    await checkoutPage.checkShipToDifferentAddressEnabled(true)

    await checkoutPage.save("Customer")

    await checkoutPage.clickStep("Customer")

    await checkoutPage.checkShipToDifferentAddressValue(true)

    await checkoutPage.openNewAddress("shipping")

    await checkoutPage.setShippingAddress(euAddress3)

    await checkoutPage.save("Customer")
    await checkoutPage.clickStep("Customer")

    await checkoutPage.checkBillingAddress({
      ...euAddress2,
      country_code: "IT",
      state_code: "FI",
    })

    await checkoutPage.checkShippingAddress(euAddress3)

    await checkoutPage.closeNewAddress("shipping")

    element = await checkoutPage.page.locator(
      "data-test-id=save-customer-button"
    )
    await expect(element).toBeDisabled()

    await checkoutPage.selectAddressOnBook({ type: "shipping", index: 0 })
    await checkoutPage.page.waitForTimeout(1000)

    await checkoutPage.save("Customer")
    await checkoutPage.clickStep("Customer")

    await checkoutPage.checkBillingAddress({
      ...euAddress2,
      country_code: "IT",
      state_code: "FI",
    })
    await checkoutPage.checkSelectedAddressBook({
      type: "shipping",
      address: euAddress,
    })

    await checkoutPage.closeNewAddress("billing")

    await checkoutPage.selectAddressOnBook({ type: "billing", index: 0 })

    await checkoutPage.page.waitForTimeout(1000)
    await checkoutPage.save("Customer")

    await checkoutPage.clickStep("Customer")

    await checkoutPage.checkShipToDifferentAddressValue(false)
    await checkoutPage.checkShipToDifferentAddressEnabled(true)

    await checkoutPage.checkSelectedAddressBook({
      type: "billing",
      address: euAddress,
    })
  })
})

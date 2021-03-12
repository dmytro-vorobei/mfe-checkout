import { AddressCollection } from "@commercelayer/js-sdk"
import {
  AddressesContainer,
  BillingAddressForm,
  SaveAddressesButton,
  ShippingAddressForm,
  CustomerContainer,
  BillingAddressContainer,
  Address,
  AddressField,
  ShippingAddressContainer,
} from "@commercelayer/react-components"
import { faPlus } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useState, Fragment, useEffect } from "react"
import styled from "styled-components"
import "twin.macro"

import { useTranslation } from "components/data/i18n"
import { ButtonCss } from "components/ui/Button"
import { Toggle } from "components/ui/Toggle"

import { AddressButtonAddNew } from "./AddressButtonAddNew"
import { AddressSectionEmail } from "./AddressSectionEmail"
import { AddressSectionSaveForm } from "./AddressSectionSaveForm"
import { AddressSectionSaveOnAddressBook } from "./AddressSectionSaveOnAddressBook"
import { AddressSectionTitle } from "./AddressSectionTitle"
import { BillingAddressFormNew } from "./BillingAddressFormNew"
import { ShippingAddressFormNew } from "./ShippingAddressFormNew"

interface Props {
  billingAddress: AddressCollection | null
  shippingAddress: AddressCollection | null
  hasSameAddresses: boolean
  isUsingNewBillingAddress: boolean
  isUsingNewShippingAddress: boolean
  hasCustomerAddresses: boolean
  isGuest: boolean
  emailAddress: string
  refetchOrder: () => void
}

export const CheckoutCustomerAddresses: React.FC<Props> = ({
  billingAddress,
  shippingAddress,
  isUsingNewBillingAddress,
  isUsingNewShippingAddress,
  hasSameAddresses,
  hasCustomerAddresses,
  isGuest,
  emailAddress,
  refetchOrder,
}: Props) => {
  const { t } = useTranslation()

  const [
    billingAddressFill,
    setBillingAddressFill,
  ] = useState<AddressCollection | null>(billingAddress)
  const [
    shippingAddressFill,
    setShippingAddressFill,
  ] = useState<AddressCollection | null>(shippingAddress)

  const [shipToDifferentAddress, setShipToDifferentAddress] = useState<boolean>(
    !hasSameAddresses
  )

  const [showBillingAddressForm, setShowBillingAddressForm] = useState<boolean>(
    isUsingNewBillingAddress
  )
  const [
    showShippingAddressForm,
    setShowShippingAddressForm,
  ] = useState<boolean>(isUsingNewShippingAddress)

  useEffect(() => {
    if (shipToDifferentAddress && !hasCustomerAddresses) {
      setShippingAddressFill(null)
      setShowShippingAddressForm(true)
    }
  }, [shipToDifferentAddress])

  const handleShowBillingForm = () => {
    setBillingAddressFill(null)
    setShowBillingAddressForm(!showBillingAddressForm)
  }

  const handleShowShippingForm = () => {
    setShippingAddressFill(null)
    setShowShippingAddressForm(!showShippingAddressForm)
  }

  const handleToggle = () => {
    if (!hasCustomerAddresses) {
      handleShowShippingForm()
    }
    if (hasCustomerAddresses) {
      setShowShippingAddressForm(false)
    }
    setShipToDifferentAddress(!shipToDifferentAddress)
  }

  return (
    <Fragment>
      <AddressSectionEmail isGuest={isGuest} emailAddress={emailAddress} />
      <CustomerContainer>
        <AddressesContainer shipToDifferentAddress={shipToDifferentAddress}>
          <AddressSectionTitle>
            {t(`addressForm.billing_address_title`)}
          </AddressSectionTitle>
          <BillingAddressContainer>
            <AddressCardComponent
              addressType="billing"
              deselect={showBillingAddressForm}
              onSelect={() =>
                showBillingAddressForm && setShowBillingAddressForm(false)
              }
            />
          </BillingAddressContainer>
          <>
            {!showBillingAddressForm && hasCustomerAddresses && (
              <button
                tw="w-1/2 p-2 mb-5 text-left border rounded cursor-pointer hover:border-primary shadow-sm"
                data-cy="add_new_billing_address"
                onClick={handleShowBillingForm}
              >
                <FontAwesomeIcon icon={faPlus} tw="mr-3" />
                {shipToDifferentAddress
                  ? t("stepCustomer.addNewBillingAddress")
                  : t("stepCustomer.addNewAddress")}
              </button>
            )}
          </>
          <div
            className={
              showBillingAddressForm || !hasCustomerAddresses ? "" : "hidden"
            }
          >
            <BillingAddressForm
              autoComplete="on"
              className="p-2"
              reset={!showBillingAddressForm}
            >
              {showBillingAddressForm ? (
                <>
                  <BillingAddressFormNew billingAddress={billingAddressFill} />
                  <AddressSectionSaveOnAddressBook addressType="billing" />
                </>
              ) : (
                <Fragment />
              )}
            </BillingAddressForm>
          </div>
          <Toggle
            data-cy="button-ship-to-different-address"
            data-status={shipToDifferentAddress}
            label={t(`addressForm.ship_to_different_address`)}
            checked={shipToDifferentAddress}
            onChange={handleToggle}
          />
          <div
            className={`${
              shipToDifferentAddress && hasCustomerAddresses ? "" : "hidden"
            }`}
          >
            <ShippingAddressContainer>
              <div tw="pl-2 pt-4">
                <AddressSectionTitle>
                  {t(`addressForm.shipping_address_title`)}
                </AddressSectionTitle>
              </div>

              <AddressCardComponent
                addressType="shipping"
                deselect={showShippingAddressForm}
                onSelect={() =>
                  showShippingAddressForm && setShowShippingAddressForm(false)
                }
              />
            </ShippingAddressContainer>
            {!showShippingAddressForm && (
              <button
                tw="w-1/2 p-2 mb-5 text-left border rounded cursor-pointer hover:border-primary shadow-sm"
                data-cy="add_new_shipping_address"
                onClick={handleShowShippingForm}
              >
                <FontAwesomeIcon icon={faPlus} tw="mr-3" />
                {t("stepCustomer.addNewShippingAddress")}
              </button>
            )}
          </div>
          <div className={showShippingAddressForm ? "" : "hidden"}>
            <ShippingAddressForm
              autoComplete="on"
              hidden={!shipToDifferentAddress}
              className="p-2"
              reset={!showShippingAddressForm}
            >
              {showShippingAddressForm ? (
                <>
                  <ShippingAddressFormNew
                    shippingAddress={shippingAddressFill}
                  />
                  <AddressSectionSaveOnAddressBook addressType="shipping" />
                </>
              ) : (
                <Fragment />
              )}
            </ShippingAddressForm>
          </div>
          <div tw="flex justify-between items-center">
            <div>
              {(showBillingAddressForm && !isUsingNewBillingAddress) ||
              (showShippingAddressForm && !isUsingNewShippingAddress) ? (
                <AddressButtonAddNew
                  onClick={() => {
                    setShowBillingAddressForm(isUsingNewBillingAddress)
                    setShowShippingAddressForm(isUsingNewShippingAddress)
                  }}
                >
                  Discard changes
                </AddressButtonAddNew>
              ) : null}
            </div>
            <AddressSectionSaveForm>
              <StyledSaveAddressesButton
                label={t("stepCustomer.continueToDelivery")}
                data-cy="save-addresses-button"
                onClick={refetchOrder}
              />
            </AddressSectionSaveForm>
          </div>
        </AddressesContainer>
      </CustomerContainer>
    </Fragment>
  )
}

interface AddressCardProps {
  addressType: "shipping" | "billing"
  deselect: boolean
  onSelect: () => void
}

const AddressCardComponent: React.FC<AddressCardProps> = ({
  addressType,
  deselect,
  onSelect,
}) => {
  const dataCy =
    addressType === "billing"
      ? "customer-billing-address"
      : "customer-shipping-address"
  return (
    <Address
      data-cy={dataCy}
      className="w-1/2 p-2 mb-5 border rounded cursor-pointer hover:border-primary shadow-sm"
      selectedClassName="border-primary"
      deselect={deselect}
      onSelect={onSelect}
      disabledClassName="opacity-50 cursor-not-allowed"
    >
      <div tw="flex font-bold">
        <AddressField name="first_name" />
        <AddressField name="last_name" tw="ml-1" />
      </div>
      <div>
        <AddressField name="full_address" />
      </div>
    </Address>
  )
}

const StyledSaveAddressesButton = styled(SaveAddressesButton)`
  ${ButtonCss}
`
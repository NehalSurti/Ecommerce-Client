export function handleRequiredFields(orderUserDetails) {
  const { address, email, paymentMethod, phone } = orderUserDetails;

  const isStreetFieldEmpty =
    address?.Add === undefined || address?.Add === null || address?.Add === "";
  const isCountryFieldEmpty =
    address?.Country === undefined ||
    address?.Country === null ||
    address?.Country === "";
  const isPostcodeFieldEmpty =
    address?.Postcode === undefined ||
    address?.Postcode === null ||
    address?.Postcode === "";
  const isEmailFieldEmpty =
    email === undefined || email === null || email === "";
  const isPaymentMethodFieldEmpty =
    paymentMethod === undefined ||
    paymentMethod === null ||
    paymentMethod === "";
  const isPhoneFieldEmpty =
    phone === undefined || phone === null || phone === "";

  if (
    isStreetFieldEmpty ||
    isCountryFieldEmpty ||
    isPostcodeFieldEmpty ||
    isEmailFieldEmpty ||
    isPaymentMethodFieldEmpty ||
    isPhoneFieldEmpty
  ) {
    return true;
  } else {
    return false;
  }
}

export function handleValidation(orderUserDetails) {
  const { address, email, paymentMethod, phone } = orderUserDetails;

  function isValidEmail(email) {
    const emailRegex = /^[a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  }

  function validateMobileNumber(mobile) {
    const regex = /^(\+\d{1,3}\s?)?(\d{10})$/;
    return regex.test(mobile);
  }

  function isValidName(name) {
    const regex = /^[A-Za-z]+\s?[A-Za-z]+$/;
    return regex.test(name);
  }

  function isValidPaymentMethod(paymentMethod) {
    const allowedPaymentMethod = ["card", "cash"];
    if (allowedPaymentMethod.includes(paymentMethod.trim())) {
      return true;
    } else {
      return false;
    }
  }

  if (!isValidName(address.Name)) {
    return { check: false, toastMsg: "Full Name can only contain letters" };
  } else if (!isValidEmail(email)) {
    return { check: false, toastMsg: "Enter a valid Email" };
  } else if (!validateMobileNumber(phone)) {
    return { check: false, toastMsg: "Enter a valid Mobile No." };
  } else if (!isValidPaymentMethod(paymentMethod)) {
    return {
      check: false,
      toastMsg: "Please select a payment method.",
    };
  }
  return { check: true };
}

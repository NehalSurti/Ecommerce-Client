export function handleRequiredFields(
  fullName,
  username,
  email,
  password,
  confirmPassword
) {
  const isfullnameFieldEmpty =
    fullName === undefined || fullName === null || fullName === "";
  const isusernameFieldEmpty =
    username === undefined || username === null || username === "";
  const isemailFieldEmpty =
    email === undefined || email === null || email === "";
  const ispasswordFieldEmpty =
    password === undefined || password === null || password === "";
  const isconfirmPasswordFieldEmpty =
    confirmPassword === undefined ||
    confirmPassword === null ||
    confirmPassword === "";

  if (
    isfullnameFieldEmpty ||
    isusernameFieldEmpty ||
    isemailFieldEmpty ||
    ispasswordFieldEmpty ||
    isconfirmPasswordFieldEmpty
  ) {
    return true;
  } else {
    return false;
  }
}

export function handleValidation(fullName, email, password, confirmPassword) {
  function isValidEmail(email) {
    const emailRegex = /^[a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  }

  function isValidName(name) {
    const regex = /^[A-Za-z]+\s?[A-Za-z]+$/;
    return regex.test(name);
  }

  if (!isValidName(fullName)) {
    return { check: false, toastMsg: "Full Name can only contain letters" };
  } else if (!isValidEmail(email)) {
    return { check: false, toastMsg: "Enter a valid Email" };
  } else if (password.length < 8) {
    return {
      check: false,
      toastMsg: "Password should be equal or greater than 8 characters",
    };
  } else if (password !== confirmPassword) {
    return {
      check: false,
      toastMsg: "Confirm Password and Password are not matching.",
    };
  }
  return { check: true };
}

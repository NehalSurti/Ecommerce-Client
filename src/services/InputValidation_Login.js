export function handleRequiredFields(username, password) {
  const isUsernameEmpty =
    username === undefined || username === null || username === "";
  const isPasswordEmpty =
    password === undefined || password === null || password === "";

  if (isUsernameEmpty || isPasswordEmpty) {
    return true;
  } else {
    return false;
  }
}

export function handleValidation(username) {
  const isValidUsername = (input) => {
    const regex = /^[a-zA-Z0-9]{5,}$/;
    return regex.test(input);
  };

  if (!isValidUsername(username)) {
    return {
      check: false,
      toastMsg: "Username can only contain letters and numbers",
    };
  }
  return { check: true };
}

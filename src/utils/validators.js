export const isValidEmail = value =>
  /^\S+@\S+\.\S+$/.test(value);

export const isValidURL = value => {
  try {
    new URL(value);
    return true;
  } catch {
    return false;
  }
};

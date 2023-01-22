export const getRefinedFirebaseErrorCode = (error: string) => {
  return error
    .replace(/^auth\//, "")
    .replace(/-/g, " ")
    .replace(/\b\w/g, (l) => l.toUpperCase());
};

export const getRefinedFirebaseErrorMessage = (error: string) => {
  return error.replace("Firebase: ", "").replace(/\(auth.*\)\.?/, "");
};

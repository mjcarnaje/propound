export function generateId() {
  return Math.random().toString(36).substring(2, 7);
}

export function generateCode() {
  return Math.random().toString(36).substring(2, 6);
}

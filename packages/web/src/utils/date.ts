export function firebaseDateToDate(date: Date): Date {
  return new Date(
    // @ts-ignore
    date?.seconds ? date.seconds * 1000 : new Date().getSeconds()
  );
}

export const COPY_LIMITS = {
  min: 1,
  max: 99,
  default: 1,
};

export function parseCopies(value) {
  if (value === null || value === undefined || value === "") return NaN;

  const copies = typeof value === "number" ? value : Number(value);

  return Number.isInteger(copies) ? copies : NaN;
}

export function getCopiesError(value) {
  const copies = parseCopies(value);

  if (!Number.isInteger(copies)) {
    return "Enter a whole number of copies.";
  }

  if (copies < COPY_LIMITS.min || copies > COPY_LIMITS.max) {
    return `Total copies must be between ${COPY_LIMITS.min} and ${COPY_LIMITS.max}.`;
  }

  return "";
}

/**
 * Shared copy maths for cards and details. Older books without copy data are
 * treated as a single shareable copy.
 */
export function getCopyState(book) {
  const totalCopies =
    Number.isInteger(book?.totalCopies) && book.totalCopies > 0
      ? book.totalCopies
      : 1;

  const availableCopies = Number.isInteger(book?.availableCopies)
    ? Math.min(Math.max(book.availableCopies, 0), totalCopies)
    : totalCopies;

  return {
    totalCopies,
    availableCopies,
    unavailable: availableCopies < 1,
  };
}

export function formatCopies(availableCopies, totalCopies) {
  return `${availableCopies}/${totalCopies}`;
}

const GOOGLE_CONFIG_MESSAGE =
  "Google sign-in is not configured yet. Add GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET.";

export function describeGoogleAuthError(error) {
  if (!error) return GOOGLE_CONFIG_MESSAGE;

  if (
    error.status === 404 ||
    /not found|provider.*(not|missing)|invalid provider/i.test(
      error.message ?? ""
    )
  ) {
    return GOOGLE_CONFIG_MESSAGE;
  }

  return error.message || "Google sign-in is unavailable.";
}

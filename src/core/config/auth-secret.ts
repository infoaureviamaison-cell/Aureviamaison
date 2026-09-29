export function getAuthSecret() {
  const secret = process.env.NEXTAUTH_SECRET ?? process.env.AUTH_SECRET;

  if (!secret) {
    throw new Error("Authentication is unavailable: NEXTAUTH_SECRET or AUTH_SECRET is required.");
  }

  return secret;
}

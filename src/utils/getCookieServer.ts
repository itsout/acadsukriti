import { cookies } from "next/headers";

export async function getCookie() {
  const c = await cookies();
  const token = c.get("token")?.value;
  const user = c.get("user")?.value;
  return { token, user };
}

function stripTrailingSlash(url: string) {
  return url.replace(/\/+$/, "");
}

export async function getPayment(user: string) {
  const base = process.env.PAYMENT_LINK;
  if (!base) {
    // If PAYMENT_LINK is not configured, don't attempt to call the payment service.
    // This prevents building an invalid URL like "undefined/..." which crashes the server.
    // Log for visibility in server logs and return null (no payment info).
    // eslint-disable-next-line no-console
    console.error("PAYMENT_LINK environment variable is not set. Skipping payment check for", user);
    return null;
  }

  const safeBase = stripTrailingSlash(base);

  try {
    const getUserUrl = `${safeBase}/payment/getuser?user=${encodeURIComponent(user)}`;
    const res = await fetch(getUserUrl);
    if (!res.ok) {
      // eslint-disable-next-line no-console
      console.error("Payment service responded with status", res.status, "for user", user);
      return null;
    }

    const data = await res.json();
    const response = Array.isArray(data) && data.length !== 0 ? data[0] : null;
    if (!response) return null;

    const date = new Date(response?.created_at * 1000);
    const currentDate = new Date();
    const daysPassed = Math.floor((currentDate.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    if (daysPassed >= 30) {
      // Best-effort unsubscribe; ignore errors here.
      try {
        const unsubscribeUrl = `${safeBase}/payment/unsubscribe?user=${encodeURIComponent(user)}`;
        await fetch(unsubscribeUrl);
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error("Failed to call unsubscribe for user", user, e);
      }
      return null;
    }

    return response;
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error("Error while fetching payment info for user", user, err);
    return null;
  }
}

import { cookies } from "next/headers";

/**
 * Makes authenticated server-to-server API calls to the admin API.
 * Forwards the current request's cookies to authenticate the downstream call.
 * 
 * Use this in server components/pages to fetch data from your own API routes
 * while preserving the user's session context.
 * 
 * @param path - The API endpoint path (e.g., '/api/v1/categories')
 * @returns Parsed JSON response of type T
 * @throws Error if the request fails or NEXT_PUBLIC_BASE_URL is not configured
 */
export async function fetchAdminApi<T>(path: string): Promise<T> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  if(!baseUrl) {
    throw new Error('NEXT_PUBLIC_BASE_URL is not configured');
  }

  const cookieStore = await cookies();
  const cookieHeader = cookieStore
    .getAll()
    .map(({name, value}) => `${name}=${value}`)
    .join("; ");

  // console.log(cookieHeader);

  const res = await fetch(`${baseUrl}${path}`, { 
    cache: 'no-store',
    headers: {
      Cookie: cookieHeader
    } 
  });

  if(!res.ok) {
    const body = await res.json().catch(() => ({}));
    const message = typeof body?.error === 'string' ? body.error : `Request failed (${res.status})`;
    throw new Error(message);
  }

  return res.json() as Promise<T>;
}

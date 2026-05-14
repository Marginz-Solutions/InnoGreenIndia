// app/dealers/page.tsx

import DealersHubClient from "./DealersHubClient";


export default async function Page() {
  // Fetch both in parallel
  const [enquiriesRes, reviewedRes] = await Promise.all([
    fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/dealers/requests`, {
      cache: "no-store",
    }),
    fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/dealers/reviewed`, {
      cache: "no-store",
    }),
  ]);

  const [{ data: enquiries }, { data: dealers }] = await Promise.all([
    enquiriesRes.json(),
    reviewedRes.json(),
  ]);

  return (
    <DealersHubClient
      enquiries={enquiries ?? []}
      dealers={dealers ?? []}
    />
  );
}
// app/dealers/page.tsx

import DealersHubClient from "./DealersHubClient";


export default async function Page() {
  // Fetch both in parallel
  const [enquiriesRes, reviewedRes] = await Promise.all([
    fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/dealers/requests`, {
      cache: "no-store",
    }),
    fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/dealers/reviewed`, {
      cache: "no-store",
    }),
  ]);
  const enquiriesData = await enquiriesRes.json();
  const reviewedData = await reviewedRes.json();



  return (
    <DealersHubClient
      enquiries={enquiriesData}
      dealers={reviewedData}
    />
  );
}


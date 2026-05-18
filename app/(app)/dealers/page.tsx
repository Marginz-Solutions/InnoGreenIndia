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
   const enquiriesData = await enquiriesRes.json();
   const reviewedData = await reviewedRes.json();
  console.log("Enquiries Response:", enquiriesData);
  console.log("Reviewed Dealers Response:", reviewedData);

  return (
    <DealersHubClient
      enquiries={enquiriesData}
      dealers={reviewedData}
    />
  );
}


// app/enquiries/page.tsx (SERVER COMPONENT)
import EnquiriesClient from "./EnquiriesClient";

export default async function Page() {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/dealers/requests`,
    {
      cache: "no-store", // important for fresh data
    }
  );

  const { data } = await res.json();

  return <EnquiriesClient enquiries1={data ?? []} />;
}
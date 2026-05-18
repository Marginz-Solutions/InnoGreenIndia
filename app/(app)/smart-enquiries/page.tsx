import SmartEnquiryClient from './SmartEnquiryClient'

export type SmartEnquiryResponse = {
  data: {
    id: string;
    need: string;
    message: string;
    mobileNo: string;
    crop: string;
    district: string;
    status: string;
    senderType: string;
    cropStage: string;
    createdAt: string;
    brands: { id: string; name: string; logoUrl: string };
    categories: { id: string; name: string };
  }[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

const page = async() => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/smart-enquiries`,{cache: "no-store"})

  const data = await response.json() as SmartEnquiryResponse

  return (
    <SmartEnquiryClient data={data}/>
  )
}

export default page


export type status = "new" | "reviewed" | "closed";


export type Dealer = {
  id: string;
  firmName: string;
  gstNumber: string;
  mobileNo: string;
  district: string;
  categoryInterest: string;
  monthlyVolume: string | null;
  submittedAt: string;
  reviewedAt: string;
  categories: {
    id: string;
    name: string;
  };
  status: status;
};

export type Enquiry = {
  id: string;
  firmName: string;
  gstNumber: string;
  mobileNo: string;
  district: string;
  categoryInterest: string;
  monthlyVolume?: string;
  categories: {
    id: string;
    name: string;
  };
  submittedAt: string;
  status: status;
};
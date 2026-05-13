

export type status = "new" | "reviewed" | "closed";


export type Dealer = {
  id: number;
  firmName: string;
  gstNumber: string;
  mobileNo: string;
  district: string;
  categoryInterest: string;
  monthlyVolume: string | null;
  submittedAt: string;
  reviewedAt: string ;
  status: status;
};

export type Enquiry = {
    id: number;
    firmName: string;
    gstNumber: string;
    mobileNo: string;
    district: string;
    categoryInterest: string;
    monthlyVolume?: string;
    submittedAt: string;
    status: status;
};
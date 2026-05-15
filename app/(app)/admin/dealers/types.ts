

export type status = "new" | "reviewed" | "closed";


export type Dealer = {
  id: number;
  firm_name: string;
  gst_number: string;
  mobile_no: string;
  district: string;
  category_interest: string;
  monthly_volume: string | null;
  submitted_at: string;
  reviewed_at: string;
  categories: {
    id: number;
    name: string;
  };
  status: status;
};

export type Enquiry = {
  id: number;
  firm_name: string;
  gst_number: string;
  mobile_no: string;
  district: string;
  category_interest: string;
  monthly_volume?: string;
  categories: {
    id: number;
    name: string;
  };
  submitted_at: string;
  status: status;
};
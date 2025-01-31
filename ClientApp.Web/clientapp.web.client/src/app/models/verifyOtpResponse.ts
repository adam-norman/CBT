// Response interface
export interface VerifyOtpResponse {
  message: string;
  isSuccess: boolean;
  // Add other backend response fields as needed
  customer:any;
}

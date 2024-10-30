export type envType = "DEVELOPMENT" | "PRODUCTION";
export type httpResponseType = {
  success: boolean;
  status: number;
  message: string;
  data: unknown;
  requestInfo: {
    ip?: string | null;
    url: string | null;
    method: string | null;
  };
};

export type TUSERREGISTER = {
  uid?: string;
  username: string;
  fullName: string;
  email: string;
  password: string;
  role: "CLIENT" | "ADMIN" | "FREELANCER";

  otpPassword?: string | null;
  otpExpiry?: Date | null;
  emailVerifiedAt?: Date | null;

  createdAt: Date;
  updatedAt: Date;
};

export type TUSERLOGIN = {
  email: string;
  password: string;
};

// Single line types
export type TENV = "DEVELOPMENT" | "PRODUCTION";

export type TROLE = "CLIENT" | "ADMIN" | "MODERATOR" | "FREELANCER";

export type TEXPIRESIN = "14m" | "1d" | "2d" | "3d" | "4d" | "5d" | "6d" | "7d";
// Multiline types
export type TPAYLOAD = {
  uid: string;
  tokenVersion: number;
  role: TROLE;
  isVerified: Date | null;
};

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
export type TUSER = {
  uid: string;
  username: string;
  fullName: string;
  email: string;
  emailVerifiedAt: Date | null;
  role: TROLE;
  createdAt?: Date;
  updatedAt?: Date;
};
export type TUSERREGISTER = {
  uid?: string;
  username: string;
  fullName: string;
  email: string;
  password: string;

  role: TROLE;
  otpPassword?: string | null;
  otpExpiry?: Date | null;
  emailVerifiedAt?: Date | null;

  createdAt: Date;
  updatedAt: Date;
};

export type TUSERUPDATE = {
  uid: string;
  username: string;
  fullName: string;
  email: string;
  oldPassword: string;
  newPassword: string;
  role: TROLE;
};
export type TUSERLOGIN = {
  username: string;
  password: string;
};

export type TTRASH = {
  victimUid: string;
};

export type TVERIFYUSER = {
  email: string;
  OTP: string;
};

export type TCOOKIEOPTIONS = {
  httpOnly: true;
  secure: boolean;
  sameSite: "none";
  expires: Date;
};

export type TSENDOTP = {
  email: string;
};

export type TCONTACTUS = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  message: string;
};

export type TSUBSCRIBENEWSLETTER = {
  email: string;
  newsLetter: string;
};
export type IMENUITEM = {
  title: string;
  description?: string;
  href?: string;
  image?: string;
  children?: IMENUITEM[];
};

export type TGETQUOTE = {
  name: string;
  email: string;
  phone: string;
  company?: string;
  address: string;
  deadline?: string;
  services: string;
  detail?: string;
  trashedBy?: string;
  trashedAt?: Date;
};
export type TSERVICESFORQUOTE = {
  services: string;
};

export type TCONSULTATIONSTATUS = "PENDING" | "ACCEPTED" | "REJECTED" | "FINISHED";
export type TCONSULTATION = {
  name: string;
  email: string;
  phone: string;
  message: string;
  address: string;
  bookingDate: string;
  subject: string;
};

export type THIREUS = {
  name: string;
  email: string;
  phone: string;
  company: string;
  address: string;
  detail: string;
};

type THIREUSDOCUMENT = {
  url?: string;
  name?: string;
};

export type THIREUSDATA = {
  id: number;
  name: string;
  email: string;
  phone: string;
  company: string | null;
  address: string;
  detail: string;
  docs: Document[];
  createdAt: string; // ISO date string format
  trashedBy: string | null;
  trashedAt: string | null;
};

export type THIREUSRESPONSE = THIREUSDATA[];
// ********* Freelancer
export type TFREELANCER = {
  name: string;
  email: string;
  phone: string;
  yourPortfolio: string;
  yourTopProject1: string;
  yourTopProject2: string;
  yourTopProject3: string;
  address: string;
  detail: string;
  niche: string;
  createdAt: string; // ISO date string format
  trashedBy: string | null;
  trashedAt: string | null;
};
export interface TFREELANCERPROFILE {
  whoYouAre: {
    fullName: string;
    email: string;
    timeZone?: string | null;
    country?: string | null;
    professionalLinks?: {
      github: string;
      gitlab: string;
      dribbble: string;
      behance: string;
      stackoverflow: string;
      medium: string;
      kaggle: string;
      personalSite: string;
      linkedin: string;
    };
    phone?: string | null;
  };
  coreRole?: {
    primaryDomain: string;
  };
  eliteSkillCards?: {
    selectedSkills: string[];
  };
  toolstackProficiency?: {
    selectedTools: string[];
  };
  domainExperience?: {
    roles: {
      title: string;
      years: number;
    }[];
  };
  industryExperience?: {
    selectedIndustries: string[];
  };
  availabilityWorkflow?: {
    weeklyCommitment: number;
    workingHours: string[];
    collaborationTools: string[];
    teamStyle: string;
    screenSharing: string;
    availabilityExceptions: string;
  };
  softSkills?: {
    collaborationStyle: string;
    communicationFrequency: string;
    conflictResolution: string;
    languages: string[];
    teamVsSolo: string;
  };
  certifications?: {
    certificates: string[];
  };
  projectQuoting?: {
    compensationPreference: string;
    smallProjectPrice: number;
    midProjectPrice: number;
    longTermPrice: number;
    milestoneTerms: string;
    willSubmitProposals: string;
  };
  legalAgreements?: {
    agreements: {
      id: string;
      accepted: boolean;
    }[];
    identityVerification?: {
      idType: string;
      taxDocType: string;
      addressVerified: boolean;
    };
    workAuthorization?: {
      interested: boolean;
    };
  };
}

export type TPROJECTSTATUS = "PENDING" | "CANCELLED" | "ONGOING" | "COMPLETED";
export type TKPIRANK = "BRONZE" | "SILVER" | "GOLD" | "PLATINIUM" | "DIAMOND" | "CROWN" | "ACE" | "CONQUERER";
export type TDIFFICULTYLEVEL = "EASY" | "MEDIUM" | "HARD";
export type TPROJECTTYPE = "INHOUSE" | "OUTSOURCE";
export type TUPDATE_PROJECT = {
  title: string;
  detail: string;
  projectType: TPROJECTTYPE;
  niche: string;
  bounty: number;
  deadline: string;
  projectStatus: TPROJECTSTATUS;
  progressPercentage: number;
  isDeadlineNeedToBeExtend: boolean;
  difficultyLevel: "EASY" | "MEDIUM" | "HARD";
};

export type TPROJECT = TUPDATE_PROJECT & {
  clientWhoPostedThisProjectForeignId?: string;
  selectedFreelancersForThisProject: string[];
  interestedFreelancerWhoWantToWorkOnThisProject: string[];
  commentByClientAfterProjectCompletion?: string;
  starsByClientAfterProjectCompletion?: string;
};
export type TFILTEREDPROJECT = {
  trashedAt: null;
  trashedBy: null;
  projectType?: TPROJECTTYPE;
  projectStatus?: TPROJECTSTATUS;
  difficultyLevel?: TDIFFICULTYLEVEL;
  niche?: string;
};

// Define types for query parameters
export type TGETPROJECTSQUERY = {
  page?: string;
  limit?: string;
  difficultyLevel?: TDIFFICULTYLEVEL;
  createdAtOrder?: "oldest" | "latest" | "";
  bountyOrder?: "lowest" | "highest" | "";
  nicheName?: string;
};
export interface TGETFULLPROJECTQUERY extends TGETPROJECTSQUERY {
  projectType?: TPROJECTTYPE | "";
  projectStatus?: TPROJECTSTATUS | "";
}

// Define filters type

// Define type for sorting
export type TSORTORDER = {
  createdAt?: "asc" | "desc";
  bounty?: "asc" | "desc";
};

// ** type for blog post
export type TBLOGPOST = {
  blogTitle: string;
  blogThumbnail: string;
  blogOverview: string;
  blogBody: string;
  isPublished?: boolean;
};
export type ProjectRequestCreateDTO = {
  registerYourself: {
    fullName: string;
    businessEmail: string;
    phoneNumber?: string;
    companyName?: string;
    companyWebsite?: string;
    businessAddress?: string;
    businessType?: string;
    referralSource?: string;
  };

  services: {
    category: string;
    service: string;
  }[];

  industries: {
    category: string;
    industry: string;
  }[];

  technologies: {
    category: string;
    technology: string;
  }[];

  features: {
    category: string;
    feature: string;
  }[];

  specialOffers: {
    discounts: string[];
    appliedDiscount: number;
  };

  timeline: string;

  budget: {
    paymentMethod: string;
  };

  estimate: {
    accepted: boolean;
    comparisonVisible: boolean;
    finalPrice: {
      min: number;
      max: number;
    };
    basePrice: {
      min: number;
      max: number;
    };
    discount: {
      percentage: number;
      amount: {
        min: number;
        max: number;
      };
    };
    rushFee: {
      percentage: number;
      amount: {
        min: number;
        max: number;
      };
    };
  };

  agreement: {
    accepted: boolean;
  };

  proceedOptions: {
    selectedOption: string;
    completed: boolean;
  };
};

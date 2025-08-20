-- CreateTable
CREATE TABLE "ProjectRequest" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "businessEmail" TEXT NOT NULL,
    "phoneNumber" TEXT,
    "companyName" TEXT,
    "companyWebsite" TEXT,
    "businessAddress" TEXT,
    "businessType" TEXT,
    "referralSource" TEXT,
    "stripeCheckOutUrl" TEXT,
    "paymentIntentId" TEXT,
    "appliedDiscount" INTEGER,
    "timeline" TEXT,
    "paymentMethod" TEXT,
    "estimateAccepted" BOOLEAN NOT NULL DEFAULT false,
    "comparisonVisible" BOOLEAN NOT NULL DEFAULT false,
    "estimateFinalPriceMin" INTEGER,
    "estimateFinalPriceMax" INTEGER,
    "estimateBasePriceMin" INTEGER,
    "estimateBasePriceMax" INTEGER,
    "discountPercentage" INTEGER,
    "discountAmountMin" INTEGER,
    "discountAmountMax" INTEGER,
    "rushFeePercentage" INTEGER,
    "rushFeeAmountMin" INTEGER,
    "rushFeeAmountMax" INTEGER,
    "agreementAccepted" BOOLEAN NOT NULL DEFAULT false,
    "selectedOption" TEXT,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProjectRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Service" (
    "id" TEXT NOT NULL,
    "submissionId" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "service" TEXT NOT NULL,

    CONSTRAINT "Service_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Industry" (
    "id" TEXT NOT NULL,
    "submissionId" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "industry" TEXT NOT NULL,

    CONSTRAINT "Industry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Technology" (
    "id" TEXT NOT NULL,
    "submissionId" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "technology" TEXT NOT NULL,

    CONSTRAINT "Technology_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Feature" (
    "id" TEXT NOT NULL,
    "submissionId" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "feature" TEXT NOT NULL,

    CONSTRAINT "Feature_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ProjectRequest" ADD CONSTRAINT "ProjectRequest_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("uid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Service" ADD CONSTRAINT "Service_submissionId_fkey" FOREIGN KEY ("submissionId") REFERENCES "ProjectRequest"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Industry" ADD CONSTRAINT "Industry_submissionId_fkey" FOREIGN KEY ("submissionId") REFERENCES "ProjectRequest"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Technology" ADD CONSTRAINT "Technology_submissionId_fkey" FOREIGN KEY ("submissionId") REFERENCES "ProjectRequest"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Feature" ADD CONSTRAINT "Feature_submissionId_fkey" FOREIGN KEY ("submissionId") REFERENCES "ProjectRequest"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

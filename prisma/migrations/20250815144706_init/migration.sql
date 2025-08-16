-- CreateEnum
CREATE TYPE "Role" AS ENUM ('CLIENT', 'ADMIN', 'MODERATOR', 'FREELANCER');

-- CreateEnum
CREATE TYPE "KPIRANK" AS ENUM ('BRONZE', 'SILVER', 'GOLD', 'PLATINIUM', 'DIAMOND', 'CROWN', 'ACE', 'CONQUERER');

-- CreateEnum
CREATE TYPE "PROJECT_STATUS" AS ENUM ('CANCELLED', 'PENDING', 'ONGOING', 'COMPLETED');

-- CreateEnum
CREATE TYPE "DIFFICULTY_LEVEL" AS ENUM ('EASY', 'MEDIUM', 'HARD');

-- CreateEnum
CREATE TYPE "PROJECT_TYPE" AS ENUM ('INHOUSE', 'OUTSOURCE');

-- CreateEnum
CREATE TYPE "consultationStatus" AS ENUM ('PENDING', 'ACCEPTED', 'REJECTED');

-- CreateTable
CREATE TABLE "RateLimiterFlexible" (
    "key" TEXT NOT NULL,
    "points" INTEGER NOT NULL,
    "expire" TIMESTAMP(3),

    CONSTRAINT "RateLimiterFlexible_pkey" PRIMARY KEY ("key")
);

-- CreateTable
CREATE TABLE "User" (
    "uid" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'CLIENT',
    "otpPassword" TEXT,
    "giveModeratorFullAccess" BOOLEAN NOT NULL DEFAULT false,
    "otpPasswordExpiry" TIMESTAMP(3),
    "emailVerifiedAt" TIMESTAMP(3),
    "phone" TEXT,
    "tokenVersion" INTEGER NOT NULL DEFAULT 0,
    "address" TEXT,
    "detail" TEXT,
    "portfolioUrl" TEXT,
    "niche" TEXT,
    "topProjects" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "kpi" JSONB[] DEFAULT ARRAY[]::JSONB[],
    "kpiHistory" JSONB[] DEFAULT ARRAY[]::JSONB[],
    "kpiRank" "KPIRANK" NOT NULL DEFAULT 'BRONZE',
    "kpiRankPoints" INTEGER NOT NULL DEFAULT 0,
    "trashedBy" TEXT,
    "trashedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("uid")
);

-- CreateTable
CREATE TABLE "Project" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "projectSlug" TEXT NOT NULL,
    "detail" TEXT NOT NULL,
    "niche" TEXT NOT NULL,
    "bounty" INTEGER NOT NULL,
    "deadline" TIMESTAMP(3) NOT NULL,
    "progressPercentage" INTEGER NOT NULL DEFAULT 0,
    "difficultyLevel" "DIFFICULTY_LEVEL" NOT NULL DEFAULT 'EASY',
    "projectStatus" "PROJECT_STATUS" NOT NULL DEFAULT 'PENDING',
    "isDeadlineNeedToBeExtend" BOOLEAN NOT NULL DEFAULT false,
    "commentByClientAfterProjectCompletion" TEXT,
    "starsByClientAfterProjectCompletion" INTEGER,
    "projectCompletedOn" TIMESTAMP(3),
    "projectType" "PROJECT_TYPE" NOT NULL DEFAULT 'INHOUSE',
    "trashedBy" TEXT,
    "trashedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "clientWhoPostedThisProjectForeignId" TEXT,

    CONSTRAINT "Project_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Milestone" (
    "id" SERIAL NOT NULL,
    "mileStoneName" TEXT NOT NULL,
    "description" TEXT,
    "deadline" TIMESTAMP(3) NOT NULL,
    "progress" INTEGER NOT NULL DEFAULT 0,
    "totalProgressPoints" INTEGER NOT NULL,
    "projectId" INTEGER NOT NULL,
    "priorityRank" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isMilestoneCompleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Milestone_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ContactUs" (
    "id" SERIAL NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "trashedBy" TEXT,
    "trashedAt" TIMESTAMP(3),

    CONSTRAINT "ContactUs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Newsletter" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "subscriptionStatus" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Newsletter_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MenuItem" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "slug" TEXT NOT NULL,
    "href" TEXT,
    "image" TEXT,
    "parentId" INTEGER,
    "trashedBy" TEXT,
    "trashedAt" TIMESTAMP(3),

    CONSTRAINT "MenuItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GetQuote" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "company" TEXT DEFAULT '',
    "address" TEXT NOT NULL,
    "deadline" TEXT,
    "services" TEXT NOT NULL,
    "detail" TEXT DEFAULT '',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "trashedBy" TEXT,
    "trashedAt" TIMESTAMP(3),

    CONSTRAINT "GetQuote_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CreateServicesForQuote" (
    "id" SERIAL NOT NULL,
    "services" TEXT NOT NULL,

    CONSTRAINT "CreateServicesForQuote_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ConsultationBooking" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "bookingDate" TIMESTAMP(3) NOT NULL,
    "status" "consultationStatus" NOT NULL DEFAULT 'PENDING',
    "subject" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "trashedBy" TEXT,
    "trashedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ConsultationBooking_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HireUs" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "company" TEXT DEFAULT '',
    "address" TEXT NOT NULL,
    "detail" TEXT NOT NULL,
    "docs" JSONB[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "trashedBy" TEXT,
    "trashedAt" TIMESTAMP(3),

    CONSTRAINT "HireUs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FreeLancersRequest" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "detail" TEXT NOT NULL,
    "yourPortfolio" TEXT NOT NULL,
    "niche" TEXT NOT NULL,
    "yourTopProject1" TEXT NOT NULL,
    "yourTopProject2" TEXT NOT NULL,
    "yourTopProject3" TEXT NOT NULL,
    "isAccepted" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "trashedBy" TEXT,
    "trashedAt" TIMESTAMP(3),

    CONSTRAINT "FreeLancersRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NichesForFreelancers" (
    "id" SERIAL NOT NULL,
    "niche" TEXT NOT NULL,

    CONSTRAINT "NichesForFreelancers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "blogposts" (
    "blogId" SERIAL NOT NULL,
    "blogTitle" TEXT NOT NULL,
    "blogSlug" TEXT NOT NULL,
    "blogThumbnail" TEXT NOT NULL,
    "blogOverview" TEXT NOT NULL,
    "blogBody" TEXT NOT NULL,
    "isPublished" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "blogposts_pkey" PRIMARY KEY ("blogId")
);

-- CreateTable
CREATE TABLE "Profile" (
    "id" TEXT NOT NULL,
    "whoYouAreId" TEXT,
    "coreRoleId" TEXT,
    "eliteSkillCardsId" TEXT,
    "toolstackProficiencyId" TEXT,
    "domainExperienceId" TEXT,
    "industryExperienceId" TEXT,
    "availabilityWorkflowId" TEXT,
    "softSkillsId" TEXT,
    "certificationsId" TEXT,
    "projectQuotingId" TEXT,
    "legalAgreementsId" TEXT,

    CONSTRAINT "Profile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WhoYouAre" (
    "id" TEXT NOT NULL,
    "fullName" TEXT,
    "email" TEXT,
    "timeZone" TEXT NOT NULL,
    "country" TEXT,
    "professionalLinks" JSONB NOT NULL,

    CONSTRAINT "WhoYouAre_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CoreRole" (
    "id" TEXT NOT NULL,
    "primaryDomain" TEXT,

    CONSTRAINT "CoreRole_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EliteSkillCards" (
    "id" TEXT NOT NULL,
    "selectedSkills" TEXT[],

    CONSTRAINT "EliteSkillCards_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ToolstackProficiency" (
    "id" TEXT NOT NULL,
    "selectedTools" TEXT[],

    CONSTRAINT "ToolstackProficiency_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DomainExperience" (
    "id" TEXT NOT NULL,
    "roles" TEXT[],

    CONSTRAINT "DomainExperience_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "IndustryExperience" (
    "id" TEXT NOT NULL,
    "selectedIndustries" TEXT[],

    CONSTRAINT "IndustryExperience_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AvailabilityWorkflow" (
    "id" TEXT NOT NULL,
    "weeklyCommitment" INTEGER NOT NULL,
    "workingHours" TEXT[],
    "collaborationTools" TEXT[],
    "teamStyle" TEXT,
    "screenSharing" TEXT,
    "availabilityExceptions" TEXT,

    CONSTRAINT "AvailabilityWorkflow_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SoftSkills" (
    "id" TEXT NOT NULL,
    "collaborationStyle" TEXT,
    "communicationFrequency" TEXT,
    "conflictResolution" TEXT,
    "languages" TEXT[],
    "teamVsSolo" TEXT,

    CONSTRAINT "SoftSkills_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Certifications" (
    "id" TEXT NOT NULL,
    "certificates" TEXT[],

    CONSTRAINT "Certifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProjectQuoting" (
    "id" TEXT NOT NULL,
    "compensationPreference" TEXT,
    "smallProjectPrice" INTEGER NOT NULL,
    "midProjectPrice" INTEGER NOT NULL,
    "longTermPrice" INTEGER NOT NULL,
    "milestoneTerms" TEXT,
    "willSubmitProposals" TEXT,

    CONSTRAINT "ProjectQuoting_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LegalAgreements" (
    "id" TEXT NOT NULL,
    "agreements" TEXT[],
    "identityVerificationId" TEXT,
    "workAuthorizationId" TEXT,

    CONSTRAINT "LegalAgreements_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "IdentityVerification" (
    "id" TEXT NOT NULL,
    "idType" TEXT,
    "taxDocType" TEXT,
    "addressVerified" BOOLEAN NOT NULL,

    CONSTRAINT "IdentityVerification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WorkAuthorization" (
    "id" TEXT NOT NULL,
    "interested" BOOLEAN NOT NULL,

    CONSTRAINT "WorkAuthorization_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_InterestedFreelancers" (
    "A" INTEGER NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_InterestedFreelancers_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_SelectedFreelancers" (
    "A" INTEGER NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_SelectedFreelancers_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_otpPassword_key" ON "User"("otpPassword");

-- CreateIndex
CREATE UNIQUE INDEX "User_phone_key" ON "User"("phone");

-- CreateIndex
CREATE INDEX "User_trashedAt_idx" ON "User"("trashedAt");

-- CreateIndex
CREATE INDEX "User_trashedBy_idx" ON "User"("trashedBy");

-- CreateIndex
CREATE INDEX "User_uid_idx" ON "User"("uid");

-- CreateIndex
CREATE INDEX "User_username_idx" ON "User"("username");

-- CreateIndex
CREATE INDEX "User_email_idx" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_role_createdAt_idx" ON "User"("role", "createdAt");

-- CreateIndex
CREATE INDEX "otp_user_idx" ON "User"("otpPassword");

-- CreateIndex
CREATE INDEX "role_name_user_idx" ON "User"("role", "username");

-- CreateIndex
CREATE UNIQUE INDEX "Project_title_key" ON "Project"("title");

-- CreateIndex
CREATE UNIQUE INDEX "Project_projectSlug_key" ON "Project"("projectSlug");

-- CreateIndex
CREATE INDEX "Project_trashedAt_idx" ON "Project"("trashedAt");

-- CreateIndex
CREATE INDEX "Project_trashedBy_idx" ON "Project"("trashedBy");

-- CreateIndex
CREATE INDEX "Project_difficultyLevel_idx" ON "Project"("difficultyLevel");

-- CreateIndex
CREATE INDEX "Project_id_idx" ON "Project"("id");

-- CreateIndex
CREATE INDEX "Project_title_idx" ON "Project"("title");

-- CreateIndex
CREATE INDEX "Project_deadline_idx" ON "Project"("deadline");

-- CreateIndex
CREATE INDEX "Project_progressPercentage_idx" ON "Project"("progressPercentage");

-- CreateIndex
CREATE INDEX "Project_clientWhoPostedThisProjectForeignId_idx" ON "Project"("clientWhoPostedThisProjectForeignId");

-- CreateIndex
CREATE INDEX "Project_createdAt_idx" ON "Project"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "Milestone_mileStoneName_key" ON "Milestone"("mileStoneName");

-- CreateIndex
CREATE INDEX "Milestone_projectId_idx" ON "Milestone"("projectId");

-- CreateIndex
CREATE INDEX "Milestone_priorityRank_idx" ON "Milestone"("priorityRank");

-- CreateIndex
CREATE INDEX "Milestone_mileStoneName_idx" ON "Milestone"("mileStoneName");

-- CreateIndex
CREATE INDEX "Milestone_deadline_idx" ON "Milestone"("deadline");

-- CreateIndex
CREATE INDEX "Milestone_progress_idx" ON "Milestone"("progress");

-- CreateIndex
CREATE INDEX "Milestone_id_idx" ON "Milestone"("id");

-- CreateIndex
CREATE INDEX "Milestone_createdAt_idx" ON "Milestone"("createdAt");

-- CreateIndex
CREATE INDEX "ContactUs_trashedAt_idx" ON "ContactUs"("trashedAt");

-- CreateIndex
CREATE INDEX "ContactUs_trashedBy_idx" ON "ContactUs"("trashedBy");

-- CreateIndex
CREATE INDEX "ContactUs_email_idx" ON "ContactUs"("email");

-- CreateIndex
CREATE INDEX "ContactUs_createdAt_idx" ON "ContactUs"("createdAt");

-- CreateIndex
CREATE INDEX "ContactUs_message_idx" ON "ContactUs"("message");

-- CreateIndex
CREATE UNIQUE INDEX "Newsletter_email_key" ON "Newsletter"("email");

-- CreateIndex
CREATE UNIQUE INDEX "MenuItem_slug_key" ON "MenuItem"("slug");

-- CreateIndex
CREATE INDEX "MenuItem_trashedAt_idx" ON "MenuItem"("trashedAt");

-- CreateIndex
CREATE INDEX "MenuItem_trashedBy_idx" ON "MenuItem"("trashedBy");

-- CreateIndex
CREATE INDEX "MenuItem_id_idx" ON "MenuItem"("id");

-- CreateIndex
CREATE INDEX "MenuItem_parentId_idx" ON "MenuItem"("parentId");

-- CreateIndex
CREATE INDEX "GetQuote_email_idx" ON "GetQuote"("email");

-- CreateIndex
CREATE INDEX "GetQuote_id_idx" ON "GetQuote"("id");

-- CreateIndex
CREATE INDEX "GetQuote_createdAt_idx" ON "GetQuote"("createdAt");

-- CreateIndex
CREATE INDEX "GetQuote_trashedAt_idx" ON "GetQuote"("trashedAt");

-- CreateIndex
CREATE INDEX "GetQuote_trashedBy_idx" ON "GetQuote"("trashedBy");

-- CreateIndex
CREATE UNIQUE INDEX "ConsultationBooking_bookingDate_key" ON "ConsultationBooking"("bookingDate");

-- CreateIndex
CREATE INDEX "ConsultationBooking_id_idx" ON "ConsultationBooking"("id");

-- CreateIndex
CREATE INDEX "ConsultationBooking_email_idx" ON "ConsultationBooking"("email");

-- CreateIndex
CREATE INDEX "ConsultationBooking_bookingDate_idx" ON "ConsultationBooking"("bookingDate");

-- CreateIndex
CREATE INDEX "ConsultationBooking_status_idx" ON "ConsultationBooking"("status");

-- CreateIndex
CREATE INDEX "ConsultationBooking_trashedAt_idx" ON "ConsultationBooking"("trashedAt");

-- CreateIndex
CREATE INDEX "ConsultationBooking_trashedBy_idx" ON "ConsultationBooking"("trashedBy");

-- CreateIndex
CREATE INDEX "HireUs_email_idx" ON "HireUs"("email");

-- CreateIndex
CREATE INDEX "HireUs_id_idx" ON "HireUs"("id");

-- CreateIndex
CREATE INDEX "HireUs_createdAt_idx" ON "HireUs"("createdAt");

-- CreateIndex
CREATE INDEX "HireUs_trashedAt_idx" ON "HireUs"("trashedAt");

-- CreateIndex
CREATE INDEX "HireUs_trashedBy_idx" ON "HireUs"("trashedBy");

-- CreateIndex
CREATE UNIQUE INDEX "FreeLancersRequest_email_key" ON "FreeLancersRequest"("email");

-- CreateIndex
CREATE UNIQUE INDEX "FreeLancersRequest_phone_key" ON "FreeLancersRequest"("phone");

-- CreateIndex
CREATE INDEX "FreeLancersRequest_email_idx" ON "FreeLancersRequest"("email");

-- CreateIndex
CREATE INDEX "FreeLancersRequest_id_idx" ON "FreeLancersRequest"("id");

-- CreateIndex
CREATE INDEX "FreeLancersRequest_phone_idx" ON "FreeLancersRequest"("phone");

-- CreateIndex
CREATE INDEX "FreeLancersRequest_createdAt_idx" ON "FreeLancersRequest"("createdAt");

-- CreateIndex
CREATE INDEX "FreeLancersRequest_trashedAt_idx" ON "FreeLancersRequest"("trashedAt");

-- CreateIndex
CREATE INDEX "FreeLancersRequest_trashedBy_idx" ON "FreeLancersRequest"("trashedBy");

-- CreateIndex
CREATE UNIQUE INDEX "blogposts_blogTitle_key" ON "blogposts"("blogTitle");

-- CreateIndex
CREATE UNIQUE INDEX "blogposts_blogSlug_key" ON "blogposts"("blogSlug");

-- CreateIndex
CREATE INDEX "blogposts_blogId_idx" ON "blogposts"("blogId");

-- CreateIndex
CREATE INDEX "blogposts_blogTitle_idx" ON "blogposts"("blogTitle");

-- CreateIndex
CREATE INDEX "blogposts_blogSlug_idx" ON "blogposts"("blogSlug");

-- CreateIndex
CREATE INDEX "blogposts_createdAt_idx" ON "blogposts"("createdAt");

-- CreateIndex
CREATE INDEX "blogposts_blogBody_idx" ON "blogposts"("blogBody");

-- CreateIndex
CREATE UNIQUE INDEX "Profile_whoYouAreId_key" ON "Profile"("whoYouAreId");

-- CreateIndex
CREATE UNIQUE INDEX "Profile_coreRoleId_key" ON "Profile"("coreRoleId");

-- CreateIndex
CREATE UNIQUE INDEX "Profile_eliteSkillCardsId_key" ON "Profile"("eliteSkillCardsId");

-- CreateIndex
CREATE UNIQUE INDEX "Profile_toolstackProficiencyId_key" ON "Profile"("toolstackProficiencyId");

-- CreateIndex
CREATE UNIQUE INDEX "Profile_domainExperienceId_key" ON "Profile"("domainExperienceId");

-- CreateIndex
CREATE UNIQUE INDEX "Profile_industryExperienceId_key" ON "Profile"("industryExperienceId");

-- CreateIndex
CREATE UNIQUE INDEX "Profile_availabilityWorkflowId_key" ON "Profile"("availabilityWorkflowId");

-- CreateIndex
CREATE UNIQUE INDEX "Profile_softSkillsId_key" ON "Profile"("softSkillsId");

-- CreateIndex
CREATE UNIQUE INDEX "Profile_certificationsId_key" ON "Profile"("certificationsId");

-- CreateIndex
CREATE UNIQUE INDEX "Profile_projectQuotingId_key" ON "Profile"("projectQuotingId");

-- CreateIndex
CREATE UNIQUE INDEX "Profile_legalAgreementsId_key" ON "Profile"("legalAgreementsId");

-- CreateIndex
CREATE UNIQUE INDEX "LegalAgreements_identityVerificationId_key" ON "LegalAgreements"("identityVerificationId");

-- CreateIndex
CREATE UNIQUE INDEX "LegalAgreements_workAuthorizationId_key" ON "LegalAgreements"("workAuthorizationId");

-- CreateIndex
CREATE INDEX "_InterestedFreelancers_B_index" ON "_InterestedFreelancers"("B");

-- CreateIndex
CREATE INDEX "_SelectedFreelancers_B_index" ON "_SelectedFreelancers"("B");

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_clientWhoPostedThisProjectForeignId_fkey" FOREIGN KEY ("clientWhoPostedThisProjectForeignId") REFERENCES "User"("uid") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Milestone" ADD CONSTRAINT "Milestone_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MenuItem" ADD CONSTRAINT "MenuItem_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "MenuItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Profile" ADD CONSTRAINT "Profile_whoYouAreId_fkey" FOREIGN KEY ("whoYouAreId") REFERENCES "WhoYouAre"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Profile" ADD CONSTRAINT "Profile_coreRoleId_fkey" FOREIGN KEY ("coreRoleId") REFERENCES "CoreRole"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Profile" ADD CONSTRAINT "Profile_eliteSkillCardsId_fkey" FOREIGN KEY ("eliteSkillCardsId") REFERENCES "EliteSkillCards"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Profile" ADD CONSTRAINT "Profile_toolstackProficiencyId_fkey" FOREIGN KEY ("toolstackProficiencyId") REFERENCES "ToolstackProficiency"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Profile" ADD CONSTRAINT "Profile_domainExperienceId_fkey" FOREIGN KEY ("domainExperienceId") REFERENCES "DomainExperience"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Profile" ADD CONSTRAINT "Profile_industryExperienceId_fkey" FOREIGN KEY ("industryExperienceId") REFERENCES "IndustryExperience"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Profile" ADD CONSTRAINT "Profile_availabilityWorkflowId_fkey" FOREIGN KEY ("availabilityWorkflowId") REFERENCES "AvailabilityWorkflow"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Profile" ADD CONSTRAINT "Profile_softSkillsId_fkey" FOREIGN KEY ("softSkillsId") REFERENCES "SoftSkills"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Profile" ADD CONSTRAINT "Profile_certificationsId_fkey" FOREIGN KEY ("certificationsId") REFERENCES "Certifications"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Profile" ADD CONSTRAINT "Profile_projectQuotingId_fkey" FOREIGN KEY ("projectQuotingId") REFERENCES "ProjectQuoting"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Profile" ADD CONSTRAINT "Profile_legalAgreementsId_fkey" FOREIGN KEY ("legalAgreementsId") REFERENCES "LegalAgreements"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LegalAgreements" ADD CONSTRAINT "LegalAgreements_identityVerificationId_fkey" FOREIGN KEY ("identityVerificationId") REFERENCES "IdentityVerification"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LegalAgreements" ADD CONSTRAINT "LegalAgreements_workAuthorizationId_fkey" FOREIGN KEY ("workAuthorizationId") REFERENCES "WorkAuthorization"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_InterestedFreelancers" ADD CONSTRAINT "_InterestedFreelancers_A_fkey" FOREIGN KEY ("A") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_InterestedFreelancers" ADD CONSTRAINT "_InterestedFreelancers_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("uid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_SelectedFreelancers" ADD CONSTRAINT "_SelectedFreelancers_A_fkey" FOREIGN KEY ("A") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_SelectedFreelancers" ADD CONSTRAINT "_SelectedFreelancers_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("uid") ON DELETE CASCADE ON UPDATE CASCADE;

import type { Prisma } from "@prisma/client";
import { BADREQUESTCODE, COMPANY_NAME, NOTFOUNDCODE, NOTFOUNDMSG, SUCCESSCODE, SUCCESSMSG, WELCOMEMESSAGEFORFREELANCER } from "../../constants";
import { db } from "../../database/db";
import type { _Request } from "../../middlewares/authMiddleware";
import { gloabalMailMessage } from "../../services/globalMailService";
import { passwordHasher } from "../../services/passwordHasherService";
import { generateRandomStrings, generateUsername } from "../../services/slugStringGeneratorService";
import type { TFREELANCERPROFILE } from "../../types";
import { httpResponse } from "../../utils/apiResponseUtils";
import { asyncHandler } from "../../utils/asyncHandlerUtils";

const freeLancerControllerV2 = {
  getFreeLancerJoinUsRequest: asyncHandler(async (req: _Request, res) => {
    const freeLancer: TFREELANCERPROFILE = req.body as TFREELANCERPROFILE;

    // Validate required fields
    if (!freeLancer.whoYouAre.email) {
      throw { status: BADREQUESTCODE, message: "Email is required for sending confirmation." };
    }

    // Check existence by email
    const isExist = await db.profile.findFirst({
      where: {
        whoYouAre: { email: freeLancer.whoYouAre.email }
      }
    });

    if (isExist) {
      throw { status: BADREQUESTCODE, message: "You've already requested for joining us" };
    }

    // Get userId from token
    const userId = req.userFromToken?.uid ?? null;
    // if (!userId) {
    //   throw { status: BADREQUESTCODE, message: "User ID is required from token." };
    // }

    // Prepare legalAgreements create input
    const legalAgreementsCreate: Prisma.LegalAgreementsCreateNestedOneWithoutProfileInput | undefined = freeLancer.legalAgreements
      ? {
          create: {
            agreements: freeLancer.legalAgreements.agreements || [],
            // Only include identityVerification if all required fields are present
            ...(freeLancer.legalAgreements.identityVerification?.idType &&
            freeLancer.legalAgreements.identityVerification.taxDocType &&
            typeof freeLancer.legalAgreements.identityVerification.addressVerified === "boolean"
              ? {
                  identityVerification: {
                    create: {
                      idType: freeLancer.legalAgreements.identityVerification.idType,
                      taxDocType: freeLancer.legalAgreements.identityVerification.taxDocType,
                      addressVerified: freeLancer.legalAgreements.identityVerification.addressVerified
                    }
                  }
                }
              : {}),
            // Only include workAuthorization if it exists
            ...(freeLancer.legalAgreements.workAuthorization
              ? {
                  workAuthorization: {
                    create: {
                      interested: freeLancer.legalAgreements.workAuthorization.interested || false
                    }
                  }
                }
              : {})
          }
        }
      : undefined;

    // Create the profile with all related data
    const profileData: Prisma.ProfileCreateInput = {
      userId,
      whoYouAre: {
        create: {
          fullName: freeLancer.whoYouAre.fullName || "",
          email: freeLancer.whoYouAre.email,
          timeZone: freeLancer.whoYouAre.timeZone || "UTC",
          country: freeLancer.whoYouAre.country || null,
          professionalLinks: freeLancer.whoYouAre.professionalLinks || {},
          phone: freeLancer.whoYouAre.phone || null
        }
      }
    };

    if (freeLancer.coreRole) {
      profileData.coreRole = {
        create: {
          primaryDomain: freeLancer.coreRole.primaryDomain || ""
        }
      };
    }
    if (freeLancer.eliteSkillCards) {
      profileData.eliteSkillCards = {
        create: {
          selectedSkills: freeLancer.eliteSkillCards.selectedSkills || []
        }
      };
    }
    if (freeLancer.toolstackProficiency) {
      profileData.toolstackProficiency = {
        create: {
          selectedTools: freeLancer.toolstackProficiency.selectedTools || []
        }
      };
    }
    if (freeLancer.domainExperience) {
      profileData.domainExperience = {
        create: {
          roles: freeLancer.domainExperience.roles || []
        }
      };
    }
    if (freeLancer.industryExperience) {
      profileData.industryExperience = {
        create: {
          selectedIndustries: freeLancer.industryExperience.selectedIndustries || []
        }
      };
    }
    if (freeLancer.availabilityWorkflow) {
      profileData.availabilityWorkflow = {
        create: {
          weeklyCommitment: freeLancer.availabilityWorkflow.weeklyCommitment || 0,
          workingHours: freeLancer.availabilityWorkflow.workingHours || [],
          collaborationTools: freeLancer.availabilityWorkflow.collaborationTools || [],
          teamStyle: freeLancer.availabilityWorkflow.teamStyle || "",
          screenSharing: freeLancer.availabilityWorkflow.screenSharing || "",
          availabilityExceptions: freeLancer.availabilityWorkflow.availabilityExceptions || ""
        }
      };
    }
    if (freeLancer.softSkills) {
      profileData.softSkills = {
        create: {
          collaborationStyle: freeLancer.softSkills.collaborationStyle || "",
          communicationFrequency: freeLancer.softSkills.communicationFrequency || "",
          conflictResolution: freeLancer.softSkills.conflictResolution || "",
          languages: freeLancer.softSkills.languages || [],
          teamVsSolo: freeLancer.softSkills.teamVsSolo || ""
        }
      };
    }
    if (freeLancer.certifications) {
      profileData.certifications = {
        create: {
          certificates: freeLancer.certifications.certificates || []
        }
      };
    }
    if (freeLancer.projectQuoting) {
      profileData.projectQuoting = {
        create: {
          compensationPreference: freeLancer.projectQuoting.compensationPreference || "",
          smallProjectPrice: freeLancer.projectQuoting.smallProjectPrice || 0,
          midProjectPrice: freeLancer.projectQuoting.midProjectPrice || 0,
          longTermPrice: freeLancer.projectQuoting.longTermPrice || 0,
          milestoneTerms: freeLancer.projectQuoting.milestoneTerms || "",
          willSubmitProposals: freeLancer.projectQuoting.willSubmitProposals || ""
        }
      };
    }
    if (legalAgreementsCreate) {
      profileData.legalAgreements = legalAgreementsCreate;
    }
    // ...existing code...
    // console.log("PROFILE DATA:", JSON.stringify(profileData, null, 2));
    // ...existing code...
    await db.profile.create({
      data: profileData
    });
    // ...existing code...

    res.status(201).json({ message: "Freelancer profile created successfully" });
  }),

  getAllFreeLancerRequest: asyncHandler(async (req, res) => {
    const profiles = await db.profile.findMany({
      where: {
        trashedAt: null,
        trashedBy: null,
        isAccepted: false
      },
      include: {
        whoYouAre: true,
        coreRole: true,
        eliteSkillCards: true,
        toolstackProficiency: true,
        domainExperience: true,
        industryExperience: true,
        availabilityWorkflow: true,
        softSkills: true,
        certifications: true,
        projectQuoting: true,
        legalAgreements: true
      }
    });
    if (profiles.length === 0) {
      httpResponse(req, res, SUCCESSCODE, NOTFOUNDMSG, null);
    }
    httpResponse(req, res, SUCCESSCODE, SUCCESSMSG, profiles);
  }),

  getSingleFreeLancerRequest: asyncHandler(async (req, res) => {
    const { id } = req.params;
    if (!id) throw { status: BADREQUESTCODE, message: "Profile id is required." };
    const profile = await db.profile.findFirst({
      where: {
        id,
        trashedAt: null,
        trashedBy: null
      },
      include: {
        whoYouAre: true,
        coreRole: true,
        eliteSkillCards: true,
        toolstackProficiency: true,
        domainExperience: true,
        industryExperience: true,
        availabilityWorkflow: true,
        softSkills: true,
        certifications: true,
        projectQuoting: true,
        legalAgreements: true
      }
    });
    if (!profile) throw { status: NOTFOUNDCODE, message: NOTFOUNDMSG };
    httpResponse(req, res, SUCCESSCODE, SUCCESSMSG, profile);
  }),

  trashFreeLancerRequest: asyncHandler(async (req: _Request, res) => {
    const { id } = req.params;
    if (!id) throw { status: BADREQUESTCODE, message: "Profile id is required." };
    const uid = req.userFromToken?.uid as string;

    const userWhoTrashed = await db.user.findUnique({ where: { uid } });
    if (!userWhoTrashed) throw { status: BADREQUESTCODE, message: "User not found" };
    await db.profile.update({
      where: { id: id },
      data: {
        trashedBy: `@${userWhoTrashed.username}-${userWhoTrashed.fullName}-${userWhoTrashed.role}`,
        trashedAt: new Date()
      }
    });
    httpResponse(req, res, SUCCESSCODE, SUCCESSMSG);
  }),

  untrashFreeLancerRequest: asyncHandler(async (req: _Request, res) => {
    const { id } = req.params;
    if (!id) throw { status: BADREQUESTCODE, message: "Profile id is required." };
    await db.profile.update({
      where: { id: id },
      data: {
        trashedBy: null,
        trashedAt: null
      }
    });
    httpResponse(req, res, SUCCESSCODE, SUCCESSMSG);
  }),

  deleteFreeLancerRequest: asyncHandler(async (req: _Request, res) => {
    const { id } = req.params;
    if (!id) throw { status: BADREQUESTCODE, message: "Profile id is required." };
    const isRequestExist = await db.profile.findUnique({ where: { id: id }, select: { id: true } });
    if (!isRequestExist) throw { status: NOTFOUNDCODE, message: NOTFOUNDMSG };
    await db.profile.delete({
      where: { id: id }
    });
    httpResponse(req, res, SUCCESSCODE, SUCCESSMSG);
  }),

  acceptFreeLancerRequest: asyncHandler(async (req: _Request, res) => {
    const { id } = req.params;
    if (!id) throw { status: BADREQUESTCODE, message: "Profile id is required." };
    const profile = await db.profile.findUnique({
      where: { id: id },
      include: { whoYouAre: true }
    });
    if (!profile || !profile.whoYouAre) throw { status: NOTFOUNDCODE, message: NOTFOUNDMSG };

    await db.profile.update({
      where: { id },
      data: { isAccepted: true }
    });

    const randomPassword = generateRandomStrings(6);
    const hashedPassword = await passwordHasher(randomPassword, res); // Remove unnecessary type assertion
    const isFreelancerAlreadyExist = await db.user.findUnique({
      where: { email: profile.whoYouAre.email ? profile.whoYouAre.email : "" }
    });

    if (isFreelancerAlreadyExist && profile.whoYouAre.email) {
      await db.user.update({
        where: { email: profile.whoYouAre.email },
        data: { role: "FREELANCER" }
      });
      return res
        .status(SUCCESSCODE)
        .json({ success: true, status: SUCCESSCODE, message: "As user already exists, its role changed to freelancer" })
        .end();
    }

    const createdFreelancer = await db.user.create({
      data: {
        username: `${generateUsername(profile.whoYouAre.fullName || "freelancer")}_${generateRandomStrings(4)}`.toLowerCase(),
        email: profile.whoYouAre.email,
        fullName: profile.whoYouAre.fullName || "Freelancer",
        role: "FREELANCER",
        phone: profile.whoYouAre.phone || null,
        password: hashedPassword as string,
        emailVerifiedAt: new Date()
      }
    });

    await gloabalMailMessage(
      createdFreelancer.email,
      `${WELCOMEMESSAGEFORFREELANCER} <p>Please use the following credentials to access your Dashboard from where you can see the list of all the projects.</p>
      <br>
      Username:<p style="color:blue;font-weight:bold;">${createdFreelancer.username}</p>
      Password:<p style="color:blue;font-weight:bold;">${randomPassword}</p>
      <p>Best Regards,</p> ${COMPANY_NAME}`,
      `Congratulations For Joining Us`,
      `Dear, ${createdFreelancer.fullName}`
    );

    await db.profile.delete({ where: { id } });
    return res
      .status(SUCCESSCODE)
      .json({ success: true, status: SUCCESSCODE, message: "Request Accepted Successfully", createdFreelancer: createdFreelancer.uid })
      .end();
  })
};

export default freeLancerControllerV2;

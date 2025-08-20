import {
  BADREQUESTCODE,
  COMPANY_NAME,
  NOTFOUNDCODE,
  NOTFOUNDMSG,
  SUCCESSCODE,
  SUCCESSMSG,
  THANKYOUMESSAGE,
  WELCOMEMESSAGEFORFREELANCER
} from "../../constants";
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
    const freeLancer = req.body as TFREELANCERPROFILE;
    // Apply defaults if not provided
    freeLancer.whoYouAre.timeZone = freeLancer.whoYouAre.timeZone ?? "UTC";
    freeLancer.whoYouAre.country = freeLancer.whoYouAre.country ?? null;
    freeLancer.whoYouAre.professionalLinks = freeLancer.whoYouAre.professionalLinks ?? {};
    freeLancer.whoYouAre.phone = freeLancer.whoYouAre.phone ?? null;

    // Check existence by email OR phone (better for duplicate prevention)
    const orFilters = [];
    if (freeLancer.whoYouAre.email !== undefined) {
      orFilters.push({ whoYouAre: { email: freeLancer.whoYouAre.email } });
    }
    // console.log(orFilters);

    const isExist = await db.profile.findFirst({
      where: orFilters.length > 0 ? { OR: orFilters } : {}
    });
    // console.log(isExist);

    if (isExist) throw { status: BADREQUESTCODE, message: "You've already requested for joining us" };

    // Assign userId from request or generate as needed
    const userId = req.userFromToken?.uid as string;
    if (!freeLancer.whoYouAre.email) {
      throw { status: BADREQUESTCODE, message: "Email is required for sending confirmation." };
    }
    await db.profile.create({
      data: {
        userId,
        whoYouAre: {
          create: {
            fullName: freeLancer.whoYouAre.fullName ?? "",
            email: freeLancer.whoYouAre.email ?? "",
            timeZone: freeLancer.whoYouAre.timeZone ?? "UTC",
            country: freeLancer.whoYouAre.country ?? null,
            professionalLinks: freeLancer.whoYouAre.professionalLinks ?? {},
            phone: freeLancer.whoYouAre.phone ?? null
          }
        },

        ...(freeLancer.coreRole ? { coreRole: { create: freeLancer.coreRole } } : {}),

        ...(freeLancer.eliteSkillCards ? { eliteSkillCards: { create: freeLancer.eliteSkillCards } } : {}),

        ...(freeLancer.toolstackProficiency ? { toolstackProficiency: { create: freeLancer.toolstackProficiency } } : {}),

        ...(freeLancer.domainExperience ? { domainExperience: { create: freeLancer.domainExperience } } : {}),

        ...(freeLancer.industryExperience ? { industryExperience: { create: freeLancer.industryExperience } } : {}),

        ...(freeLancer.availabilityWorkflow ? { availabilityWorkflow: { create: freeLancer.availabilityWorkflow } } : {}),

        ...(freeLancer.softSkills ? { softSkills: { create: freeLancer.softSkills } } : {}),

        ...(freeLancer.certifications ? { certifications: { create: freeLancer.certifications } } : {}),

        ...(freeLancer.projectQuoting ? { projectQuoting: { create: freeLancer.projectQuoting } } : {}),

        ...(freeLancer.legalAgreements
          ? {
              legalAgreements: {
                create: {
                  agreements: freeLancer.legalAgreements.agreements,
                  identityVerification: {
                    create: freeLancer.legalAgreements.identityVerification
                  },
                  workAuthorization: {
                    create: freeLancer.legalAgreements.workAuthorization
                  }
                }
              }
            }
          : {})
      }
    });

    await gloabalMailMessage(freeLancer.whoYouAre.email, THANKYOUMESSAGE, `Your Request to Join Us`, `Dear, ${freeLancer.whoYouAre.fullName}`);
    // res.status(200).json({ message: "Request sent successfully" });
    httpResponse(req, res, SUCCESSCODE, SUCCESSMSG);
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
    const hashedPassword = (await passwordHasher(randomPassword, res)) as string;
    const isFreelancerAlreadyExist = await db.user.findUnique({
      where: { email: profile.whoYouAre.email ? profile.whoYouAre.email : "" }
    });

    if (isFreelancerAlreadyExist && profile?.whoYouAre?.email) {
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
        username: `${generateUsername((profile.whoYouAre.fullName as string) || "freelancer")}_${generateRandomStrings(4)}`.toLowerCase(),
        email: profile.whoYouAre.email as string,
        fullName: (profile.whoYouAre.fullName as string) || "Freelancer",
        role: "FREELANCER",
        phone: (profile.whoYouAre.phone as string) || null,
        password: hashedPassword,
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

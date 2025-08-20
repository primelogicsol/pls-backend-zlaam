import { Prisma } from "@prisma/client";
import type { Request, Response } from "express";
import { SUCCESSCODE, SUCCESSMSG } from "../../constants";
import { db } from "../../database/db";
import type { _Request } from "../../middlewares/authMiddleware";
import type { ProjectRequestCreateDTO } from "../../types";
import { httpResponse } from "../../utils/apiResponseUtils";
import { asyncHandler } from "../../utils/asyncHandlerUtils";

const ProjectRequestController = {
  create: asyncHandler(async (req: _Request, res: Response) => {
    const { registerYourself, services, industries, technologies, features, specialOffers, timeline, budget, estimate, agreement, proceedOptions } =
      req.body as ProjectRequestCreateDTO;

    // You’ll probably get userId from auth middleware or req.user
    const userId = req.userFromToken?.uid as string;

    await db.projectRequest.create({
      data: {
        userId,

        // Register Yourself
        fullName: registerYourself.fullName,
        businessEmail: registerYourself.businessEmail,
        phoneNumber: registerYourself.phoneNumber || null,
        companyName: registerYourself.companyName || null,
        companyWebsite: registerYourself.companyWebsite || null,
        businessAddress: registerYourself.businessAddress || null,
        businessType: registerYourself.businessType || null,
        referralSource: registerYourself.referralSource || null,

        // Special Offers
        appliedDiscount: specialOffers?.appliedDiscount || null,

        // Timeline & Budget
        timeline: timeline || null,
        paymentMethod: budget?.paymentMethod || null,

        // Estimate
        estimateAccepted: estimate?.accepted ?? false,
        comparisonVisible: estimate?.comparisonVisible ?? false,
        estimateFinalPriceMin: estimate?.finalPrice?.min || null,
        estimateFinalPriceMax: estimate?.finalPrice?.max || null,
        estimateBasePriceMin: estimate?.basePrice?.min || null,
        estimateBasePriceMax: estimate?.basePrice?.max || null,
        discountPercentage: estimate?.discount?.percentage || null,
        discountAmountMin: estimate?.discount?.amount?.min || null,
        discountAmountMax: estimate?.discount?.amount?.max || null,
        rushFeePercentage: estimate?.rushFee?.percentage || null,
        rushFeeAmountMin: estimate?.rushFee?.amount?.min || null,
        rushFeeAmountMax: estimate?.rushFee?.amount?.max || null,

        // Agreement
        agreementAccepted: agreement?.accepted ?? false,

        // Proceed Options
        selectedOption: proceedOptions?.selectedOption || null,
        completed: proceedOptions?.completed ?? false,

        // Relations
        services: {
          create: services?.map((s: { category: string; service: string }) => ({
            category: s.category,
            service: s.service
          }))
        },
        industries: {
          create: industries?.map((i: { category: string; industry: string }) => ({
            category: i.category,
            industry: i.industry
          }))
        },
        technologies: {
          create: technologies?.map((t: { category: string; technology: string }) => ({
            category: t.category,
            technology: t.technology
          }))
        },
        features: {
          create: features?.map((f: { category: string; feature: string }) => ({
            category: f.category,
            feature: f.feature
          }))
        }
      },
      include: {
        services: true,
        industries: true,
        technologies: true,
        features: true
      }
    });

    return httpResponse(req, res, SUCCESSCODE, SUCCESSMSG);
  }),

  findAll: asyncHandler(async (req: Request, res: Response) => {
    const { search } = req.query as { search?: string };

    const projectRequests = await db.projectRequest.findMany({
      where: search
        ? {
            OR: [
              {
                fullName: {
                  contains: search,
                  mode: Prisma.QueryMode.insensitive
                }
              },
              {
                businessEmail: {
                  contains: search,
                  mode: Prisma.QueryMode.insensitive
                }
              },
              {
                businessType: {
                  contains: search,
                  mode: Prisma.QueryMode.insensitive
                }
              },
              {
                companyName: {
                  contains: search,
                  mode: Prisma.QueryMode.insensitive
                }
              }
            ]
          }
        : {},
      include: {
        services: true,
        industries: true,
        technologies: true,
        features: true
      }
    });

    return httpResponse(req, res, SUCCESSCODE, SUCCESSMSG, projectRequests);
  }),

  findById: asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: "ID is required" });
    }

    const projectRequest = await db.projectRequest.findUnique({
      where: { id }, // id is a string UUID
      include: {
        services: true,
        industries: true,
        technologies: true,
        features: true,
        user: true // if you want the user details too
      }
    });

    if (!projectRequest) {
      return res.status(404).json({ error: "Project request not found" });
    }

    return httpResponse(req, res, SUCCESSCODE, SUCCESSMSG, projectRequest);
  }),

  delete: asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ error: "ID is required" });
    }
    await db.projectRequest.delete({
      where: { id }
    });
    return httpResponse(req, res, SUCCESSCODE, SUCCESSMSG);
  })
};

export default ProjectRequestController;

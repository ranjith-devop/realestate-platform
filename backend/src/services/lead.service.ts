import { prisma } from "../config/prisma";
import { CreateLeadDto } from "../validators/lead.validator";
import { LeadStatus } from "@prisma/client";

export class LeadService {
  /**
   * Create an inquiry with spam protection and deduplication.
   */
  static async createLead(
    dto: CreateLeadDto,
    buyerId?: string,
    ipAddress?: string
  ) {
    // 1. Honeypot check: Bots routinely autofill hidden form fields
    if (dto.website && dto.website.trim().length > 0) {
      throw new Error("Spam detected. Submission ignored.");
    }

    // 2. Validate property existence
    const property = await prisma.property.findUnique({
      where: { id: dto.propertyId },
      select: { id: true, ownerId: true, title: true, status: true },
    });

    if (!property) {
      throw new Error("Property not found");
    }

    // Prevent owner from submitting lead on their own property
    if (buyerId && property.ownerId === buyerId) {
      throw new Error("You cannot submit an inquiry for your own property listing");
    }

    // 3. Deduplication Check: Prevent duplicate inquiries from the same email for the same property within 24h
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const existingRecentLead = await prisma.lead.findFirst({
      where: {
        propertyId: dto.propertyId,
        email: dto.email.toLowerCase(),
        createdAt: { gte: oneDayAgo },
      },
    });

    if (existingRecentLead) {
      throw new Error(
        "You have already sent an inquiry for this property recently. The owner will get in touch with you shortly."
      );
    }

    // 4. Create the lead
    const lead = await prisma.lead.create({
      data: {
        propertyId: dto.propertyId,
        buyerId: buyerId || null,
        name: dto.name,
        email: dto.email.toLowerCase(),
        phone: dto.phone,
        message: dto.message,
        ipAddress,
      },
      include: {
        property: {
          select: {
            id: true,
            title: true,
            city: true,
            price: true,
          },
        },
      },
    });

    return lead;
  }

  /**
   * Fetch leads for properties owned by the authenticated owner.
   */
  static async getLeadsForOwner(ownerId: string) {
    return prisma.lead.findMany({
      where: {
        property: {
          ownerId,
        },
      },
      orderBy: { createdAt: "desc" },
      include: {
        property: {
          select: {
            id: true,
            title: true,
            locality: true,
            city: true,
            price: true,
          },
        },
      },
    });
  }

  /**
   * Fetch leads submitted by the authenticated buyer.
   */
  static async getLeadsSentByBuyer(buyerId: string) {
    return prisma.lead.findMany({
      where: { buyerId },
      orderBy: { createdAt: "desc" },
      include: {
        property: {
          select: {
            id: true,
            title: true,
            locality: true,
            city: true,
            price: true,
            images: true,
          },
        },
      },
    });
  }

  /**
   * Update lead status (e.g. from NEW to CONTACTED or CLOSED).
   */
  static async updateLeadStatus(leadId: string, status: LeadStatus, ownerId: string) {
    // Verify that the lead belongs to a property owned by this user
    const lead = await prisma.lead.findUnique({
      where: { id: leadId },
      include: { property: { select: { ownerId: true } } },
    });

    if (!lead) {
      throw new Error("Lead not found");
    }

    if (lead.property.ownerId !== ownerId) {
      throw new Error("You do not have permission to update this inquiry");
    }

    return prisma.lead.update({
      where: { id: leadId },
      data: { status },
    });
  }
}

import { prisma } from "../config/prisma";
import { Role, PropertyStatus, LeadStatus } from "@prisma/client";

export class AdminService {
  /**
   * Get high-level platform analytics for SuperAdmin dashboard.
   */
  static async getPlatformStats() {
    const [
      totalUsers,
      buyerCount,
      ownerCount,
      agentCount,
      adminCount,
      totalProperties,
      availableProperties,
      underOfferProperties,
      soldProperties,
      rentedProperties,
      totalLeads,
      newLeads,
      contactedLeads,
      closedLeads,
      propertyPrices,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { role: Role.BUYER } }),
      prisma.user.count({ where: { role: Role.OWNER } }),
      prisma.user.count({ where: { role: Role.AGENT } }),
      prisma.user.count({ where: { role: Role.ADMIN } }),
      prisma.property.count(),
      prisma.property.count({ where: { status: PropertyStatus.AVAILABLE } }),
      prisma.property.count({ where: { status: PropertyStatus.UNDER_OFFER } }),
      prisma.property.count({ where: { status: PropertyStatus.SOLD } }),
      prisma.property.count({ where: { status: PropertyStatus.RENTED } }),
      prisma.lead.count(),
      prisma.lead.count({ where: { status: LeadStatus.NEW } }),
      prisma.lead.count({ where: { status: LeadStatus.CONTACTED } }),
      prisma.lead.count({ where: { status: LeadStatus.CLOSED } }),
      prisma.property.aggregate({
        _sum: { price: true },
        _avg: { price: true },
      }),
    ]);

    const recentUsers = await prisma.user.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        avatar: true,
        createdAt: true,
      },
    });

    const recentProperties = await prisma.property.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        title: true,
        price: true,
        city: true,
        status: true,
        createdAt: true,
        owner: {
          select: {
            id: true,
            name: true,
            role: true,
          },
        },
      },
    });

    return {
      users: {
        total: totalUsers,
        buyers: buyerCount,
        owners: ownerCount,
        agents: agentCount,
        admins: adminCount,
      },
      properties: {
        total: totalProperties,
        available: availableProperties,
        underOffer: underOfferProperties,
        sold: soldProperties,
        rented: rentedProperties,
        totalAssetValue: propertyPrices._sum.price || 0,
        averagePrice: propertyPrices._avg.price || 0,
      },
      leads: {
        total: totalLeads,
        new: newLeads,
        contacted: contactedLeads,
        closed: closedLeads,
      },
      recentUsers,
      recentProperties,
    };
  }

  /**
   * Get paginated users list with search & role filter.
   */
  static async getUsers(params: {
    page?: number;
    limit?: number;
    search?: string;
    role?: Role;
  }) {
    const page = Math.max(1, params.page || 1);
    const limit = Math.min(100, Math.max(1, params.limit || 20));
    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = {};

    if (params.role) {
      where.role = params.role;
    }

    if (params.search && params.search.trim()) {
      const q = params.search.trim();
      where.OR = [
        { name: { contains: q, mode: "insensitive" } },
        { email: { contains: q, mode: "insensitive" } },
        { phone: { contains: q, mode: "insensitive" } },
      ];
    }

    const [totalRecords, users] = await Promise.all([
      prisma.user.count({ where }),
      prisma.user.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          role: true,
          avatar: true,
          city: true,
          createdAt: true,
          _count: {
            select: {
              properties: true,
              leadsSent: true,
            },
          },
        },
      }),
    ]);

    return {
      users,
      pagination: {
        page,
        limit,
        totalRecords,
        totalPages: Math.ceil(totalRecords / limit),
      },
    };
  }

  /**
   * Promote or change user role.
   */
  static async updateUserRole(userId: string, newRole: Role, adminId: string) {
    if (userId === adminId && newRole !== Role.ADMIN) {
      throw new Error("You cannot demote your own SuperAdmin account.");
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new Error("User not found.");
    }

    const updated = await prisma.user.update({
      where: { id: userId },
      data: { role: newRole },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    });

    return updated;
  }

  /**
   * Delete user account.
   */
  static async deleteUser(userId: string, adminId: string) {
    if (userId === adminId) {
      throw new Error("You cannot delete your own SuperAdmin account.");
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new Error("User not found.");
    }

    await prisma.user.delete({ where: { id: userId } });
    return { id: userId, deleted: true };
  }

  /**
   * Moderate properties across all sellers/agents.
   */
  static async getAllProperties(params: {
    page?: number;
    limit?: number;
    search?: string;
    status?: PropertyStatus;
  }) {
    const page = Math.max(1, params.page || 1);
    const limit = Math.min(100, Math.max(1, params.limit || 20));
    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = {};
    if (params.status) where.status = params.status;
    if (params.search && params.search.trim()) {
      const q = params.search.trim();
      where.OR = [
        { title: { contains: q, mode: "insensitive" } },
        { city: { contains: q, mode: "insensitive" } },
        { locality: { contains: q, mode: "insensitive" } },
      ];
    }

    const [totalRecords, properties] = await Promise.all([
      prisma.property.count({ where }),
      prisma.property.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          owner: {
            select: {
              id: true,
              name: true,
              email: true,
              role: true,
              avatar: true,
            },
          },
          _count: {
            select: { leads: true },
          },
        },
      }),
    ]);

    return {
      properties,
      pagination: {
        page,
        limit,
        totalRecords,
        totalPages: Math.ceil(totalRecords / limit),
      },
    };
  }

  /**
   * Force take down a property listing.
   */
  static async deleteProperty(propertyId: string) {
    const property = await prisma.property.findUnique({ where: { id: propertyId } });
    if (!property) {
      throw new Error("Property not found.");
    }

    await prisma.property.delete({ where: { id: propertyId } });
    return { id: propertyId, deleted: true };
  }

  /**
   * Platform-wide leads audit log.
   */
  static async getAllLeads(params: {
    page?: number;
    limit?: number;
    status?: LeadStatus;
  }) {
    const page = Math.max(1, params.page || 1);
    const limit = Math.min(100, Math.max(1, params.limit || 20));
    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = {};
    if (params.status) where.status = params.status;

    const [totalRecords, leads] = await Promise.all([
      prisma.lead.count({ where }),
      prisma.lead.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          buyer: {
            select: {
              id: true,
              name: true,
              email: true,
              avatar: true,
            },
          },
          property: {
            select: {
              id: true,
              title: true,
              city: true,
              owner: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                  role: true,
                },
              },
            },
          },
        },
      }),
    ]);

    return {
      leads,
      pagination: {
        page,
        limit,
        totalRecords,
        totalPages: Math.ceil(totalRecords / limit),
      },
    };
  }
}

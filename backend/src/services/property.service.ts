import { Prisma, PropertyStatus, PropertyType, ListingType, Furnishing } from "@prisma/client";
import { prisma } from "../config/prisma";
import { CreatePropertyDto, UpdatePropertyDto, PropertyQueryParams } from "../validators/property.validator";
import { PaginationMeta } from "../types";

export class PropertyService {
  /**
   * High-performance search and filter supporting 50,000+ records.
   * Utilizes composite indexes on [city, status, price] and [city, propertyType, bedrooms].
   */
  static async searchProperties(params: PropertyQueryParams) {
    const {
      page = 1,
      limit = 12,
      cursor,
      city,
      locality,
      search,
      listingType,
      propertyType,
      bedrooms,
      minPrice,
      maxPrice,
      furnishing,
      sortBy = "newest",
    } = params;

    const where: Prisma.PropertyWhereInput = {
      status: PropertyStatus.AVAILABLE,
    };

    if (city) {
      where.city = { equals: city.trim(), mode: "insensitive" };
    }

    if (locality) {
      where.locality = { contains: locality.trim(), mode: "insensitive" };
    }

    if (listingType) {
      where.listingType = listingType;
    }

    if (propertyType) {
      if (Array.isArray(propertyType)) {
        where.propertyType = { in: propertyType };
      } else {
        where.propertyType = propertyType;
      }
    }

    if (bedrooms !== undefined) {
      if (Array.isArray(bedrooms)) {
        where.bedrooms = { in: bedrooms };
      } else {
        where.bedrooms = bedrooms;
      }
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      where.price = {};
      if (minPrice !== undefined) where.price.gte = minPrice;
      if (maxPrice !== undefined) where.price.lte = maxPrice;
    }

    if (furnishing) {
      where.furnishing = furnishing;
    }

    if (search) {
      const term = search.trim();
      where.OR = [
        { title: { contains: term, mode: "insensitive" } },
        { locality: { contains: term, mode: "insensitive" } },
        { city: { contains: term, mode: "insensitive" } },
        { description: { contains: term, mode: "insensitive" } },
      ];
    }

    // Determine sorting criteria
    let orderBy: Prisma.PropertyOrderByWithRelationInput[];
    switch (sortBy) {
      case "price_asc":
        orderBy = [{ price: "asc" }, { id: "asc" }];
        break;
      case "price_desc":
        orderBy = [{ price: "desc" }, { id: "desc" }];
        break;
      case "popularity":
        orderBy = [{ viewsCount: "desc" }, { id: "desc" }];
        break;
      case "newest":
      default:
        orderBy = [{ createdAt: "desc" }, { id: "desc" }];
        break;
    }

    // Lean projection: only fetch fields needed for listing cards
    const selectFields: Prisma.PropertySelect = {
      id: true,
      title: true,
      listingType: true,
      propertyType: true,
      price: true,
      pricePerSqFt: true,
      bedrooms: true,
      bathrooms: true,
      superAreaSqFt: true,
      furnishing: true,
      locality: true,
      city: true,
      state: true,
      images: true,
      status: true,
      viewsCount: true,
      createdAt: true,
      owner: {
        select: {
          id: true,
          name: true,
          role: true,
          avatar: true,
        },
      },
    };

    // Support cursor-based pagination for infinite scroll or ultra-fast deep paging
    if (cursor) {
      const items = await prisma.property.findMany({
        where,
        take: limit + 1,
        skip: 1,
        cursor: { id: cursor },
        orderBy,
        select: selectFields,
      });

      const hasNextPage = items.length > limit;
      const records = hasNextPage ? items.slice(0, limit) : items;
      const nextCursor = hasNextPage ? records[records.length - 1].id : null;

      const meta: PaginationMeta = {
        limit,
        hasNextPage,
        nextCursor,
      };

      return { properties: records, meta };
    }

    // Offset pagination with index optimization
    const skip = (page - 1) * limit;

    // Parallel execution of query and optimized count
    const [totalRecords, properties] = await Promise.all([
      prisma.property.count({ where }),
      prisma.property.findMany({
        where,
        skip,
        take: limit,
        orderBy,
        select: selectFields,
      }),
    ]);

    const totalPages = Math.ceil(totalRecords / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    const meta: PaginationMeta = {
      page,
      limit,
      totalRecords,
      totalPages,
      hasNextPage,
      hasPrevPage,
    };

    return { properties, meta };
  }

  /**
   * Similar Properties Recommendation Engine.
   * Multi-criteria weighted scoring algorithm.
   */
  static async getSimilarProperties(propertyId: string, limit = 6) {
    const target = await prisma.property.findUnique({
      where: { id: propertyId },
    });

    if (!target) {
      throw new Error("Target property not found");
    }

    // Candidate selection: properties in the same city with active status within ±35% budget
    const minPrice = target.price * 0.65;
    const maxPrice = target.price * 1.35;

    const candidates = await prisma.property.findMany({
      where: {
        id: { not: target.id },
        city: { equals: target.city, mode: "insensitive" },
        listingType: target.listingType,
        status: PropertyStatus.AVAILABLE,
        price: { gte: minPrice, lte: maxPrice },
      },
      take: 30, // Sample top 30 candidates to score in-memory
      select: {
        id: true,
        title: true,
        price: true,
        pricePerSqFt: true,
        bedrooms: true,
        bathrooms: true,
        superAreaSqFt: true,
        locality: true,
        city: true,
        propertyType: true,
        listingType: true,
        furnishing: true,
        images: true,
        status: true,
      },
    });

    // Score candidates based on multi-dimensional similarity
    const scored = candidates.map((item) => {
      let score = 0;

      // 1. Same locality match (+35 pts)
      if (item.locality.toLowerCase() === target.locality.toLowerCase()) {
        score += 35;
      }

      // 2. Same property type match (+25 pts)
      if (item.propertyType === target.propertyType) {
        score += 25;
      }

      // 3. Same bedroom count match (+20 pts)
      if (item.bedrooms === target.bedrooms) {
        score += 20;
      }

      // 4. Price proximity score (max 15 pts)
      const priceDiffRatio = Math.abs(item.price - target.price) / target.price;
      const priceScore = Math.max(0, 15 * (1 - priceDiffRatio));
      score += priceScore;

      // 5. Area proximity score (max 10 pts)
      const areaDiffRatio =
        Math.abs(item.superAreaSqFt - target.superAreaSqFt) / target.superAreaSqFt;
      const areaScore = Math.max(0, 10 * (1 - areaDiffRatio));
      score += areaScore;

      // 6. Furnishing match (+5 pts)
      if (item.furnishing === target.furnishing) {
        score += 5;
      }

      return { ...item, similarityScore: Math.round(score) };
    });

    // Sort by similarity score descending and take top N
    scored.sort((a, b) => b.similarityScore - a.similarityScore);
    return scored.slice(0, limit);
  }

  static async getPropertyById(id: string) {
    // Atomically increment views count and fetch full details
    const property = await prisma.property.update({
      where: { id },
      data: { viewsCount: { increment: 1 } },
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            role: true,
            avatar: true,
          },
        },
      },
    });

    return property;
  }

  static async createProperty(dto: CreatePropertyDto, ownerId: string) {
    const pricePerSqFt =
      dto.pricePerSqFt || Math.round(dto.price / dto.superAreaSqFt);

    const typeFallbacks: Record<string, string> = {
      APARTMENT: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80",
      VILLA: "https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1200&q=80",
      INDEPENDENT_HOUSE: "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=1200&q=80",
      PLOT: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80",
      COMMERCIAL: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80",
    };

    const imagesToSave =
      dto.images && dto.images.length > 0
        ? dto.images
        : [
            {
              url:
                typeFallbacks[dto.propertyType] ||
                "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80",
              isCover: true,
            },
          ];

    return prisma.property.create({
      data: {
        title: dto.title,
        description: dto.description,
        listingType: dto.listingType as ListingType,
        propertyType: dto.propertyType as PropertyType,
        price: dto.price,
        pricePerSqFt,
        bedrooms: dto.bedrooms,
        bathrooms: dto.bathrooms,
        balconies: dto.balconies,
        superAreaSqFt: dto.superAreaSqFt,
        carpetAreaSqFt: dto.carpetAreaSqFt,
        furnishing: dto.furnishing as Furnishing,
        totalFloors: dto.totalFloors,
        floorNumber: dto.floorNumber,
        address: dto.address,
        locality: dto.locality,
        city: dto.city,
        state: dto.state,
        pincode: dto.pincode,
        latitude: dto.latitude,
        longitude: dto.longitude,
        amenities: dto.amenities,
        images: imagesToSave as unknown as Prisma.InputJsonValue,
        ownerId,
      },
    });
  }

  static async updateProperty(id: string, dto: UpdatePropertyDto) {
    const data: Prisma.PropertyUpdateInput = { ...dto } as Prisma.PropertyUpdateInput;
    if (dto.images) {
      data.images = dto.images as unknown as Prisma.InputJsonValue;
    }
    return prisma.property.update({
      where: { id },
      data,
    });
  }

  static async deleteProperty(id: string) {
    return prisma.property.delete({
      where: { id },
    });
  }

  static async getOwnerProperties(ownerId: string) {
    return prisma.property.findMany({
      where: { ownerId },
      orderBy: { createdAt: "desc" },
      include: {
        _count: {
          select: { leads: true },
        },
      },
    });
  }

  static async getCityStats() {
    const stats = await prisma.property.groupBy({
      by: ["city"],
      where: { status: PropertyStatus.AVAILABLE },
      _count: { id: true },
    });
    return stats.map((s) => ({
      city: s.city,
      count: s._count.id,
    }));
  }
}

import { PrismaClient, PropertyType, ListingType, Furnishing, PropertyStatus } from "@prisma/client";

const prisma = new PrismaClient();

const CITIES = [
  { city: "Bangalore", state: "Karnataka", localities: ["Whitefield", "Indiranagar", "Koramangala", "HSR Layout", "Electronic City", "Bellandur", "Marathahalli", "Hebbal", "Sarjapur Road", "JP Nagar"] },
  { city: "Mumbai", state: "Maharashtra", localities: ["Bandra West", "Andheri East", "Powai", "Juhu", "Worli", "Thane West", "Borivali", "Goregaon", "Malad", "Dadar"] },
  { city: "Delhi-NCR", state: "Haryana", localities: ["DLF Phase 5", "Cyber City", "Golf Course Road", "Sector 62 Noida", "Sector 150 Noida", "South Extension", "Dwarka", "Vasant Kunj"] },
  { city: "Hyderabad", state: "Telangana", localities: ["Gachibowli", "Hitec City", "Madhapur", "Banjara Hills", "Jubilee Hills", "Kondapur", "Kukatpally", "Manikonda"] },
  { city: "Pune", state: "Maharashtra", localities: ["Koregaon Park", "Hinjewadi", "Kalyani Nagar", "Baner", "Viman Nagar", "Wakad", "Aundh", "Hadapsar"] },
];

const TYPES: PropertyType[] = [
  PropertyType.APARTMENT,
  PropertyType.VILLA,
  PropertyType.INDEPENDENT_HOUSE,
  PropertyType.PLOT,
  PropertyType.COMMERCIAL,
];

const SAMPLE_IMAGES = [
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80",
];

async function seed50k() {
  console.log("⚡ Starting 50,000+ Scalability Benchmark Data Seeder...");

  // Get or create owner
  let owner = await prisma.user.findFirst({ where: { role: "OWNER" } });
  if (!owner) {
    owner = await prisma.user.create({
      data: {
        name: "Benchmark Property Owner",
        email: "benchmark-owner@realestate.com",
        password: "hashedpassword123",
        role: "OWNER",
      },
    });
  }

  const TARGET_COUNT = 50000;
  const BATCH_SIZE = 5000;
  const totalBatches = TARGET_COUNT / BATCH_SIZE;

  console.log(`Target: ${TARGET_COUNT} records in ${totalBatches} batches of ${BATCH_SIZE}...`);
  const startTime = Date.now();

  for (let batch = 1; batch <= totalBatches; batch++) {
    const properties = [];

    for (let i = 0; i < BATCH_SIZE; i++) {
      const globalIndex = (batch - 1) * BATCH_SIZE + i + 1;
      const cityObj = CITIES[globalIndex % CITIES.length];
      const locality = cityObj.localities[globalIndex % cityObj.localities.length];
      const pType = TYPES[globalIndex % TYPES.length];
      const isRent = globalIndex % 3 === 0;
      const bhk = pType === PropertyType.PLOT || pType === PropertyType.COMMERCIAL ? 0 : (globalIndex % 4) + 1;
      const area = bhk === 0 ? 1200 + (globalIndex % 10) * 200 : bhk * 550 + 200;
      
      const price = isRent
        ? 18000 + (globalIndex % 40) * 1500
        : 4500000 + (globalIndex % 200) * 150000;

      const img = SAMPLE_IMAGES[globalIndex % SAMPLE_IMAGES.length];

      properties.push({
        title: `${bhk > 0 ? `${bhk} BHK ` : ""}${pType} in ${locality}`,
        description: `High-value listing in prime ${locality}, ${cityObj.city}. Excellent connectivity, indexed for high-volume benchmark testing.`,
        listingType: isRent ? ListingType.RENT : ListingType.SALE,
        propertyType: pType,
        price,
        pricePerSqFt: Math.round(price / area),
        bedrooms: bhk,
        bathrooms: bhk > 0 ? bhk : 1,
        balconies: bhk > 1 ? 2 : 1,
        superAreaSqFt: area,
        carpetAreaSqFt: Math.round(area * 0.8),
        furnishing: globalIndex % 2 === 0 ? Furnishing.SEMI_FURNISHED : Furnishing.FULLY_FURNISHED,
        totalFloors: 15,
        floorNumber: (globalIndex % 14) + 1,
        address: `Sector ${globalIndex % 50}, ${locality}`,
        locality,
        city: cityObj.city,
        state: cityObj.state,
        pincode: "5600" + String(10 + (globalIndex % 80)),
        status: PropertyStatus.AVAILABLE,
        amenities: ["Power Backup", "24x7 Security", "Lift", "Car Parking"],
        images: [{ url: img, isCover: true, caption: "Exterior" }],
        viewsCount: globalIndex % 1000,
        ownerId: owner.id,
      });
    }

    await prisma.property.createMany({ data: properties });
    console.log(`✅ Batch ${batch}/${totalBatches} inserted (${batch * BATCH_SIZE} / ${TARGET_COUNT})`);
  }

  const elapsed = ((Date.now() - startTime) / 1000).toFixed(2);
  console.log(`🎉 50,000 properties inserted in ${elapsed}s!`);
}

seed50k()
  .catch((err) => {
    console.error("Error in 50k seeder:", err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

import { PrismaClient, Role, PropertyType, ListingType, Furnishing, PropertyStatus } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const SAMPLE_IMAGES = [
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=1200&q=80",
];

const CITIES = [
  { city: "Bangalore", state: "Karnataka", localities: ["Whitefield", "Indiranagar", "Koramangala", "HSR Layout", "Electronic City", "Bellandur"] },
  { city: "Mumbai", state: "Maharashtra", localities: ["Bandra West", "Andheri East", "Powai", "Juhu", "Worli", "Thane West"] },
  { city: "Delhi-NCR", state: "Haryana", localities: ["DLF Phase 5, Gurgaon", "Cyber City, Gurgaon", "Golf Course Road", "Sector 62, Noida", "South Extension, Delhi"] },
  { city: "Hyderabad", state: "Telangana", localities: ["Gachibowli", "Hitec City", "Madhapur", "Banjara Hills", "Jubilee Hills", "Kondapur"] },
  { city: "Pune", state: "Maharashtra", localities: ["Koregaon Park", "Hinjewadi", "Kalyani Nagar", "Baner", "Viman Nagar", "Wakad"] },
];

const AMENITIES_LIST = [
  "24x7 Security",
  "Power Backup",
  "Covered Car Parking",
  "Clubhouse",
  "Gymnasium",
  "Swimming Pool",
  "High Speed Lift",
  "Children Play Area",
  "Intercom Facility",
  "Gas Pipeline",
  "Rain Water Harvesting",
  "Jogging Track",
];

async function main() {
  console.log("🌱 Starting Real Estate database seeding...");

  // 1. Create Demo Users
  const passwordHash = await bcrypt.hash("Password@123", 10);

  const owner1 = await prisma.user.upsert({
    where: { email: "owner@realestate.com" },
    update: {},
    create: {
      name: "Rajesh Sharma",
      email: "owner@realestate.com",
      password: passwordHash,
      phone: "+91 98765 43210",
      role: Role.OWNER,
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
    },
  });

  const agent1 = await prisma.user.upsert({
    where: { email: "agent@realestate.com" },
    update: {},
    create: {
      name: "Priya Patel",
      email: "agent@realestate.com",
      password: passwordHash,
      phone: "+91 91234 56789",
      role: Role.AGENT,
      avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&q=80",
    },
  });

  const buyer1 = await prisma.user.upsert({
    where: { email: "buyer@realestate.com" },
    update: {},
    create: {
      name: "Vikram Malhotra",
      email: "buyer@realestate.com",
      password: passwordHash,
      phone: "+91 99887 76655",
      role: Role.BUYER,
    },
  });

  console.log(`✅ Demo Users created: ${owner1.email}, ${agent1.email}, ${buyer1.email}`);

  // 2. Clear existing properties to avoid duplication on re-seeding
  await prisma.lead.deleteMany();
  await prisma.property.deleteMany();

  // 3. Generate 35 diverse properties across cities
  const propertiesData = [];
  const propertyTypes: PropertyType[] = [
    PropertyType.APARTMENT,
    PropertyType.VILLA,
    PropertyType.INDEPENDENT_HOUSE,
    PropertyType.APARTMENT,
  ];

  let propIndex = 1;

  for (const c of CITIES) {
    for (const loc of c.localities) {
      const isRent = propIndex % 3 === 0;
      const pType = propertyTypes[propIndex % propertyTypes.length];
      const bhk = pType === PropertyType.VILLA ? 4 : (propIndex % 3) + 2; // 2, 3, or 4 BHK
      const area = bhk === 2 ? 1150 : bhk === 3 ? 1680 : 2800;
      
      let price = 0;
      if (isRent) {
        price = bhk === 2 ? 32000 + (propIndex % 10) * 1500 : 55000 + (propIndex % 8) * 3000;
      } else {
        price = bhk === 2 ? 7500000 + (propIndex % 15) * 200000 : bhk === 3 ? 14500000 + (propIndex % 10) * 400000 : 32000000 + (propIndex % 5) * 1500000;
      }

      const img1 = SAMPLE_IMAGES[propIndex % SAMPLE_IMAGES.length];
      const img2 = SAMPLE_IMAGES[(propIndex + 1) % SAMPLE_IMAGES.length];
      const img3 = SAMPLE_IMAGES[(propIndex + 2) % SAMPLE_IMAGES.length];

      propertiesData.push({
        title: `${bhk} BHK Luxury ${pType === PropertyType.APARTMENT ? "Apartment" : pType === PropertyType.VILLA ? "Villa" : "House"} in ${loc}`,
        description: `Spacious, sun-drenched ${bhk} BHK property located in prime ${loc}, ${c.city}. Features modern modular kitchen, Italian marble flooring, premium bathroom fittings, large private balconies with lush landscape views, and high-end security. Walking distance from premier IT parks, shopping malls, and international schools.`,
        listingType: isRent ? ListingType.RENT : ListingType.SALE,
        propertyType: pType,
        price,
        pricePerSqFt: Math.round(price / area),
        bedrooms: bhk,
        bathrooms: bhk,
        balconies: Math.min(bhk, 3),
        superAreaSqFt: area,
        carpetAreaSqFt: Math.round(area * 0.78),
        furnishing: propIndex % 2 === 0 ? Furnishing.FULLY_FURNISHED : Furnishing.SEMI_FURNISHED,
        totalFloors: pType === PropertyType.VILLA ? 2 : 18,
        floorNumber: pType === PropertyType.VILLA ? 1 : (propIndex % 15) + 2,
        address: `Tower ${String.fromCharCode(65 + (propIndex % 5))}, Prestige & Godrej Enclave, ${loc}`,
        locality: loc,
        city: c.city,
        state: c.state,
        pincode: "560" + String(100 + propIndex).slice(-3),
        latitude: 12.9716 + (Math.random() - 0.5) * 0.1,
        longitude: 77.5946 + (Math.random() - 0.5) * 0.1,
        status: PropertyStatus.AVAILABLE,
        amenities: AMENITIES_LIST.slice(0, 7 + (propIndex % 5)),
        images: [
          { url: img1, isCover: true, caption: "Spacious Living Room" },
          { url: img2, isCover: false, caption: "Modern Modular Kitchen" },
          { url: img3, isCover: false, caption: "Master Bedroom Suite" },
        ],
        viewsCount: Math.floor(Math.random() * 450) + 25,
        ownerId: propIndex % 2 === 0 ? owner1.id : agent1.id,
      });

      propIndex++;
    }
  }

  const createdProperties = [];
  for (const p of propertiesData) {
    const created = await prisma.property.create({ data: p });
    createdProperties.push(created);
  }

  console.log(`✅ Created ${createdProperties.length} realistic properties across 5 major Indian metros.`);

  // 4. Create sample leads for the first 3 properties
  if (createdProperties.length > 0) {
    await prisma.lead.create({
      data: {
        propertyId: createdProperties[0].id,
        buyerId: buyer1.id,
        name: "Arun Verma",
        email: "arun.verma@example.com",
        phone: "+91 98112 23344",
        message: "Hi, I am interested in visiting this property this Saturday. Is the price slightly negotiable?",
      },
    });

    await prisma.lead.create({
      data: {
        propertyId: createdProperties[1].id,
        buyerId: buyer1.id,
        name: "Kavita Reddy",
        email: "kavita.reddy@example.com",
        phone: "+91 97400 11223",
        message: "Hello Rajesh, please share the maintenance fee details and occupancy status.",
      },
    });

    console.log("✅ Created sample inquiries/leads for owner dashboard.");
  }

  console.log("\n✨ Database seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seeding error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

import { Express } from "express";
import swaggerUi from "swagger-ui-express";

export const swaggerSpec = {
  openapi: "3.0.3",
  info: {
    title: "Real Estate Listing Platform API",
    version: "1.0.0",
    description:
      "Production-grade Real Estate Backend API inspired by 99acres and NoBroker. Built with Node.js, Express, TypeScript, and PostgreSQL.",
    contact: {
      name: "Engineering Team",
      email: "engineering@realestate-platform.com",
    },
  },
  servers: [
    {
      url: "http://localhost:5000",
      description: "Local Development Server",
    },
  ],
  components: {
    securitySchemes: {
      BearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
        description: "Provide JWT Access Token generated from /api/auth/login",
      },
    },
    schemas: {
      User: {
        type: "object",
        properties: {
          id: { type: "string", format: "uuid" },
          name: { type: "string" },
          email: { type: "string", format: "email" },
          phone: { type: "string" },
          role: { type: "string", enum: ["BUYER", "AGENT", "OWNER", "ADMIN"] },
        },
      },
      Property: {
        type: "object",
        properties: {
          id: { type: "string", format: "uuid" },
          title: { type: "string" },
          description: { type: "string" },
          listingType: { type: "string", enum: ["SALE", "RENT"] },
          propertyType: {
            type: "string",
            enum: ["APARTMENT", "INDEPENDENT_HOUSE", "VILLA", "PLOT", "COMMERCIAL"],
          },
          price: { type: "number" },
          pricePerSqFt: { type: "number" },
          bedrooms: { type: "integer" },
          bathrooms: { type: "integer" },
          superAreaSqFt: { type: "number" },
          furnishing: { type: "string", enum: ["UNFURNISHED", "SEMI_FURNISHED", "FULLY_FURNISHED"] },
          locality: { type: "string" },
          city: { type: "string" },
          state: { type: "string" },
          pincode: { type: "string" },
          status: { type: "string", enum: ["AVAILABLE", "UNDER_OFFER", "SOLD", "RENTED"] },
          amenities: { type: "array", items: { type: "string" } },
          images: {
            type: "array",
            items: {
              type: "object",
              properties: {
                url: { type: "string" },
                isCover: { type: "boolean" },
                caption: { type: "string" },
              },
            },
          },
          viewsCount: { type: "integer" },
          createdAt: { type: "string", format: "date-time" },
        },
      },
      Lead: {
        type: "object",
        properties: {
          id: { type: "string", format: "uuid" },
          propertyId: { type: "string", format: "uuid" },
          name: { type: "string" },
          email: { type: "string", format: "email" },
          phone: { type: "string" },
          message: { type: "string" },
          status: { type: "string", enum: ["NEW", "CONTACTED", "CLOSED"] },
          createdAt: { type: "string", format: "date-time" },
        },
      },
      ApiResponse: {
        type: "object",
        properties: {
          success: { type: "boolean" },
          message: { type: "string" },
          data: { type: "object" },
          meta: {
            type: "object",
            properties: {
              page: { type: "integer" },
              limit: { type: "integer" },
              totalRecords: { type: "integer" },
              totalPages: { type: "integer" },
              hasNextPage: { type: "boolean" },
            },
          },
        },
      },
    },
  },
  paths: {
    "/api/auth/register": {
      post: {
        tags: ["Authentication"],
        summary: "Register a new user account",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["name", "email", "password"],
                properties: {
                  name: { type: "string" },
                  email: { type: "string" },
                  password: { type: "string" },
                  phone: { type: "string" },
                  role: { type: "string", enum: ["BUYER", "AGENT", "OWNER"] },
                },
              },
            },
          },
        },
        responses: {
          201: { description: "User registered successfully" },
          400: { description: "Email already exists or validation error" },
        },
      },
    },
    "/api/auth/login": {
      post: {
        tags: ["Authentication"],
        summary: "Authenticate user and issue JWT Access and Refresh tokens",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["email", "password"],
                properties: {
                  email: { type: "string" },
                  password: { type: "string" },
                },
              },
            },
          },
        },
        responses: {
          200: { description: "Login successful with token pair" },
          401: { description: "Invalid credentials" },
        },
      },
    },
    "/api/auth/refresh": {
      post: {
        tags: ["Authentication"],
        summary: "Rotate refresh token and issue new access token",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["refreshToken"],
                properties: {
                  refreshToken: { type: "string" },
                },
              },
            },
          },
        },
        responses: {
          200: { description: "Tokens refreshed successfully" },
          401: { description: "Invalid or expired refresh token" },
        },
      },
    },
    "/api/auth/me": {
      get: {
        tags: ["Authentication"],
        summary: "Get current authenticated user profile",
        security: [{ BearerAuth: [] }],
        responses: {
          200: { description: "User profile retrieved" },
          401: { description: "Unauthorized" },
        },
      },
    },
    "/api/properties/meta/city-stats": {
      get: {
        tags: ["Properties"],
        summary: "Get live count of active properties grouped by city",
        responses: {
          200: { description: "City statistics retrieved" },
        },
      },
    },
    "/api/properties": {
      get: {
        tags: ["Properties"],
        summary: "Search, filter, sort and paginate properties (supports 50,000+ records)",
        parameters: [
          { name: "city", in: "query", schema: { type: "string" } },
          { name: "locality", in: "query", schema: { type: "string" } },
          { name: "search", in: "query", schema: { type: "string" } },
          { name: "listingType", in: "query", schema: { type: "string", enum: ["SALE", "RENT"] } },
          { name: "propertyType", in: "query", schema: { type: "string" } },
          { name: "bedrooms", in: "query", schema: { type: "integer" } },
          { name: "minPrice", in: "query", schema: { type: "number" } },
          { name: "maxPrice", in: "query", schema: { type: "number" } },
          { name: "furnishing", in: "query", schema: { type: "string" } },
          { name: "sortBy", in: "query", schema: { type: "string", enum: ["price_asc", "price_desc", "newest", "popularity"] } },
          { name: "page", in: "query", schema: { type: "integer", default: 1 } },
          { name: "limit", in: "query", schema: { type: "integer", default: 12 } },
          { name: "cursor", in: "query", schema: { type: "string" } },
        ],
        responses: {
          200: { description: "List of matched properties with pagination metadata" },
        },
      },
      post: {
        tags: ["Properties"],
        summary: "Create a new property listing",
        security: [{ BearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/Property" },
            },
          },
        },
        responses: {
          201: { description: "Property created successfully" },
          401: { description: "Unauthorized" },
        },
      },
    },
    "/api/properties/{id}": {
      get: {
        tags: ["Properties"],
        summary: "Get full property details by ID (increments view count)",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: {
          200: { description: "Property details retrieved" },
          404: { description: "Property not found" },
        },
      },
      put: {
        tags: ["Properties"],
        summary: "Update an existing property listing (Owner only)",
        security: [{ BearerAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        requestBody: {
          required: true,
          content: {
            "application/json": { schema: { $ref: "#/components/schemas/Property" } },
          },
        },
        responses: {
          200: { description: "Property updated successfully" },
          403: { description: "Forbidden - not property owner" },
        },
      },
      delete: {
        tags: ["Properties"],
        summary: "Delete a property listing (Owner only)",
        security: [{ BearerAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: {
          200: { description: "Property deleted successfully" },
          403: { description: "Forbidden - not property owner" },
        },
      },
    },
    "/api/properties/{id}/similar": {
      get: {
        tags: ["Properties"],
        summary: "Get AI/Algorithmic similar recommended properties",
        parameters: [
          { name: "id", in: "path", required: true, schema: { type: "string" } },
          { name: "limit", in: "query", schema: { type: "integer", default: 6 } },
        ],
        responses: {
          200: { description: "Ranked list of similar properties" },
        },
      },
    },
    "/api/properties/user/my-listings": {
      get: {
        tags: ["Properties"],
        summary: "Get all properties listed by current authenticated user",
        security: [{ BearerAuth: [] }],
        responses: {
          200: { description: "User's property listings" },
          401: { description: "Unauthorized" },
        },
      },
    },
    "/api/leads": {
      post: {
        tags: ["Leads & Inquiries"],
        summary: "Submit lead inquiry to property owner (Anti-spam protected)",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["propertyId", "name", "email", "phone", "message"],
                properties: {
                  propertyId: { type: "string", format: "uuid" },
                  name: { type: "string" },
                  email: { type: "string", format: "email" },
                  phone: { type: "string" },
                  message: { type: "string" },
                  website: { type: "string", description: "Honeypot field: must be empty" },
                },
              },
            },
          },
        },
        responses: {
          201: { description: "Inquiry submitted successfully" },
          400: { description: "Duplicate inquiry within 24h or spam detected" },
          429: { description: "Too many inquiries from this IP" },
        },
      },
    },
    "/api/leads/received": {
      get: {
        tags: ["Leads & Inquiries"],
        summary: "Get inquiries received for properties owned by authenticated user",
        security: [{ BearerAuth: [] }],
        responses: {
          200: { description: "List of received leads" },
        },
      },
    },
    "/api/leads/sent": {
      get: {
        tags: ["Leads & Inquiries"],
        summary: "Get inquiries sent by authenticated buyer",
        security: [{ BearerAuth: [] }],
        responses: {
          200: { description: "List of sent inquiries" },
        },
      },
    },
    "/api/leads/{id}/status": {
      patch: {
        tags: ["Leads & Inquiries"],
        summary: "Update inquiry status (NEW / CONTACTED / CLOSED)",
        security: [{ BearerAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["status"],
                properties: {
                  status: { type: "string", enum: ["NEW", "CONTACTED", "CLOSED"] },
                },
              },
            },
          },
        },
        responses: {
          200: { description: "Inquiry status updated" },
        },
      },
    },
    "/api/upload/images": {
      post: {
        tags: ["Cloud Storage (ImageKit)"],
        summary: "Upload property images to ImageKit cloud",
        security: [{ BearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "multipart/form-data": {
              schema: {
                type: "object",
                properties: {
                  images: {
                    type: "array",
                    items: { type: "string", format: "binary" },
                    description: "Up to 10 images (JPEG, PNG, WEBP, max 10MB each)",
                  },
                },
              },
            },
          },
        },
        responses: {
          201: { description: "Images uploaded successfully with ImageKit URLs" },
          400: { description: "No files or invalid file format" },
          401: { description: "Unauthorized" },
        },
      },
    },
    "/api/upload/document": {
      post: {
        tags: ["Cloud Storage (ImageKit)"],
        summary: "Upload property document (PDF / Brochure) to ImageKit cloud",
        security: [{ BearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "multipart/form-data": {
              schema: {
                type: "object",
                properties: {
                  document: {
                    type: "string",
                    format: "binary",
                    description: "PDF or Word document (max 20MB)",
                  },
                },
              },
            },
          },
        },
        responses: {
          201: { description: "Document uploaded successfully with ImageKit URL" },
          400: { description: "Invalid file" },
          401: { description: "Unauthorized" },
        },
      },
    },
  },
};

export const setupSwagger = (app: Express): void => {
  app.use(
    "/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec, {
      customCss: ".swagger-ui .topbar { display: none }",
      customSiteTitle: "RealEstate API Docs (OpenAPI 3.0)",
    })
  );

  // Also expose raw openapi.json for tooling / postman import
  app.get("/api-docs.json", (_req, res) => {
    res.setHeader("Content-Type", "application/json");
    res.send(swaggerSpec);
  });
};

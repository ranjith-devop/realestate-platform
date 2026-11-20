import {
  ApiResponse,
  Property,
  User,
  Lead,
  FilterState,
} from "../types";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

class ApiClient {
  private getAccessToken(): string | null {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("accessToken");
  }

  private setTokens(accessToken: string, refreshToken?: string): void {
    if (typeof window === "undefined") return;
    localStorage.setItem("accessToken", accessToken);
    if (refreshToken) {
      localStorage.setItem("refreshToken", refreshToken);
    }
  }

  private clearTokens(): void {
    if (typeof window === "undefined") return;
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
  }

  /** Safe JSON parse — won't throw on HTML error pages from downed backend */
  private async safeJson<T>(response: Response): Promise<ApiResponse<T> | null> {
    const contentType = response.headers.get("content-type") || "";
    if (!contentType.includes("application/json")) return null;
    try {
      return await response.json();
    } catch {
      return null;
    }
  }

  async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${API_BASE_URL}${endpoint}`;
    const token = this.getAccessToken();

    const headers: Record<string, string> = {
      ...(options.body instanceof FormData
        ? {}
        : { "Content-Type": "application/json" }),
      ...(options.headers as Record<string, string>),
    };

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    let response: Response;

    try {
      response = await fetch(url, { ...options, headers });
    } catch (networkErr) {
      throw new Error(
        "Cannot connect to server. Please ensure the backend is running."
      );
    }

    // Handle token expiration & automatic refresh
    if (response.status === 401 && typeof window !== "undefined") {
      const refreshToken = localStorage.getItem("refreshToken");
      if (refreshToken) {
        try {
          const refreshRes = await fetch(`${API_BASE_URL}/auth/refresh`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ refreshToken }),
          });

          if (refreshRes.ok) {
            const refreshData = await refreshRes.json();
            this.setTokens(
              refreshData.data.accessToken,
              refreshData.data.refreshToken
            );
            headers["Authorization"] = `Bearer ${refreshData.data.accessToken}`;
            response = await fetch(url, { ...options, headers });
          } else {
            this.clearTokens();
          }
        } catch {
          this.clearTokens();
        }
      }
    }

    const data = await this.safeJson<T>(response);

    if (!response.ok) {
      const message =
        data?.message ||
        (response.status === 401
          ? "Authentication required. Please sign in."
          : response.status === 403
          ? "You do not have permission to perform this action."
          : response.status === 404
          ? "The requested resource was not found."
          : response.status === 429
          ? "Too many requests. Please wait a moment and try again."
          : `Request failed (${response.status})`);
      throw new Error(message);
    }

    if (!data) {
      throw new Error("Invalid response from server.");
    }

    return data;
  }

  // --- Auth APIs ---
  async login(credentials: { email: string; password: string }) {
    const res = await this.request<{
      user: User;
      accessToken: string;
      refreshToken: string;
    }>("/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    });
    this.setTokens(res.data.accessToken, res.data.refreshToken);
    if (typeof window !== "undefined") {
      localStorage.setItem("user", JSON.stringify(res.data.user));
    }
    return res.data;
  }

  async register(payload: {
    name: string;
    email: string;
    password: string;
    phone?: string;
    role: string;
  }) {
    const res = await this.request<{
      user: User;
      accessToken: string;
      refreshToken: string;
    }>("/auth/register", {
      method: "POST",
      body: JSON.stringify(payload),
    });
    this.setTokens(res.data.accessToken, res.data.refreshToken);
    if (typeof window !== "undefined") {
      localStorage.setItem("user", JSON.stringify(res.data.user));
    }
    return res.data;
  }

  async logout() {
    const refreshToken =
      typeof window !== "undefined" ? localStorage.getItem("refreshToken") : null;
    try {
      if (refreshToken) {
        await this.request("/auth/logout", {
          method: "POST",
          body: JSON.stringify({ refreshToken }),
        });
      }
    } finally {
      this.clearTokens();
    }
  }

  async getMe() {
    return this.request<User>("/auth/me");
  }

  // --- Property APIs ---
  async searchProperties(
    filters: Partial<FilterState>,
    options: RequestInit = {}
  ) {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        params.append(key, String(value));
      }
    });
    return this.request<Property[]>(`/properties?${params.toString()}`, options);
  }

  async getPropertyById(id: string) {
    return this.request<Property>(`/properties/${id}`);
  }

  async getSimilarProperties(id: string, limit = 6) {
    return this.request<Property[]>(`/properties/${id}/similar?limit=${limit}`);
  }

  async createProperty(propertyData: Partial<Property>) {
    return this.request<Property>("/properties", {
      method: "POST",
      body: JSON.stringify(propertyData),
    });
  }

  async updateProperty(id: string, propertyData: Partial<Property>) {
    return this.request<Property>(`/properties/${id}`, {
      method: "PUT",
      body: JSON.stringify(propertyData),
    });
  }

  async deleteProperty(id: string) {
    return this.request<null>(`/properties/${id}`, {
      method: "DELETE",
    });
  }

  async getMyListings() {
    return this.request<Property[]>("/properties/user/my-listings");
  }

  async getCityStats() {
    return this.request<{ city: string; count: number }[]>(
      "/properties/meta/city-stats"
    );
  }

  // --- Upload APIs (ImageKit Cloud) ---
  async uploadImages(files: File[]) {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append("images", file);
    });

    return this.request<
      { url: string; fileId: string; name: string; thumbnailUrl?: string }[]
    >("/upload/images", {
      method: "POST",
      body: formData,
    });
  }

  async deleteUploadedFile(fileId: string) {
    return this.request<null>(`/upload/${fileId}`, {
      method: "DELETE",
    });
  }

  // --- Lead & Inquiry APIs ---
  async submitLead(payload: {
    propertyId: string;
    name: string;
    email: string;
    phone: string;
    message: string;
    website?: string;
  }) {
    return this.request<Lead>("/leads", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  }

  async getReceivedLeads() {
    return this.request<Lead[]>("/leads/received");
  }

  async getSentLeads() {
    return this.request<Lead[]>("/leads/sent");
  }

  async updateLeadStatus(id: string, status: "NEW" | "CONTACTED" | "CLOSED") {
    return this.request<Lead>(`/leads/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    });
  }
}

export const api = new ApiClient();

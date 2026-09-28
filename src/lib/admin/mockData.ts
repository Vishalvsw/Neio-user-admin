import type {
  AdminBooking,
  DashboardStats,
} from "./types";

export const ADMIN_CREDENTIALS = {
  email: "admin@neoi.in",
  phone: "9999999999",
  password: "admin123",
};

export const dashboardStats: DashboardStats = {
  totalBookings: 128,
  pendingBookings: 24,
  todayBookings: 18,
  completedBookings: 86,
  totalRevenue: 42500,
};

export const recentBookings: AdminBooking[] = [
  {
    id: "NEOI-1024",
    customerName: "Rahul Kumar",
    customerPhone: "9876543210",
    service: "Full Home Cleaning",
    variant: "2 BHK",
    area: "Whitefield",
    city: "Bengaluru",
    address: "ITPL Main Road, Whitefield",
    bookingDate: "25 Sep 2026",
    bookingTime: "10:00 AM - 12:00 PM",
    technician: "Arun Kumar",
    amount: 2499,
    paymentStatus: "paid",
    status: "technician_assigned",
  },

  {
    id: "NEOI-1023",
    customerName: "Priya Sharma",
    customerPhone: "9876543211",
    service: "Bathroom Cleaning",
    variant: "2 Bathrooms",
    area: "Indiranagar",
    city: "Bengaluru",
    address: "100 Feet Road, Indiranagar",
    bookingDate: "25 Sep 2026",
    bookingTime: "12:00 PM - 1:30 PM",
    technician: null,
    amount: 799,
    paymentStatus: "pending",
    status: "pending",
  },

  {
    id: "NEOI-1022",
    customerName: "Vikram Rao",
    customerPhone: "9876543212",
    service: "Sofa Cleaning",
    variant: "Standard",
    area: "HSR Layout",
    city: "Bengaluru",
    address: "Sector 2, HSR Layout",
    bookingDate: "25 Sep 2026",
    bookingTime: "2:00 PM - 3:30 PM",
    technician: "Suresh Kumar",
    amount: 999,
    paymentStatus: "paid",
    status: "service_started",
  },

  {
    id: "NEOI-1021",
    customerName: "Ananya Reddy",
    customerPhone: "9876543213",
    service: "Kitchen Cleaning",
    variant: "Standard Kitchen",
    area: "Koramangala",
    city: "Bengaluru",
    address: "5th Block, Koramangala",
    bookingDate: "24 Sep 2026",
    bookingTime: "11:00 AM - 12:30 PM",
    technician: "Manoj Kumar",
    amount: 799,
    paymentStatus: "paid",
    status: "service_completed",
  },

  {
    id: "NEOI-1020",
    customerName: "Karthik Rao",
    customerPhone: "9876543214",
    service: "Cockroach Control",
    variant: "Standard Treatment",
    area: "Marathahalli",
    city: "Bengaluru",
    address: "Outer Ring Road, Marathahalli",
    bookingDate: "24 Sep 2026",
    bookingTime: "4:00 PM - 5:00 PM",
    technician: "Ravi Kumar",
    amount: 699,
    paymentStatus: "paid",
    status: "confirmed",
  },

  {
    id: "NEOI-1019",
    customerName: "Sneha Nair",
    customerPhone: "9876543215",
    service: "Full Home Cleaning",
    variant: "3 BHK",
    area: "Jayanagar",
    city: "Bengaluru",
    address: "4th Block, Jayanagar",
    bookingDate: "24 Sep 2026",
    bookingTime: "9:00 AM - 12:00 PM",
    technician: null,
    amount: 3199,
    paymentStatus: "paid",
    status: "confirmed",
  },

  {
    id: "NEOI-1018",
    customerName: "Arjun Mehta",
    customerPhone: "9876543216",
    service: "Termite Control",
    variant: "Standard Treatment",
    area: "Electronic City",
    city: "Bengaluru",
    address: "Phase 1, Electronic City",
    bookingDate: "23 Sep 2026",
    bookingTime: "3:00 PM - 4:30 PM",
    technician: "Vijay Kumar",
    amount: 1499,
    paymentStatus: "paid",
    status: "service_completed",
  },
];

export interface AdminTeamMember {
  id: string;
  name: string;
  phone: string;
  role:
    | "technician"
    | "team_lead"
    | "supervisor";
  areas: string[];
  status:
    | "available"
    | "busy"
    | "offline";
}

export const adminTeamMembers: AdminTeamMember[] = [
  {
    id: "TEAM-001",
    name: "Arun Kumar",
    phone: "9876500001",
    role: "technician",
    areas: ["Whitefield", "Marathahalli"],
    status: "busy",
  },
  {
    id: "TEAM-002",
    name: "Suresh Kumar",
    phone: "9876500002",
    role: "technician",
    areas: ["HSR Layout", "Koramangala"],
    status: "available",
  },
  {
    id: "TEAM-003",
    name: "Manoj Kumar",
    phone: "9876500003",
    role: "team_lead",
    areas: ["Jayanagar", "Banashankari"],
    status: "available",
  },
  {
    id: "TEAM-004",
    name: "Ravi Kumar",
    phone: "9876500004",
    role: "technician",
    areas: ["Indiranagar", "Domlur"],
    status: "available",
  },
  {
    id: "TEAM-005",
    name: "Vijay Kumar",
    phone: "9876500005",
    role: "technician",
    areas: ["Electronic City"],
    status: "offline",
  },
];




import type {
  AdminArea,
  AdminCity,
  AdminServiceOption,
} from "./types";

export const adminCities: AdminCity[] = [
  {
    id: "city-blr",
    name: "Bengaluru",
    slug: "bengaluru",
    state: "Karnataka",
    active: true,
    areaCount: 412,
  },
];

export const adminServiceOptions: AdminServiceOption[] = [
  {
    id: "full-home-cleaning",
    name: "Full Home Cleaning",
    category: "Home Cleaning",
  },
  {
    id: "bathroom-cleaning",
    name: "Bathroom Cleaning",
    category: "Home Cleaning",
  },
  {
    id: "kitchen-cleaning",
    name: "Kitchen Cleaning",
    category: "Home Cleaning",
  },
  {
    id: "sofa-cleaning",
    name: "Sofa Cleaning",
    category: "Cleaning",
  },
  {
    id: "cockroach-control",
    name: "Cockroach Control",
    category: "Pest Control",
  },
  {
    id: "termite-control",
    name: "Termite Control",
    category: "Pest Control",
  },
];

const bengaluruAreaSeed = [
  "Whitefield",
  "Indiranagar",
  "Koramangala",
  "HSR Layout",
  "Electronic City",
  "Jayanagar",
  "Banashankari",
  "Marathahalli",
  "Bellandur",
  "Sarjapur Road",
  "BTM Layout",
  "JP Nagar",
  "HSR Sector 1",
  "HSR Sector 2",
  "HSR Sector 3",
  "HSR Sector 4",
  "HSR Sector 5",
  "HSR Sector 6",
  "HSR Sector 7",
  "HSR Sector 8",
  "HSR Sector 9",
  "Hebbal",
  "Yelahanka",
  "Rajajinagar",
  "Malleshwaram",
  "Sadashivanagar",
  "Vijayanagar",
  "Kengeri",
  "Nagarbhavi",
  "Basaveshwaranagar",
  "Kammanahalli",
  "HRBR Layout",
  "Hennur",
  "Kalyan Nagar",
  "Banaswadi",
  "Domlur",
  "Ulsoor",
  "CV Raman Nagar",
  "Kaggadasapura",
  "Brookefield",
  "AECS Layout",
  "Kadugodi",
  "Hoodi",
  "Mahadevapura",
  "Kundalahalli",
  "Varthur",
  "Panathur",
  "Devarabeesanahalli",
  "Ejipura",
  "Adugodi",
  "Wilson Garden",
  "Shantinagar",
  "Richmond Town",
  "Frazer Town",
  "Cooke Town",
  "Cox Town",
  "RT Nagar",
  "Sanjay Nagar",
  "Dollars Colony",
  "Nagawara",
  "Thanisandra",
  "Jakkur",
  "Vidyaranyapura",
  "Peenya",
  "Nandini Layout",
  "Mathikere",
  "Vijayanagar",
  "Mahalakshmi Layout",
  "Chandra Layout",
  "Attiguppe",
  "RPC Layout",
  "Girinagar",
  "Padmanabhanagar",
  "Kumaraswamy Layout",
  "Konanakunte",
  "Arekere",
  "Begur",
  "Bommanahalli",
  "Hongasandra",
  "Singasandra",
  "Hulimavu",
  "Akshayanagar",
  "Doddakamanahalli",
  "Bannerghatta Road",
  "Arakere",
  "Gottigere",
  "Anekal",
  "Bommasandra",
  "Hosur Road",
  "Singena Agrahara",
  "Attibele",
];

export const adminAreas: AdminArea[] =
  bengaluruAreaSeed.map((name, index) => ({
    id: `blr-area-${String(index + 1).padStart(
      4,
      "0",
    )}`,

    cityId: "city-blr",

    name,

    slug: name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, ""),

    active: index !== 94,

    serviceIds:
      index % 7 === 0
        ? [
            "full-home-cleaning",
            "bathroom-cleaning",
            "kitchen-cleaning",
          ]
        : adminServiceOptions.map(
            (service) => service.id,
          ),

    createdAt: "2026-09-01",
    updatedAt: "2026-09-15",
  }));

/*
 * In production this array will be returned by the API.
 *
 * The admin UI should never assume that Bengaluru
 * has a fixed number of areas.
 */
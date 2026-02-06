"use client";

export type Gender = "MALE" | "FEMALE" | "OTHER";
export type CivilStatus =
  | "SINGLE"
  | "MARRIED"
  | "DIVORCED"
  | "WIDOWED"
  | "OTHER";
export type Status = "ACTIVE" | "INACTIVE";

export type User = {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  gender: Gender;
  country: string;
  passport_number: string | null;
  national_id: string | null;
  father_names: string | null;
  mother_names: string | null;
  date_of_birth: string | null;
  driver_names: string | null;
  plate_number: string | null;
  expiry_date: string | null;
  issuance_date: string | null;
  birth_place: string | null;
  issuing_country: string | null;
  civil_status: CivilStatus;
  place_of_birth: string | null;
  place_of_issue: string | null;
  province: string | null;
  district: string | null;
  sector: string | null;
  cell: string | null;
  village: string | null;
  created_at: string;
  status: Status;
};

export const ALL_USER_FIELDS: Array<{ id: keyof User; label: string }> = [
  // id is kept in the type but not displayed as a column
  { id: "first_name", label: "First name" },
  { id: "last_name", label: "Last name" },
  { id: "email", label: "Email" },
  { id: "phone", label: "Phone" },
  { id: "gender", label: "Gender" },
  { id: "country", label: "Country" },
  { id: "passport_number", label: "Passport number" },
  { id: "national_id", label: "National ID" },
  { id: "father_names", label: "Father names" },
  { id: "mother_names", label: "Mother names" },
  { id: "date_of_birth", label: "Date of birth" },
  { id: "driver_names", label: "Driver names" },
  { id: "plate_number", label: "Plate number" },
  { id: "expiry_date", label: "Expiry date" },
  { id: "issuance_date", label: "Issuance date" },
  { id: "birth_place", label: "Birth place" },
  { id: "issuing_country", label: "Issuing country" },
  { id: "civil_status", label: "Civil status" },
  { id: "place_of_birth", label: "Place of birth" },
  { id: "place_of_issue", label: "Place of issue" },
  { id: "province", label: "Province" },
  { id: "district", label: "District" },
  { id: "sector", label: "Sector" },
  { id: "cell", label: "Cell" },
  { id: "village", label: "Village" },
  { id: "created_at", label: "Created at" },
  { id: "status", label: "Status" },
];

export const mockUsers: User[] = [
  {
    id: "1",
    first_name: "David",
    last_name: "B",
    email: "davidb@example.com",
    phone: "0789878947",
    gender: "MALE",
    country: "Rwanda",
    passport_number: null,
    national_id: "1199990001112223",
    father_names: "John B Senior",
    mother_names: "Jane B",
    date_of_birth: "1990-05-12",
    driver_names: null,
    plate_number: null,
    expiry_date: null,
    issuance_date: null,
    birth_place: "Kigali",
    issuing_country: "Rwanda",
    civil_status: "SINGLE",
    place_of_birth: "Kigali",
    place_of_issue: "Kigali",
    province: "Kigali City",
    district: "Gasabo",
    sector: "Kimironko",
    cell: "Bibare",
    village: "Urugano",
    created_at: "2025-12-01T10:00:00Z",
    status: "ACTIVE",
  },
  {
    id: "2",
    first_name: "Chris",
    last_name: "M",
    email: "chris.m@example.com",
    phone: "0787485789",
    gender: "MALE",
    country: "Rwanda",
    passport_number: null,
    national_id: "1199990001112224",
    father_names: "Michael M",
    mother_names: "Claudine M",
    date_of_birth: "1992-03-01",
    driver_names: null,
    plate_number: null,
    expiry_date: null,
    issuance_date: null,
    birth_place: "Huye",
    issuing_country: "Rwanda",
    civil_status: "MARRIED",
    place_of_birth: "Huye",
    place_of_issue: "Huye",
    province: "Southern",
    district: "Huye",
    sector: "Ngoma",
    cell: "Kibingo",
    village: "Intwari",
    created_at: "2025-11-15T08:30:00Z",
    status: "ACTIVE",
  },
  {
    id: "3",
    first_name: "Ben",
    last_name: "K",
    email: "ben.k@example.com",
    phone: "078789878987",
    gender: "MALE",
    country: "Rwanda",
    passport_number: null,
    national_id: "1199990001112225",
    father_names: null,
    mother_names: null,
    date_of_birth: null,
    driver_names: null,
    plate_number: null,
    expiry_date: null,
    issuance_date: null,
    birth_place: null,
    issuing_country: null,
    civil_status: "SINGLE",
    place_of_birth: null,
    place_of_issue: null,
    province: "Kigali City",
    district: "Nyarugenge",
    sector: "Nyamirambo",
    cell: "Nyarugenge",
    village: "Icyerekezo",
    created_at: "2025-10-02T12:00:00Z",
    status: "INACTIVE",
  },
  {
    id: "4",
    first_name: "Byu",
    last_name: "D",
    email: "byu.d@example.com",
    phone: "0789878987",
    gender: "FEMALE",
    country: "Rwanda",
    passport_number: null,
    national_id: "1199990001112226",
    father_names: "Daniel D",
    mother_names: "Beatrice D",
    date_of_birth: "1988-09-20",
    driver_names: null,
    plate_number: null,
    expiry_date: null,
    issuance_date: null,
    birth_place: "Musanze",
    issuing_country: "Rwanda",
    civil_status: "MARRIED",
    place_of_birth: "Musanze",
    place_of_issue: "Musanze",
    province: "Northern",
    district: "Musanze",
    sector: "Muhoza",
    cell: "Cyana",
    village: "Amahoro",
    created_at: "2025-09-10T09:45:00Z",
    status: "ACTIVE",
  },
];


export type PostType = "LOST" | "FOUND";
export type PostStatus = "ACTIVE" | "RESOLVED" | "ARCHIVED" | "HIDDEN_BY_MODERATION";
export type EventDatetimePrecision = "EXACT" | "APPROXIMATE";
export type CatSex = "MALE" | "FEMALE" | "UNKNOWN";
export type CatAgeGroup = "KITTEN" | "ADULT" | "SENIOR" | "UNKNOWN";
export type CatSize = "SMALL" | "MEDIUM" | "LARGE" | "UNKNOWN";
export type CatFurLength = "SHORT" | "MEDIUM" | "LONG" | "UNKNOWN";
export type CatPattern = "SOLID" | "TABBY" | "TUXEDO" | "CALICO" | "OTHER" | "UNKNOWN";

export type Location = {
  latitude: number;
  longitude: number;
  location_label: string;
  accuracy_radius_m: number;
};

export type CatProfile = {
  name?: string | null;
  sex: CatSex;
  age_group: CatAgeGroup;
  size: CatSize;
  fur_length: CatFurLength;
  primary_color: string;
  secondary_color?: string | null;
  pattern: CatPattern;
  distinctive_marks?: string | null;
  is_neutered?: boolean | null;
  health_notes?: string | null;
};

export type FoundCareInfo = {
  is_sheltered?: boolean | null;
  needs_vet?: boolean | null;
};

export type CatPost = {
  id: string;
  type: PostType;
  status: PostStatus;
  author_user_id: string;
  title: string;
  description: string;
  event_datetime: string;
  event_datetime_precision: EventDatetimePrecision;
  location: Location;
  cat_profile: CatProfile;
  chip_number?: string | null;
  passport_number?: string | null;
  found_care_info?: FoundCareInfo | null;
  views_count: number;
  created_at: string;
  updated_at: string;
  resolved_at?: string | null;
};

export type CatPostCreate = Omit<CatPost, "id" | "views_count" | "created_at" | "updated_at" | "resolved_at">;

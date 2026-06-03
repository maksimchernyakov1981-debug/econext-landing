import type {
  ButtonSettings,
  CatalogSettings,
  ContactSettings,
  LandingSettings,
  MapSettings,
  Partner,
  SpecialDay,
} from "@prisma/client";
import type { WorkStatusResult } from "@/lib/schedule/types";

export type LandingViewProps = {
  partner: Partner | null;
  landing: LandingSettings;
  buttons: ButtonSettings;
  map: MapSettings;
  catalog: CatalogSettings;
  contacts: ContactSettings;
  workStatus: WorkStatusResult;
  fullScheduleText: string;
  specialDay: SpecialDay | null;
};

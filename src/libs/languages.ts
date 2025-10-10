import { Language } from "@/types";
import {
  Us,
  Vn,
  Es,
  Fr,
  De,
  Jp,
  Kr,
  Cn,
} from "react-flags-select";
import {} from "country-list";

export const SUPPORTED_LANGUAGES: Language[] = [
  { code: "en", name: "English", FlagComponent: Us },
  { code: "vi", name: "Vietnamese", FlagComponent: Vn },
  { code: "es", name: "Spanish", FlagComponent: Es },
  { code: "fr", name: "French", FlagComponent: Fr },
  { code: "de", name: "German", FlagComponent: De },
  { code: "jp", name: "Japanese", FlagComponent: Jp },
  { code: "kr", name: "Korean", FlagComponent: Kr },
  { code: "cn", name: "Chinese", FlagComponent: Cn },
];

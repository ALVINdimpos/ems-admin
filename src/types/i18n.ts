import type en from "../../lang/en.json";
import type fr from "../../lang/fr.json";

export type enMessages = typeof en;
export type frMessages = typeof fr;

declare global {
  // interface INextIntlMessages extends enMessages, frMessages {}
}

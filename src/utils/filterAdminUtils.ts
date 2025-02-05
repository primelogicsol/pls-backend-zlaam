import { WHITELISTMAILS } from "../constants";

export const filterAdmin = (email: string): boolean => {
  return WHITELISTMAILS.includes(email);
};

import { WHITE_LIST_MAILS } from "../config/config";

const WHITELISTMAILS = JSON.parse(WHITE_LIST_MAILS) as string[];
export const filterAdmin = (email: string): boolean => {
  return WHITELISTMAILS.includes(email);
};

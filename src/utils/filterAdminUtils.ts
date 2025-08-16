import { WHITE_LIST_MAILS } from "../config/config";

const WHITELISTMAILS = JSON.parse(WHITE_LIST_MAILS) as string[];
export const filterAdmin = (email: string): boolean => {
  return WHITELISTMAILS.includes(email);
};
export const filterAdminTest = (email: string): boolean => {
  return email.endsWith("@admin.com");
};
export const filterFreelanserEmail = (email: string): boolean => {
  return email.endsWith("@freelancer.com");
};
export const filterClientEmail = (email: string): boolean => {
  return email.endsWith("@client.com");
};

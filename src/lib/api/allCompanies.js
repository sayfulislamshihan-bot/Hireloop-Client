import { serverFetch } from "@/lib/core/server";

export const getAllCompanies = async () => {
  return serverFetch("/api/allCompanies");
};

import { serverFetch } from "@/lib/core/server";

export const getAllUsers = async () => {
  return serverFetch("/api/users");
};

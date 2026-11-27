import { serverFetch } from "@/lib/core/server";

export const getAllSubscriptions = async () => {
  return serverFetch("/api/subscriptions");
};

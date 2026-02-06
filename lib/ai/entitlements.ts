import type { UserType } from "@/app/(auth)/auth";

type Entitlements = {
  maxMessagesPerDay: number;
};

export const entitlementsByUserType: Record<UserType, Entitlements> = {
  /*
   * For users with an @xyz.vc Google account
   */
  regular: {
    maxMessagesPerDay: 250,
  },
};

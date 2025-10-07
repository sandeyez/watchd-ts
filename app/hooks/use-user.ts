import { authClient } from "@/lib/auth-client";

export function useUser() {
  const { data } = authClient.useSession();
  return data?.user;
}

import { useUser } from "@clerk/tanstack-react-start";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import type { ComponentProps } from "react";

type UserAvatarProps = ComponentProps<typeof Avatar>;

export function UserAvatar({ ...props }: UserAvatarProps) {
  const user = useUser();

  if (!user.user) return null;

  return (
    <Avatar {...props}>
      <AvatarImage src={user.user.imageUrl} />
      <AvatarFallback>{user.user.firstName?.charAt(0)}</AvatarFallback>
    </Avatar>
  );
}

import { Link, useRouter } from "@tanstack/react-router";
import {
  ClapperboardIcon,
  ClockIcon,
  HomeIcon,
  ListIcon,
  LogInIcon,
  LogOutIcon,
  MoreHorizontal,
  SearchIcon,
  SparklesIcon,
  TrophyIcon,
  TvIcon,
} from "lucide-react";

import { GradientText } from "./gradient-text";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "./ui/sidebar/sidebar";

import { useUser } from "@/hooks/use-user";
import { cn } from "@/lib/tailwind";
import type { ReactNode } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { useSidebar } from "./ui/sidebar/sidebar-context";
import { UserAvatar } from "./user-avatar";
import { authClient } from "@/lib/auth-client";

type SidebarItem = {
  title: string;
  href: string;
  icon: ReactNode;
  dataAttribute?: string;
};

type SidebarItemGroup = {
  title: string;
  items: Array<SidebarItem>;
};

const mainItems: Array<SidebarItem> = [
  {
    title: "Home",
    href: "/home",
    icon: <HomeIcon />,
  },
  {
    title: "Discover",
    href: "/discover",
    icon: <SparklesIcon />,
  },
  {
    title: "Movies",
    href: "/movies",
    icon: <ClapperboardIcon />,
  },
  {
    title: "TV Shows",
    href: "/tv-shows",
    icon: <TvIcon />,
  },
  {
    title: "Search",
    href: "/search",
    icon: <SearchIcon />,
  },
];

const sidebarGroups: Array<SidebarItemGroup> = [
  {
    title: "Your library",
    items: [
      {
        title: "Recently watched",
        href: "/recents",
        icon: <ClockIcon />,
      },
      {
        title: "Favorites",
        href: "/favorites",
        icon: <TrophyIcon />,
      },
      {
        title: "Watchlist",
        href: "/watchlist",
        icon: <ListIcon />,
        dataAttribute: "watchlist",
      },
    ],
  },
];

export function AppSidebar() {
  const { open } = useSidebar();

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <div
          className={cn(
            "w-fit p-2 transition-[padding] duration-200 ease-in-out",
            {
              "px-0": !open,
            }
          )}
        >
          <Link to="/home" className="select-none relative h-fit w-fit">
            <GradientText>
              <span
                className={cn(
                  "text-2xl font-black transition-[font-size] duration-200 ease-in-out",
                  {
                    "text-xl": !open,
                  }
                )}
              >
                w
                <span
                  className={cn({
                    hidden: !open,
                  })}
                >
                  atch
                </span>
                d
                <span
                  className={cn({
                    hidden: !open,
                  })}
                >
                  .
                </span>
              </span>
            </GradientText>
          </Link>
        </div>
        <SidebarMenu>
          {mainItems.map(({ href, icon, title, dataAttribute }) => (
            <SidebarMenuItem key={title}>
              <SidebarMenuButton
                asChild
                {...(dataAttribute ? { [`data-${dataAttribute}`]: true } : {})}
              >
                <Link to={href}>
                  {icon}
                  <span>{title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        {sidebarGroups.map(({ title, items }) => (
          <SidebarGroup key={title}>
            <SidebarGroupLabel>Favorites</SidebarGroupLabel>

            <SidebarMenu>
              {items.map(({ title: itemTitle, href, icon, dataAttribute }) => (
                <SidebarMenuItem key={itemTitle}>
                  <SidebarMenuButton
                    asChild
                    {...(dataAttribute
                      ? { [`data-${dataAttribute}`]: true }
                      : {})}
                  >
                    <Link to={href} title={itemTitle}>
                      {icon}
                      <span>{itemTitle}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
              <SidebarMenuItem>
                {/* <Link to="/lists"> */}
                <SidebarMenuButton className="text-sidebar-secondary hover:text-sidebar-secondary active:text-sidebar-secondary">
                  <MoreHorizontal />
                  <span>View all lists</span>
                </SidebarMenuButton>
                {/* </Link> */}
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarFooter>
        <SidebarUserButton />
      </SidebarFooter>
    </Sidebar>
  );
}

function SidebarUserButton() {
  const user = useUser();

  const router = useRouter();

  if (!user)
    return (
      <SidebarMenuItem>
        <SidebarMenuButton
          size="lg"
          className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
          asChild
        >
          <Link to="/login">
            <LogInIcon />
            <span>Log in</span>
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
    );

  return (
    <SidebarMenuItem>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <SidebarMenuButton
            size="lg"
            className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
          >
            <UserAvatar />
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate">{user.firstName}</span>
              <span className="truncate text-xs font-normal text-sidebar-secondary">
                {user.email}
              </span>
            </div>
          </SidebarMenuButton>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
          align="end"
          side="right"
          sideOffset={4}
        >
          <DropdownMenuLabel className="p-0 font-normal">
            <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
              <UserAvatar />
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">{user.firstName}</span>
                <span className="truncate text-xs font-normal text-sidebar-secondary">
                  {user.email}
                </span>
              </div>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() =>
              authClient.signOut().then(({ data }) => {
                if (!data || !data.success) return;

                router.invalidate();
              })
            }
          >
            <LogOutIcon />
            Log out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </SidebarMenuItem>
  );
}

import { ReactNode, useEffect, useState } from "react";
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
import {
  ClapperboardIcon,
  ClockIcon,
  HomeIcon,
  ListIcon,
  MoreHorizontal,
  SearchIcon,
  SparklesIcon,
  TrophyIcon,
  TvIcon,
} from "lucide-react";
import { Link } from "@tanstack/react-router";

type AppSidebarProps = {};

type SidebarItem = {
  title: string;
  href: string;
  icon: ReactNode;
};

type SidebarItemGroup = {
  title: string;
  items: SidebarItem[];
};

const mainItems: SidebarItem[] = [
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

const sidebarGroups: SidebarItemGroup[] = [
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
      },
    ],
  },
];

export function AppSidebar({}: AppSidebarProps) {
  return (
    <Sidebar>
      <SidebarHeader>
        <div className="w-fit p-2">
          <Link
            to="/home"
            className="select-none whitespace-nowrap relative block h-fit w-fit"
          >
            <span className="text-2xl font-black bg-gradient-to-r from-sky-500 to-fuchsia-500 inline-block text-transparent bg-clip-text ">
              watchd.
            </span>
          </Link>
        </div>
        <SidebarMenu>
          {mainItems.map(({ href, icon, title }) => (
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
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
              {items.map(({ title, href, icon }) => (
                <SidebarMenuItem key={title}>
                  <SidebarMenuButton asChild>
                    <Link to={href} title={title}>
                      {icon}
                      <span>{title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
              <SidebarMenuItem>
                <Link to="/lists">
                  <SidebarMenuButton className="text-sidebar-secondary hover:text-sidebar-secondary active:text-sidebar-secondary">
                    <MoreHorizontal />
                    <span>View all lists</span>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  );
}

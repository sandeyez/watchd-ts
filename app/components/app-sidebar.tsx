import { Link } from "@tanstack/react-router";
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
import { GradientText } from "./gradient-text";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "./ui/sidebar/sidebar";
import type { ReactNode } from "react";

type SidebarItem = {
  title: string;
  href: string;
  icon: ReactNode;
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
      },
    ],
  },
];

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarHeader>
        <div className="w-fit p-2">
          <Link to="/home" className="select-none relative h-fit w-fit">
            <GradientText>
              <span className="text-2xl font-black">watchd.</span>
            </GradientText>
          </Link>
        </div>
        <SidebarMenu>
          {mainItems.map(({ href, icon, title }) => (
            <SidebarMenuItem key={title}>
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
              {items.map(({ title: itemTitle, href, icon }) => (
                <SidebarMenuItem key={itemTitle}>
                  <SidebarMenuButton asChild>
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
    </Sidebar>
  );
}

import { useUser } from "@clerk/tanstack-react-start";
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
import { ReactNode } from "react";
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
import { GradientText } from "./gradient-text";

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
  const user = useUser();

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

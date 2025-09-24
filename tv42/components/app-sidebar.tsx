"use client"

import * as React from "react"
import { usePathname } from 'next/navigation';  // Use usePathname hook to get the current path
import {
  Hash,
  Home,
  StickyNote,
  User,
  Settings,
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import { useSelector } from "react-redux";
import { type LucideIcon } from "lucide-react"


const data = {
  teams: [
    {
      name: "TV 42",
      image: "/images/tv42logo.png", // <-- Use your image path here
      plan: ".",
    },
  ],
  navTest: [
    {
      title: "Anasayfa",
      url: "/panel/dashboard",
      icon: Home,
      isActive: false,
      items: [
        {
          title: "Anasayfa",
          url: "/panel/dashboard",
        },
      ],
    },
    {
      title: "Sayfalar",
      url: "#",
      icon: StickyNote,
      isActive: false,
      items: [
        {
          title: "Anasayfa",
          url: "/panel/pages/anasayfa",
        },
        {
          title: "Yayın Akışı",
          url: "/panel/pages/yayin-akisi",
        },
        {
          title: "Programlar",
          url: "/panel/pages/programlar",
        },
        {
          title: "Basın",
          url: "/panel/pages/basin",
        },
        /*
        {
          title: "Reklam",
          url: "/panel/pages/reklam",
        },*/
        {
          title: "Künye",
          url: "/panel/pages/kunye",
        },
        {
          title: "İletişim",
          url: "/panel/pages/iletisim",
        },
        {
          title: "Canlı Yayın",
          url: "/panel/pages/canli-yayin",
        },
      ],
    },
    {
      title: "Kullanıcılar",
      url: "#",
      icon: User,
      isActive: false,
      items: [
        {
          title: "Kullanıcı Listesi",
          url: "/panel/users/list",
        },
        {
          title: "Kullanıcı Grupları",
          url: "/panel/users/group",
        },
      ],
    },
    {
      title: "Ayarlar",
      url: "#",
      icon: Settings,
      isActive: false,
      items: [
        {
          title: "Site Ayarları",
          url: "/panel/settings/site",
        },
        {
          title: "Kullanıcı Ayarları",
          url: "/panel/settings/user",
        },
      ],
    },
    {
      title: "Sosyal Medya",
      url: "#",
      icon: Hash,
      isActive: false,
      items: [
        {
          title: "Sosyal Medya Ayarları",
          url: "/panel/socialmedia",
        },
      ],
    },
  ],
}


interface NavItem {
  title: string;
  url: string;
  icon?: LucideIcon
  isActive: boolean;
  items: SubItem[];
}

interface SubItem {
  title: string;
  url: string;
  isActive?: boolean;
}

interface UserType {
  name: string;
  email: string;
  avatar: string;
}

interface RootState {
  user: {
    user: {
      user: UserType;
    };
  };
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user } = useSelector((state: RootState) => state.user);
  const pathname = usePathname();  // Get the current pathname

  // Menülerdeki öğeleri güncelle
  const getUpdatedNavItems = (navItems: NavItem[]) => {
    return navItems.map((item: NavItem) => {
      const isActive = pathname === item.url || 
        (item.items && item.items.some((subItem: SubItem) => pathname === subItem.url));
        
      return {
        ...item,
        isActive,
        items: item.items ? item.items.map((subItem: SubItem) => ({
          ...subItem,
          isActive: pathname === subItem.url,
        })) : [],
      };
    });
  };

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        {data.teams[0] && (
          <div className="flex items-center gap-2 px-4 py-2">
            <img src={data.teams[0].image} alt={data.teams[0].name} className="h-6 w-auto rounded" />
            <span className="font-semibold">{data.teams[0].name}</span>
          </div>
        )}
      </SidebarHeader>
      <SidebarContent>
        {/*<NavProjects projects={data.personelTakip} />*/}
        <NavMain items={getUpdatedNavItems(data.navTest)} />
        {/*<NavMain items={getUpdatedNavItems(data.navMain)} />*/} {/* Güncellenmiş navMain */}
        {/*<NavProjects projects={data.projects} />*/}
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
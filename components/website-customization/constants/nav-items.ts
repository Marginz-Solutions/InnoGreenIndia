import {
BarChart3,
Package,
Briefcase,
Users,
Tag,
Contact,
LayoutDashboard
} from 'lucide-react';

import { SidebarSection } from '../types/common.types';

export const NAV_ITEMS = [
    {
        id: 'pulse' as SidebarSection,
        label: "Today's Pulse List",
        icon: BarChart3,
    },
    {
        id: 'dashboard' as SidebarSection,
        label: "Dashboard",
        icon: LayoutDashboard,
    },
    {
        id: 'products' as SidebarSection,
        label: 'Products',
        icon: Package,
    },
    {
        id: 'brands' as SidebarSection,
        label: 'Brands',
        icon: Briefcase,
    },
    {
        id: 'dealer' as SidebarSection,
        label: 'DealerHub',
        icon: Users,
    },
    {
        id: 'categories' as SidebarSection,
        label: 'Categories',
        icon: Tag,
    },
    {
        id: 'contacts' as SidebarSection,
        label: 'Contacts',
        icon: Contact,
    }
];

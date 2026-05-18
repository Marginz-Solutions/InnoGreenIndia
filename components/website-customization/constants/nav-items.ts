import {
    BarChart3,
    Package,
    Briefcase,
    Users,
    Tag,
    Contact,
    LayoutDashboard,
    LucideUserSquare,
    HandCoins,
    MessageCircleQuestion
} from 'lucide-react';

import { SidebarSection } from '../types/common.types';

export const NAV_ITEMS = [
    {
        id: 'dashboard' as SidebarSection,
        label: "Dashboard",
        icon: LayoutDashboard,
    },
    {
        id: 'pulse' as SidebarSection,
        label: "Today's Pulse List",
        icon: BarChart3,
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
        id: 'smartEnquiries' as SidebarSection,
        label: 'Smart Enquiry',
        icon: MessageCircleQuestion,
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

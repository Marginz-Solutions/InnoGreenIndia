import {
BarChart3,
Package,
Briefcase,
Users,
PhoneCall,
} from 'lucide-react';

import { SidebarSection } from '../types/common.types';

export const NAV_ITEMS = [
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
id: 'contacts' as SidebarSection,
label: 'Contacts',
icon: PhoneCall,
},
];

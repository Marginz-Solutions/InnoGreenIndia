export type SidebarSection =
| 'pulse'
| 'products'
| 'brands'
| 'dealer'
| 'contacts'
| 'categories';

export interface PulseItem {
id: string;
title: string;
price: number;
unit: string;
available: boolean;
status: 'active' | 'draft';
category: string;
createdAt: string;
}

export interface Product {
id: string;
name: string;
category: string;
sku: string;
featured: boolean;
status: 'active' | 'inactive';
tags: string[];
}

export interface Category {
id: string;
name: string;
slug: string;
created_at?: string;
updated_at?: string;
}

export interface Brand {
id: string;
name: string;
description: string;
website: string;
status: 'active' | 'inactive';
productsCount: number;
}

export interface Dealer {
id: string;
name: string;
location: string;
phone: string;
email: string;
district: string;
status: 'active' | 'inactive';
}

export interface ContactItem {
id: string;
label: string;
type: 'email' | 'phone' | 'address' | 'social';
value: string;
platform?: string;
primary: boolean;
}

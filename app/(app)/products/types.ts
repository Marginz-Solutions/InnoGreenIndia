import { PaginationType, Product } from "@/lib/global.types";

export type ProductsPageResponse = {
    data: Product[];
    pagination: PaginationType;
}
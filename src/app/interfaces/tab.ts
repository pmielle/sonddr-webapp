import { FabMode } from "./fab-mode";

export interface Tab {
    name: string,
    icon: string,
    badge?: string,
    component: any,
    fab?: FabMode,
}

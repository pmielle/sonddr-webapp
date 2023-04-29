export interface FabMode {
    icon: string,
    label: string,
    color: string,
}

export let homeMode: FabMode = {
    icon: "add",
    color: "var(--primary-color)",
    label: "Share\nan idea",
};

export let goalMode: FabMode = {
    icon: "add",
    color: "green",
    //color: "var(--primary-color)",
    label: "Share\nan idea",
};

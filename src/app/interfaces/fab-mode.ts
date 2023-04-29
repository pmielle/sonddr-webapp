export interface FabMode {
    icon: string,
    label: string,
    color: string,
}

export let homeMode: FabMode = {
    icon: "add",
    color: "var(--primary-color)",
    label: "Share<br>an idea",
};

export let goalMode: FabMode = {
    icon: "add",
    color: "green",
    //color: "var(--primary-color)",
    label: "Share<br>an idea",
};

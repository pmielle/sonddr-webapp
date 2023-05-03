export interface FabMode {
    icon: string,
    label: string,
    color: string,
}

export let addMode: FabMode = {
    icon: "checkmark",
    color: "green",
    label: "Share",
};

export let homeMode: FabMode = {
    icon: "add",
    color: "var(--primary-color)",
    label: "Share<br>an idea",
};

export let goalMode: FabMode = {
    icon: "add",
    color: "var(--primary-color)",
    label: "Share<br>an idea",
};

export let ideaMode: FabMode = {
    icon: "favorite_outline",
    color: "gray",
    label: "Upvote",
};
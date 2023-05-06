export interface FabMode {
    icon: string,
    label: string,
    color: string,
}

export let userMode: FabMode = {
    icon: "add",
    color: "blue",
    label: "Get<br>in touch",
};

export let profileMode: FabMode = {
    icon: "logout",
    color: "red",
    label: "Log out",
};

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

export let upvoteMode: FabMode = {
    icon: "favorite_outline",
    color: "gray",
    label: "Upvote",
};

export let upvotedMode: FabMode = {
    icon: "favorite",
    color: "red",
    label: "Upvoted",
};
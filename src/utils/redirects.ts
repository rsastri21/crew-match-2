export function getDashboardUrl(role: string) {
    switch (role) {
        case "user":
            return "/user/dashboard";
        case "production_head":
            return "/production-head/dashboard";
        default:
            return "/";
    }
}

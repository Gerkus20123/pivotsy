import { CirclePlus, Search, Star, CircleUser, Home, LogOut } from "lucide-react";

export const NavLinksData = [
    {"id": "dashboard", "name": "Home", "link": "/home", "icon": Home},
    {"id": "search", "name": "Search", "link": "/home/search", "icon": Search},
    {"id": "add-job-post", "name": "Add Job Post", "link": "/home/add-job-post", "icon": CirclePlus},
    {"id": "followed-job-posts", "name": "Followed", "link": "/home/followed", "icon": Star},
    {"id": "account", "name": "Account", "link": "/home/account", "icon": CircleUser},
    {"id": "logout", "name": "Logout", "link": "", "icon": LogOut},
];
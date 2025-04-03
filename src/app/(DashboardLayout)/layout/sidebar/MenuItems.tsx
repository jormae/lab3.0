import {
  IconFlask,
  IconHome,
  IconLayoutDashboard,
  IconUser,
} from "@tabler/icons-react";

import { uniqueId } from "lodash";

const Menuitems = [
  {
    navlabel: true,
    subheader: "Home",
  },
  {
    id: uniqueId(),
    title: "รายการตรวจแล็บ",
    icon: IconFlask,
    href: "/labs",
  },
  {
    navlabel: true,
    subheader: "Settings",
  },
  {
    id: uniqueId(),
    title: "เจ้าหน้าที่",
    icon: IconUser,
    href: "/users",
  },
  {
    id: uniqueId(),
    title: "หน่วยงาน",
    icon: IconHome,
    href: "/org",
  },
];

export default Menuitems;

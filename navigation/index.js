export default [
  {
    header: "",
    description: "",
    child: [
      {
        title: "Dashboard",
        path: "/dashboard",
        icon: "ic:outline-dashboard",
        child: [],
        meta: {
          auth: {
            role: ["admin", "developer", "superuser"],
          },
        },
      },
      {
        title: "Assessment",
        path: "/assessment",
        icon: "ic:outline-assessment",
        child: [],
        meta: {
          auth: {
            role: ["admin", "developer", "manager"],
          },
        },
      },
      {
        title: "Framework",
        path: "/framework",
        icon: "hugeicons:chip",
        child: [],
        meta: {
          auth: {
            role: ["admin", "developer", "superuser"],
          },
        },
      },
      {
        title: "Organization",
        path: "/organization/1",
        icon: "ph:building",
        child: [],
        meta: {
          auth: {
            role: ["admin", "developer", "superuser"],
          },
        },
      },
      {
        title: "Question Bank",
        path: "/bank-question",
        icon: "mdi:bank",
        child: [],
        meta: {
          auth: {
            role: ["superuser"],
          },
        },
      },
      {
        title: "Profile",
        path: "/profile",
        icon: "ph:user",
        child: [],
        meta: {
          auth: {
            role: ["admin", "developer", "superuser", "manager", "employee"],
          },
        },
      },
    ],
  },
  {
    header: "Administrator",
    description: "",
    child: [
      {
        title: "Organization",
        path: "/admin/organization",
        icon: "ph:building",
        child: [],
        meta: {
          auth: {
            role: ["admin"],
          },
        },
      },
      {
        title: "Superuser",
        path: "/admin/superuser",
        icon: "ph:user",
        child: [],
        meta: {
          auth: {
            role: ["admin"],
          },
        },
      },
    ],
    meta: {
      auth: {
        role: ["admin"],
      },
    },
  },
];

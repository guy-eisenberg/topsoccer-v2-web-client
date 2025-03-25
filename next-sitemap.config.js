/** @type {import('next-sitemap').IConfig} */
const config = {
  siteUrl: process.env.SITE_URL || "https://topsoccer.co.il",
  exclude: [
    "/manage",
    "/my-events",
    "/profile",
    "/event/edit",
    "/my-teams",
    "/team/new",
    "/events",
    "/blog",
  ],
  generateRobotsTxt: true,
  robotsTxtOptions: {
    policies: [
      {
        userAgent: "*",
        disallow: [
          "/manage",
          "/my-events",
          "/profile",
          "/event/edit/",
          "/my-teams/",
          "/team/new",
          "/events/",
          "/blog/",
        ],
      },
    ],
  },
};

module.exports = config;

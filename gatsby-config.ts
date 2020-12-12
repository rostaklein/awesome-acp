import { getThemeVariables } from "antd/dist/theme";
import { GatsbyConfig } from "gatsby";

const config: GatsbyConfig = {
  siteMetadata: {
    title: "Awesome ACP",
  },
  plugins: [
    `gatsby-plugin-react-helmet`,
    `gatsby-plugin-emotion`,
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: "Awesome ACP",
        short_name: "Lineage 2 Account Panel",
        start_url: "/",
        icon: "src/images/100ka_favicon.png",
      },
    },
    {
      resolve: "gatsby-plugin-antd",
      options: {
        style: true,
      },
    },
    {
      resolve: `gatsby-plugin-less`,
      options: {
        lessOptions: {
          javascriptEnabled: true,
          modifyVars: {
            ...getThemeVariables({
              dark: true,
              compact: true,
            }),
            "font-family": "PT Serif",
            "primary-color": "#ffc439",
            "body-background": "#121212",
            "component-background": "#ececec",
            "input-bg": "#2a2a2a",
            "btn-default-bg": "#1d1d1d",
            "btn-primary-color": "#1d1d1d",
          },
        },
      },
    },
    // {
    // 	resolve: '@sentry/gatsby',
    // 	options: {
    // 		dsn: 'https://9b8988fdf05d4faba486b3df062c68b4@o440643.ingest.sentry.io/5410118',
    // 	},
    // },
  ],
};

export default config;

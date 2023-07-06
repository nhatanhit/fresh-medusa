const dotenv = require("dotenv");

let ENV_FILE_NAME = "";
switch (process.env.NODE_ENV) {
  case "production":
    ENV_FILE_NAME = ".env.production";
    break;
  case "staging":
    ENV_FILE_NAME = ".env.staging";
    break;
  case "test":
    ENV_FILE_NAME = ".env.test";
    break;
  case "development":
  default:
    ENV_FILE_NAME = ".env";
    break;
}

try {
  dotenv.config({ path: process.cwd() + "/" + ENV_FILE_NAME });
} catch (e) {}

// CORS when consuming Medusa from admin
const ADMIN_CORS =
  process.env.ADMIN_CORS || "http://localhost:7000,http://localhost:7001";

// CORS to avoid issues when consuming Medusa from a client
const STORE_CORS = process.env.STORE_CORS || "http://localhost:8000";

const DATABASE_URL =
  process.env.DATABASE_URL || "postgres://localhost/medusa-store";

const REDIS_URL = process.env.REDIS_URL || "redis://localhost:6379";

const GoogleClientId = process.env.GOOGLE_CLIENT_ID || "670556147701-8pndkplrgdivhej6oa5vgn9ruckbneq4.apps.googleusercontent.com"
const GoogleClientSecret = process.env.GOOGLE_CLIENT_SECRET || "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"
const BACKEND_URL = process.env.BACKEND_URL || "localhost:9000"
const ADMIN_URL = process.env.ADMIN_URL || "localhost:7000"
const STORE_URL = process.env.STORE_URL || "localhost:8000"


const plugins = [
  `medusa-fulfillment-manual`,
  `medusa-payment-manual`,
  {
    resolve: `@medusajs/file-local`,
    options: {
      upload_dir: "uploads",
    },
  },
  {
    resolve: "medusa-plugin-auth",
    options: {
        // strict: "all", // or "none" or "store" or "admin"
        google: {
            clientID: GoogleClientId,
            clientSecret: GoogleClientSecret,
 
            admin: {
                callbackUrl:`${BACKEND_URL}/admin/auth/google/cb?scope=email`,
                failureRedirect: `${ADMIN_URL}/login`,
 
				// The success redirect can be overriden from the client by adding a query param `?redirectTo=your_url` to the auth url
				// This query param will have the priority over this configuration
                successRedirect: `${ADMIN_URL}/`,
 
                authPath: '/admin/auth/google?scope=email',
                // authCallbackPath: '/admin/auth/google/cb',
                // expiresIn: 24 * 60 * 60 * 1000,
                // verifyCallback: (container, req, accessToken, refreshToken, profile) => {
                //    // implement your custom verify callback here if you need it
                // }
            },
 
            store: {
                callbackUrl:`${BACKEND_URL}/store/auth/google/cb`,
                failureRedirect: `${STORE_URL}/login`,
 
				// The success redirect can be overriden from the client by adding a query param `?redirectTo=your_url` to the auth url
				// This query param will have the priority over this configuration
                successRedirect: `${STORE_URL}/`,
 
                // authPath: '/store/auth/google',
                // authCallbackPath: '/store/auth/google/cb',
                // expiresIn: 24 * 60 * 60 * 1000,
                // verifyCallback: (container, req, accessToken, refreshToken, profile) => {
                //    // implement your custom verify callback here if you need it
                // }
            }
        }
    }
  }
  // To enable the admin plugin, uncomment the following lines and run `yarn add @medusajs/admin`
  // {
  //   resolve: "@medusajs/admin",
  //   /** @type {import('@medusajs/admin').PluginOptions} */
  //   options: {
  //     autoRebuild: true,
  //   },
  // },
];

const modules = {
  /*eventBus: {
    resolve: "@medusajs/event-bus-redis",
    options: {
      redisUrl: REDIS_URL
    }
  },
  cacheService: {
    resolve: "@medusajs/cache-redis",
    options: {
      redisUrl: REDIS_URL
    }
  },*/
};

/** @type {import('@medusajs/medusa').ConfigModule["projectConfig"]} */
const projectConfig = {
  jwtSecret: process.env.JWT_SECRET,
  cookieSecret: process.env.COOKIE_SECRET,
  store_cors: STORE_CORS,
  database_url: DATABASE_URL,
  admin_cors: ADMIN_CORS,
  // Uncomment the following lines to enable REDIS
  // redis_url: REDIS_URL
};

/** @type {import('@medusajs/medusa').ConfigModule} */
module.exports = {
  projectConfig,
  plugins,
  modules,
};

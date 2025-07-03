import "next-auth";
import "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    accessToken?: string;
    accessTokenExpires?: string;
  }
  interface User {
    accessToken?: string;
    accessTokenExpires?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string;
    accessTokenExpires?: string;
  }
}

import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";

/**
 * ⚠️  Route Handler 只能 export 合法欄位：
 *     GET / POST / PUT / PATCH / DELETE / HEAD / OPTIONS...
 */
const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };

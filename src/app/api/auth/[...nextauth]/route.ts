import NextAuth from "next-auth/next";
import { authOptions } from "@/lib/auth/utils";

// No need to redeclare the Session type here since it's already declared in utils.ts
const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };

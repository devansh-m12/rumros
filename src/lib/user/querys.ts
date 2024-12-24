import { db } from "@/lib/db/drizzle";
import { users } from "@/lib/db/migrations/schema";
import type { InferSelectModel } from "drizzle-orm";
import { eq } from "drizzle-orm";
import { IUserGet } from "./type";


export const getUserByEmail = async (email: string) => {
    const user = await db.query.users.findFirst({
        where: eq(users.email, email)
    });
    return user;
}

export const createUser = async (user: IUserGet) : Promise<InferSelectModel<typeof users>> => {
    await db.insert(users).values({
        username: `${user.email.split('@')[0]}${Math.floor(1000 + Math.random() * 9000)}`,
        email: user.email,
        password: user.password,
        role: "user"
    });
    
    const newUser = await getUserByEmail(user.email);
    if (!newUser) throw new Error("Failed to create user");
    return newUser;
}
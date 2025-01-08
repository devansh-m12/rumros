import { db } from "@/lib/db";
import type { User } from "@prisma/client";
import { IUserGet } from "./type";

export const getUserByEmail = async (email: string): Promise<User | null> => {
    const user = await db.user.findFirst({
        where: {
            email: email
        }
    });
    return user;
}

export const createUser = async (user: IUserGet): Promise<User> => {
    const newUser = await db.user.create({
        data: {
            username: `${user.email.split('@')[0]}${Math.floor(1000 + Math.random() * 9000)}`,
            email: user.email,
            password: user.password,
            role: "user"
        }
    });
    
    if (!newUser) throw new Error("Failed to create user");
    return newUser;
}
import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { createWebsite } from "@/lib/website/querys";

export async function POST(req: NextRequest) {
    try {
        // Check authentication
        const token = await getToken({ req: req, secret: process.env.AUTH_SECRET });
        const userId = token?.sub;

        const body = await req.json();
        const { name, domain } = body;

        // Input validation
        if (!name) {
            return NextResponse.json(
                { message: 'Name is required' },
                { status: 400 }
            );
        }

        const website = await createWebsite({
            name,
            domain,
            userId,
            createdBy: userId,
        });

        return NextResponse.json(
            {
                message: 'Website created successfully',
                website: {
                    id: website.id,
                    name: website.name,
                    domain: website.domain,
                }
            },
            { status: 201 }
        );
    } catch (error) {
        console.error('Website creation error:', error);
        return NextResponse.json(
            { message: 'Failed to create website', error: error instanceof Error ? error.message : 'Unknown error' },
            { status: 500 }
        );
    }
} 
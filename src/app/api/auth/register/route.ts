import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { createUser, getUserByEmail } from "@/lib/user/querys";
import { hash } from "bcrypt";
export async function GET(req: NextRequest) {

  // check if bearer token is valid
  const token = await getToken({ req: req, secret: process.env.AUTH_SECRET });

  // // If not authenticated, redirect to login
  if (!token) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  return NextResponse.json({ message: 'Authenticated' }, { status: 200 });
}

export async function POST(req: NextRequest) {
  try {
      const body = await req.json();
      const { password, email } = body;

      // Input validation
      if (!password || !email) {
          return NextResponse.json(
              { message: 'Missing required fields' },
              { status: 400 }
          );
      }


      if(await getUserByEmail(email)) {
          return NextResponse.json(
              { message: 'Email already exists' },
              { status: 400 }
          );
      }

      // Hash password with bcrypt
      const hashedPassword = await hash(password, 10);

      const user = await createUser({
          password: hashedPassword,
          email
      });

      // Return success response without sensitive data
      return NextResponse.json(
          {
              message: 'User created successfully',
              user: {
                  id: user.id,
                  email: user.email
              }
          },
          { status: 201 }
      );
  } catch (error) {
      console.error('Registration error:', error);
      return NextResponse.json(
          { message: 'Failed to create user', error: error instanceof Error ? error.message : 'Unknown error' },
          { status: 500 }
      );
  }
}



import { NextResponse } from "next/server";
import { SignJWT } from "jose";
import { getServerSideConfig } from "@/app/config/server";
import { prisma } from "@/app/server/db";

const serverConfig = getServerSideConfig();
const JWT_SECRET_KEY = serverConfig.secret;

export async function POST(req: Request) {
  const { username, password }: Partial<User> = await req.json();

  if (!username || !password)
    return NextResponse.json({
      error: true,
      msg: "username and password are required",
    });

  const user = await prisma.user.findFirst({ where: { username } });
  if (!user) {
    return NextResponse.json({ error: true, msg: "username is not exist" });
  }

  const { password: _password, ...userInfo } = user;
  if (_password !== password) {
    return NextResponse.json({
      error: true,
      msg: "username or password is incorrect",
    });
  }

  const secret = new TextEncoder().encode(JWT_SECRET_KEY);
  const token = await new SignJWT(userInfo)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("2h")
    .sign(secret);

  return NextResponse.json({ error: false, userInfo, token });
}

import { NextResponse } from "next/server";
import { prisma } from "../../server/db";

export async function POST(req: Request) {
  const { username, password, email, phone }: Partial<User> = await req.json();

  if (!username || !password)
    return NextResponse.json({
      error: true,
      msg: "account or password is empty",
    });
  const isReady = await prisma.user.findFirst({ where: { username } });
  if (isReady)
    return NextResponse.json({ error: true, msg: "username already exists" });

  const { id } = await prisma.user.create({
    data: {
      username,
      nickname: username,
      password,
      email: email || "",
      phone: phone || "",
    },
  });

  return NextResponse.json({ id });
}

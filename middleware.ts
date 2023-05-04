import { NextRequest, NextResponse } from "next/server";
import { getServerSideConfig } from "@/app/config/server";
import md5 from "spark-md5";
import { jwtVerify } from "jose";

export const config = {
  matcher: ["/(api/(?!auth|config).*)"],
};

const serverConfig = getServerSideConfig();
const JWT_SECRET_KEY = serverConfig.secret;

function getIP(req: NextRequest) {
  let ip = req.ip ?? req.headers.get("x-real-ip");
  const forwardedFor = req.headers.get("x-forwarded-for");

  if (!ip && forwardedFor) {
    ip = forwardedFor.split(",").at(0) ?? "";
  }

  return ip;
}

export async function middleware(req: NextRequest) {
  const accessCode = req.headers.get("access-code");
  const token = req.headers.get("token");
  const authorization = req.headers.get("authorization");
  const hashedCode = md5.hash(accessCode ?? "").trim();

  console.log("[Auth] allowed hashed codes: ", [...serverConfig.codes]);
  console.log("[Auth] got access code:", accessCode);
  console.log("[Auth] hashed access code:", hashedCode);
  console.log("[User IP] ", getIP(req));
  console.log("[Time] ", new Date().toLocaleString());

  if (!authorization) {
    return NextResponse.json(
      {
        error: true,
        msg: "No token, authorization denied",
      },
      { status: 401 },
    );
  }

  try {
    const token = authorization?.split("Bearer ")?.[1];
    const secret = new TextEncoder().encode(JWT_SECRET_KEY);

    const {
      payload: { id: userId },
    } = await jwtVerify(token, secret);
    req.headers.set("userId", userId as string);
  } catch (error) {
    console.error("[Authorization] error:", error);
    return NextResponse.json(
      {
        error: true,
        msg: "The session has expired, please log in again",
      },
      { status: 401 },
    );
  }

  if (serverConfig.needCode && !serverConfig.codes.has(hashedCode) && !token) {
    return NextResponse.json(
      {
        error: true,
        needAccessCode: true,
        msg: "Please go settings page and fill your access code.",
      },
      { status: 401 },
    );
  }

  // inject api key
  if (!token) {
    const apiKey = serverConfig.apiKey;
    if (apiKey) {
      console.log("[Auth] set system token");
      req.headers.set("token", apiKey);
    } else {
      return NextResponse.json(
        {
          error: true,
          msg: "Internal error (code: 6001)",
        },
        { status: 500 },
      );
    }
  } else {
    console.log("[Auth] set user token");
  }

  return NextResponse.next({
    request: {
      headers: req.headers,
    },
  });
}

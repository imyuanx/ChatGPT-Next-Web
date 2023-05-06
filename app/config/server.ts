import md5 from "spark-md5";

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      JWT_SECRET_KEY: string;
      OPENAI_API_KEY?: string;
      CODE?: string;
      PROXY_URL?: string;
      VERCEL?: string;
    }
  }
}

const ACCESS_CODES = (function getAccessCodes(): Set<string> {
  const code = process.env.CODE;

  try {
    const codes = (code?.split(",") ?? [])
      .filter((v) => !!v)
      .map((v) => md5.hash(v.trim()));
    return new Set(codes);
  } catch (e) {
    return new Set();
  }
})();

export const getServerSideConfig = () => {
  if (typeof process === "undefined") {
    throw Error(
      "[Server Config] you are importing a nodejs-only module outside of nodejs",
    );
  }
  const { JWT_SECRET_KEY, OPENAI_API_KEY, CODE, PROXY_URL, VERCEL } =
    process.env;

  if (!JWT_SECRET_KEY || JWT_SECRET_KEY.length === 0) {
    throw new Error(
      "[Server Config] The environment variable JWT_SECRET_KEY is not set.",
    );
  }

  return {
    secret: JWT_SECRET_KEY,
    apiKey: OPENAI_API_KEY,
    code: CODE,
    codes: ACCESS_CODES,
    needCode: ACCESS_CODES.size > 0,
    proxyUrl: PROXY_URL,
    isVercel: !!VERCEL,
  };
};

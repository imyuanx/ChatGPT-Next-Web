declare module "*.jpg";
declare module "*.png";
declare module "*.woff2";
declare module "*.woff";
declare module "*.ttf";
declare module "*.scss" {
  const content: Record<string, string>;
  export default content;
}

declare module "*.svg";

type User = {
  id: string;
  username: string;
  nickname: string;
  password: string;
  email?: string;
  phone?: string;
};

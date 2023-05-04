"use client";

require("../polyfill");

import { useState, HTMLProps } from "react";
import { IconButton } from "./button";
import styles from "./home.module.scss";
import EyeIcon from "../icons/eye.svg";
import EyeOffIcon from "../icons/eye-off.svg";
import Locale from "../locales";
import { useAuthStore } from "../store";

function PasswordInput(props: HTMLProps<HTMLInputElement>) {
  const [visible, setVisible] = useState(false);

  function changeVisibility() {
    setVisible(!visible);
  }

  return (
    <div className={styles["password-input-container"]}>
      <input
        {...props}
        type={visible ? "text" : "password"}
        className={styles["password-input"]}
      />
      <IconButton
        icon={
          visible ? (
            <EyeIcon className={styles["window-icon-solid"]} />
          ) : (
            <EyeOffIcon className={styles["window-icon-solid"]} />
          )
        }
        onClick={changeVisibility}
        className={[
          styles["password-eye"],
          styles["password-eye-no-padding"],
        ].join(" ")}
      />
    </div>
  );
}

export default function Login() {
  const { isLogin, login } = useAuthStore();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  // login
  const onLogin = () => login(username, password);

  return (
    <>
      {!isLogin && (
        <div className={styles["login-container"]}>
          <div className={styles["login-item-box"]}>
            <div className={styles["login-item"]}>
              <label>{Locale.Home.Login.Username.Label}</label>
              <input
                type="text"
                value={username}
                className={styles["login-item-input"]}
                placeholder={Locale.Home.Login.Username.Placeholder}
                onChange={(e) => setUsername(e.currentTarget.value)}
              />
            </div>
            <div className={styles["login-item"]}>
              <label>{Locale.Home.Login.Password.Label}</label>
              <PasswordInput
                value={password}
                type="text"
                placeholder={Locale.Home.Login.Password.Placeholder}
                onChange={(e) => setPassword(e.currentTarget.value)}
              />
            </div>
            <div className={styles["login-item-btn"]}>
              <IconButton
                text={Locale.Home.Login.Button}
                className={styles["login-btn"]}
                noDark
                onClick={onLogin}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}

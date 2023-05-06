"use client";

require("../polyfill");

import { useState, HTMLProps } from "react";
import { IconButton } from "./button";
import styles from "./login.module.scss";
import EyeIcon from "../icons/eye.svg";
import EyeOffIcon from "../icons/eye-off.svg";
import LoadingIcon from "../icons/loading.svg";
import Locale from "../locales";
import { useAuthStore } from "../store";
import { showToast } from "./ui-lib";

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
  const [isLoading, setIsLoading] = useState(false);
  const { isLogin, login, register } = useAuthStore();
  const [isRegister, setIsRegister] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [regUsername, setRegUsername] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [repRegPassword, setRepRegPassword] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPhone, setRegPhone] = useState("");

  // login
  const onLogin = () => {
    setIsLoading(true);
    if (!username || !password) {
      showToast(Locale.Auth.Toast1);
      setIsLoading(false);
      return;
    }
    login(username, password)
      .then(() => {
        setIsLoading(false);
      })
      .catch(() => {
        setIsLoading(false);
      });
  };

  const onRegister = () => {
    setIsLoading(true);
    if (!regUsername || !regPassword || !repRegPassword) {
      showToast(Locale.Auth.Toast1);
      setIsLoading(false);
      return;
    }
    if (regPassword !== repRegPassword) {
      showToast(Locale.Auth.Toast2);
      setIsLoading(false);
      return;
    }
    register(regUsername, regPassword, regEmail, regPhone)
      .then(() => {
        setIsRegister(false);
        setIsLoading(false);
      })
      .catch(() => {
        setIsLoading(false);
      });
  };

  const onSwitch = () => {
    setIsRegister(!isRegister);
  };

  if (isLogin) {
    return <></>;
  }

  return (
    <div className={styles["login-container"]}>
      <div className={styles["login-item-box"]}>
        <h2>幸福大学 AI 助理</h2>
        {!isRegister && (
          <>
            <div className={styles["login-item"]}>
              <label>{Locale.Auth.Login.Username.Label}</label>
              <input
                type="text"
                value={username}
                className={styles["login-item-input"]}
                placeholder={Locale.Auth.Login.Username.Placeholder}
                onChange={(e) => setUsername(e.currentTarget.value)}
              />
            </div>
            <div className={styles["login-item"]}>
              <label>{Locale.Auth.Login.Password.Label}</label>
              <PasswordInput
                value={password}
                type="text"
                placeholder={Locale.Auth.Login.Password.Placeholder}
                onChange={(e) => setPassword(e.currentTarget.value)}
              />
            </div>
            <div className={styles["login-item-btn"]}>
              <IconButton
                icon={isLoading ? <LoadingIcon /> : undefined}
                disabled={isLoading}
                text={Locale.Auth.Login.Button}
                className={styles["login-btn"]}
                noDark
                onClick={onLogin}
              />
            </div>
          </>
        )}
        {isRegister && (
          <>
            <div className={styles["login-item"]}>
              <label>{Locale.Auth.Register.Username.Label}</label>
              <input
                type="text"
                value={regUsername}
                className={styles["login-item-input"]}
                placeholder={Locale.Auth.Register.Username.Placeholder}
                onChange={(e) => setRegUsername(e.currentTarget.value)}
              />
            </div>
            <div className={styles["login-item"]}>
              <label>{Locale.Auth.Register.Password.Label}</label>
              <PasswordInput
                value={regPassword}
                type="text"
                placeholder={Locale.Auth.Register.Password.Placeholder}
                onChange={(e) => setRegPassword(e.currentTarget.value)}
              />
            </div>
            <div className={styles["login-item"]}>
              <label>{Locale.Auth.Register.RepPassword.Label}</label>
              <PasswordInput
                value={repRegPassword}
                type="text"
                placeholder={Locale.Auth.Register.RepPassword.Placeholder}
                onChange={(e) => setRepRegPassword(e.currentTarget.value)}
              />
            </div>
            <div className={styles["login-item"]}>
              <label>{Locale.Auth.Register.Email.Label}</label>
              <input
                type="text"
                value={regEmail}
                className={styles["login-item-input"]}
                placeholder={Locale.Auth.Register.Email.Placeholder}
                onChange={(e) => setRegEmail(e.currentTarget.value)}
              />
            </div>
            <div className={styles["login-item"]}>
              <label>{Locale.Auth.Register.Phone.Label}</label>
              <input
                type="text"
                value={regPhone}
                className={styles["login-item-input"]}
                placeholder={Locale.Auth.Register.Phone.Placeholder}
                onChange={(e) => setRegPhone(e.currentTarget.value)}
              />
            </div>
            <div className={styles["login-item-btn"]}>
              <IconButton
                icon={isLoading ? <LoadingIcon /> : undefined}
                disabled={isLoading}
                text={Locale.Auth.Register.Button}
                className={styles["login-btn"]}
                noDark
                onClick={onRegister}
              />
            </div>
          </>
        )}
        <hr className={styles["login-hr"]} />
        <div className={styles["login-item-btn"]}>
          <a
            href="javascript:void(0);"
            className={styles["login-switch"]}
            onClick={onSwitch}
          >
            {isRegister
              ? Locale.Auth.Login.Button
              : Locale.Auth.Register.Button}
          </a>
        </div>
      </div>
    </div>
  );
}

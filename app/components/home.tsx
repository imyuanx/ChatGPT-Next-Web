"use client";

require("../polyfill");

import { useState, useEffect, useRef, HTMLProps } from "react";

import { IconButton } from "./button";
import styles from "./home.module.scss";

import SettingsIcon from "../icons/settings.svg";

import AddIcon from "../icons/add.svg";
import LoadingIcon from "../icons/three-dots.svg";
import CloseIcon from "../icons/close.svg";
import EyeIcon from "../icons/eye.svg";
import EyeOffIcon from "../icons/eye-off.svg";

import { useChatStore } from "../store";
import { getCSSVar, isMobileScreen } from "../utils";
import Locale from "../locales";
import { Chat } from "./chat";

import dynamic from "next/dynamic";
import { ErrorBoundary } from "./error";
import Image from "next/image";

export function Loading(props: { noLogo?: boolean }) {
  return (
    <div className={styles["loading-content"]}>
      {!props.noLogo && (
        <Image
          className={[styles["user-avtar"], styles["sidebar-logo-img"]].join(
            " ",
          )}
          src="/logo-256x256.webp"
          width={32}
          height={32}
          alt="HAPPYINESS UNIVERSITY"
        />
      )}
      <LoadingIcon />
    </div>
  );
}

export function Bow() {
  return (
    <div className={styles["sidebar-bow-box"]}>
      <div className={styles["sidebar-bow"]}>
        <Image src={"/bow.webp"} width={160} height={160} alt="bow" />
      </div>
      {Array.from({ length: 2 }).map((_, index) => {
        return (
          <div className={styles["sidebar-bow-line-box"]} key={index}>
            <Image
              src={"/bow-line.webp"}
              alt="bow line"
              className={[
                styles["sidebar-bow-line"],
                styles[`sidebar-bow-line-${index}`],
              ].join(" ")}
              fill
            />
          </div>
        );
      })}
    </div>
  );
}

const Settings = dynamic(async () => (await import("./settings")).Settings, {
  loading: () => <Loading noLogo />,
});

const ChatList = dynamic(async () => (await import("./chat-list")).ChatList, {
  loading: () => <Loading noLogo />,
});

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

function useSwitchTheme() {
  const config = useChatStore((state) => state.config);

  useEffect(() => {
    document.body.classList.remove("light");
    document.body.classList.remove("dark");

    if (config.theme === "dark") {
      document.body.classList.add("dark");
    } else if (config.theme === "light") {
      document.body.classList.add("light");
    }

    const metaDescriptionDark = document.querySelector(
      'meta[name="theme-color"][media]',
    );
    const metaDescriptionLight = document.querySelector(
      'meta[name="theme-color"]:not([media])',
    );

    if (config.theme === "auto") {
      metaDescriptionDark?.setAttribute("content", "#151515");
      metaDescriptionLight?.setAttribute("content", "#fafafa");
    } else {
      const themeColor = getCSSVar("--themeColor");
      metaDescriptionDark?.setAttribute("content", themeColor);
      metaDescriptionLight?.setAttribute("content", themeColor);
    }
  }, [config.theme]);
}

function useDragSideBar() {
  const limit = (x: number) => Math.min(500, Math.max(220, x));

  const chatStore = useChatStore();
  const startX = useRef(0);
  const startDragWidth = useRef(chatStore.config.sidebarWidth ?? 300);
  const lastUpdateTime = useRef(Date.now());

  const handleMouseMove = useRef((e: MouseEvent) => {
    if (Date.now() < lastUpdateTime.current + 100) {
      return;
    }
    lastUpdateTime.current = Date.now();
    const d = e.clientX - startX.current;
    const nextWidth = limit(startDragWidth.current + d);
    chatStore.updateConfig((config) => (config.sidebarWidth = nextWidth));
  });

  const handleMouseUp = useRef(() => {
    startDragWidth.current = chatStore.config.sidebarWidth ?? 300;
    window.removeEventListener("mousemove", handleMouseMove.current);
    window.removeEventListener("mouseup", handleMouseUp.current);
  });

  const onDragMouseDown = (e: MouseEvent) => {
    startX.current = e.clientX;

    window.addEventListener("mousemove", handleMouseMove.current);
    window.addEventListener("mouseup", handleMouseUp.current);
  };

  useEffect(() => {
    if (isMobileScreen()) {
      return;
    }

    document.documentElement.style.setProperty(
      "--sidebar-width",
      `${limit(chatStore.config.sidebarWidth ?? 300)}px`,
    );
  }, [chatStore.config.sidebarWidth]);

  return {
    onDragMouseDown,
  };
}

const useHasHydrated = () => {
  const [hasHydrated, setHasHydrated] = useState<boolean>(false);

  useEffect(() => {
    setHasHydrated(true);
  }, []);

  return hasHydrated;
};

function _Home() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(false);
  const [createNewSession, currentIndex, removeSession] = useChatStore(
    (state) => [
      state.newSession,
      state.currentSessionIndex,
      state.removeSession,
    ],
  );
  const chatStore = useChatStore();
  const loading = !useHasHydrated();
  const [showSideBar, setShowSideBar] = useState(true);

  // setting
  const [openSettings, setOpenSettings] = useState(false);
  const config = useChatStore((state) => state.config);

  // drag side bar
  const { onDragMouseDown } = useDragSideBar();

  useSwitchTheme();

  if (loading) {
    return <Loading />;
  }

  // login
  const onLogin = () => {
    if (username === "qianshouyisheng" && password === "qianshouyisheng123") {
      setIsLogin(true);
    } else {
      alert("帐号或密码错误");
    }
  };

  return (
    <div
      className={`${
        config.tightBorder && !isMobileScreen()
          ? styles["tight-container"]
          : styles.container
      } ${isLogin && styles["overflow-container"]}`}
    >
      <div
        className={styles.sidebar + ` ${showSideBar && styles["sidebar-show"]}`}
      >
        <Bow />
        <div className={styles["sidebar-header"]}>
          <div className={styles["sidebar-title"]}>幸福大学助教</div>
          <div className={styles["sidebar-sub-title"]}>您的私人 AI 助理</div>
        </div>

        <div
          className={styles["sidebar-body"]}
          onClick={() => {
            setOpenSettings(false);
            setShowSideBar(false);
          }}
        >
          <ChatList />
        </div>

        <div className={styles["sidebar-tail"]}>
          <div className={styles["sidebar-actions"]}>
            <div className={styles["sidebar-action"] + " " + styles.mobile}>
              <IconButton
                icon={<CloseIcon className={styles["window-icon"]} />}
                onClick={chatStore.deleteSession}
              />
            </div>
            <div className={styles["sidebar-action"]}>
              <IconButton
                icon={<SettingsIcon className={styles["window-icon"]} />}
                onClick={() => {
                  setOpenSettings(true);
                  setShowSideBar(false);
                }}
                shadow
              />
            </div>
          </div>
          <div>
            <IconButton
              icon={<AddIcon className={styles["window-icon"]} />}
              text={Locale.Home.NewChat}
              onClick={() => {
                createNewSession();
                setShowSideBar(false);
              }}
              shadow
            />
          </div>
        </div>

        <div
          className={styles["sidebar-drag"]}
          onMouseDown={(e) => onDragMouseDown(e as any)}
        ></div>
      </div>

      <div className={styles["window-content"]}>
        {openSettings ? (
          <Settings
            closeSettings={() => {
              setOpenSettings(false);
              setShowSideBar(true);
            }}
          />
        ) : (
          <Chat
            key="chat"
            showSideBar={() => setShowSideBar(true)}
            sideBarShowing={showSideBar}
          />
        )}
      </div>
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
    </div>
  );
}

export function Home() {
  return (
    <ErrorBoundary>
      <_Home></_Home>
    </ErrorBoundary>
  );
}

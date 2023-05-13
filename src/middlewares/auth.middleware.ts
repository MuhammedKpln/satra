import { INITIAL_STATE, LoginState, useAuthStore } from "@/stores/auth.store";
import { ICookieAuthKeys } from "@/types/auth.types";
import { getCookie } from "@/utils/cookies";
import { redirect } from "react-router-dom";

export const APP_MIDDLEWARE = async () => {
  if (getCookie(ICookieAuthKeys.isAuthenticated) != null) {
    return null;
  }

  //Reset state if cookie does not exists.
  useAuthStore.setState(INITIAL_STATE);

  return redirect("/login");
};

export const LOGIN_PAGE_MIDDLEWARE = async () => {
  const state = useAuthStore.getState();

  if (state.loginState === LoginState.loggedIn) {
    return redirect("/");
  }

  return null;
};

import { useAuthService } from "@/services/auth.service";
import { ICookieAuthKeys } from "@/types/auth.types";
import { eraseCookie, setCookie } from "@/utils/cookies";
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

export enum LoginState {
  none,
  loggedIn,
}

export const INITIAL_STATE = {
  accessToken: undefined,
  isStaff: undefined,
  loginState: LoginState.none,
  username: undefined,
};

interface AuthState {
  loginState: LoginState;
  accessToken?: string;
  isStaff?: boolean;
  username?: string;

  updateState: (state: Omit<AuthState, "updateState" | "logout">) => void;
  logout: () => void;
  login: (username: string, password: string) => Promise<boolean>;
}

export const useAuthStore = create(
  devtools(
    persist<AuthState>(
      (set, _get) => ({
        loginState: LoginState.none,
        updateState: (_state) => set((__state) => _state, true),
        logout: () => {
          eraseCookie(ICookieAuthKeys.isAuthenticated);
          set(INITIAL_STATE);
        },
        login: async (username: string, password: string) => {
          try {
            const response = await useAuthService.login(username, password);

            set({
              isStaff: response.data.is_staff,
              loginState: LoginState.loggedIn,
              accessToken: response.data.access_token,
              username,
            });
            setCookie(ICookieAuthKeys.isAuthenticated, "true", 3);

            return true;
          } catch (error) {
            console.log(error);
            return false;
          }
        },
      }),
      {
        name: ICookieAuthKeys.isAuthenticated,
      },
    ),
  ),
);

export interface ILogin {
  status: boolean;
  access_token: string;
  is_staff?: boolean;
}

export enum ICookieAuthKeys {
  isAuthenticated = "IS_AUTHENTICATED",
  questions = "QUESTIONS",
}

export interface ISystemInfo {
  status: boolean;
  system_off: number;
  user: ISystemOnUser;
}

export interface ISystemOnUser {
  username: string;
  password: string;
}

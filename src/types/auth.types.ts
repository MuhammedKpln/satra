export interface ILogin {
  status: boolean;
  access_token: string;
  is_staff?: boolean;
}

export enum ICookieAuthKeys {
  isAuthenticated = "IS_AUTHENTICATED",
  questions = "QUESTIONS",
}

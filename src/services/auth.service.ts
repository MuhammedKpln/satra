import { AxiosResponse } from "axios";
import { BaseService } from "./base.service";
import { ILogin } from "@/types/auth.types";

class AuthService extends BaseService {
  login(username: string, password: string): Promise<AxiosResponse<ILogin>> {
    return this.post("/login", {
      username,
      password,
    });
  }
}

export const useAuthService = new AuthService();

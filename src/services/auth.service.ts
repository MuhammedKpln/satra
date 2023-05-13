import { ILogin, ISystemInfo } from "@/types/auth.types";
import { AxiosResponse } from "axios";
import { BaseService } from "./base.service";

class AuthService extends BaseService {
  login(username: string, password: string): Promise<AxiosResponse<ILogin>> {
    return this.post("/login", {
      username,
      password,
    });
  }

  fetchSystemStatus(): Promise<AxiosResponse<ISystemInfo>> {
    return this.get<ISystemInfo>("/systeminfo");
  }
}

export const useAuthService = new AuthService();

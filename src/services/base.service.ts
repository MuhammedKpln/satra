import { LoginState, useAuthStore } from "@/stores/auth.store";
import axios, {
  AxiosInstance,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";

export class BaseService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: import.meta.env.VITE_API_URL,
    });

    this.addInterceptor((config) => {
      const authStore = useAuthStore.getState();

      if (authStore.loginState === LoginState.loggedIn) {
        const accessToken = authStore.accessToken;

        config.headers.Authorization = `Bearer ${accessToken}`;

        return config;
      }

      return config;
    });
  }

  protected get<T>(url: string): Promise<AxiosResponse<T>> {
    return this.api.get(url);
  }

  protected post<T>(url: string, data: object): Promise<AxiosResponse<T>> {
    return this.api.post(url, data);
  }

  private addInterceptor(
    interceptor: (
      config: InternalAxiosRequestConfig,
    ) => InternalAxiosRequestConfig,
  ) {
    this.api.interceptors.request.use(interceptor, (err) => console.error(err));
  }
}

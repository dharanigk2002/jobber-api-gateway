import axios from "axios";
import jwt from "jsonwebtoken";

import { config } from "../config.js";

export class AxiosService {
  public axios: ReturnType<typeof axios.create>;

  constructor(baseUrl: string, serviceName: string) {
    this.axios = this.createAxios(baseUrl, serviceName);
  }

  public createAxios(
    baseUrl: string,
    serviceName?: string,
  ): ReturnType<typeof axios.create> {
    let gatewayToken = "";
    if (serviceName)
      gatewayToken = jwt.sign({ id: serviceName }, config.GATEWAY_JWT_TOKEN);

    return axios.create({
      baseURL: baseUrl,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        gatewayToken,
      },
      withCredentials: true,
    });
  }
}

export const axiosTest: AxiosService = new AxiosService(
  `${config.AUTH_BASE_URL}/api/v1/auth`,
  "auth",
);

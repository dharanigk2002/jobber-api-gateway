import "dotenv/config";

export class Config {
  constructor(
    public NODE_ENV = process.env.NODE_ENV || "",
    public JWT_TOKEN = process.env.JWT_TOKEN || "",
    public GATEWAY_JWT_TOKEN = process.env.GATEWAY_JWT_TOKEN || "",
    public SECRET_KEY_ONE = process.env.SECRET_KEY_ONE || "",
    public SECRET_KEY_TWO = process.env.SECRET_KEY_TWO || "",
    public CLIENT_URL = process.env.CLIENT_URL || "",
    public AUTH_BASE_URL = process.env.AUTH_BASE_URL || "",
    public USERS_BASE_URL = process.env.USERS_BASE_URL || "",
    public GIG_BASE_URL = process.env.GIG_BASE_URL || "",
    public MESSAGE_BASE_URL = process.env.MESSAGE_BASE_URL || "",
    public ORDER_BASE_URL = process.env.ORDER_BASE_URL || "",
    public REVIEW_BASE_URL = process.env.REVIEW_BASE_URL || "",
    public REDIS_HOST = process.env.REDIS_HOST || "",
    public ELASTIC_SEARCH_URL = process.env.ELASTIC_SEARCH_URL || "",
    public ELASTIC_APM_SERVER_URL = process.env.ELASTIC_APM_SERVER_URL || "",
    public ELASTIC_APM_SECRET_TOKEN = process.env.ELASTIC_APM_SECRET_TOKEN ||
      "",
  ) {}
}

export const config: Config = new Config();

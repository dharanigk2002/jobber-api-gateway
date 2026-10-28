import {
  type Application,
  type NextFunction,
  type Request,
  type Response,
} from "express";
import { type Logger } from "winston";
import {
  CustomError,
  winstonLogger,
  type IErrorResponse,
} from "@dharanigk2002/jobber-shared";
import cookieSession from "cookie-session";
import hpp from "hpp";
import helmet from "helmet";
import compression from "compression";
import cors from "cors";
import express from "express";
import { StatusCodes } from "http-status-codes";
import http from "http";
import { config } from "./config.js";
import { elasticsearch } from "./elasticsearch.js";
import { appRoutes } from "./routes.js";

export class GatewayServer {
  private readonly SERVER_PORT = 4000;
  private readonly log: Logger = winstonLogger(
    config.ELASTIC_SEARCH_URL,
    "api-gateway-service",
    "debug",
  );

  constructor(private app: Application) {}

  public start(): void {
    this.securityMiddleware(this.app);
    this.standardMiddleware(this.app);
    this.routesMiddleware(this.app);
    this.startElasticSearch();
    this.errorHandler(this.app);
    this.startServer(this.app);
  }

  private securityMiddleware(app: Application): void {
    app.set("trust proxy", 1);
    app.use(
      cookieSession({
        name: "session",
        keys: [config.SECRET_KEY_ONE, config.SECRET_KEY_TWO],
        maxAge: 7 * 24 * 60 * 60 * 1000,
        secure: config.NODE_ENV !== "development",
        httpOnly: true,
        // sameSite: 'none'
      }),
    );
    app.use(hpp());
    app.use(helmet());
    app.use(
      cors({
        origin: config.CLIENT_URL,
        credentials: true,
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
      }),
    );
  }

  private standardMiddleware(app: Application): void {
    app.use(compression());
    app.use(express.json({ limit: "200mb" }));
    app.use(express.urlencoded({ limit: "200mb", extended: true }));
  }

  private routesMiddleware(app: Application): void {
    appRoutes(app);
  }

  private startElasticSearch(): void {
    elasticsearch.checkConnection();
  }

  private errorHandler(app: Application): void {
    app.use((req: Request, res: Response, next: NextFunction) => {
      const fullUrl = `${req.protocol}://${req.get("host")}${req.originalUrl}`;
      this.log.error(`${fullUrl} endpoint does not exist`);
      return res.status(StatusCodes.NOT_FOUND).json({
        message: "The endpoint called does not exist.",
      });
    });

    app.use(
      (
        err: IErrorResponse,
        _req: Request,
        res: Response,
        next: NextFunction,
      ) => {
        this.log.error(`gateway-service ${err.comingFrom}`, err);
        if (err instanceof CustomError) {
          return res.status(err.statusCode).json(err.serializeErrors());
        }
        return res
          .status(StatusCodes.INTERNAL_SERVER_ERROR)
          .json({ message: err.message || "Something went wrong" });
      },
    );
  }

  private async startServer(app: Application): Promise<void> {
    try {
      const httpServer: http.Server = http.createServer(app);
      this.startHttpServer(httpServer);
    } catch (error) {
      this.log.error("gateway-service startServer() error method:", error);
    }
  }

  private async startHttpServer(server: http.Server) {
    try {
      this.log.info(
        `Gateway server has started with process id ${process.pid}`,
      );
      server.listen(this.SERVER_PORT, () => {
        this.log.info(`Gateway server is running on port ${this.SERVER_PORT}`);
      });
    } catch (error) {
      this.log.error("gateway-service startServer() error method:", error);
    }
  }
}

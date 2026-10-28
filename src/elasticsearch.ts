import { winstonLogger } from "@dharanigk2002/jobber-shared";
import type { Logger } from "winston";
import { config } from "./config.js";
import { Client } from "@elastic/elasticsearch";
import type { ClusterHealthResponse } from "@elastic/elasticsearch/lib/api/types";

class ElasticSearch {
  private log: Logger = winstonLogger(
    config.ELASTIC_SEARCH_URL,
    "api-gateway-elastic-connection",
    "debug",
  );
  private esClient: Client;

  constructor() {
    this.esClient = new Client({
      node: config.ELASTIC_SEARCH_URL,
      maxRetries: 2,
      requestTimeout: 10000,
    });
  }

  public async checkConnection(): Promise<void> {
    let isConnected = false;
    while (!isConnected) {
      this.log.info("Gateway service connecting to elastic search");
      try {
        const health: ClusterHealthResponse =
          await this.esClient.cluster.health();
        this.log.info(
          "Gateway service ElasticSearch health status - " + health.status,
        );
        isConnected = true;
      } catch (error) {
        this.log.error(
          "Connection to ElasticSearch failed, Retrying...",
          error,
        );
        this.log.error(
          "Gateway service checkConnection() method error:",
          error,
        );
      }
    }
  }
}

export const elasticsearch: ElasticSearch = new ElasticSearch();

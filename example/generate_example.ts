// Run this file to generate the API and TRPC client

import { generateApiClient } from "../src/index";
import { generateTrpcClient } from "../src/trpc-client-generator";

generateApiClient({
  apiName: "LajitApi",
  generatedDir: "./example/__generated__",
  swaggerUrl: "https://back.lajit.com/swagger/doc.json",
});

generateTrpcClient("./example");

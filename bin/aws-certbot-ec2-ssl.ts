#!/usr/bin/env node
import * as cdk from "aws-cdk-lib";
import { AwsCertbotEc2SslStack } from "../lib/stack/aws-certbot-ec2-ssl-stack";
import { devParameter } from "../parameter";

const app = new cdk.App();
const tokyo = new AwsCertbotEc2SslStack(app, "AwsCertbotEc2SslStack", {
  ...devParameter,
  description: "Tokyo Stack.",
});
cdk.Tags.of(tokyo).add("Env", devParameter.EnvName);

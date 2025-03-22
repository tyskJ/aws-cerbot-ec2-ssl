#!/usr/bin/env node
import * as cdk from "aws-cdk-lib";
import { AwsCerbotEc2SslStack } from "../lib/stack/aws-cerbot-ec2-ssl-stack";
import { devParameter } from "../parameter";

const app = new cdk.App();
const tokyo = new AwsCerbotEc2SslStack(app, "AwsCerbotEc2SslStack", {
  ...devParameter,
  description: "Tokyo Stack.",
});
cdk.Tags.of(tokyo).add("Env", devParameter.EnvName);

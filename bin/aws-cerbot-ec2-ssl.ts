#!/usr/bin/env node
import * as cdk from "aws-cdk-lib";
import { AwsCerbotEc2SslStack } from "../lib/aws-cerbot-ec2-ssl-stack";

const app = new cdk.App();
new AwsCerbotEc2SslStack(app, "AwsCerbotEc2SslStack", {});

/*
╔════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════╗
║ Cerbot EC2 SSL Stack - Cloud Development Kit ec2.ts                                                                                                ║
╠════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════╣
║ This construct creates an L2 Construct EC2 and IAM Role.                                                                                           ║
╚════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════╝
*/
import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as ec2 from "aws-cdk-lib/aws-ec2";

export interface IEc2Props extends cdk.StackProps {
  vpc: ec2.Vpc;
}

export class Ec2Construct extends Construct {
  constructor(scope: Construct, id: string, props: IEc2Props) {
    super(scope, id);
  }
}

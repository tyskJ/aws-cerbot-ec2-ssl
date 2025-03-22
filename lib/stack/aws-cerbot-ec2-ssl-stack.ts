import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import { IParameterProps } from "../../parameter";
import { NetworkConstruct } from "../construct/nw";
import { Ec2Construct } from "../construct/ec2";

export class AwsCerbotEc2SslStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: IParameterProps) {
    super(scope, id, props);

    // Pseudo Parameters
    const pseudo = new cdk.ScopedAws(this);

    // Network
    const network = new NetworkConstruct(this, "Network", {
      pseudo: pseudo,
      vpcInfo: props.vpc,
    });

    // EC2
    const ec2 = new Ec2Construct(this, "Ec2", {
      vpc: network.vpc,
    });
  }
}

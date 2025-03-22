import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import { IParameterProps } from "../../parameter";
import { NetworkConstruct } from "../construct/nw";

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
  }
}

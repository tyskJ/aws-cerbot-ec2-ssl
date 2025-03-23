import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import { IParameterProps } from "../../parameter";
import { NetworkConstruct } from "../construct/nw";
import { Ec2Construct } from "../construct/ec2";
import { Route53Construct } from "../construct/route53";

export class AwsCertbotEc2SslStack extends cdk.Stack {
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
      pseudo: pseudo,
      vpc: network.vpc,
      keyPairInfo: props.keyPair,
      roleInfo: props.ec2Role,
    });

    // Record Set
    const r53 = new Route53Construct(this, "RecordSet", {
      eip: ec2.elasticIp,
      hosted_zone_id: this.node.tryGetContext("hosted_zone_id"),
      zone_apex_name: this.node.tryGetContext("zone_apex_name"),
      fqdn: this.node.tryGetContext("fqdn"),
    });
  }
}

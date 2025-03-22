/*
╔════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════╗
║ Certbot EC2 SSL Stack - Cloud Development Kit route53.ts                                                                                           ║
╠════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════╣
║ This construct creates an RecordSet.                                                                                                               ║
╚════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════╝
*/
import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as ec2 from "aws-cdk-lib/aws-ec2";
import * as route53 from "aws-cdk-lib/aws-route53";

export interface IRoute53Props extends cdk.StackProps {
  eip: ec2.CfnEIP;
  hosted_zone_id: string;
  zone_apnex_name: string;
  fqdn: string;
}

export class Route53Construct extends Construct {
  constructor(scope: Construct, id: string, props: IRoute53Props) {
    super(scope, id);
    // import hosted zone
    const hosted_zone = route53.HostedZone.fromHostedZoneAttributes(
      this,
      "Zone." + props.zone_apnex_name,
      { hostedZoneId: props.hosted_zone_id, zoneName: props.zone_apnex_name }
    );

    // A Record
    new route53.ARecord(this, "ARecord", {
      zone: hosted_zone,
      recordName: props.fqdn,
      target: route53.RecordTarget.fromIpAddresses(props.eip.attrPublicIp),
    });
  }
}

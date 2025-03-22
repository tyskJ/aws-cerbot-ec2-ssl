/*
╔════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════╗
║ Certbot EC2 SSL Stack - Cloud Development Kit ec2.ts                                                                                               ║
╠════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════╣
║ This construct creates an L2 Construct EC2 and IAM Role.                                                                                           ║
╚════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════╝
*/
import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as ec2 from "aws-cdk-lib/aws-ec2";
import * as iam from "aws-cdk-lib/aws-iam";
import { roleProps } from "../../parameter";
import { keypairProps } from "../../parameter";

export interface IEc2Props extends cdk.StackProps {
  pseudo: cdk.ScopedAws;
  vpc: ec2.Vpc;
  keyPairInfo: keypairProps;
  roleInfo: roleProps;
  managedPolicy?: iam.ManagedPolicy[];
}

export class Ec2Construct extends Construct {
  constructor(scope: Construct, id: string, props: IEc2Props) {
    super(scope, id);

    // IAM Role
    let iamRole: iam.Role;
    if (props.managedPolicy) {
      iamRole = this.createIamRole(this, props.roleInfo, props.managedPolicy);
    } else {
      iamRole = this.createIamRole(this, props.roleInfo);
    }

    // KeyPair
    const cfnkeyPair = new ec2.CfnKeyPair(this, props.keyPairInfo.id, {
      keyName: props.keyPairInfo.keyName,
      keyType: props.keyPairInfo.keyType,
      keyFormat: props.keyPairInfo.keyFormat,
    });
    if (props.keyPairInfo.removalPolicy) {
      cfnkeyPair.applyRemovalPolicy(cdk.RemovalPolicy.DESTROY);
    }
    for (const tag of props.keyPairInfo.tags) {
      cdk.Tags.of(cfnkeyPair).add(tag.key, tag.value);
    }
    new cdk.CfnOutput(this, "Get" + cfnkeyPair.keyName + "Command", {
      value: `aws ssm get-parameter --name "/ec2/keypair/${cfnkeyPair.attrKeyPairId}:1" --region ${props.pseudo.region} --with-decryption --query Parameter.Value --output text --profile admin > keypair.pem && chmod 400 keypair.pem`,
    });
    //// Escape hatch
    const keyPair = ec2.KeyPair.fromKeyPairName(
      this,
      "L2KeyPair",
      cfnkeyPair.keyName
    );

    // EC2 Instance
    const instance = new ec2.Instance(this, "Ec2Instance", {
      vpc: props.vpc,
      instanceType: ec2.InstanceType.of(
        ec2.InstanceClass.T3,
        ec2.InstanceSize.LARGE
      ),
      machineImage: ec2.MachineImage.latestAmazonLinux2023(),
      allowAllOutbound: true,
      disableApiTermination: false,
      ebsOptimized: true,
      instanceName: "ec2-instance",
      keyPair: keyPair,
      role: iamRole,
      vpcSubnets: {
        subnetType: ec2.SubnetType.PUBLIC,
      },
      blockDevices: [
        {
          deviceName: "/dev/xvda",
          volume: ec2.BlockDeviceVolume.ebs(30, {
            volumeType: ec2.EbsDeviceVolumeType.GP3,
            deleteOnTermination: true,
            encrypted: true,
          }),
        },
      ],
    });
    // Add Sg Inbound
    instance.connections.allowFrom(
      ec2.Peer.anyIpv4(),
      ec2.Port.HTTP,
      "Allow Inbound HTTP."
    );
    instance.connections.allowFrom(
      ec2.Peer.anyIpv4(),
      ec2.Port.HTTPS,
      "Allow Inbound HTTPS."
    );
  }
  /*
  ╔════════════════════════════════════════════════════════════════════════════════════════════════════════════════╗
  ║ Method (private)                                                                                               ║
  ╠═══════════════════════════╤═════════════════════════╤══════════════════════════════════════════════════════════╣
  ║ createIamRole             │ iam.Role                │ Method to create IAM Role for L2 constructs.             ║
  ╚═══════════════════════════╧═════════════════════════╧══════════════════════════════════════════════════════════╝
  */
  private createIamRole(
    scope: Construct,
    roleInfo: roleProps,
    managedPolicy?: iam.ManagedPolicy[]
  ): iam.Role {
    const assumedBy = Array.isArray(roleInfo.assumed)
      ? new iam.CompositePrincipal(
          ...roleInfo.assumed.map(
            (service) => new iam.ServicePrincipal(service)
          )
        )
      : new iam.ServicePrincipal(roleInfo.assumed);
    const iamRole = new iam.Role(scope, roleInfo.id, {
      roleName: roleInfo.roleName,
      description: roleInfo.description,
      assumedBy: assumedBy,
    });
    if (roleInfo.awsManagedPolicyAdd && roleInfo.awsManagedPolicyName) {
      for (const amp of roleInfo.awsManagedPolicyName) {
        iamRole.addManagedPolicy(
          iam.ManagedPolicy.fromAwsManagedPolicyName(amp.policyName)
        );
      }
    }
    if (roleInfo.customManagedPolicyAdd && managedPolicy) {
      for (const cmp of managedPolicy) {
        iamRole.addManagedPolicy(cmp);
      }
    }
    for (const tag of roleInfo.tags) {
      cdk.Tags.of(iamRole).add(tag.key, tag.value);
    }
    return iamRole;
  }
}

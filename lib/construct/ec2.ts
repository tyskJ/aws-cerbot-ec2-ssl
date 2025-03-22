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
import * as iam from "aws-cdk-lib/aws-iam";
import { roleProps } from "../../parameter";

export interface IEc2Props extends cdk.StackProps {
  vpc: ec2.Vpc;
  roleInfo: roleProps;
  managedPolicy?: iam.ManagedPolicy[];
}

export class Ec2Construct extends Construct {
  constructor(scope: Construct, id: string, props: IEc2Props) {
    super(scope, id);

    // IAM Role
    const iamRole = this.createIamRole(this, props.roleInfo);
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

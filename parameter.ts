/*
╔════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════╗
║ Cerbot EC2 SSL Stack - Cloud Development Kit parameter.ts                                                                                          ║
╠════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════╣
║ This file that defines the parameters for each resource.                                                                                           ║
╚════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════╝
*/
import * as cdk from "aws-cdk-lib";

/*
╔════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════╗
║ type (Define your own type)                                                                                                                        ║
╠═════════════════╤══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════╣
║ azInfo          │ Type defined Availavility Zone.                                                                                                  ║
║ subnetType      │ Type defined Subnet Type.                                                                                                        ║
║ vpcProps        │ Type defined L2 Construct vpc configuration Properties.                                                                          ║
║ roleProps       │ Type defined L2 Construct IAM Role Properties.                                                                                   ║
╚═════════════════╧══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════╝
*/
export type azInfo = "a" | "c" | "d";

export type subnetType =
  | "PUBLIC"
  | "PRIVATE_ISOLATED"
  | "PRIVATE_WITH_EGRESS"
  | "PRIVATE_WITH_NAT";

export type vpcProps = {
  id: string;
  name: string;
  vpcCidr: string;
  createAZs: azInfo[];
  dnsHostFlag: boolean;
  dnsSupportFlag: boolean;
  createIgwFlag: boolean;
  createNgwNumber: number;
  notCreateDefaultSgFlag: boolean;
  subnetConfig: {
    name: string;
    type: subnetType;
    cidrMask: number;
    mapPublicIpFlag: boolean;
  }[];
};

export type roleProps = {
  id: string;
  roleName: string;
  assumed: string | string[];
  description: string;
  customManagedPolicyAdd: boolean;
  awsManagedPolicyAdd: boolean;
  awsManagedPolicyName?: { policyName: string }[];
  tags: { key: string; value: string }[];
};

/*
╔════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════╗
║ Interface IParameterProps                                                                                                                          ║
╚════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════╝
*/
export interface IParameterProps extends cdk.StackProps {
  EnvName: string;
  vpc: vpcProps;
  ec2Role: roleProps;
}

/*
╔════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════╗
║ devParameter                                                                                                                                       ║
╠═════════════════╤══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════╣
║ EnvName         │ common tag value.                                                                                                                ║
║ vpc             │ VPC.                                                                                                                             ║
║ ec2Role         │ EC2 Role.                                                                                                                        ║
╚═════════════════╧══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════╝
*/
export const devParameter: IParameterProps = {
  EnvName: "tokyo",

  vpc: {
    id: "Vpc",
    name: "cerbot-ec2-ssl-vpc",
    vpcCidr: "10.0.0.0/16",
    createAZs: ["a"],
    dnsHostFlag: true,
    dnsSupportFlag: true,
    createIgwFlag: true,
    createNgwNumber: 0,
    notCreateDefaultSgFlag: false,
    subnetConfig: [
      {
        name: "public",
        type: "PUBLIC",
        cidrMask: 24,
        mapPublicIpFlag: true,
      },
    ],
  },

  ec2Role: {
    id: "Ec2Role",
    roleName: "iam-role-ec2",
    assumed: "ec2.amazonaws.com",
    description: "EC2 Role",
    customManagedPolicyAdd: false,
    awsManagedPolicyAdd: true,
    awsManagedPolicyName: [
      {
        policyName: "AmazonSSMManagedInstanceCore",
      },
    ],
    tags: [{ key: "Name", value: "iam-role-ec2" }],
  },
};

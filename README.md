# EFS for Lambda - Example SAM applications

This repo contains AWS SAM templates that deploy serverless applications. The applications illustrate different ways to use EFS for Lambda.

For full details on how this works:
- Read the Compute Blog post at: https://aws.amazon.com/blogs/compute/using-amazon-efs-for-aws-lambda-in-your-serverless-applications/.
- Watch the [YouTube walkthrough](https://www.youtube.com/watch?v=vHwNh9JtPwE).

Important: this application uses various AWS services and there are costs associated with these services after the Free Tier usage - please see the [AWS Pricing page](https://aws.amazon.com/pricing/) for details. You are responsible for any AWS costs incurred. No warranty is implied in these examples.

```bash
.
├── README.MD                   <-- This instructions file
├── 1-setup                     <-- Creates VPC, subnets and EFS file system
│   └── create-efs-cfn.yml      <-- CloudFormation template
├── 2-lambda-template           <-- "Hello World" example to use VPC and EFS
│   └── package.json            <-- NodeJS dependencies and scripts
│   └── template.yaml           <-- SAM template
├── 3-largefiles                <-- Processes a user-provided MP4 video into screenshots
│   └── package.json            <-- NodeJS dependencies and scripts
│   └── template.yaml           <-- SAM template
├── 4-zip                       <-- Zips many files into a zip archive
│   └── package.json            <-- NodeJS dependencies and scripts
│   └── template.yaml           <-- SAM template
├── 5-unzip                     <-- Unzips archive into specified directory
│   └── package.json            <-- NodeJS dependencies and scripts
│   └── template.yaml           <-- SAM template
```

## Requirements

* AWS CLI already configured with Administrator permission
* [NodeJS 12.x installed](https://nodejs.org/en/download/)
* An MP4 video for example #3 - video.mp4 is not provided in this repo.

## Installation Instructions

1. [Create an AWS account](https://portal.aws.amazon.com/gp/aws/developer/registration/index.html) if you do not already have one and login.

1. Clone the repo onto your local development machine using `git clone`.

## Setup

To create a VPC, subnets and EFS file system, use the `create-efs-cfn.yml` example in the `setup` directory. To deploy this template, run in a terminal:

```
aws cloudformation create-stack --stack-name create-efs --template-body file://./create-efs-cfn.yml
```
Note that the `template-body` parameter must include the `file://` prefix when run locally.

## Deploying examples

1. From the command line, change directory into the application example required, then run:
```
sam build
sam deploy --guided
```
Follow the prompts in the deploy process to set the stack name, EFS mount path, access point ARN, AWS Region, VPC and subnet IDs.

You can find VPC settings by executing the following CLI command:
```
aws ec2 describe-vpcs
```

You can find a list of subnet IDs for your account by executing:
```
aws ec2 describe-subnets --query 'Subnets[*].{Id: SubnetId}' --output text
```

You can find a list of access point ARNs for your account by executing:
```
aws efs describe-access-points
```

## How it works

* The deployed Lambda functions are configured with your VPC and subnet settings.
* The Lambda functions mount the EFS file system you specify. The operations in the examples use EFS to complete their tasks.

## Questions?

Please contact [@jbesw](https://twitter.com/jbesw) or raise an issue on this repo.

==============================================

Copyright 2020 Amazon.com, Inc. or its affiliates. All Rights Reserved.

SPDX-License-Identifier: MIT-0

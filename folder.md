# フォルダ構成

- フォルダ構成は以下の通り

```
.
|-- bin
|   `-- aws-certbot-ec2-ssl.ts              CDK App定義ファイル
|-- lib
|   |-- construct                           コンストラクト
|   |   |-- ec2.ts                            EC2
|   |   |-- nw.ts                             Network
|   |   `-- route53.ts                        RecordSet
|   `-- stack
|       `-- aws-certbot-ec2-ssl-stack.ts    CDK Stack定義ファイル
`-- parameter.ts                            環境リソース設定値定義ファイル
```

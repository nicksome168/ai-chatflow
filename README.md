# ai-chatflow

Final project for CS-GY 9223 Cloud Computing course at NYU.

# How to dev

## prerequisite

1. Install [remote container](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers) extension on your VS code. Open  this repository folder in VS Code and start the dev environment in container. To add package dependencies, please modify in `.devcontainer` folder.

## Documentation
### Setup and use EKS cluster
Switch AWS profile if needed
```
export AWS_DEFAULT_PROFILE=<user>
```

Check if you are using the right AWS profile
```
aws sts get-caller-identity
```

Apply the terraform configuration in `terraform` and it will create a eks cluster and a node group
```
cd terraform
terraform init
terraform apply
```

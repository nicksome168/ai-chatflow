# ai-chatflow

Final project for CS-GY 9223 Cloud Computing course at NYU.

# How to dev

## prerequisite

1. Install [remote container](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers) extension on your VS code. Open  this repository folder in VS Code and start the dev environment in container. To add package dependencies, please modify in `.devcontainer` folder.

## Documentation
### Setup Infra
Switch AWS profile if needed
```
export AWS_DEFAULT_PROFILE=<user>
export AWS_DEFAULT_REGION=us-east-1
```

Check if you are using the right AWS profile
```
aws sts get-caller-identity
```

Apply the terraform configuration in `terraform` and it will create a eks cluster and a node group
```
cd terraform
terraform init
terraform apply -var-file ../variables.tfvars

```
### Setup EKS cluster
Setup kubeconfig for EKS cluster
```
aws eks --region us-east-1 update-kubeconfig --name demo
```

Check if the cluster is working
```
kubectl get nodes
```

### Deploy on EKS
If you want your pod to access aws resources, you need to create a service account and associate it with a IAM role. The role and the OICD provider association is taken care by my terraform. All you need is to add the desired IAM policies in `terraform/eks/11-sa-iam.tf`. The terraform will create a AWS IAM role. To associate the IAM role with a service account, add the following annotation to the service account yaml. You can find the role arn in your aws portal.
```bash
eks.amazonaws.com/role-arn: arn:aws:iam::<YOUR_ACCOUNT_ID>:role/eks-sa
```
### Cleanup
delete all resources on eks cluster
```
kubectl delete -f k8s/*.yaml
```
uninstall eks cluster
```
cd terraform
terraform destroy -var-file ../variables.tfvars
```

### Architecture Diagram
![image](https://github.com/nicksome168/ai-chatflow/assets/46374452/55c46cf3-fd7c-4b01-b0a2-5ff6cd7b017f)

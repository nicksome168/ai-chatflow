data "aws_iam_policy_document" "eks_sa" {
  statement {
    actions = ["sts:AssumeRoleWithWebIdentity"]
    effect  = "Allow"

    condition {
      test     = "StringEquals"
      variable = "${replace(aws_iam_openid_connect_provider.eks.url, "https://", "")}:sub"
      values   = ["system:serviceaccount:default:backend-sa"]
    }

    principals {
      identifiers = [aws_iam_openid_connect_provider.eks.arn]
      type        = "Federated"
    }
  }
}

resource "aws_iam_role" "eks_sa" {
  assume_role_policy = data.aws_iam_policy_document.eks_sa.json
  name               = "eks-sa"
}

resource "aws_iam_role_policy_attachment" "eks_sa_attach" {
  role = aws_iam_role.eks_sa.name
  for_each = toset([
    "arn:aws:iam::aws:policy/AmazonDynamoDBFullAccess",
  ])
  policy_arn = each.value
}

variable "aws_region" {
  description = "AWS region"
  default     = "us-east-1"
}

variable "key_name" {
  description = "Name of the AWS key pair to use for SSH access"
  type        = string
}

variable "allowed_ssh_ip" {
  description = "Your public IP in CIDR format (e.g. 1.2.3.4/32)"
  type        = string
}

variable "domain" {
  description = "Primary domain name"
  default     = "luiseduardo.dev.br"
}

variable "project" {
  description = "Project tag applied to all resources"
  default     = "portfolio"
}

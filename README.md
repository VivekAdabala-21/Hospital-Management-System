
# Hospital Management System

A Java-based Hospital Management System using MySQL, Docker, and DevOps deployment tools.

## Project Overview

This project demonstrates how to package and deploy a Java application with a MySQL database. The repository is being prepared for deployment on AWS EC2, with CI/CD and Kubernetes configuration.

The current application connects to MySQL and displays doctor and patient data. It is a console-based Java application, not a web application.

## Technology Stack

- Java 21
- Maven
- MySQL 8.4
- Docker
- Docker Compose
- Jenkins
- Terraform
- Kubernetes
- AWS EC2

## Repository Structure

```text
.
├── src/
├── pom.xml
├── Dockerfile
├── docker-compose.yml
├── .dockerignore
├── .env.example
├── Jenkinsfile
├── k8s/
├── terraform/
├── scripts/
└── README.md
```

Additional monitoring, Helm, and Argo CD configuration may be added as the deployment evolves.

## Prerequisites

For local development:

- Java Development Kit 21
- Maven
- Docker Engine or Docker Desktop with Docker Compose

For AWS deployment:

- An AWS account with appropriate permissions
- An EC2 instance in the selected AWS region
- Docker Hub credentials if using a private image repository
- SSH access restricted to your own public IP

## Configure Environment Variables

Create your local environment file from the example:

```bash
cp .env.example .env
```

Edit `.env` and set strong database credentials. Do not commit `.env` or publish real credentials.

## Build the Java Application

```bash
mvn clean package
```

Expected JAR:

```text
target/hospital-management-system-1.0.0.jar
```

## Build the Docker Image

```bash
docker build -t hospital-management-system:latest .
```

## Run with Docker Compose

Review `docker-compose.yml` and `.env` before starting the services.

```bash
docker compose config --quiet
docker compose up -d --build
```

Check service status:

```bash
docker compose ps
```

View application logs:

```bash
docker compose logs -f hospital-app
```

## AWS EC2 Deployment

The intended workflow is:

1. Prepare and review the deployment configuration.
2. Push the completed repository to GitHub.
3. Provision EC2 infrastructure using Terraform after reviewing cost and security settings.
4. Configure Docker and the required deployment tools on EC2.
5. Clone the repository on EC2.
6. Build and deploy the application using the chosen deployment method.
7. Verify application logs and MySQL connectivity.

Terraform files describe infrastructure; they do not install or configure all deployment tools automatically.

## Security Notes

- Never commit `.env`, Terraform state, private keys, or access tokens.
- Use Jenkins credentials for CI/CD secrets.
- Restrict SSH access to trusted IP addresses.
- Use Kubernetes Secrets or an appropriate secret manager for database credentials.
- Review AWS security groups and expected costs before launching resources.

## Current Limitations

- The application is console-based and does not expose an HTTP endpoint.
- A browser-accessible interface would require a web API and frontend.
- Database schema initialization must be configured before a fresh database can serve application queries.
- Kubernetes manifests and CI/CD stages must be validated against the final EC2 deployment architecture before use.

## License

Add a license if you intend to distribute this project publicly.
```

Save with **Ctrl+O**, Enter, then **Ctrl+X**.

This documentation describes the current application honestly and the intended deployment workflow without claiming that AWS deployment is already complete.

When you're done, tell me **done**. Next, we'll prepare the monitoring directory structure and then review the files together before pushing anything to GitHub.

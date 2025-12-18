# CI/CD & Deployment Helper - Instructions

This repository was auto-inspected and prepared with helper files for the upcoming CI/CD sessions.

## What was added
- `.env.example` - template for environment variables (fill in real values on the server or CI only).
- `Dockerfile` - general-purpose Dockerfile based on project type (nodejs).
- `.dockerignore` - common ignores for builds.
- `Jenkinsfile` - declarative pipeline. Update credentials, docker hub repo, and sonar/kube names as needed.
- `sonar-project.properties` - minimal config for SonarQube.
- `k8s/deployment.yaml` and `k8s/service` - basic Kubernetes manifests.
- `scripts/build_and_push.sh` - helper to build & push image locally.
- `CICD_PREP_CHECKLIST.md` - checklist for you and the team.

## How to test locally (recommended before class)
1. Build Docker image locally:
   ```bash
   docker build -t my-app:local .
   docker run -p 3000:3000 --env-file .env.example my-app:local
   ```
2. Push image to Docker Hub (replace image name):
   ```bash
   ./scripts/build_and_push.sh your-dockerhub-username/your-repo:tag
   ```
3. Test Kubernetes manifest (use minikube or kind):
   ```bash
   kubectl apply -f k8s/deployment.yaml
   kubectl get pods
   ```
4. SonarQube: run `sonar-scanner` on project root (or configure Jenkins with SonarQube server).

## Notes & Next Steps for class
- DO NOT commit secrets (.env) to Git. Use Jenkins credentials or Kubernetes Secrets in production.
- Update `Jenkinsfile` to match your Jenkins credential IDs and repo names.
- If using Nexus for private registry, configure repository and update `Jenkinsfile` to push there instead of Docker Hub.

# CI/CD Pre-deployment Checklist (auto-generated)

Project detected type: **nodejs**

- [ ] Project builds locally.
- [ ] All runtime dependencies listed (package.json / requirements.txt / pom.xml).
- [ ] .env.example added (DO NOT commit real .env). Path: .env.example
- [ ] Dockerfile present at project root.
- [ ] .dockerignore present.
- [ ] Jenkinsfile present (for pipeline).
- [ ] sonar-project.properties present.
- [ ] Kubernetes manifests present in /k8s (deployment.yaml + service).
- [ ] scripts/build_and_push.sh present for manual testing.
- [ ] Ensure Docker Hub credentials configured in Jenkins as 'dockerhub-creds' or update Jenkinsfile.
- [ ] Add SonarQube server with name 'sonar-server' in Jenkins global configuration or update Jenkinsfile.
- [ ] Add Kubernetes credentials and configure kubectl on Jenkins agent (or use a separate deploy job).
- [ ] Check for hard-coded secrets and remove them (use env vars).
- [ ] Run the app inside Docker locally to ensure no hidden local dependencies.

pipeline {
    agent {
        kubernetes {
            yaml '''
apiVersion: v1
kind: Pod
spec:
  containers:

  - name: dind
    image: docker:dind
    securityContext:
      privileged: true
    env:
    - name: DOCKER_TLS_CERTDIR
      value: ""

  - name: kubectl
    image: bitnami/kubectl:latest
    command: ["cat"]
    tty: true

  - name: sonar-scanner
    image: sonarsource/sonar-scanner-cli
    command: ["cat"]
    tty: true
'''
        }
    }

    environment {
        REGISTRY = "nexus-service-for-docker-hosted-registry.nexus.svc.cluster.local:8085"
        FRONTEND_IMAGE = "interview-frontend"
        PROJECT_NAMESPACE = "2401132_RuchitaMule"
    }

    stages {

        stage('Checkout Code') {
            steps {
                checkout scm
            }
        }

        stage('Build Backend Image') {
            steps {
                echo "......................................................"
            }
        }

        stage('Build Frontend Image') {
            steps {
                container('dind') {
                    sh '''
                        echo "Starting Docker daemon..."
                        dockerd > /tmp/dockerd.log 2>&1 &

                        echo "Waiting for Docker daemon..."
                        sleep 15

                        docker info

                        echo "Building frontend image..."
                        docker build -t ${FRONTEND_IMAGE}:latest ./Frontend
                        docker images
                    '''
                }
            }
        }

        stage('SonarQube Analysis') {
            steps {
                container('sonar-scanner') {
                    withCredentials([string(credentialsId: 'SONAR_TOKEN', variable: 'SONAR_TOKEN')]) {
                        sh '''
                            sonar-scanner \
                              -Dsonar.projectKey=InterviewPrepGuide-Frontend \
                              -Dsonar.host.url=http://my-sonarqube-sonarqube.sonarqube.svc.cluster.local:9000 \
                              -Dsonar.login=$SONAR_TOKEN \
                              -Dsonar.sources=frontend \
                              -Dsonar.exclusions=**/node_modules/**,**/build/**
                        '''
                    }
                }
            }
        }

        stage('Login to Nexus') {
            steps {
                container('dind') {
                    sh '''
                        echo "Logging into Nexus..."
                        docker login ${REGISTRY} -u admin -p Changeme@2025
                    '''
                }
            }
        }

        stage('Tag & Push Frontend Image') {
            steps {
                container('dind') {
                    sh '''
                        echo "Tagging frontend image..."
                        docker tag ${FRONTEND_IMAGE}:latest ${REGISTRY}/${FRONTEND_IMAGE}:latest

                        echo "Pushing frontend image..."
                        docker push ${REGISTRY}/${FRONTEND_IMAGE}:latest
                    '''
                }
            }
        }

        stage('Deploy Frontend to Kubernetes') {
            steps {
                container('kubectl') {
                    sh '''
                        echo "Deploying frontend to Kubernetes..."
                        kubectl apply -f k8s/frontend-deployment.yaml
                    '''
                }
            }
        }
    }
}

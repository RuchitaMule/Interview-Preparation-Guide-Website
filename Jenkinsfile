pipeline {
    agent {
        kubernetes {
            yaml '''
apiVersion: v1
kind: Pod
spec:
  containers:
  - name: dind
    image: docker:24-dind
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
    }

    stages {

        stage('Checkout Code') {
            steps {
                checkout scm
            }
        }

        stage('Start Docker Daemon') {
            steps {
                container('dind') {
                    sh '''
                        echo "Starting Docker daemon..."
                        dockerd > /tmp/dockerd.log 2>&1 &
                        sleep 20
                        docker info
                    '''
                }
            }
        }

        stage('Build Frontend Image') {
            steps {
                container('dind') {
                    sh '''
                        docker build -t ${FRONTEND_IMAGE}:latest ./Frontend
                        docker images
                    '''
                }
            }
        }

        stage('SonarQube Analysis') {
            steps {
                container('sonar-scanner') {
                    withCredentials([string(credentialsId: 'sonar_token_2401132', variable: 'SONAR_TOKEN')]) {
                        sh '''
                            sonar-scanner \
                              -Dsonar.projectKey=InterviewPrepGuide \
                              -Dsonar.host.url=http://my-sonarqube-sonarqube.sonarqube.svc.cluster.local:9000 \
                              -Dsonar.login=$SONAR_TOKEN \
                              -Dsonar.sources=./Frontend \
                              -Dsonar.exclusions=**/node_modules/**
                        '''
                    }
                }
            }
        }

        stage('Login to Nexus') {
            steps {
                container('dind') {
                    sh '''
                        docker login ${REGISTRY} -u admin -p Changeme@2025
                    '''
                }
            }
        }

        stage('Push Frontend Image') {
            steps {
                container('dind') {
                    sh '''
                        docker tag ${FRONTEND_IMAGE}:latest ${REGISTRY}/${FRONTEND_IMAGE}:latest
                        docker push ${REGISTRY}/${FRONTEND_IMAGE}:latest
                    '''
                }
            }
        }

        stage('Deploy Frontend to Kubernetes') {
            steps {
                container('kubectl') {
                    sh '''
                        kubectl apply -f k8s/frontend-deployment.yaml
                    '''
                }
            }
        }
    }
}

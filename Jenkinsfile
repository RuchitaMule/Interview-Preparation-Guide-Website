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
        BACKEND_IMAGE = "interview-backend"
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
                container('dind') {
                    sh '''
                        docker build -t ${BACKEND_IMAGE}:latest ./backend
                        docker images
                    '''
                }
            }
        }

        stage('Build Frontend Image') {
            steps {
                container('dind') {
                    sh '''
                        docker build -t ${FRONTEND_IMAGE}:latest ./frontend
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
                              -Dsonar.projectKey=InterviewPrepGuide \
                              -Dsonar.host.url=http://my-sonarqube-sonarqube.sonarqube.svc.cluster.local:9000 \
                              -Dsonar.login=$SONAR_TOKEN \
                              -Dsonar.sources=./ \
                              -Dsonar.exclusions=**/node_modules/**,**/dist/**
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

        stage('Tag & Push Images') {
            steps {
                container('dind') {
                    sh '''
                        docker tag ${BACKEND_IMAGE}:latest ${REGISTRY}/${BACKEND_IMAGE}:latest
                        docker tag ${FRONTEND_IMAGE}:latest ${REGISTRY}/${FRONTEND_IMAGE}:latest

                        docker push ${REGISTRY}/${BACKEND_IMAGE}:latest
                        docker push ${REGISTRY}/${FRONTEND_IMAGE}:latest
                    '''
                }
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                container('kubectl') {
                    sh '''
                        kubectl apply -f k8s/
                    '''
                }
            }
        }
    }
}

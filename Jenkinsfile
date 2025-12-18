pipeline {
    agent any

    environment {
        REGISTRY = "nexus-service-for-docker-hosted-registry.nexus.svc.cluster.local:8085"
        BACKEND_IMAGE = "interview-backend"
        FRONTEND_IMAGE = "interview-frontend"
    }

    stages {

        stage('Checkout Code') {
            steps {
                checkout scm
            }
        }

        stage('Build Backend Image') {
            steps {
                sh "docker build -t $REGISTRY/$BACKEND_IMAGE:latest backend/"
            }
        }

        stage('Build Frontend Image') {
            steps {
                sh "docker build -t $REGISTRY/$FRONTEND_IMAGE:latest frontend/"
            }
        }

        stage('SonarQube Analysis') {
            steps {
                sh "sonar-scanner"
            }
        }

        stage('Push Images to Nexus') {
            steps {
                sh "docker push $REGISTRY/$BACKEND_IMAGE:latest"
                sh "docker push $REGISTRY/$FRONTEND_IMAGE:latest"
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                sh "kubectl apply -f k8s/"
            }
        }
    }
}

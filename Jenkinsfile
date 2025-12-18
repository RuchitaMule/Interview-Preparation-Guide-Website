pipeline {
    agent {
        kubernetes {
            yaml '''
apiVersion: v1
kind: Pod
spec:
  containers:
  - name: sonar-scanner
    image: sonarsource/sonar-scanner-cli
    command: ["cat"]
    tty: true

  - name: kubectl
    image: bitnami/kubectl:latest
    command: ["cat"]
    tty: true
    securityContext:
      runAsUser: 0
      readOnlyRootFilesystem: false
    env:
    - name: KUBECONFIG
      value: /kube/config
    volumeMounts:
    - name: kubeconfig-secret
      mountPath: /kube/config
      subPath: kubeconfig

  - name: dind
    image: docker:dind
    securityContext:
      privileged: true
    env:
    - name: DOCKER_TLS_CERTDIR
      value: ""
    volumeMounts:
    - name: docker-config
      mountPath: /etc/docker/daemon.json
      subPath: daemon.json

  volumes:
  - name: docker-config
    configMap:
      name: docker-daemon-config
  - name: kubeconfig-secret
    secret:
      secretName: kubeconfig-secret
'''
        }
    }

    stages {

        stage('Build Frontend Docker Image') {
            steps {
                container('dind') {
                    sh '''
                        echo "Waiting for Docker daemon..."
                        sleep 15
                        docker info

                        echo "Building frontend Docker image..."
                        docker build -t interview-frontend:latest ./Frontend
                        docker images
                    '''
                }
            }
        }

        stage('SonarQube Analysis') {
            steps {
                container('sonar-scanner') {
                    withCredentials([
                        string(credentialsId: 'sonar_token_2401132', variable: 'SONAR_TOKEN')
                    ]) {
                        sh '''
                            sonar-scanner \
                              -Dsonar.projectKey=2401132_InterviewPrep \
                              -Dsonar.projectName=2401132_InterviewPrep \
                              -Dsonar.host.url=http://my-sonarqube-sonarqube.sonarqube.svc.cluster.local:9000 \
                              -Dsonar.login=$SONAR_TOKEN \
                              -Dsonar.sources=Frontend \
                              -Dsonar.exclusions=*/node_modules/,/dist/,/build/*
                        '''
                    }
                }
            }
        }

        stage('Login to Nexus Registry') {
            steps {
                container('dind') {
                    sh '''
                        docker login nexus-service-for-docker-hosted-registry.nexus.svc.cluster.local:8085 \
                          -u admin -p Changeme@2025
                    '''
                }
            }
        }

        stage('Tag & Push Frontend Image') {
            steps {
                container('dind') {
                    sh '''
                        docker tag interview-frontend:latest \
                          nexus-service-for-docker-hosted-registry.nexus.svc.cluster.local:8085/interview-frontend:latest

                        docker push nexus-service-for-docker-hosted-registry.nexus.svc.cluster.local:8085/interview-frontend:latest
                    '''
                }
            }
        }

        stage('Create Namespace') {
            steps {
                container('kubectl') {
                    sh '''
                        kubectl get namespace 2401132-ruchita || \
                        kubectl create namespace 2401132-ruchita
                    '''
                }
            }
        }

        stage('Deploy Frontend to Kubernetes') {
            steps {
                container('kubectl') {
                    dir('k8s') {
                        sh '''
                            kubectl apply -n 2401132-ruchita -f frontend-deployment.yaml
                        '''
                    }
                }
            }
        }
    }
}

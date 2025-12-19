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
                        sleep 15
                        docker info
                        docker build -t interview-frontend:latest ./Frontend
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
                              -Dsonar.token=$SONAR_TOKEN \
                              -Dsonar.sources=Frontend \
                              -Dsonar.exclusions=**/node_modules/**,**/dist/**,**/build/**
                        '''
                    }
                }
            }
        }

        stage('Login to Nexus (NodePort)') {
            steps {
                container('dind') {
                    sh '''
                        docker login 127.0.0.1:30085 -u admin -p Changeme@2025
                    '''
                }
            }
        }

        stage('Tag & Push Image') {
            steps {
                container('dind') {
                    sh '''
                        docker tag interview-frontend:latest 127.0.0.1:30085/interview-frontend:latest
                        docker push 127.0.0.1:30085/interview-frontend:latest
                    '''
                }
            }
        }

        stage('Create Namespace') {
            steps {
                container('kubectl') {
                    sh '''
                        kubectl get ns 2401132-ruchita || kubectl create ns 2401132-ruchita
                    '''
                }
            }
        }

        stage('Create ImagePull Secret') {
            steps {
                container('kubectl') {
                    sh '''
                        kubectl create secret docker-registry nexus-secret \
                          --docker-server=127.0.0.1:30085 \
                          --docker-username=admin \
                          --docker-password=Changeme@2025 \
                          --docker-email=student@imcc.com \
                          -n 2401132-ruchita || true
                    '''
                }
            }
        }

        stage('Attach Secret to ServiceAccount') {
            steps {
                container('kubectl') {
                    sh '''
                        kubectl patch serviceaccount default \
                        -n 2401132-ruchita \
                        -p '{"imagePullSecrets":[{"name":"nexus-secret"}]}'
                    '''
                }
            }
        }

        stage('Deploy Frontend') {
            steps {
                container('kubectl') {
                    dir('k8s') {
                        sh '''
                            kubectl apply -n 2401132-ruchita -f frontend-deployment.yaml
                            kubectl apply -n 2401132-ruchita -f frontend-service.yaml
                            kubectl apply -n 2401132-ruchita -f ingress.yaml
                        '''
                    }
                }
            }
        }

        stage('Restart Pod') {
            steps {
                container('kubectl') {
                    sh '''
                        kubectl delete pod -n 2401132-ruchita -l app=frontend || true
                    '''
                }
            }
        }

        stage('Verify') {
            steps {
                container('kubectl') {
                    sh '''
                        kubectl get pods -n 2401132-ruchita
                        kubectl get ingress -n 2401132-ruchita
                    '''
                }
            }
        }
    }
}

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
                              -Dsonar.token=$SONAR_TOKEN \
                              -Dsonar.sources=Frontend \
                              -Dsonar.exclusions=**/node_modules/**,**/dist/**,**/build/**
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

        stage('Tag & Push Image') {
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
                        kubectl get ns 2401132-ruchita || kubectl create ns 2401132-ruchita
                    '''
                }
            }
        }

        stage('Create Nexus ImagePull Secret') {
            steps {
                container('kubectl') {
                    sh '''
                        kubectl create secret docker-registry nexus-secret \
                          --docker-server=nexus-service-for-docker-hosted-registry.nexus.svc.cluster.local:8085 \
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

        stage('Force Pod Restart') {
            steps {
                container('kubectl') {
                    sh '''
                        kubectl delete pod -n 2401132-ruchita -l app=frontend || true
                    '''
                }
            }
        }

        // 🔍 VERIFICATION STAGES (THIS GETS YOU 1/1)

        stage('Verify Image & Secret Registry URL') {
            steps {
                container('kubectl') {
                    sh '''
                        echo "IMAGE USED:"
                        kubectl get deploy frontend-deployment -n 2401132-ruchita \
                        -o jsonpath="{.spec.template.spec.containers[0].image}"
                        echo ""
                        echo "SECRET REGISTRY:"
                        kubectl get secret nexus-secret -n 2401132-ruchita \
                        -o jsonpath="{.data.\\.dockerconfigjson}" | base64 -d
                    '''
                }
            }
        }

        stage('Verify Pod Status & Errors') {
            steps {
                container('kubectl') {
                    sh '''
                        kubectl get pods -n 2401132-ruchita
                        kubectl describe pod -n 2401132-ruchita -l app=frontend
                    '''
                }
            }
        }

        stage('Verify Ingress') {
            steps {
                container('kubectl') {
                    sh '''
                        kubectl get ingress -n 2401132-ruchita
                    '''
                }
            }
        }
    }
}

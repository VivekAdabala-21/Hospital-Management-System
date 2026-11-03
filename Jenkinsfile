
pipeline {
    agent any

    environment {
        IMAGE_NAME = 'hospital-management-system'
        IMAGE_TAG = "${BUILD_NUMBER}"
        COMPOSE_PROJECT_NAME = 'hospital-management-system'
        DEPLOY_DIR = '/home/ubuntu/Hospital-Management-System'
    }

    stages {

        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Build Java Application') {
            steps {
                sh 'mvn clean package'
            }
        }

        stage('Verify JAR') {
            steps {
                sh '''
                    test -f target/hospital-management-system-1.0.0.jar
                '''
            }
        }

        stage('Build Docker Image') {
            steps {
                sh '''
                    docker build \
                      -t ${IMAGE_NAME}:${IMAGE_TAG} \
                      -t ${IMAGE_NAME}:latest .
                '''
            }
        }

        stage('Validate Deployment Configuration') {
            steps {
                sh '''
                    test -f ${DEPLOY_DIR}/docker-compose.yml
                    test -f ${DEPLOY_DIR}/.env
                    docker compose version
                '''
            }
        }

        stage('Deploy Application') {
            steps {
                withCredentials([
                    string(
                        credentialsId: 'hospital-db-password',
                        variable: 'DB_SECRET'
                    )
                ]) {
                    sh '''
                        export MYSQL_ROOT_PASSWORD="$DB_SECRET"
                        export DB_PASSWORD="$DB_SECRET"
                        export IMAGE_TAG="${IMAGE_TAG}"

                        docker compose \
                          -p "$COMPOSE_PROJECT_NAME" \
                          -f "${DEPLOY_DIR}/docker-compose.yml" \
                          up -d --no-build hospital-app
                    '''
                }
            }
        }

        stage('Verify Deployment') {
            steps {
                sh '''
                    sleep 10

                    docker inspect \
                      --format='{{.State.Status}}' hospital-app
                '''
            }
        }
    }

    post {
        success {
            echo 'Hospital Management System deployed successfully!'
        }

        failure {
            echo 'Pipeline failed. Check the Jenkins console output.'
        }

        always {
            echo 'Pipeline execution finished.'
        }
    }
}

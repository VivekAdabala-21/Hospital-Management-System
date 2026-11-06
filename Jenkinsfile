
pipeline {
    agent any

    environment {
        IMAGE_NAME = 'hospital-management-system'
        IMAGE_TAG = "${BUILD_NUMBER}"
        COMPOSE_PROJECT_NAME = 'hospital-management-system'
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

        stage('Verify Build Files') {
            steps {
                sh '''
                    test -f target/hospital-management-system-1.0.0.jar
                    test -f Dockerfile
                    test -f docker-compose.yml
                    test -f sql/init.sql
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

        stage('Test MySQL Credentials') {
            steps {
                withCredentials([
                    string(
                        credentialsId: 'hospital-db-password',
                        variable: 'DB_SECRET'
                    )
                ]) {
                    sh '''
                        set +x

                        if docker exec \
                            -e MYSQL_PWD="$DB_SECRET" \
                            mysql-db mysql -uroot -Nse "SELECT 1" \
                            >/dev/null 2>&1; then

                            echo "Jenkins credential authentication successful."
                        else
                            echo "Jenkins credential authentication failed."
                            exit 1
                        fi
                    '''
                }
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
                        set +x

                        export MYSQL_ROOT_PASSWORD="$DB_SECRET"
                        export DB_PASSWORD="$DB_SECRET"
                        export IMAGE_TAG="$BUILD_NUMBER"

                        docker compose \
                          -p "$COMPOSE_PROJECT_NAME" \
                          --project-directory "$WORKSPACE" \
                          -f "$WORKSPACE/docker-compose.yml" \
                          config --quiet

                        docker compose \
                          -p "$COMPOSE_PROJECT_NAME" \
                          --project-directory "$WORKSPACE" \
                          -f "$WORKSPACE/docker-compose.yml" \
                          up -d --no-build --no-deps hospital-app
                    '''
                }
            }
        }

        stage('Verify Deployment') {
            steps {
                sh '''
                    attempt=0

                    until docker inspect \
                      --format='{{.State.Running}}' hospital-app 2>/dev/null \
                      | grep -q true && \
                      docker logs hospital-app 2>&1 \
                      | grep -q 'Connected to MySQL'; do

                        attempt=$((attempt + 1))

                        if [ "$attempt" -ge 12 ]; then
                            echo "Deployment verification failed."
                            docker logs --tail 100 hospital-app
                            exit 1
                        fi

                        sleep 5
                    done

                    echo "Application is running and connected to MySQL."
                '''
            }
        }
    }

    post {
        success {
            echo 'Hospital Management System deployed successfully!'
        }

        failure {
            echo 'Pipeline failed. Check Jenkins console output.'
        }

        always {
            echo 'Pipeline execution finished.'
        }
    }
}

pipeline {
    agent {
        label 'etabletka-1'
    }
    environment {
        REPO_URL = 'git@github.com:konexit/etabletka-backend.git'
        APP_DIR = '/usr/home/jenkins/app'
        CONFIG_DIR = 'config'
        SERVICES_DIR = "${APP_DIR}/services"
        SERVICE_DIR = 'etabletka-backend'
        NODE_ENV = 'development'
    }
    stages {
        stage('Prepare Directory') {
            steps {
                sh '''
                # Создаём директорию, если её нет
                mkdir -p ${SERVICES_DIR}/${SERVICE_DIR}

                # Удаляем содержимое директории
                if [ -d "${SERVICES_DIR}/${SERVICE_DIR}/.git" ]; then
                    echo "Git репозиторий найден. Выполняем reset и clean."
                    cd ${SERVICES_DIR}/${SERVICE_DIR}
                    git reset --hard
                    git clean -fd
                else
                    echo "Удаляем старые файлы, если директория не является репозиторием."
                    rm -rf ${SERVICES_DIR}/${SERVICE_DIR}/*
                fi
                '''
            }
        }
        stage('Checkout') {
            steps {
                sshagent(['github-ssh-key']) {
                    sh '''
                    cd ${SERVICES_DIR}/${SERVICE_DIR}
                    git checkout main
                    git pull origin main
                    '''
                }
            }
        }
        stage('Install Dependencies') {
            steps {
                // Установка зависимостей
                sh '''
                cd ${SERVICES_DIR}/${SERVICE_DIR}
                npm install
                cp ${APP_DIR}/${CONFIG_DIR}/${SERVICE_DIR}/ecosystem.config.js ${SERVICES_DIR}/${SERVICE_DIR}/ecosystem.config.js
                cp ${APP_DIR}/${CONFIG_DIR}/${SERVICE_DIR}/.env ${SERVICES_DIR}/${SERVICE_DIR}/.env
                '''
            }
        }
        stage('Build Project') {
            steps {
                // Сборка проекта
                sh '''
                cd ${SERVICES_DIR}/${SERVICE_DIR}
                npm run migration:run
                '''
            }
        }
        stage('Restart Application') {
            steps {
                // Перезапуск приложения через PM2
                sh '''
                cd ${SERVICES_DIR}/${SERVICE_DIR}
                JENKINS_NODE_COOKIE=dontKillMe pm2 restart ecosystem.config.js --env production --only etabletka-backend --node-args="--env-file ${SERVICES_DIR}/${SERVICE_DIR}/.env" || pm2 start ecosystem.config.js ${SERVICES_DIR}/${SERVICE_DIR}/.env --env production
                '''
            }
        }
    }
    post {
        success {
            echo 'Deployment successful!'
        }
        failure {
            echo 'Deployment failed!'
        }
    }
}

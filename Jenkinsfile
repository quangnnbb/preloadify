// SS-System-Iac
def getCurrentTime() {
    return new Date().format("yyyy-MM-dd HH:mm:ss Z", TimeZone.getTimeZone("UTC"))
}
def getChangeAuthorName() {
    return sh(returnStdout: true, script: "git show -s --pretty=%an").trim()
}

@Library(['ss-notify-library']) _

pipeline {
    agent none
    environment {
        PROJECT_PATH = "${env.PROJECT_PATH}"
        PROJECT_NAME = "${env.JOB_NAME}"
        SERVER_1 = "${env.SERVER_1}"
        SERVER_2 = "${env.SERVER_2}"
        SERVER_3 = "${env.SERVER_3}"
        SERVER_4 = "${env.SERVER_4}"
        SERVER_5 = "${env.SERVER_5}"

        USERNAME_NOTI = "${env.NAME_NOTI}"
        SLACK_CHANNEL = "${env.SLACK_CHANNEL}"
        SLACK_WEBHOOK = credentials('ss-slack-alert-common')
    }
    
    stages {
        stage('Initialize') {
            agent any
            steps {
                script {
                    echo "GIT_BRANCH: ${env.GIT_BRANCH}"
                    env.BRANCH = env.GIT_BRANCH?.replaceFirst(/^origin\//, '') ?: sh(script: "git rev-parse --abbrev-ref HEAD", returnStdout: true).trim()
                    env.CHANGE_AUTHOR = getChangeAuthorName()
                    
                    // Set agent label as environment variable
                    if (env.GIT_BRANCH == 'origin/master' || env.GIT_BRANCH == 'origin/staging' || env.GIT_BRANCH == 'origin/beta' || env.GIT_BRANCH == 'origin/main') {
                        echo "Building on master branch, using master agent"
                        env.AGENT_LABEL = 'master'
                    } else {
                        echo "Building on dev/staging branch, using ss-jk-ag-01 agent"
                        env.AGENT_LABEL = 'ss-jk-ag-01'
                    }
                    
                    echo "Branch: ${env.BRANCH}, Author: ${env.CHANGE_AUTHOR}, Agent: ${env.AGENT_LABEL}"
                }
            }
        }

        stage('Checkout Source') {
            agent {
                label "${env.AGENT_LABEL}"
            }
            steps {
                echo "Checking out source code..."
                checkout scm
            }
        }

        stage('Send Start Alert') {
            agent {
                label "${env.AGENT_LABEL}"
            }
            steps {
                script {
                    echo "Sending START notification..."
                    slackAlert("STARTED", "STARTED", "-", getCurrentTime())
                }
            }
        }

        stage('Deployment') {
            agent {
                label "${env.AGENT_LABEL}"
            }
            steps {
                script {
                    sh """
                        echo $PROJECT_NAME
                        rsync -avz $WORKSPACE/ root@$SERVER_1:$PROJECT_PATH
                        """
                }
            }
        }
    }

    post {
        success {
            node("${env.AGENT_LABEL}") {
                script {
                    def duration = currentBuild.duration / 1000
                    echo "Sending SUCCESS notification..."
                    slackAlert("SUCCESS", "COMPLETED", duration.toString(), getCurrentTime())
                }
            }
        }

        failure {
            node("${env.AGENT_LABEL}") {
                script {
                    def duration = currentBuild.duration / 1000
                    echo "Sending FAILED notification...."
                    slackAlert("FAILED", "FAILED", duration.toString(), getCurrentTime())
                }
            }
        }
    }
}

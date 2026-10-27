FROM eclipse-temurin:21-jre

WORKDIR /app

COPY target/hospital-management-system-1.0.0.jar /app/app.jar

ENTRYPOINT ["java","-jar","/app/app.jar"]
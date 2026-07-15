FROM eclipse-temurin:22-jdk

WORKDIR /app

COPY target/hospital-management-system-1.0.0.jar /app/app.jar

ENTRYPOINT ["java","-jar","/app/app.jar"]
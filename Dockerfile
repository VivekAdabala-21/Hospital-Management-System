
# Stage 1: Build the application
FROM maven:3.9.9-eclipse-temurin-22 AS build

WORKDIR /app

COPY pom.xml .
COPY src ./src

RUN mvn clean package -DskipTests

# Stage 2: Run the application
FROM eclipse-temurin:22-jre

WORKDIR /app

COPY --from=build /app/target/hospital-management-system-1.0.0.jar app.jar

ENTRYPOINT ["java", "-jar", "app.jar"]

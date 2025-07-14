FROM openjdk:17-jdk-slim
WORKDIR /app

COPY . .

RUN chmod +x ./mvnw
RUN ./mvnw clean package -DskipTests

EXPOSE 8761
CMD ["java", "-jar", "target/EurekaServer-0.0.1-SNAPSHOT.jar"]

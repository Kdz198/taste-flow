FROM openjdk:17-jdk-slim
WORKDIR /app

COPY . .

RUN chmod +x ./mvnw
RUN ./mvnw clean package -DskipTests

EXPOSE 8085
CMD ["java", "-jar", "target/OrderService2-0.0.1-SNAPSHOT.jar"]
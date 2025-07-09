FROM openjdk:17-jdk-slim
WORKDIR /app
COPY src/main/java/tasteflow/paymentservice .
RUN ./mvnw clean package -DskipTests
EXPOSE 8085
CMD ["java", "-jar", "target/*.jar"]

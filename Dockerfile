FROM eclipse-temurin:21-jdk

WORKDIR /app

COPY . .

RUN chmod +x mvnw && ./mvnw clean package -DskipTests

CMD ["sh", "-c", "java -jar target/*.jar"]
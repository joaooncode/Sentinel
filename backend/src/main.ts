import { NestFactory } from "@nestjs/core";
import { ValidationPipe, Logger } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { AppModule } from "./app.module";

async function bootstrap(): Promise<void> {
  const logger = new Logger("Bootstrap");
  const app = await NestFactory.create(AppModule);

  // Enable CORS
  app.enableCors({
    origin: "*",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
    credentials: true,
  });

  // Global Validation Pipe with strict settings
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Global API Prefix
  app.setGlobalPrefix("api/v1");

  // Swagger OpenAPI Documentation
  const config = new DocumentBuilder()
    .setTitle("Sentinel API")
    .setDescription(
      "Documentação da API REST do Sentinel — Gestão Inteligente de Assinaturas (DDD + NestJS)",
    )
    .setVersion("1.0")
    .addBearerAuth(
      {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
        name: "JWT",
        description: "Insira o token JWT gerado pelo Clerk",
        in: "header",
      },
      "clerk-jwt",
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("docs", app, document);

  const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3333;
  await app.listen(port);
  logger.log(`🚀 Sentinel API rodando em http://localhost:${port}/api/v1`);
  logger.log(`📚 Swagger disponível em http://localhost:${port}/docs`);
}

void bootstrap();

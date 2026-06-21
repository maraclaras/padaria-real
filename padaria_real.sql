-- MySQL dump 10.13  Distrib 8.0.42, for Win64 (x86_64)
--
-- Host: localhost    Database: padaria_real
-- ------------------------------------------------------
-- Server version	8.0.42

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `categories`
--

DROP TABLE IF EXISTS `categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `categories` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `created_at` bigint DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `updated_at` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UKt8o6pivur7nn124jehx7cygw5` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=38 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categories`
--

LOCK TABLES `categories` WRITE;
/*!40000 ALTER TABLE `categories` DISABLE KEYS */;
INSERT INTO `categories` VALUES (14,1777912141000,'Produtos de panificação como pães franceses, integrais e baguetes.','Pães',1777912141000),(15,1777912141000,'Bolos inteiros, fatias e produtos de confeitaria.','Bolos',1777912141000),(16,1777912141000,'Doces de padaria, sobremesas e confeitos.','Doces',1777912141000),(17,1777912141000,'Salgados assados e fritos para consumo rápido.','Salgados',1777912141000),(18,1777912141000,'Cafés, sucos, refrigerantes e outras bebidas.','Bebidas',1777912141000),(19,1777912141000,'Queijos, presuntos e produtos fatiados.','Frios',1777912141000),(28,1778443542000,'Produtos de mercearia vendidos na padaria','Mercearia',1778443542000),(29,1778443542000,'Lanches prontos e sanduíches','Lanches',1778443542000),(30,1778443542000,'Produtos especiais e sazonais','Especiais',1778443542000),(37,1778548147945,'Mistos 2','Mistos',1778548165541);
/*!40000 ALTER TABLE `categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `companies`
--

DROP TABLE IF EXISTS `companies`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `companies` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `ativo` bit(1) DEFAULT NULL,
  `cnpj` varchar(20) NOT NULL,
  `created_at` bigint NOT NULL,
  `endereco` varchar(255) DEFAULT NULL,
  `matriz_id` bigint DEFAULT NULL,
  `razao_social` varchar(150) NOT NULL,
  `tipo` varchar(20) NOT NULL,
  `updated_at` bigint DEFAULT NULL,
  `nome` varchar(150) NOT NULL,
  `sistema` bit(1) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UK1phmrrhw2946lhdeh2yjis697` (`cnpj`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `companies`
--

LOCK TABLES `companies` WRITE;
/*!40000 ALTER TABLE `companies` DISABLE KEYS */;
INSERT INTO `companies` VALUES (1,_binary '','09.644.914/0001-60',1779816468752,'R. Mal. Deodoro da Fonseca, 145 - Três Marias, MG, 39205-000',NULL,'Padaria Real LTDA','MATRIZ',1779816468752,'Padaria Real',_binary ''),(6,_binary '','09.644.914/2222-60',1779830082890,'',1,'padaria 2','FILIAL',1779832056025,'padaria 2',_binary '\0');
/*!40000 ALTER TABLE `companies` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `products`
--

DROP TABLE IF EXISTS `products`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `products` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `category` varchar(50) DEFAULT NULL,
  `cost_price` double NOT NULL,
  `created_at` bigint NOT NULL,
  `description` varchar(500) DEFAULT NULL,
  `name` varchar(100) NOT NULL,
  `price` double NOT NULL,
  `quantity` int NOT NULL,
  `updated_at` bigint DEFAULT NULL,
  `company_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=64 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `products`
--

LOCK TABLES `products` WRITE;
/*!40000 ALTER TABLE `products` DISABLE KEYS */;
INSERT INTO `products` VALUES (2,'Pães',0.25,1777905549000,'Pão tradicional de padaria, vendido por unidade.','Pão francês',0.5,1,1779831266767,1),(3,'Pães',0.3,1777905549000,'Pão de queijo pequeno para lanche.','Pão de queijo',0.6,100,1779831585003,1),(4,'Pães',1.8,1777905549000,'Pão integral artesanal.','Pão integral',3.5,32,1779832818401,1),(5,'Pães',2.21,1777905549000,'Baguete crocante de fermentação tradicional','Baguete',4.51,20,1778530255994,NULL),(6,'Bolos',4.5,1777905549000,'Bolo de cenoura com cobertura de chocolate.','Bolo de cenoura',9,3,1779832065748,6),(7,'Mistos',5,1777905549000,'Bolo de chocolate com massa fofinha.','Bolo de chocolate',10,14,1778548187957,NULL),(8,'Bolos',1.8,1777905549000,'Fatia individual de bolo do dia.','Fatia de bolo',4,7,1777912650483,NULL),(9,'Doces',3.5,1777905549000,'Sonho recheado com creme.','Sonho',7,30,1777905549000,NULL),(10,'Doces',1.5,1777905549000,'Cookie artesanal com gotas de chocolate.','Cookie',3,0,1782064980059,NULL),(11,'Doces',0.8,1777905549000,'Brigadeiro tradicional enrolado.','Brigadeiro',2,60,1778548107726,NULL),(12,'Salgados',0.5,1777905549000,'Coxinha de frango tradicional.','Coxinha',1,0,1778530441136,NULL),(13,'Salgados',1.8,1777905549000,'Empada recheada com frango cremoso.','Empada de frango',4,33,1778529001245,NULL),(14,'Salgados',2,1777905549000,'Esfiha assada com recheio de carne.','Esfiha de carne',4.5,21,1778529130135,NULL),(15,'Bebidas',0.6,1777905549000,'Café coado servido na hora.','Café coado',2.5,100,1777905549000,NULL),(16,'Bebidas',2.5,1777905549000,'Suco natural de fruta.','Suco natural',6,25,1777905549000,NULL),(17,'Bebidas',3,1777905549000,'Refrigerante em lata 350ml.','Refrigerante lata',6,45,1777905549000,NULL),(18,'Frios',8,1777905549000,'Queijo minas vendido em porção.','Queijo minas',15,12,1777905549000,NULL),(19,'Frios',7,1777905549000,'Presunto fatiado vendido em porção.','Presunto fatiado',13,16,1777905549000,NULL),(20,'Pães',0.25,1777905590000,'Pão tradicional de padaria, vendido por unidade.','Pão francês',0.5,123,1778530844281,NULL),(21,'Pães',0.3,1777905590000,'Pão de queijo pequeno para lanche.','Pão de queijo',0.6,80,1777905590000,NULL),(22,'Pães',1.8,1777905590000,'Pão integral artesanal.','Pão integral',3.5,35,1777905590000,NULL),(23,'Pães',2.2,1777905590000,'Baguete crocante de fermentação tradicional.','Baguete',4.5,25,1777905590000,NULL),(24,'Bolos',4.5,1777905590000,'Bolo de cenoura com cobertura de chocolate.','Bolo de cenoura',9,20,1777905590000,NULL),(25,'Bolos',5,1777905590000,'Bolo de chocolate com massa fofinha.','Bolo de chocolate',10,18,1777905590000,NULL),(26,'Bolos',1.8,1777905590000,'Fatia individual de bolo do dia.','Fatia de bolo',4,40,1777905590000,NULL),(27,'Doces',3.5,1777905590000,'Sonho recheado com creme.','Sonho',7,30,1777905590000,NULL),(28,'Doces',1.5,1777905590000,'Cookie artesanal com gotas de chocolate.','Cookie',3,50,1777905590000,NULL),(29,'Doces',0.8,1777905590000,'Brigadeiro tradicional enrolado.','Brigadeiro',2,60,1777905590000,NULL),(30,'Salgados',0.5,1777905590000,'Coxinha de frango tradicional.','Coxinha',1,70,1777905590000,NULL),(31,'Salgados',1.8,1777905590000,'Empada recheada com frango cremoso.','Empada de frango',4,35,1777905590000,NULL),(32,'Salgados',2,1777905590000,'Esfiha assada com recheio de carne.','Esfiha de carne',4.5,32,1777905590000,NULL),(33,'Bebidas',0.6,1777905590000,'Café coado servido na hora.','Café coado',2.5,100,1777905590000,NULL),(34,'Bebidas',2.5,1777905590000,'Suco natural de fruta.','Suco natural',6,2,1778450652225,NULL),(35,'Bebidas',3,1777905590000,'Refrigerante em lata 350ml.','Refrigerante lata',6,45,1777905590000,NULL),(36,'Frios',8,1777905590000,'Queijo minas vendido em porção.','Queijo minas',15,15,1777905590000,NULL),(37,'Frios',7,1777905590000,'Presunto fatiado vendido em porção.','Presunto fatiado',13,18,1777905590000,NULL),(39,'Pães',0.35,1778443610000,'Pão francês tradicional da padaria','Pão Francês',0.8,200,1778443610000,NULL),(40,'Pães',3.5,1778443610000,'Pão de queijo assado, vendido por unidade','Pão de Queijo',5,80,1778443610000,NULL),(41,'Pães',4,1778443610000,'Pão doce com creme e coco','Pão Doce',6.5,40,1778443610000,NULL),(42,'Bolos',18,1778443610000,'Bolo simples de cenoura com cobertura de chocolate','Bolo de Cenoura',35,10,1778443610000,NULL),(43,'Bolos',22,1778443610000,'Bolo de chocolate recheado','Bolo de Chocolate',45,8,1778443610000,NULL),(45,'Salgados',2.5,1778443610000,'Coxinha de frango tradicional','Coxinha',6,50,1778443610000,NULL),(46,'Salgados',2.2,1778443610000,'Empada recheada com frango','Empada de Frango',5.5,45,1778443610000,NULL),(47,'Salgados',3,1778443610000,'Esfiha aberta de carne','Esfiha de Carne',7,35,1778443610000,NULL),(48,'Doces',1.5,1778443610000,'Brigadeiro tradicional','Brigadeiro',3.5,100,1778443610000,NULL),(49,'Doces',1.7,1778443610000,'Beijinho de coco tradicional','Beijinho',3.5,90,1778443610000,NULL),(50,'Doces',4,1778443610000,'Fatia de pudim de leite condensado','Pudim',8,20,1778443610000,NULL),(51,'Bebidas',2.5,1778443610000,'Café coado tradicional','Café',5,100,1778443610000,NULL),(52,'Bebidas',3,1778443610000,'Suco natural de laranja','Suco de Laranja',8,40,1778443610000,NULL),(53,'Bebidas',2,1778443610000,'Refrigerante em lata 350ml','Refrigerante Lata',6,60,1778443610000,NULL),(54,'Mercearia',5,1778443610000,'Pacote de biscoito doce','Biscoito',9,30,1778443610000,NULL),(55,'Mercearia',4,1778443610000,'Leite integral 1 litro','Leite Integral',7.5,25,1778443610000,NULL),(56,'Lanches',6,1778443610000,'Sanduíche natural de frango','Sanduíche Natural',14,20,1778443610000,NULL),(57,'Lanches',7,1778443610000,'Misto quente com presunto e queijo','Misto Quente',15,25,1778443610000,NULL),(58,'Especiais',12,1778443610000,'Panetone artesanal sazonal','Panetone Artesanal',28,15,1778443610000,NULL);
/*!40000 ALTER TABLE `products` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sales`
--

DROP TABLE IF EXISTS `sales`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sales` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `created_at` bigint DEFAULT NULL,
  `notes` varchar(255) DEFAULT NULL,
  `payment_method` varchar(255) DEFAULT NULL,
  `product_id` bigint DEFAULT NULL,
  `quantity_sold` int DEFAULT NULL,
  `total_amount` double DEFAULT NULL,
  `unit_price` double DEFAULT NULL,
  `updated_at` bigint DEFAULT NULL,
  `sale_date` bigint DEFAULT NULL,
  `company_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=59 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sales`
--

LOCK TABLES `sales` WRITE;
/*!40000 ALTER TABLE `sales` DISABLE KEYS */;
INSERT INTO `sales` VALUES (1,1777320627711,'','Dinheiro',1,10,70,7,1777320627711,20260427,NULL),(2,1777912495000,'Venda de teste - Pão francês','Dinheiro',2,20,10,0.5,1777912495000,20260504,NULL),(3,1777912495000,'Venda de teste - Pão de queijo','Pix',3,15,9,0.6,1777912495000,20260504,NULL),(4,1777912495000,'Venda de teste - Bolo de cenoura','Cartão de crédito',6,3,27,9,1777912495000,20260504,NULL),(5,1777912495000,'Venda de teste - Sonho','Pix',9,8,56,7,1777912495000,20260504,NULL),(6,1777912495000,'Venda de teste - Coxinha','Dinheiro',12,12,12,1,1777912495000,20260504,NULL),(7,1777912495000,'Venda de teste - Café coado','Pix',15,18,45,2.5,1777912495000,20260504,NULL),(8,1777912495000,'Venda de teste - Cookie','Cartão de débito',10,10,30,3,1777912495000,20260504,NULL),(9,1777912495000,'Venda de teste - Refrigerante lata','Cartão de crédito',17,6,36,6,1777912495000,20260504,NULL),(10,1777925597629,'','Dinheiro',38,4,79.92,19.98,1777925597629,20260504,NULL),(11,1778443654000,'Venda de pão francês no balcão','Dinheiro',1,10,8,0.8,1778443654000,20260510,NULL),(12,1778443654000,'Venda de pão de queijo','Pix',2,4,20,5,1778443654000,20260510,NULL),(13,1778443654000,'Venda de bolo de cenoura inteiro','Cartão de Crédito',4,1,35,35,1778443654000,20260510,NULL),(14,1778443654000,'Venda de coxinhas','Cartão de Débito',7,5,30,6,1778443654000,20260510,NULL),(15,1778443654000,'Venda de brigadeiros para encomenda pequena','Pix',10,12,42,3.5,1778443654000,20260510,NULL),(16,1778443654000,'Venda de café no salão','Dinheiro',13,2,10,5,1778443654000,20260510,NULL),(17,1778443654000,'Venda de suco de laranja','Pix',14,3,24,8,1778443654000,20260510,NULL),(18,1778443654000,'Venda de sanduíche natural','Cartão de Crédito',18,2,28,14,1778443654000,20260510,NULL),(19,1778443654000,'Venda de misto quente','Cartão de Débito',19,1,15,15,1778443654000,20260510,NULL),(20,1778443654000,'Venda de panetone artesanal','Pix',20,1,28,28,1778443654000,20260510,NULL),(21,1778512207062,'','Dinheiro',4,1,3.5,3.5,1778512207062,20260511,NULL),(22,1778512368000,'','PIX',1,4,20,5,1778512368000,20260320,NULL),(23,1777640400000,'Venda manual - 01/05','Dinheiro',1,5,25,5,1777640400000,1777640400000,NULL),(24,1777726800000,'Venda manual - 02/05','PIX',2,4,20,5,1777726800000,1777726800000,NULL),(25,1777813200000,'Venda manual - 03/05','Cartão Crédito',4,2,7,3.5,1777813200000,1777813200000,NULL),(26,1777899600000,'Venda manual - 04/05','Cartão Débito',7,3,18,6,1777899600000,1777899600000,NULL),(27,1777986000000,'Venda manual - 05/05','PIX',10,6,21,3.5,1777986000000,1777986000000,NULL),(28,1778072400000,'Venda manual - 06/05','Dinheiro',13,2,10,5,1778072400000,1778072400000,NULL),(29,1778158800000,'Venda manual - 07/05','PIX',14,3,24,8,1778158800000,1778158800000,NULL),(30,1778245200000,'Venda manual - 08/05','Cartão Crédito',18,2,28,14,1778245200000,1778245200000,NULL),(31,1778331600000,'Venda manual - 09/05','Cartão Débito',19,1,15,15,1778331600000,1778331600000,NULL),(33,1778412600000,'Venda manual - Pão francês - 10/05','Dinheiro',1,12,9.6,0.8,1778412600000,1778412600000,NULL),(34,1778415300000,'Venda manual - Pão de queijo - 10/05','PIX',2,6,30,5,1778415300000,1778415300000,NULL),(35,1778422800000,'Venda manual - Bolo de cenoura - 10/05','Cartão Crédito',4,2,70,35,1778422800000,1778422800000,NULL),(36,1778431500000,'Venda manual - Coxinha - 10/05','Cartão Débito',7,8,48,6,1778431500000,1778431500000,NULL),(37,1778436600000,'Venda manual - Brigadeiro - 10/05','PIX',10,15,52.5,3.5,1778436600000,1778436600000,NULL),(38,1778442000000,'Venda manual - Café - 10/05','Dinheiro',13,5,25,5,1778442000000,1778442000000,NULL),(39,1778445000000,'Venda manual - Suco de laranja - 10/05','PIX',14,4,32,8,1778445000000,1778445000000,NULL),(40,1778448000000,'Venda manual - Sanduíche natural - 10/05','Cartão Crédito',18,3,42,14,1778448000000,1778448000000,NULL),(41,1778512952304,'','Dinheiro',10,5,15,3,1778515383883,1778512952304,NULL),(47,1778517081178,'Venda de Bolo de cenoura','Dinheiro',6,12,108,9,1778517081178,1778517081178,NULL),(48,1778584800000,'Venda manual - Pão francês - 12/05','Dinheiro',1,15,12,0.8,1778584800000,1778584800000,NULL),(49,1778587800000,'Venda manual - Pão de queijo - 12/05','PIX',2,8,40,5,1778587800000,1778587800000,NULL),(50,1778592600000,'Venda manual - Bolo de cenoura - 12/05','Cartão Crédito',4,2,70,35,1778592600000,1778592600000,NULL),(51,1778598900000,'Venda manual - Coxinha - 12/05','Cartão Débito',7,10,60,6,1778598900000,1778598900000,NULL),(52,1778607600000,'Venda manual - Brigadeiro - 12/05','PIX',10,20,70,3.5,1778607600000,1778607600000,NULL),(53,1778610300000,'Venda manual - Café - 12/05','Dinheiro',13,6,30,5,1778610300000,1778610300000,NULL),(54,1778613000000,'Venda manual - Suco de laranja - 12/05','PIX',14,5,40,8,1778613000000,1778613000000,NULL),(55,1778619000000,'Venda manual - Sanduíche natural - 12/05','Cartão Crédito',18,4,56,14,1778619000000,1778619000000,NULL),(57,1779832818384,'Venda de Pão integral','Dinheiro',4,1,3.5,3.5,1779832818384,1779832818384,1),(58,1782064979678,'Venda de Cookie','Dinheiro',10,70,210,3,1782064979678,1782064979678,NULL);
/*!40000 ALTER TABLE `sales` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sales_backup`
--

DROP TABLE IF EXISTS `sales_backup`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sales_backup` (
  `id` bigint NOT NULL DEFAULT '0',
  `created_at` bigint DEFAULT NULL,
  `notes` varchar(255) DEFAULT NULL,
  `payment_method` varchar(255) DEFAULT NULL,
  `product_id` bigint DEFAULT NULL,
  `quantity_sold` int DEFAULT NULL,
  `sale_date` bigint DEFAULT NULL,
  `total_amount` double DEFAULT NULL,
  `unit_price` double DEFAULT NULL,
  `updated_at` bigint DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sales_backup`
--

LOCK TABLES `sales_backup` WRITE;
/*!40000 ALTER TABLE `sales_backup` DISABLE KEYS */;
INSERT INTO `sales_backup` VALUES (1,1777320627711,'','Dinheiro',1,10,1777320627711,70,7,1777320627711),(2,1777912495000,'Venda de teste - Pão francês','Dinheiro',2,20,1777896900000,10,0.5,1777912495000),(3,1777912495000,'Venda de teste - Pão de queijo','Pix',3,15,1777898400000,9,0.6,1777912495000),(4,1777912495000,'Venda de teste - Bolo de cenoura','Cartão de crédito',6,3,1777900800000,27,9,1777912495000),(5,1777912495000,'Venda de teste - Sonho','Pix',9,8,1777903800000,56,7,1777912495000),(6,1777912495000,'Venda de teste - Coxinha','Dinheiro',12,12,1777906800000,12,1,1777912495000),(7,1777912495000,'Venda de teste - Café coado','Pix',15,18,1777915800000,45,2.5,1777912495000),(8,1777912495000,'Venda de teste - Cookie','Cartão de débito',10,10,1777917900000,30,3,1777912495000),(9,1777912495000,'Venda de teste - Refrigerante lata','Cartão de crédito',17,6,1777922700000,36,6,1777912495000),(10,1777925597629,'','Dinheiro',38,4,1777925597629,79.92,19.98,1777925597629),(11,1778443654000,'Venda de pão francês no balcão','Dinheiro',1,10,1778443654000,8,0.8,1778443654000),(12,1778443654000,'Venda de pão de queijo','Pix',2,4,1778443654000,20,5,1778443654000),(13,1778443654000,'Venda de bolo de cenoura inteiro','Cartão de Crédito',4,1,1778443654000,35,35,1778443654000),(14,1778443654000,'Venda de coxinhas','Cartão de Débito',7,5,1778443654000,30,6,1778443654000),(15,1778443654000,'Venda de brigadeiros para encomenda pequena','Pix',10,12,1778443654000,42,3.5,1778443654000),(16,1778443654000,'Venda de café no salão','Dinheiro',13,2,1778443654000,10,5,1778443654000),(17,1778443654000,'Venda de suco de laranja','Pix',14,3,1778443654000,24,8,1778443654000),(18,1778443654000,'Venda de sanduíche natural','Cartão de Crédito',18,2,1778443654000,28,14,1778443654000),(19,1778443654000,'Venda de misto quente','Cartão de Débito',19,1,1778443654000,15,15,1778443654000),(20,1778443654000,'Venda de panetone artesanal','Pix',20,1,1778443654000,28,28,1778443654000),(21,1778512207062,'','Dinheiro',4,1,1778512207062,3.5,3.5,1778512207062);
/*!40000 ALTER TABLE `sales_backup` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `username` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `name` varchar(150) DEFAULT NULL,
  `role` varchar(30) DEFAULT NULL,
  `active` tinyint(1) DEFAULT '1',
  `created_at` bigint DEFAULT NULL,
  `updated_at` bigint DEFAULT NULL,
  `company_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=33 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'padariaReal','123456','Padaria Real','ADMIN',1,1777302330000,1780924176601,1),(19,'debora','123456','Débora ','USER',1,1778515423875,1780941100956,6),(24,'maria clara','123456789','Maria Clara','GERENTE',1,1780929804762,1780930135388,6);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `waste`
--

DROP TABLE IF EXISTS `waste`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `waste` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `created_at` bigint DEFAULT NULL,
  `product_id` bigint NOT NULL,
  `quantity_wasted` int NOT NULL,
  `reason` varchar(255) DEFAULT NULL,
  `total_loss` double NOT NULL,
  `unit_cost` double NOT NULL,
  `updated_at` bigint DEFAULT NULL,
  `waste_date` bigint DEFAULT NULL,
  `company_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `waste`
--

LOCK TABLES `waste` WRITE;
/*!40000 ALTER TABLE `waste` DISABLE KEYS */;
INSERT INTO `waste` VALUES (2,1777912589000,3,10,'Produto passou do ponto no forno',3,0.3,1777912589000,1777897200000,NULL),(3,1777912589000,6,2,'Produto vencido',9,4.5,1777912589000,1777900200000,NULL),(4,1777912589000,9,6,'Produto danificado na exposição',21,3.5,1777912589000,1777905600000,NULL),(5,1777912589000,12,8,'Salgado frio e fora do padrão de venda',4,0.5,1777912589000,1777911300000,NULL),(6,1777912589000,10,5,'Produto quebrado durante o manuseio',7.5,1.5,1777912589000,1777917600000,NULL),(7,1777912589000,16,3,'Produto vencido',7.5,2.5,1777912589000,1777921200000,NULL),(8,1777912589000,19,2,'Produto fora da validade',14,7,1777912589000,1777925400000,NULL),(10,1778443988000,2,6,'Pães de queijo queimados no forno',21,3.5,1778443988000,1778443988000,NULL),(11,1778443988000,4,1,'Bolo de cenoura vencido',18,18,1778443988000,1778443988000,NULL),(12,1778443988000,7,4,'Coxinhas quebradas no manuseio',10,2.5,1778443988000,1778443988000,NULL),(13,1778443988000,10,10,'Brigadeiros fora do padrão de venda',15,1.5,1778443988000,1778443988000,NULL),(14,1778443988000,14,2,'Suco natural passou do prazo de consumo',6,3,1778443988000,1778443988000,NULL),(15,1778443988000,18,3,'Sanduíches não vendidos até o fim do dia',18,6,1778443988000,1778443988000,NULL),(16,1778443988000,19,2,'Lanches preparados incorretamente',14,7,1778443988000,1778443988000,NULL),(17,1778528970293,6,5,'Estragado',22.5,4.5,1778528970293,1778528970293,NULL),(18,1778529001228,13,2,'outro',3.6,1.8,1778529001228,1778529001228,NULL),(19,1778529130118,14,9,'Vencimento',216,24,1778529130118,1778529130118,NULL),(20,1778529844198,60,2,'produto caiu no chão',39.98,19.99,1778529844198,1778529844198,NULL);
/*!40000 ALTER TABLE `waste` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-06-21 15:24:06

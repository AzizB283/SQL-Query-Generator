-- MySQL dump 10.13  Distrib 8.0.36, for Linux (x86_64)
--
-- Host: localhost    Database: atliq_tshirts
-- ------------------------------------------------------
-- Server version	8.0.36-0ubuntu0.22.04.1

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `discounts`
--

DROP TABLE IF EXISTS `discounts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `discounts` (
  `discount_id` int NOT NULL AUTO_INCREMENT,
  `t_shirt_id` int NOT NULL,
  `pct_discount` decimal(5,2) DEFAULT NULL,
  PRIMARY KEY (`discount_id`),
  KEY `t_shirt_id` (`t_shirt_id`),
  CONSTRAINT `discounts_ibfk_1` FOREIGN KEY (`t_shirt_id`) REFERENCES `t_shirts` (`t_shirt_id`),
  CONSTRAINT `discounts_chk_1` CHECK ((`pct_discount` between 0 and 100))
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `discounts`
--

LOCK TABLES `discounts` WRITE;
/*!40000 ALTER TABLE `discounts` DISABLE KEYS */;
/*!40000 ALTER TABLE `discounts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `t_shirts`
--

DROP TABLE IF EXISTS `t_shirts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `t_shirts` (
  `t_shirt_id` int NOT NULL AUTO_INCREMENT,
  `brand` enum('Van Huesen','Levi','Nike','Adidas') NOT NULL,
  `color` enum('Red','Blue','Black','White') NOT NULL,
  `size` enum('XS','S','M','L','XL') NOT NULL,
  `price` int DEFAULT NULL,
  `stock_quantity` int NOT NULL,
  PRIMARY KEY (`t_shirt_id`),
  UNIQUE KEY `brand_color_size` (`brand`,`color`,`size`),
  CONSTRAINT `t_shirts_chk_1` CHECK ((`price` between 10 and 50))
) ENGINE=InnoDB AUTO_INCREMENT=101 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `t_shirts`
--

LOCK TABLES `t_shirts` WRITE;
/*!40000 ALTER TABLE `t_shirts` DISABLE KEYS */;
INSERT INTO `t_shirts` VALUES (1,'Adidas','Black','S',41,92),(2,'Van Huesen','Blue','M',11,77),(3,'Nike','White','L',33,88),(4,'Nike','Blue','M',19,58),(5,'Van Huesen','Blue','XS',43,15),(6,'Adidas','Red','XS',50,76),(7,'Nike','Red','XS',44,86),(9,'Van Huesen','White','L',46,40),(10,'Van Huesen','Red','M',23,11),(11,'Van Huesen','Blue','L',18,100),(12,'Levi','White','XS',18,61),(14,'Van Huesen','Blue','XL',34,13),(15,'Levi','White','L',29,20),(16,'Van Huesen','Red','L',15,47),(17,'Nike','Red','M',10,71),(18,'Levi','Black','S',45,28),(19,'Levi','Blue','XL',15,14),(21,'Adidas','Red','XL',25,11),(22,'Adidas','Blue','L',41,90),(24,'Adidas','White','S',44,23),(25,'Van Huesen','Black','S',37,52),(26,'Levi','Blue','S',14,48),(27,'Adidas','Black','L',42,82),(28,'Nike','Black','XS',49,46),(30,'Nike','White','M',19,61),(31,'Van Huesen','White','S',49,78),(32,'Adidas','Red','M',26,59),(33,'Levi','White','XL',37,83),(34,'Van Huesen','Black','XL',46,66),(35,'Levi','Black','XS',46,33),(37,'Van Huesen','Black','M',49,37),(38,'Nike','Red','S',10,11),(39,'Van Huesen','Red','S',48,99),(40,'Van Huesen','Black','XS',40,24),(41,'Nike','Black','XL',35,66),(43,'Adidas','White','XS',43,74),(44,'Van Huesen','Blue','S',20,61),(46,'Van Huesen','Red','XS',48,32),(47,'Levi','Blue','XS',48,54),(49,'Adidas','Black','XS',50,92),(50,'Nike','White','S',38,55),(57,'Nike','White','XS',38,27),(61,'Adidas','Red','L',33,61),(63,'Adidas','Blue','XL',41,45),(66,'Adidas','Black','XL',14,67),(67,'Adidas','Blue','XS',33,57),(68,'Adidas','White','XL',50,20),(71,'Adidas','White','L',18,88),(72,'Nike','Black','M',35,49),(73,'Levi','Blue','M',32,37),(76,'Nike','Blue','XL',22,87),(77,'Levi','Blue','L',28,15),(82,'Nike','Blue','L',36,19),(84,'Levi','Red','S',12,62),(87,'Adidas','Red','S',35,45),(90,'Levi','Black','XL',39,12),(93,'Levi','Red','XL',40,24);
/*!40000 ALTER TABLE `t_shirts` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-04-30 16:51:56

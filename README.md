create database tbl_lab_item

```bash
CREATE TABLE `tbl_lab_item`  (
  `labItemId` int(3) NOT NULL AUTO_INCREMENT,
  `labItemName` varchar(100) CHARACTER SET utf8 COLLATE utf8_unicode_ci NULL DEFAULT NULL,
  `labTypeId` int(2) NULL DEFAULT NULL,
  PRIMARY KEY (`labItemId`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 34 CHARACTER SET = utf8 COLLATE = utf8_unicode_ci ROW_FORMAT = Dynamic;
```

add database tbl_lab_item

```bash
INSERT INTO `tbl_lab_item` VALUES (1, 'CBC', 1);
INSERT INTO `tbl_lab_item` VALUES (2, 'Creatinine', 1);
INSERT INTO `tbl_lab_item` VALUES (3, 'Lipid Profile', 1);
INSERT INTO `tbl_lab_item` VALUES (4, 'Cholesterol', 1);
INSERT INTO `tbl_lab_item` VALUES (5, 'Triglyceride', 1);
INSERT INTO `tbl_lab_item` VALUES (6, 'HDL', 1);
INSERT INTO `tbl_lab_item` VALUES (7, 'LDL', 1);
INSERT INTO `tbl_lab_item` VALUES (8, 'Urine Albumine/Sugar', 1);
INSERT INTO `tbl_lab_item` VALUES (9, 'Glucose', 1);
INSERT INTO `tbl_lab_item` VALUES (10, 'Uric Acid', 1);
INSERT INTO `tbl_lab_item` VALUES (11, 'CBC', 2);
INSERT INTO `tbl_lab_item` VALUES (12, 'Creatinine', 2);
INSERT INTO `tbl_lab_item` VALUES (13, 'Lipid Profile', 2);
INSERT INTO `tbl_lab_item` VALUES (14, 'Cholesterol', 2);
INSERT INTO `tbl_lab_item` VALUES (15, 'Triglyceride', 2);
INSERT INTO `tbl_lab_item` VALUES (16, 'HDL', 2);
INSERT INTO `tbl_lab_item` VALUES (17, 'LDL', 2);
INSERT INTO `tbl_lab_item` VALUES (18, 'HbA1C', 2);
INSERT INTO `tbl_lab_item` VALUES (19, 'Urine Micro Albumine', 2);
INSERT INTO `tbl_lab_item` VALUES (20, 'Uric Acid', 2);
INSERT INTO `tbl_lab_item` VALUES (21, 'CBC', 3);
INSERT INTO `tbl_lab_item` VALUES (22, 'OF', 3);
INSERT INTO `tbl_lab_item` VALUES (23, 'DCIP', 3);
INSERT INTO `tbl_lab_item` VALUES (24, 'HBsAg', 3);
INSERT INTO `tbl_lab_item` VALUES (25, 'Anti-HIV', 3);
INSERT INTO `tbl_lab_item` VALUES (26, 'VDRL', 3);
INSERT INTO `tbl_lab_item` VALUES (27, 'Blood Group', 3);
INSERT INTO `tbl_lab_item` VALUES (28, 'Rh', 3);
INSERT INTO `tbl_lab_item` VALUES (29, 'CBC', 4);
INSERT INTO `tbl_lab_item` VALUES (30, 'Anti-HIV', 4);
INSERT INTO `tbl_lab_item` VALUES (31, 'VDRL', 4);
INSERT INTO `tbl_lab_item` VALUES (32, 'OF', 5);
INSERT INTO `tbl_lab_item` VALUES (33, 'DCIP', 5);
```

create database tbl_lab_type

```bash
CREATE TABLE `tbl_lab_type`  (
  `labTypeId` int(3) NOT NULL AUTO_INCREMENT,
  `labTypeName` varchar(50) CHARACTER SET utf8 COLLATE utf8_unicode_ci NULL DEFAULT NULL,
  `labSex` varchar(10) CHARACTER SET utf8 COLLATE utf8_unicode_ci NULL DEFAULT NULL,
  PRIMARY KEY (`labTypeId`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 6 CHARACTER SET = utf8 COLLATE = utf8_unicode_ci ROW_FORMAT = Dynamic;
```

insert database tbl_lab_type

```bash
INSERT INTO `tbl_lab_type` VALUES (1, 'HT', '1,2');
INSERT INTO `tbl_lab_type` VALUES (2, 'DM', '1,2');
INSERT INTO `tbl_lab_type` VALUES (3, 'ANC LAB 1', '2');
INSERT INTO `tbl_lab_type` VALUES (4, 'ANC LAB 2', '2');
INSERT INTO `tbl_lab_type` VALUES (5, 'ANC สามี', '1');
```

add database tbl_org

```bash
CREATE TABLE `jhcisdb`.`tbl_org`  (
  `orgId` int(2) NOT NULL AUTO_INCREMENT,
  `orgName` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `orgShortName` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `orgAddress` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL,
  `orgDocNo` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  PRIMARY KEY (`orgId`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 2 CHARACTER SET = latin1 COLLATE = latin1_swedish_ci ROW_FORMAT = Dynamic;
```

alter table user

```bash
ALTER TABLE jhcis.user
ADD telephone varchar(10) NULL,
ADD email varchar(100) NULL,
```

insert database tbl_org

```bash
INSERT INTO `tbl_org` VALUES (1, 'โรงพยาบาลส่งเสริมสุขภาพตำบลปะลุกาสาเมาะ', 'รพ.สต.ปะลุกาสาเมาะ', 'อ.บาเจาะ จ.นราธิวาส 96170', 'นธ 51006.0106/');
```

add column labTypeId in table visit

```bash
ALTER TABLE jhcisdb.visit ADD labTypeId INT(2) NULL;
insert user field such email, telephone
```

=============================================
BUILD DOCKER IMAGE

1. modify db info into db.js file
   2.1 build image

```bash
docker build -t jormae/lab3.0 .
```

2.2 push image

```bash
docker push jormae/lab3.0
```

2.3 pull image

```bash
docker pull jormae/lab3.0
```

- if build failed try to run

```bash
yarn install
```

\*\* to install yarn run command in cmd

```bash
npm install --global yarn
```

3.run image using docker desktop

```bash
docker pull jormae/lab3.0
```

3.1 set container name

```bash
lab3.0
```

3.2 set host port number

```bash
3000
```

3.3 set environment variables 'jhcisdb'

```bash
NEXT_HOST_NAME
```

```bash
NEXT_DB_USER
```

```bash
NEXT_DB_PASSWORD
```

```bash
NEXT_DB_NAME
```

```bash
NEXT_DB_PORT
```

3.4 run container

```bash
docker run --platform linux/amd64 -d -p 3000:3000 -it -e NEXT_DB_USER=root -e NEXT_DB_PASSWORD=123456 -e NEXT_DB_NAME=jhcisdb -e NEXT_DB_PORT=3306  --name lab3.0 jormae/lab3.0
```

4.update auto restart container

```bash
docker update --restart=always lab3.0
```

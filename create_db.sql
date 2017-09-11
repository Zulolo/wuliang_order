CREATE DATABASE IF NOT EXISTS wuliang_order;

use wuliang_order;

CREATE TABLE IF NOT EXISTS menu (
	ProductID INT NOT NULL,
	CreatePerson VARCHAR(255) NOT NULL,
	CreateDate DATE NOT NULL,
	UpdatePerson VARCHAR(255),
	UpdateDate DATE,
	ProductName VARCHAR(255) NOT NULL,
	ProductPrice REAL NOT NULL,
	ProductCategory VARCHAR(255),
	ProductImage VARCHAR(255),
	ProductStock REAL,
	ProductSoldNumber REAL,
	PRIMARY KEY ( ProductID )
);

CREATE TABLE IF NOT EXISTS feedback (
	ProductID INT NOT NULL,
	FeedbackID INT NOT NULL,
	CreatePerson VARCHAR(255) NOT NULL,
	CreateDate DATE NOT NULL,
	UpdateDate DATE,
	Rate INT NOT NULL,
	Comment VARCHAR(511),
	PRIMARY KEY ( ProductID )
);
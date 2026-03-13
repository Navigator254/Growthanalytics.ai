
DROP DATABASE IF EXISTS OnlineStore;
CREATE DATABASE OnlineStore;
USE OnlineStore;

-- =========================================
-- TASK 1: CREATE TABLES
-- =========================================

CREATE TABLE Customers (
    CustomerID INT AUTO_INCREMENT PRIMARY KEY,
    FullName VARCHAR(100) NOT NULL,
    CustomerEmail VARCHAR(100) NOT NULL,
    Phone VARCHAR(20) NOT NULL,
    Address VARCHAR(200) NOT NULL,
    EmailHash VARCHAR(64)
);

CREATE TABLE Products (
    ProductID INT AUTO_INCREMENT PRIMARY KEY,
    ProductName VARCHAR(100) NOT NULL,
    Price DECIMAL(10,2) NOT NULL,
    StockQuantity INT NOT NULL,
    ProductHash VARCHAR(64)
);

CREATE TABLE Orders (
    OrderID INT AUTO_INCREMENT PRIMARY KEY,
    CustomerID INT NOT NULL,
    OrderDate DATETIME NOT NULL,
    TotalAmount DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (CustomerID) REFERENCES Customers(CustomerID)
);

CREATE TABLE OrderItems (
    OrderItemID INT AUTO_INCREMENT PRIMARY KEY,
    OrderID INT NOT NULL,
    ProductID INT NOT NULL,
    Quantity INT NOT NULL,
    SubTotal DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (OrderID) REFERENCES Orders(OrderID),
    FOREIGN KEY (ProductID) REFERENCES Products(ProductID)
);

-- =========================================
-- CREATE INDEXES
-- =========================================

CREATE INDEX idx_customer_email ON Customers(CustomerEmail);
CREATE INDEX idx_product_name ON Products(ProductName);

-- =========================================
-- HASH BASED LOOKUP (Using MD5)
-- =========================================

UPDATE Customers SET EmailHash = MD5(CustomerEmail);
UPDATE Products SET ProductHash = MD5(ProductName);

-- =========================================
-- TASK 2: DATABASE AUTOMATION
-- =========================================

-- TRIGGER: ReduceStock
DELIMITER $$

CREATE TRIGGER ReduceStock
AFTER INSERT ON OrderItems
FOR EACH ROW
BEGIN
    UPDATE Products
    SET StockQuantity = StockQuantity - NEW.Quantity
    WHERE ProductID = NEW.ProductID;
END$$

DELIMITER ;

-- =========================================
-- STORED PROCEDURE
-- =========================================

DELIMITER $$

CREATE PROCEDURE UpdateProductStock(
    IN product_id INT,
    IN qty INT
)
BEGIN
    UPDATE Products
    SET StockQuantity = StockQuantity + qty
    WHERE ProductID = product_id;
END$$

DELIMITER ;

-- =========================================
-- CREATE VIEWS
-- =========================================

CREATE VIEW CustomerOrderSummary AS
SELECT 
    c.FullName AS CustomerName,
    o.OrderID,
    o.OrderDate,
    o.TotalAmount
FROM Customers c
JOIN Orders o 
ON c.CustomerID = o.CustomerID;

CREATE VIEW ProductStockView AS
SELECT 
    ProductName,
    Price,
    StockQuantity AS CurrentStock
FROM Products;

-- =========================================
-- TASK 3: INSERT DATA
-- =========================================

-- CUSTOMERS
INSERT INTO Customers (FullName, CustomerEmail, Phone, Address)
VALUES
('John Kamau','john@email.com','0711111111','Nairobi'),
('Mary Wanjiku','mary@email.com','0722222222','Kiambu'),
('Peter Otieno','peter@email.com','0733333333','Kisumu'),
('Alice Njeri','alice@email.com','0744444444','Nakuru'),
('David Mwangi','david@email.com','0755555555','Thika');

-- PRODUCTS
INSERT INTO Products (ProductName, Price, StockQuantity)
VALUES
('Laptop',85000,10),
('Smartphone',45000,20),
('Headphones',5000,30),
('Keyboard',2500,25),
('Mouse',1500,40);

-- UPDATE HASH VALUES
UPDATE Customers SET EmailHash = MD5(CustomerEmail);
UPDATE Products SET ProductHash = MD5(ProductName);

-- ORDERS
INSERT INTO Orders (CustomerID, OrderDate, TotalAmount)
VALUES
(1,NOW(),90000),
(2,NOW(),45000),
(3,NOW(),5000),
(4,NOW(),2500),
(5,NOW(),1500);

-- ORDER ITEMS
INSERT INTO OrderItems (OrderID, ProductID, Quantity, SubTotal)
VALUES
(1,1,1,85000),
(1,3,1,5000),
(2,2,1,45000),
(3,3,1,5000),
(4,4,1,2500);

-- =========================================
-- DATA MANIPULATION
-- =========================================

-- UPDATE PRODUCT PRICE
UPDATE Products
SET Price = 47000
WHERE ProductID = 2;

-- UPDATE CUSTOMER ADDRESS
UPDATE Customers
SET Address = 'Mombasa'
WHERE CustomerID = 3;

-- DELETE SPECIFIC ORDER ITEM
DELETE FROM OrderItems
WHERE OrderItemID = 5;

-- =========================================
-- REQUIRED QUERY OPERATIONS
-- =========================================

-- SHOW CUSTOMERS WITH THEIR ORDERS
SELECT 
c.FullName,
o.OrderID,
o.OrderDate,
o.TotalAmount
FROM Customers c
JOIN Orders o
ON c.CustomerID = o.CustomerID;

-- LINK ORDER ITEMS WITH PRODUCTS
SELECT 
o.OrderID,
p.ProductName,
oi.Quantity,
p.Price,
oi.SubTotal
FROM OrderItems oi
JOIN Products p
ON oi.ProductID = p.ProductID
JOIN Orders o
ON oi.OrderID = o.OrderID;

-- =========================================
-- TASK 4: TEST DATABASE COMPONENTS
-- =========================================

-- TEST TRIGGER
INSERT INTO OrderItems (OrderID, ProductID, Quantity, SubTotal)
VALUES (2,1,1,85000);

-- CHECK STOCK AFTER TRIGGER
SELECT ProductName, StockQuantity FROM Products;

-- TEST STORED PROCEDURE
CALL UpdateProductStock(1,5);

-- TEST VIEWS
SELECT * FROM CustomerOrderSummary;
SELECT * FROM ProductStockView;
# 🛒 CARTORA — Full-Stack E-Commerce Platform

<p align="center">
  <img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&height=200&section=header&text=CARTORA&fontSize=65&fontAlignY=35&desc=Modern%20Full-Stack%20E-Commerce%20Platform&descAlignY=60&descSize=18" width="100%"/>
</p>

<p align="center">
  <b>🛍️ Shop • 💳 Pay • 📦 Track • 🤖 Chat • 📊 Manage</b>
</p>

<p align="center">
  A modern and secure full-stack e-commerce platform designed to provide a smooth shopping experience for customers while giving sellers and administrators powerful tools to manage the marketplace.
</p>

---

## 🌟 Project Overview

**CARTORA** is a full-stack e-commerce web application built to simulate a real-world online shopping platform.

The application supports multiple types of users, including **Customers, Sellers, and Administrators**, with role-based access and dedicated dashboards.

Customers can browse products, search and filter items, manage their cart, place orders, make online payments, and track their purchases.

Sellers can manage their products, inventory, orders, and earnings, while administrators can manage users, products, sellers, and the overall platform.

---

## ✨ Key Features

### 👤 Customer Features

* 🔐 Secure user registration and login
* 🔑 JWT-based authentication
* 🔎 Product search
* 🏷️ Category-based filtering
* ↕️ Product sorting
* 📄 Pagination
* 🛒 Add to cart
* ➕ Update product quantity
* ❌ Remove products from cart
* 💳 Online checkout
* 💰 Razorpay & Stripe payment integration
* 📦 Order placement
* 🚚 Order tracking
* 📜 Order history
* 🤖 AI/Chatbot assistance

### 🏪 Seller Features

* 📊 Seller dashboard
* ➕ Add products
* ✏️ Edit products
* 🗑️ Delete products
* 📦 Manage inventory
* 📋 View customer orders
* 💰 Track earnings
* 📈 Monitor sales

### 🛡️ Admin Features

* 📊 Admin dashboard
* 👥 Manage users
* 🏪 Manage sellers
* 📦 Manage products
* 🛒 Manage orders
* 📈 Monitor platform activity
* 🔐 Role-based authorization

---

## 🖥️ Application Preview

> Add your real project screenshots in this section.

### 🏠 Home Page

<p align="center">
  <img src="screenshots/home.png" width="90%" alt="CARTORA Home Page"/>
</p>

### 🛍️ Product Listing

<p align="center">
  <img src="screenshots/products.png" width="90%" alt="Product Listing"/>
</p>

### 📦 Product Details

<p align="center">
  <img src="screenshots/product-details.png" width="90%" alt="Product Details"/>
</p>

### 🛒 Shopping Cart

<p align="center">
  <img src="screenshots/cart.png" width="90%" alt="Shopping Cart"/>
</p>

### 💳 Checkout & Payment

<p align="center">
  <img src="screenshots/checkout.png" width="90%" alt="Checkout"/>
</p>

### 📊 Seller Dashboard

<p align="center">
  <img src="screenshots/seller-dashboard.png" width="90%" alt="Seller Dashboard"/>
</p>

### 🛡️ Admin Dashboard

<p align="center">
  <img src="screenshots/admin-dashboard.png" width="90%" alt="Admin Dashboard"/>
</p>

---

## 🏗️ System Architecture

```text
                    ┌─────────────────────┐
                    │       CARTORA       │
                    │   E-Commerce App    │
                    └──────────┬──────────┘
                               │
             ┌─────────────────┼─────────────────┐
             │                 │                 │
             ▼                 ▼                 ▼
        👤 Customer        🏪 Seller          🛡️ Admin
             │                 │                 │
             └─────────────────┼─────────────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │    React Frontend   │
                    │ TypeScript + Redux  │
                    └──────────┬──────────┘
                               │
                            REST API
                               │
                               ▼
                    ┌─────────────────────┐
                    │   Spring Boot API   │
                    │ Security + JWT      │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │       MySQL         │
                    │      Database       │
                    └─────────────────────┘
```

---

## 🧰 Tech Stack

### 🎨 Frontend

* React.js
* TypeScript
* Redux Toolkit
* React Router
* Tailwind CSS
* HTML5
* CSS3

### ⚙️ Backend

* Java
* Spring Boot
* Spring Security
* JWT Authentication
* REST APIs
* JavaMailSender
* OTP Authentication

### 🗄️ Database

* MySQL

### 💳 Payment Integration

* Razorpay
* Stripe

### 🛠️ Development Tools

* Git
* GitHub
* VS Code
* Postman
* Maven

---

## 🔐 Security

CARTORA implements secure authentication and authorization using:

* 🔑 JWT Authentication
* 🛡️ Spring Security
* 👥 Role-Based Access Control
* 📧 OTP Verification
* 🔒 Protected APIs
* 🔐 Password Encryption
* 🚫 Unauthorized access prevention

---

## 🔄 User Flow

```text
User
 │
 ▼
Register / Login
 │
 ▼
Browse Products
 │
 ▼
Search / Filter / Sort
 │
 ▼
Product Details
 │
 ▼
Add to Cart
 │
 ▼
Checkout
 │
 ▼
Online Payment
 │
 ▼
Order Confirmation
 │
 ▼
Track Order
```

---

## 📁 Project Structure

```text
CARTORA/
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── redux/
│   │   ├── hooks/
│   │   └── utils/
│   │
│   └── package.json
│
├── backend/
│   ├── src/
│   │   └── main/
│   │       ├── java/
│   │       │   └── com/cartora/
│   │       │       ├── controller/
│   │       │       ├── service/
│   │       │       ├── repository/
│   │       │       ├── entity/
│   │       │       ├── dto/
│   │       │       ├── security/
│   │       │       └── config/
│   │       │
│   │       └── resources/
│   │           └── application.properties
│   │
│   └── pom.xml
│
└── README.md
```

---

## 💡 What I Learned

Through this project, I gained practical experience in:

* Building a complete full-stack web application
* Developing REST APIs using Spring Boot
* Connecting React with a Spring Boot backend
* Implementing JWT authentication
* Managing application state using Redux Toolkit
* Designing relational database structures
* Integrating online payment gateways
* Implementing role-based authorization
* Creating seller and admin dashboards
* Handling real-world CRUD operations
* Testing APIs using Postman
* Using Git and GitHub for version control

---

## 🚀 Future Improvements

* 📱 Fully responsive mobile-first design
* ⭐ Product reviews and ratings
* ❤️ Wishlist functionality
* 🔔 Real-time order notifications
* 🤖 Advanced AI shopping assistant
* 📈 Advanced sales analytics
* ☁️ Cloud deployment
* 🐳 Docker-based deployment
* 📦 Real-time inventory management

---

## 🎯 Project Highlights

| Feature                 | Status |
| ----------------------- | ------ |
| Customer Authentication | ✅      |
| Seller Authentication   | ✅      |
| Admin Authentication    | ✅      |
| Product Management      | ✅      |
| Shopping Cart           | ✅      |
| Order Management        | ✅      |
| Payment Integration     | ✅      |
| JWT Security            | ✅      |
| Seller Dashboard        | ✅      |
| Admin Dashboard         | ✅      |
| Chatbot                 | ✅      |
| Search & Filtering      | ✅      |

---

## 👩‍💻 Developer

**Jyoti Kumari**

B.Tech — Electronics & Communication Engineering

💻 Aspiring Software Engineer

---

<p align="center">
  ⭐ If you like this project, consider giving it a star!
</p>

<p align="center">
  Made with ❤️ using React & Spring Boot
</p>

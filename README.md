E-Commerce API

API for E-commerce backend project built with Node.js, Express, Sequelize, and Paymob integration.

E-Commerce API Documentation

https://cloudy-sunset-901741.postman.co/workspace/My-Workspace~13f3400d-51e0-4b09-82c2-8bc207ac20f4/collection/19716445-e6f12eaf-e124-46ac-a6ef-e8b1e74fb9e3?action=share&creator=19716445

user
POST /api/user/signup → Register new user
POST /api/user/signin → Login user and get token
GET /api/user/profile→ get user profile by send token
PATCH /api/user/profile→ edit user profile by send token (email,name,role)
PATCH /api/user/send-code→ get code to change password
PATCH /api/user/check-code→ check code send by user to change password
PATCH /api/user/new-password → change password

product
POST /api/product/addproduct→ create new product by admin
GET /api/product/products→ get products by all user type
GET /api/product/products/:id→ get product by id all user type
PATCH /api/product/products/:id→ edit product by admin (name, price, description, category)
DELETE /api/product/products/:id→ delete product by admin

category
POST /api/category/addcategory→ create new category by admin
GET /api/category/categories→ get categories by all user type
GET /api/category/categories/:id→ get categoriesby id all user type
PATCH /api/category/categories/:id→ edit category by admin (name, description)
DELETE /api/category/categories/:id→ delete categoryby admin

cart
POST /api/cart/addcart→ create new cartby all user type
GET /api/cart/carts→ get categories by all user type
PATCH /api/cart/carts/:itemId→ edit cart by all user type (name, description)
DELETE /api/cart/carts/:itemId→ delete cartby all user type


order
POST /api/order/createorder→ create new order by all user type
GET /api/order/orders→ get orders by user token
PATCH /api/order/orders/:id→ edit order by user token status patch
DELETE /api/order/orders/:id→ delete order by user token






# Rikkei Academy - Da Nang - NodeJS Tutorial

## Khởi tạo project

```shell
npm init
```

## Cài đặt các thư viện

```shell
npm install express cors body-parser morgan bcrypt multer mysql
```

## Cấu trúc source

```
├───public/                         # Thư mục chứa file tĩnh (hình ảnh, ...)
├───logs/                           # Lưu trữ nhật ký của ứng dụng
├───src/
    ├───application/
    │   ├───controllers/            # Xử lý điều hướng (request/response)
    │   ├───middlewares/            # Middlewares
    │   ├───repositories/           # Xử lý truy vấn dữ liệu đến database (MySQL)
    │   ├───services/               # Xử lý logic nghiệp vụ
    │   └───routes.js               # Định tuyến request
    └───config/
        └───connection.database.js  # Kết nối database (MySQL)
└───index.js
└───package.json
```

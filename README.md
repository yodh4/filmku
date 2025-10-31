## Description
Filmku adalah API RESTful untuk situs web ulasan film. API ini memungkinkan pengguna untuk mendaftar dan mengautentikasi untuk memposting, memperbarui, dan menghapus ulasan mereka untuk berbagai film. Pengguna yang tidak terautentikasi dapat menelusuri film dan membaca ulasan.

## Environment Variable
```
DATABASE_URL=...
JWT_SECRET=...
JWT_EXPIRATION=...
```

## Deployment Link
### Backend: https://filmku-bb866a595f4e.herokuapp.com

## API Documentation
### Postman: https://documenter.getpostman.com/view/29704147/2sB3Wnxhef

## Pattern Project
### 1. Three-Layer Architecture
Projek ini saya buat dengan menggunakan three-layer architecture. Arsitektur ini akan membuat tiga layer arsitektur yaitu layer `controller`, layer `service`, dan layer `repository` dengan setiap layer memiliki tanggung jawabnya sendiri-sendiri.

1.  **Controller Layer (`*.controller.ts`):** 
Ini adalah layer terluar dari aplikasi yang dibuat. Tanggung jawab utamanya adalah menangani permintaan HTTP yang masuk dan mengirimkan respons. Layer ini akan memproses parameter request , query string, dan isi request, lalu mendelegasikan pekerjaan yang sebenarnya ke `service` layer. Layer ini tidak boleh berisi logika bisnis atau akses langsung ke basis data.

2.  **Service Layer (`*.service.ts`):** 
Ini adalah inti dari aplikasi dan berisi semua logika bisnis. Layer ini akan mengatur operasi aplikasi, memvalidasi data, dan membuat keputusan. Layer `service` akan mengambil atau menyimpan data dengan memanggil metode pada `repostitory` layer. Layer ini tidak fokus dengan *bagaimana* data disimpan atau diambil, melainkan dengan *data apa* yang dibutuhkannya.

3.  **Repository Layer (`*.repository.ts`):** 
Ini adalah layer untuk mengakses data. Tugasnya hanya berkomunikasi dengan basis data. Layer ini berisi semua logika untuk kueri dan manipulasi data dari database. Layer ini menyediakan API yang bersih dan berorientasi objek bagi 'service' layer untuk mengakses data, tanpa peduli detail implementasi basis data yang mendasarinya.

**Dengan menggunakan arsitektur ini flow http request-nya akan menjadi seperti berikut:**

`HTTP Request` → `Controller` → `Service` → `Repository` → `Database`

Keunggulan menggunakan **Three-Layer Architecture** di antaranya adalah:
- **Decoupling & Separation of Concerns**

    Arsitektur ini menciptkana batasan yang jelas antara business logic dan akses data. Business logic terpisah sepenuhnya dari database sehingga kita dapat mengubah database atau query tanpa perlu merefactor business logic.

- **Mempermudah Proses Testing**

    Three-Layer Architecture dapat mempermudah proses testing, misalnya kita dapat dengan mudah membuat versi mock dari repositori yang dibutuhkan ketika ingin menguji `service` layer. Hal ini memungkinkan kita untuk menguji business logic secara terpisah, sehingga pengujian dapat dilakukan dengan lebih cepat dan lebih mudah.

  
### 2. DTO Pattern

DTO (Data Transfer Object) adalah objek yang menentukan struktur data yang dikirim. Dalam aplikasi ini DTO digunakan dalam bentuk `DTO Request` untuk menentukan struktur yang diharapkan dari request body yang masuk, dan dalam bentuk `DTO Response` untuk menentukan struktur response body yang akan dikirim ke client.

Keuntungan yang didapat jika menggunakan DTO pattern di antaranya:

1. **Keamanan**

    DTO pattern dapat mencegah exposure data sensitif ke client karena kita secara eksplisit membuat struktur data yang akan dikirim ke client

2. **Validasi Otomatis**

    Kita dapat memvalidasi request body yang masuk dengan menggunakan library `class-validator`. Kita hanya perlu men-configure `ValidationPipe` di `main.ts` untuk men-enforce aturan tertentu untuk setiap request body yang masuk dan aplikasi akan me-reject suatu request secara otomatis apabila terdapat request body yang tidak sesuai dengan aturan yang kita buat

3. **Definisi API yang Jelas**

    Menggunakan DTO pattern dapat mempermudah kolaborasi dengan developer lain karena setiap developer hanya perlu melihat file DTO untuk mengetahui data yang perlu dikirim dan bagaimana response dari suatu endpoint.
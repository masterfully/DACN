# API Document

- [API Document](#api-document)
  - [I. General information](#i-general-information)
  - [II. Endpoints](#ii-endpoints)
    - [1. Auth](#1-auth)
      - [1.1. Login](#11-login)
      - [1.2. Logout](#12-logout)
      - [1.3. Refresh Token](#13-refresh-token)
      - [1.4. Change Password](#14-change-password)
      - [1.5. Register](#15-register)
    - [2. Account](#2-account)
      - [2.1. Get Account List](#21-get-account-list)
      - [2.2. Create Account](#22-create-account)
      - [2.3. Get Account Detail](#23-get-account-detail)
      - [2.4. Update Account](#24-update-account)
      - [2.5. Delete Account](#25-delete-account)
      - [2.6. Get My Account](#26-get-my-account)
    - [3. UserProfile](#3-userprofile)
      - [3.1. Get Profile List](#31-get-profile-list)
      - [3.2. Get Profile Detail](#32-get-profile-detail)
      - [3.3. Update Profile](#33-update-profile)
      - [3.4. Get My Profile](#34-get-my-profile)
      - [3.5. Update My Profile](#35-update-my-profile)
      - [3.6. Get Student List](#36-get-student-list)
      - [3.7. Get Lecturer List](#37-get-lecturer-list)
    - [4. Subject](#4-subject)
      - [4.1. Get Subject List](#41-get-subject-list)
      - [4.2. Create Subject](#42-create-subject)
      - [4.3. Get Subject Detail](#43-get-subject-detail)
      - [4.4. Update Subject](#44-update-subject)
      - [4.5. Delete Subject](#45-delete-subject)
    - [5. Section](#5-section)
      - [5.1. Get Section List](#51-get-section-list)
      - [5.2. Create Section](#52-create-section)
      - [5.3. Get Section Detail](#53-get-section-detail)
      - [5.4. Update Section](#54-update-section)
      - [5.5. Delete Section](#55-delete-section)
      - [5.6. Get Students in Section](#56-get-students-in-section)
      - [5.7. Get My Sections (Lecturer)](#57-get-my-sections-lecturer)
      - [5.8. Update Section Status](#58-update-section-status)
      - [5.9. Update Section Visibility](#59-update-section-visibility)
    - [6. Registration](#6-registration)
      - [6.1. Get Registration List](#61-get-registration-list)
      - [6.2. Register Section](#62-register-section)
      - [6.3. Cancel Registration](#63-cancel-registration)
      - [6.4. Get My Registrations](#64-get-my-registrations)
      - [6.5. Get Registrations by Section](#65-get-registrations-by-section)
    - [7. Room](#7-room)
      - [7.1. Get Room List](#71-get-room-list)
      - [7.2. Create Room](#72-create-room)
      - [7.3. Get Room Detail](#73-get-room-detail)
      - [7.4. Update Room](#74-update-room)
      - [7.5. Delete Room](#75-delete-room)
      - [7.6. Get Room Schedules](#76-get-room-schedules)
      - [7.7. Get Available Rooms](#77-get-available-rooms)
    - [8. Schedule](#8-schedule)
      - [8.1. Get Schedule List](#81-get-schedule-list)
      - [8.2. Create Schedule](#82-create-schedule)
      - [8.3. Get Schedule Detail](#83-get-schedule-detail)
      - [8.4. Update Schedule](#84-update-schedule)
      - [8.5. Delete Schedule](#85-delete-schedule)
      - [8.6. Get My Schedule](#86-get-my-schedule)
      - [8.7. Get Schedules by Section](#87-get-schedules-by-section)
    - [9. UsageHistory](#9-usagehistory)
      - [9.1. Get Usage History List](#91-get-usage-history-list)
      - [9.2. Create Usage History](#92-create-usage-history)
      - [9.3. Get Usage History Detail](#93-get-usage-history-detail)
      - [9.4. Update Usage History](#94-update-usage-history)
      - [9.5. Delete Usage History](#95-delete-usage-history)
      - [9.6. Get Usage Histories by Room](#96-get-usage-histories-by-room)
      - [9.7. Add Section to Usage History](#97-add-section-to-usage-history)
      - [9.8. Remove Section from Usage History](#98-remove-section-from-usage-history)
    - [10. Attendance](#10-attendance)
      - [10.1. Get Attendance List](#101-get-attendance-list)
      - [10.2. Create Attendance](#102-create-attendance)
      - [10.3. Get Attendance Detail](#103-get-attendance-detail)
      - [10.4. Update Attendance](#104-update-attendance)
      - [10.5. Delete Attendance](#105-delete-attendance)
      - [10.6. Get Attendances by Section](#106-get-attendances-by-section)
    - [11. AttendanceDetail](#11-attendancedetail)
      - [11.1. Get Attendance Details](#111-get-attendance-details)
      - [11.2. Create Attendance Details (Bulk)](#112-create-attendance-details-bulk)
      - [11.3. Update Attendance Detail](#113-update-attendance-detail)
      - [11.4. Get Attendance Summary by Student](#114-get-attendance-summary-by-student)
    - [12. ProfileApplication](#12-profileapplication)
      - [12.1. Get Application List](#121-get-application-list)
      - [12.2. Submit Application](#122-submit-application)
      - [12.3. Get Application Detail](#123-get-application-detail)
      - [12.4. Update Application](#124-update-application)
      - [12.5. Review Application](#125-review-application)
      - [12.6. Get My Applications](#126-get-my-applications)
    - [13. CertificateType](#13-certificatetype)
      - [13.1. Get Certificate Type List](#131-get-certificate-type-list)
      - [13.2. Create Certificate Type](#132-create-certificate-type)
      - [13.3. Get Certificate Type Detail](#133-get-certificate-type-detail)
      - [13.4. Update Certificate Type](#134-update-certificate-type)
      - [13.5. Delete Certificate Type](#135-delete-certificate-type)
    - [14. CertificateDetail](#14-certificatedetail)
      - [14.1. Get Certificate List](#141-get-certificate-list)
      - [14.2. Create Certificate](#142-create-certificate)
      - [14.3. Get Certificate Detail](#143-get-certificate-detail)
      - [14.4. Update Certificate](#144-update-certificate)
      - [14.5. Delete Certificate](#145-delete-certificate)
      - [14.6. Get Certificates by Application](#146-get-certificates-by-application)
    - [15. StudentCertificates](#15-studentcertificates)
      - [15.1. Get Student Certificates](#151-get-student-certificates)
      - [15.2. Add Certificate to Student](#152-add-certificate-to-student)
      - [15.3. Remove Certificate from Student](#153-remove-certificate-from-student)

## I. General information

Base URL: `/api/**/*`

Response Structure:

```
{
    "success": boolean,
    "data": object | array | null,
    "error": {
        "code": string,
        "message": string,
    } | null,
    "meta": {
        "page": number,
        "limit": number,
        "total": number
    }
}
```

**_Example response_**:

- Success:

  ```
  {
      "success": true,
      "data": UserProfile,
  }

  ```

- Error:

  ```
  {
      "success": false,
      "error": {
          "code": "EMAIL_EXISTED",
          "message": "Đăng ký thất bại, email đã tồn tại"
      }
  }
  ```

## II. Endpoints

---

### 1. Auth

#### 1.1. Login

**Description**: Đăng nhập vào hệ thống. Trả về access token và refresh token. Không yêu cầu xác thực trước.

**URL**: `/api/auth/login`

**Method**: `POST`

**Body Request**:

| Field    |  Type  | Required | Description   |
| -------- | :----: | :------: | ------------- |
| username | string |   Yes    | Tên đăng nhập |
| password | string |   Yes    | Mật khẩu      |

```json
{
  "username": "admin01",
  "password": "Secret@123"
}
```

**Example Response:**

- Success:

  ```json
  {
    "success": true,
    "data": {
      "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "refreshToken": "dGhpcyBpcyBhIHJlZnJlc2ggdG9rZW4...",
      "account": {
        "accountId": 1,
        "username": "admin01",
        "role": "ADMIN",
        "profile": {
          "profileId": 1,
          "fullName": "Nguyễn Văn Admin",
          "email": "admin@university.edu.vn",
          "avatar": "https://storage.example.com/avatars/1.jpg",
          "status": "active"
        }
      }
    }
  }
  ```

- Error:

  ```json
  {
    "success": false,
    "error": {
      "code": "INVALID_CREDENTIALS",
      "message": "Tên đăng nhập hoặc mật khẩu không đúng"
    }
  }
  ```

---

#### 1.2. Logout

**Description**: Đăng xuất khỏi hệ thống, vô hiệu hóa refresh token. Yêu cầu xác thực: `Authorization: Bearer <token>`.

**URL**: `/api/auth/logout`

**Method**: `POST`

**Body Request**:

| Field        |  Type  | Required | Description   |
| ------------ | :----: | :------: | ------------- |
| refreshToken | string |   Yes    | Refresh token |

```json
{
  "refreshToken": "dGhpcyBpcyBhIHJlZnJlc2ggdG9rZW4..."
}
```

**Example Response:**

- Success:

  ```json
  {
    "success": true,
    "data": null
  }
  ```

- Error:

  ```json
  {
    "success": false,
    "error": {
      "code": "INVALID_TOKEN",
      "message": "Token không hợp lệ hoặc đã hết hạn"
    }
  }
  ```

---

#### 1.3. Refresh Token

**Description**: Làm mới access token bằng refresh token hiện có.

**URL**: `/api/auth/refresh-token`

**Method**: `POST`

**Body Request**:

| Field        |  Type  | Required | Description   |
| ------------ | :----: | :------: | ------------- |
| refreshToken | string |   Yes    | Refresh token |

```json
{
  "refreshToken": "dGhpcyBpcyBhIHJlZnJlc2ggdG9rZW4..."
}
```

**Example Response:**

- Success:

  ```json
  {
    "success": true,
    "data": {
      "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "refreshToken": "bmV3UmVmcmVzaFRva2Vu..."
    }
  }
  ```

- Error:

  ```json
  {
    "success": false,
    "error": {
      "code": "REFRESH_TOKEN_EXPIRED",
      "message": "Refresh token đã hết hạn, vui lòng đăng nhập lại"
    }
  }
  ```

---

#### 1.4. Change Password

**Description**: Đổi mật khẩu tài khoản hiện tại. Yêu cầu xác thực: `Authorization: Bearer <token>`.

**URL**: `/api/auth/change-password`

**Method**: `PUT`

**Body Request**:

| Field           |  Type  | Required | Description       |
| --------------- | :----: | :------: | ----------------- |
| currentPassword | string |   Yes    | Mật khẩu hiện tại |
| newPassword     | string |   Yes    | Mật khẩu mới      |

```json
{
  "currentPassword": "Secret@123",
  "newPassword": "NewSecret@456"
}
```

**Example Response:**

- Success:

  ```json
  {
    "success": true,
    "data": null
  }
  ```

- Error:

  ```json
  {
    "success": false,
    "error": {
      "code": "WRONG_CURRENT_PASSWORD",
      "message": "Mật khẩu hiện tại không chính xác"
    }
  }
  ```

---

#### 1.5. Register

**Description**: Tự đăng ký tài khoản mới (dành cho sinh viên). Hệ thống tự động tạo `Account` với role `STUDENT` và `UserProfile` tương ứng. Không yêu cầu xác thực trước.

**URL**: `/api/auth/register`

**Method**: `POST`

**Body Request**:

| Field           |  Type  | Required | Description                                |
| --------------- | :----: | :------: | ------------------------------------------ |
| fullName        | string |   Yes    | Họ và tên                                  |
| username        | string |   Yes    | Username                                   |
| email           | string |   Yes    | Email của người dùng                       |
| password        | string |   Yes    | Mật khẩu                                   |
| confirmPassword | string |   Yes    | Xác nhận mật khẩu (phải khớp với password) |

```json
{
  "fullName": "Nguyễn Văn A",
  "username": "admin01",
  "email": "nguyenvana@example.com",
  "password": "Secret@123",
  "confirmPassword": "Secret@123"
}
```

**Example Response:**

- Success:

  ```json
  {
    "success": true,
    "data": {
      "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "refreshToken": "dGhpcyBpcyBhIHJlZnJlc2ggdG9rZW4...",
      "account": {
        "accountId": 10,
        "username": "admin01",
        "role": "ADMIN",
        "profile": {
          "profileId": 10,
          "fullName": "Nguyễn Văn A",
          "email": "nguyenvana@example.com",
          "avatar": null,
          "status": "active"
        }
      }
    }
  }
  ```

- Error:

  ```json
  {
    "success": false,
    "error": {
      "code": "EMAIL_EXISTED",
      "message": "Email đã được sử dụng cho tài khoản khác"
    }
  }
  ```

---

### 2. Account

#### 2.1. Get Account List

**Description**: Lấy danh sách tài khoản có phân trang và lọc theo role. Yêu cầu role: `ADMIN`.

**URL**: `/api/accounts`

**Method**: `GET`

**Query Params**:

| Field |  Type  | Required | Description                             |
| ----- | :----: | :------: | --------------------------------------- |
| page  | number |    No    | Trang hiện tại (mặc định: 1)            |
| limit | number |    No    | Số bản ghi mỗi trang (mặc định: 10)     |
| role  | string |    No    | Lọc theo role: ADMIN, LECTURER, STUDENT |

```
GET /api/accounts?page=1&limit=10&role=STUDENT
```

**Example Response:**

- Success:

  ```json
  {
    "success": true,
    "data": [
      {
        "accountId": 1,
        "username": "admin01",
        "role": "ADMIN",
        "profile": {
          "profileId": 1,
          "fullName": "Nguyễn Văn Admin",
          "email": "admin@university.edu.vn",
          "avatar": "https://storage.example.com/avatars/1.jpg",
          "status": "active"
        }
      },
      {
        "accountId": 2,
        "username": "student01",
        "role": "STUDENT",
        "profile": {
          "profileId": 3,
          "fullName": "Trần Thị B",
          "email": "tranthib@example.com",
          "avatar": null,
          "status": "active"
        }
      }
    ],
    "meta": {
      "page": 1,
      "limit": 10,
      "total": 2
    }
  }
  ```

- Error:

  ```json
  {
    "success": false,
    "error": {
      "code": "FORBIDDEN",
      "message": "Bạn không có quyền truy cập tài nguyên này"
    }
  }
  ```

---

#### 2.2. Create Account

**Description**: Tạo tài khoản mới. Yêu cầu role: `ADMIN`.

**URL**: `/api/accounts`

**Method**: `POST`

**Body Request**:

| Field    |  Type  | Required | Description                    |
| -------- | :----: | :------: | ------------------------------ |
| username | string |   Yes    | Tên đăng nhập (duy nhất)       |
| email    | string |   Yes    | Email                          |
| password | string |   Yes    | Mật khẩu                       |
| role     | string |   Yes    | Role: ADMIN, LECTURER, STUDENT |

```json
{
  "username": "lecturer01",
  "email": "nguyenvana@example.com",
  "password": "Temp@123",
  "role": "LECTURER"
}
```

**Example Response:**

- Success:

  ```json
  {
    "success": true,
    "data": {
      "accountId": 5,
      "username": "lecturer01",
      "role": "LECTURER",
      "profile": null
    }
  }
  ```

- Error:

  ```json
  {
    "success": false,
    "error": {
      "code": "USERNAME_EXISTED",
      "message": "Tên đăng nhập đã tồn tại"
    }
  }
  ```

---

#### 2.3. Get Account Detail

**Description**: Lấy chi tiết một tài khoản theo ID. Yêu cầu role: `ADMIN`.

**URL**: `/api/accounts/{accountId}`

**Method**: `GET`

**Query Params**: Không có.

**Example Response:**

- Success:

  ```json
  {
    "success": true,
    "data": {
      "accountId": 5,
      "username": "lecturer01",
      "role": "LECTURER",
      "profile": {
        "profileId": 5,
        "fullName": "TS. Lê Văn C",
        "email": "levanc@university.edu.vn",
        "avatar": "https://storage.example.com/avatars/5.jpg",
        "status": "active"
      }
    }
  }
  ```

- Error:

  ```json
  {
    "success": false,
    "error": {
      "code": "ACCOUNT_NOT_FOUND",
      "message": "Tài khoản không tồn tại"
    }
  }
  ```

---

#### 2.4. Update Account

**Description**: Cập nhật thông tin tài khoản (username, role). Yêu cầu role: `ADMIN`.

**URL**: `/api/accounts/{accountId}`

**Method**: `PUT`

**Body Request**:

| Field    |  Type  | Required | Description                        |
| -------- | :----: | :------: | ---------------------------------- |
| username | string |    No    | Tên đăng nhập mới                  |
| role     | string |    No    | Role mới: ADMIN, LECTURER, STUDENT |

```json
{
  "username": "lecturer01_updated",
  "role": "LECTURER"
}
```

**Example Response:**

- Success:

  ```json
  {
    "success": true,
    "data": {
      "accountId": 5,
      "username": "lecturer01_updated",
      "role": "LECTURER",
      "profile": {
        "profileId": 5,
        "fullName": "TS. Lê Văn C",
        "email": "levanc@university.edu.vn",
        "avatar": "https://storage.example.com/avatars/5.jpg",
        "status": "active"
      }
    }
  }
  ```

- Error:

  ```json
  {
    "success": false,
    "error": {
      "code": "ACCOUNT_NOT_FOUND",
      "message": "Tài khoản không tồn tại"
    }
  }
  ```

---

#### 2.5. Delete Account

**Description**: Xóa tài khoản theo ID. Yêu cầu role: `ADMIN`.

**URL**: `/api/accounts/{accountId}`

**Method**: `DELETE`

**Query Params**: Không có.

**Example Response:**

- Success:

  ```json
  {
    "success": true,
    "data": null
  }
  ```

- Error:

  ```json
  {
    "success": false,
    "error": {
      "code": "ACCOUNT_NOT_FOUND",
      "message": "Tài khoản không tồn tại"
    }
  }
  ```

---

#### 2.6. Get My Account

**Description**: Lấy thông tin tài khoản của người dùng đang đăng nhập. Yêu cầu xác thực: `Authorization: Bearer <token>`.

**URL**: `/api/accounts/me`

**Method**: `GET`

**Query Params**: Không có.

**Example Response:**

- Success:

  ```json
  {
    "success": true,
    "data": {
      "accountId": 5,
      "username": "lecturer01",
      "role": "LECTURER",
      "profile": {
        "profileId": 5,
        "fullName": "TS. Lê Văn C",
        "email": "levanc@university.edu.vn",
        "avatar": "https://storage.example.com/avatars/5.jpg",
        "status": "active"
      }
    }
  }
  ```

- Error:

  ```json
  {
    "success": false,
    "error": {
      "code": "UNAUTHORIZED",
      "message": "Vui lòng đăng nhập để tiếp tục"
    }
  }
  ```

---

### 3. UserProfile

#### 3.1. Get Profile List

**Description**: Lấy danh sách hồ sơ người dùng. Yêu cầu role: `ADMIN`.

**URL**: `/api/profiles`

**Method**: `GET`

**Query Params**:

| Field  |  Type  | Required | Description                         |
| ------ | :----: | :------: | ----------------------------------- |
| page   | number |    No    | Trang hiện tại (mặc định: 1)        |
| limit  | number |    No    | Số bản ghi mỗi trang (mặc định: 10) |
| search | string |    No    | Tìm theo tên hoặc email             |

```
GET /api/profiles?page=1&limit=10&search=Nguyen
```

**Example Response:**

- Success:

  ```json
  {
    "success": true,
    "data": [
      {
        "profileId": 1,
        "accountId": 2,
        "role": "STUDENT",
        "fullName": "Nguyễn Văn A",
        "email": "nguyenvana@example.com",
        "phoneNumber": "0901234567",
        "dateOfBirth": "2002-05-15",
        "gender": "Nam",
        "status": "active"
      }
    ],
    "meta": {
      "page": 1,
      "limit": 10,
      "total": 1
    }
  }
  ```

- Error:

  ```json
  {
    "success": false,
    "error": {
      "code": "FORBIDDEN",
      "message": "Bạn không có quyền truy cập tài nguyên này"
    }
  }
  ```

---

#### 3.2. Get Profile Detail

**Description**: Lấy chi tiết hồ sơ theo ID. Yêu cầu role: `ADMIN` hoặc chính chủ.

**URL**: `/api/profiles/{profileId}`

**Method**: `GET`

**Query Params**: Không có.

**Example Response:**

- Success:

  ```json
  {
    "success": true,
    "data": {
      "profileId": 1,
      "accountId": 2,
      "role": "STUDENT",
      "fullName": "Nguyễn Văn A",
      "email": "nguyenvana@example.com",
      "phoneNumber": "0901234567",
      "dateOfBirth": "2002-05-15",
      "gender": "Nam",
      "avatar": "https://storage.example.com/avatars/1.jpg",
      "citizenId": "079202012345",
      "hometown": "Hà Nội",
      "status": "active"
    }
  }
  ```

- Error:

  ```json
  {
    "success": false,
    "error": {
      "code": "PROFILE_NOT_FOUND",
      "message": "Hồ sơ không tồn tại"
    }
  }
  ```

---

#### 3.3. Update Profile

**Description**: Cập nhật hồ sơ theo ID. Yêu cầu role: `ADMIN` hoặc chính chủ.

**URL**: `/api/profiles/{profileId}`

**Method**: `PUT`

**Body Request**:

| Field       |  Type  | Required | Description            |
| ----------- | :----: | :------: | ---------------------- |
| fullName    | string |    No    | Họ và tên              |
| phoneNumber | string |    No    | Số điện thoại          |
| dateOfBirth | string |    No    | Ngày sinh (YYYY-MM-DD) |
| gender      | string |    No    | Giới tính              |
| email       | string |    No    | Email                  |
| avatar      | string |    No    | URL ảnh đại diện       |
| citizenId   | string |    No    | CCCD/CMND              |
| hometown    | string |    No    | Quê quán               |
| status      | string |    No    | Trạng thái             |

```json
{
  "fullName": "Nguyễn Văn A",
  "phoneNumber": "0901234567",
  "email": "nguyenvana@example.com"
}
```

**Example Response:**

- Success:

  ```json
  {
    "success": true,
    "data": {
      "profileId": 1,
      "accountId": 2,
      "role": "STUDENT",
      "fullName": "Nguyễn Văn A",
      "phoneNumber": "0901234567",
      "email": "nguyenvana@example.com"
    }
  }
  ```

- Error:

  ```json
  {
    "success": false,
    "error": {
      "code": "PROFILE_NOT_FOUND",
      "message": "Hồ sơ không tồn tại"
    }
  }
  ```

---

#### 3.4. Get My Profile

**Description**: Lấy hồ sơ của người dùng đang đăng nhập. Yêu cầu xác thực: `Authorization: Bearer <token>`.

**URL**: `/api/profiles/me`

**Method**: `GET`

**Query Params**: Không có.

**Example Response:**

- Success:

  ```json
  {
    "success": true,
    "data": {
      "profileId": 1,
      "accountId": 2,
      "role": "STUDENT",
      "fullName": "Nguyễn Văn A",
      "email": "nguyenvana@example.com",
      "phoneNumber": "0901234567",
      "dateOfBirth": "2002-05-15",
      "gender": "Nam",
      "status": "active"
    }
  }
  ```

- Error:

  ```json
  {
    "success": false,
    "error": {
      "code": "UNAUTHORIZED",
      "message": "Vui lòng đăng nhập để tiếp tục"
    }
  }
  ```

---

#### 3.5. Update My Profile

**Description**: Cập nhật hồ sơ của người dùng đang đăng nhập. Yêu cầu xác thực: `Authorization: Bearer <token>`.

**URL**: `/api/profiles/me`

**Method**: `PUT`

**Body Request**:

| Field       |  Type  | Required | Description            |
| ----------- | :----: | :------: | ---------------------- |
| fullName    | string |    No    | Họ và tên              |
| phoneNumber | string |    No    | Số điện thoại          |
| dateOfBirth | string |    No    | Ngày sinh (YYYY-MM-DD) |
| gender      | string |    No    | Giới tính              |
| email       | string |    No    | Email                  |
| avatar      | string |    No    | URL ảnh đại diện       |
| citizenId   | string |    No    | CCCD/CMND              |
| hometown    | string |    No    | Quê quán               |

```json
{
  "phoneNumber": "0909999888",
  "avatar": "https://storage.example.com/avatars/new.jpg"
}
```

**Example Response:**

- Success:

  ```json
  {
    "success": true,
    "data": {
      "profileId": 1,
      "accountId": 2,
      "role": "STUDENT",
      "fullName": "Nguyễn Văn A",
      "phoneNumber": "0909999888",
      "avatar": "https://storage.example.com/avatars/new.jpg"
    }
  }
  ```

- Error:

  ```json
  {
    "success": false,
    "error": {
      "code": "UNAUTHORIZED",
      "message": "Vui lòng đăng nhập để tiếp tục"
    }
  }
  ```

---

#### 3.6. Get Student List

**Description**: Lấy danh sách hồ sơ sinh viên. Yêu cầu role: `ADMIN`, `LECTURER`.

**URL**: `/api/profiles/students`

**Method**: `GET`

**Query Params**:

| Field  |  Type  | Required | Description                         |
| ------ | :----: | :------: | ----------------------------------- |
| page   | number |    No    | Trang hiện tại (mặc định: 1)        |
| limit  | number |    No    | Số bản ghi mỗi trang (mặc định: 10) |
| search | string |    No    | Tìm theo tên hoặc email             |

```
GET /api/profiles/students?page=1&limit=20
```

**Example Response:**

- Success:

  ```json
  {
    "success": true,
    "data": [
      {
        "profileId": 3,
        "accountId": 4,
        "role": "STUDENT",
        "fullName": "Trần Thị B",
        "email": "tranthib@example.com",
        "status": "active"
      }
    ],
    "meta": {
      "page": 1,
      "limit": 20,
      "total": 1
    }
  }
  ```

- Error:

  ```json
  {
    "success": false,
    "error": {
      "code": "FORBIDDEN",
      "message": "Bạn không có quyền truy cập tài nguyên này"
    }
  }
  ```

---

#### 3.7. Get Lecturer List

**Description**: Lấy danh sách hồ sơ giảng viên. Yêu cầu role: `ADMIN`.

**URL**: `/api/profiles/lecturers`

**Method**: `GET`

**Query Params**:

| Field  |  Type  | Required | Description                         |
| ------ | :----: | :------: | ----------------------------------- |
| page   | number |    No    | Trang hiện tại (mặc định: 1)        |
| limit  | number |    No    | Số bản ghi mỗi trang (mặc định: 10) |
| search | string |    No    | Tìm theo tên                        |

```
GET /api/profiles/lecturers?page=1&limit=10
```

**Example Response:**

- Success:

  ```json
  {
    "success": true,
    "data": [
      {
        "profileId": 5,
        "accountId": 6,
        "role": "LECTURER",
        "fullName": "TS. Lê Văn C",
        "email": "levanc@university.edu.vn",
        "status": "active"
      }
    ],
    "meta": {
      "page": 1,
      "limit": 10,
      "total": 1
    }
  }
  ```

- Error:

  ```json
  {
    "success": false,
    "error": {
      "code": "FORBIDDEN",
      "message": "Bạn không có quyền truy cập tài nguyên này"
    }
  }
  ```

---

### 4. Subject

#### 4.1. Get Subject List

**Description**: Lấy danh sách môn học. Yêu cầu xác thực: `Authorization: Bearer <token>`.

**URL**: `/api/subjects`

**Method**: `GET`

**Query Params**:

| Field  |  Type  | Required | Description                         |
| ------ | :----: | :------: | ----------------------------------- |
| page   | number |    No    | Trang hiện tại (mặc định: 1)        |
| limit  | number |    No    | Số bản ghi mỗi trang (mặc định: 10) |
| search | string |    No    | Tìm theo tên môn học                |

```
GET /api/subjects?page=1&limit=10
```

**Example Response:**

- Success:

  ```json
  {
    "success": true,
    "data": [
      {
        "subjectId": 1,
        "subjectName": "Cơ sở dữ liệu",
        "periods": 45
      }
    ],
    "meta": {
      "page": 1,
      "limit": 10,
      "total": 1
    }
  }
  ```

- Error:

  ```json
  {
    "success": false,
    "error": {
      "code": "UNAUTHORIZED",
      "message": "Vui lòng đăng nhập để tiếp tục"
    }
  }
  ```

---

#### 4.2. Create Subject

**Description**: Tạo môn học mới. Yêu cầu role: `ADMIN`.

**URL**: `/api/subjects`

**Method**: `POST`

**Body Request**:

| Field       |  Type  | Required | Description |
| ----------- | :----: | :------: | ----------- |
| subjectName | string |   Yes    | Tên môn học |
| periods     | number |   Yes    | Số tiết học |

```json
{
  "subjectName": "Lập trình hướng đối tượng",
  "periods": 45
}
```

**Example Response:**

- Success:

  ```json
  {
    "success": true,
    "data": {
      "subjectId": 2,
      "subjectName": "Lập trình hướng đối tượng",
      "periods": 45
    }
  }
  ```

- Error:

  ```json
  {
    "success": false,
    "error": {
      "code": "SUBJECT_NAME_EXISTED",
      "message": "Tên môn học đã tồn tại"
    }
  }
  ```

---

#### 4.3. Get Subject Detail

**Description**: Lấy chi tiết một môn học. Yêu cầu xác thực: `Authorization: Bearer <token>`.

**URL**: `/api/subjects/{subjectId}`

**Method**: `GET`

**Query Params**: Không có.

**Example Response:**

- Success:

  ```json
  {
    "success": true,
    "data": {
      "subjectId": 2,
      "subjectName": "Lập trình hướng đối tượng",
      "periods": 45
    }
  }
  ```

- Error:

  ```json
  {
    "success": false,
    "error": {
      "code": "SUBJECT_NOT_FOUND",
      "message": "Môn học không tồn tại"
    }
  }
  ```

---

#### 4.4. Update Subject

**Description**: Cập nhật thông tin môn học. Yêu cầu role: `ADMIN`.

**URL**: `/api/subjects/{subjectId}`

**Method**: `PUT`

**Body Request**:

| Field                 |  Type  | Required | Description       |
| --------------------- | :----: | :------: | ----------------- |
| subjectName | string |    No    | Tên môn học mới |
| periods     | number |    No    | Số tiết học     |

```json
{
  "subjectName": "OOP - Lập trình hướng đối tượng",
  "periods": 60
}
```

**Example Response:**

- Success:

  ```json
  {
    "success": true,
    "data": {
      "subjectId": 2,
      "subjectName": "OOP - Lập trình hướng đối tượng",
      "periods": 60
    }
  }
  ```

- Error:

  ```json
  {
    "success": false,
    "error": {
      "code": "SUBJECT_NOT_FOUND",
      "message": "Môn học không tồn tại"
    }
  }
  ```

---

#### 4.5. Delete Subject

**Description**: Xóa môn học. Yêu cầu role: `ADMIN`.

**URL**: `/api/subjects/{subjectId}`

**Method**: `DELETE`

**Query Params**: Không có.

**Example Response:**

- Success:

  ```json
  {
    "success": true,
    "data": null
  }
  ```

- Error:

  ```json
  {
    "success": false,
    "error": {
      "code": "SUBJECT_IN_USE",
      "message": "Không thể xóa môn học đang được sử dụng trong lớp học phần"
    }
  }
  ```

---

---

### 5. Section

#### 5.1. Get Section List

**Description**: Lấy danh sách lớp học phần. Yêu cầu role: `ADMIN`.

**URL**: `/api/sections`

**Method**: `GET`

**Query Params**:

| Field     |  Type  | Required | Description                         |
| --------- | :----: | :------: | ----------------------------------- |
| page      | number |    No    | Trang hiện tại (mặc định: 1)        |
| limit     | number |    No    | Số bản ghi mỗi trang (mặc định: 10) |
| subjectId | number |    No    | Lọc theo môn học                    |
| year      | string |    No    | Lọc theo năm học                    |
| status    | number |    No    | Lọc theo trạng thái                 |

```
GET /api/sections?page=1&limit=10&year=2024-2025
```

**Example Response:**

- Success:

  ```json
  {
    "success": true,
    "data": [
      {
        "sectionId": 1,
        "subjectId": 2,
        "subjectName": "OOP",
        "lecturerProfileId": 5,
        "lecturerName": "TS. Lê Văn C",
        "year": "2024-2025",
        "enrollmentCount": 30,
        "maxCapacity": 40,
        "status": 1,
        "visibility": 1
      }
    ],
    "meta": {
      "page": 1,
      "limit": 10,
      "total": 1
    }
  }
  ```

- Error:

  ```json
  {
    "success": false,
    "error": {
      "code": "FORBIDDEN",
      "message": "Bạn không có quyền truy cập tài nguyên này"
    }
  }
  ```

---

#### 5.2. Create Section

**Description**: Tạo lớp học phần mới. Yêu cầu role: `ADMIN`.

**URL**: `/api/sections`

**Method**: `POST`

**Body Request**:

| Field             |  Type  | Required | Description              |
| ----------------- | :----: | :------: | ------------------------ |
| subjectId         | number |   Yes    | ID môn học               |
| lecturerProfileId | number |   Yes    | ID hồ sơ giảng viên      |
| year              | string |   Yes    | Năm học (vd: 2024-2025)  |
| maxCapacity       | number |   Yes    | Sĩ số tối đa             |
| status            | number |    No    | Trạng thái (mặc định: 0) |
| visibility        | number |    No    | Hiển thị (mặc định: 0)   |

```json
{
  "subjectId": 2,
  "lecturerProfileId": 5,
  "year": "2024-2025",
  "maxCapacity": 40,
  "status": 1,
  "visibility": 1
}
```

**Example Response:**

- Success:

  ```json
  {
    "success": true,
    "data": {
      "sectionId": 2,
      "subjectId": 2,
      "lecturerProfileId": 5,
      "year": "2024-2025",
      "enrollmentCount": 0,
      "maxCapacity": 40,
      "status": 1,
      "visibility": 1
    }
  }
  ```

- Error:

  ```json
  {
    "success": false,
    "error": {
      "code": "LECTURER_NOT_FOUND",
      "message": "Giảng viên không tồn tại"
    }
  }
  ```

---

#### 5.3. Get Section Detail

**Description**: Lấy chi tiết lớp học phần. Yêu cầu xác thực: `Authorization: Bearer <token>`.

**URL**: `/api/sections/{sectionId}`

**Method**: `GET`

**Query Params**: Không có.

**Example Response:**

- Success:

  ```json
  {
    "success": true,
    "data": {
      "sectionId": 1,
      "subjectId": 2,
      "subjectName": "OOP",
      "lecturerProfileId": 5,
      "lecturerName": "TS. Lê Văn C",
      "year": "2024-2025",
      "enrollmentCount": 30,
      "maxCapacity": 40,
      "status": 1,
      "visibility": 1
    }
  }
  ```

- Error:

  ```json
  {
    "success": false,
    "error": {
      "code": "SECTION_NOT_FOUND",
      "message": "Lớp học phần không tồn tại"
    }
  }
  ```

---

#### 5.4. Update Section

**Description**: Cập nhật thông tin lớp học phần. Yêu cầu role: `ADMIN`.

**URL**: `/api/sections/{sectionId}`

**Method**: `PUT`

**Body Request**:

| Field             |  Type  | Required | Description         |
| ----------------- | :----: | :------: | ------------------- |
| lecturerProfileId | number |    No    | ID hồ sơ giảng viên |
| year              | string |    No    | Năm học             |
| maxCapacity       | number |    No    | Sĩ số tối đa        |
| status            | number |    No    | Trạng thái          |
| visibility        | number |    No    | Hiển thị            |

```json
{
  "maxCapacity": 45,
  "status": 1
}
```

**Example Response:**

- Success:

  ```json
  {
    "success": true,
    "data": {
      "sectionId": 1,
      "maxCapacity": 45,
      "status": 1
    }
  }
  ```

- Error:

  ```json
  {
    "success": false,
    "error": {
      "code": "SECTION_NOT_FOUND",
      "message": "Lớp học phần không tồn tại"
    }
  }
  ```

---

#### 5.5. Delete Section

**Description**: Xóa lớp học phần. Yêu cầu role: `ADMIN`.

**URL**: `/api/sections/{sectionId}`

**Method**: `DELETE`

**Query Params**: Không có.

**Example Response:**

- Success:

  ```json
  {
    "success": true,
    "data": null
  }
  ```

- Error:

  ```json
  {
    "success": false,
    "error": {
      "code": "SECTION_HAS_STUDENTS",
      "message": "Không thể xóa lớp đang có sinh viên đăng ký"
    }
  }
  ```

---

#### 5.6. Get Students in Section

**Description**: Lấy danh sách sinh viên đã đăng ký vào lớp học phần. Yêu cầu role: `ADMIN`, `LECTURER`.

**URL**: `/api/sections/{sectionId}/students`

**Method**: `GET`

**Query Params**:

| Field |  Type  | Required | Description                         |
| ----- | :----: | :------: | ----------------------------------- |
| page  | number |    No    | Trang hiện tại (mặc định: 1)        |
| limit | number |    No    | Số bản ghi mỗi trang (mặc định: 10) |

```
GET /api/sections/1/students?page=1&limit=30
```

**Example Response:**

- Success:

  ```json
  {
    "success": true,
    "data": [
      {
        "profileId": 3,
        "fullName": "Trần Thị B",
        "email": "tranthib@example.com"
      }
    ],
    "meta": {
      "page": 1,
      "limit": 30,
      "total": 1
    }
  }
  ```

- Error:

  ```json
  {
    "success": false,
    "error": {
      "code": "SECTION_NOT_FOUND",
      "message": "Lớp học phần không tồn tại"
    }
  }
  ```

---

#### 5.7. Get My Sections (Lecturer)

**Description**: Lấy danh sách lớp học phần của giảng viên đang đăng nhập. Yêu cầu role: `LECTURER`.

**URL**: `/api/sections/my-sections`

**Method**: `GET`

**Query Params**:

| Field |  Type  | Required | Description                         |
| ----- | :----: | :------: | ----------------------------------- |
| page  | number |    No    | Trang hiện tại (mặc định: 1)        |
| limit | number |    No    | Số bản ghi mỗi trang (mặc định: 10) |
| year  | string |    No    | Lọc theo năm học                    |

```
GET /api/sections/my-sections?year=2024-2025
```

**Example Response:**

- Success:

  ```json
  {
    "success": true,
    "data": [
      {
        "sectionId": 1,
        "subjectName": "OOP",
        "year": "2024-2025",
        "enrollmentCount": 30,
        "maxCapacity": 40
      }
    ],
    "meta": {
      "page": 1,
      "limit": 10,
      "total": 1
    }
  }
  ```

- Error:

  ```json
  {
    "success": false,
    "error": {
      "code": "FORBIDDEN",
      "message": "Chỉ giảng viên mới có thể truy cập"
    }
  }
  ```

---

#### 5.8. Update Section Status

**Description**: Cập nhật trạng thái lớp học phần. Yêu cầu role: `ADMIN`, `LECTURER`.

**URL**: `/api/sections/{sectionId}/status`

**Method**: `PATCH`

**Body Request**:

| Field  |  Type  | Required | Description    |
| ------ | :----: | :------: | -------------- |
| status | number |   Yes    | Trạng thái mới |

```json
{
  "status": 2
}
```

**Example Response:**

- Success:

  ```json
  {
    "success": true,
    "data": {
      "sectionId": 1,
      "status": 2
    }
  }
  ```

- Error:

  ```json
  {
    "success": false,
    "error": {
      "code": "SECTION_NOT_FOUND",
      "message": "Lớp học phần không tồn tại"
    }
  }
  ```

---

#### 5.9. Update Section Visibility

**Description**: Cập nhật visibility (hiển thị/ẩn) lớp học phần. Yêu cầu role: `ADMIN`, `LECTURER`.

**URL**: `/api/sections/{sectionId}/visibility`

**Method**: `PATCH`

**Body Request**:

| Field      |  Type  | Required | Description         |
| ---------- | :----: | :------: | ------------------- |
| visibility | number |   Yes    | Trạng thái hiển thị |

```json
{
  "visibility": 1
}
```

**Example Response:**

- Success:

  ```json
  {
    "success": true,
    "data": {
      "sectionId": 1,
      "visibility": 1
    }
  }
  ```

- Error:

  ```json
  {
    "success": false,
    "error": {
      "code": "SECTION_NOT_FOUND",
      "message": "Lớp học phần không tồn tại"
    }
  }
  ```

---

### 6. Registration

#### 6.1. Get Registration List

**Description**: Lấy danh sách tất cả đăng ký học phần. Yêu cầu role: `ADMIN`.

**URL**: `/api/registrations`

**Method**: `GET`

**Query Params**:

| Field     |  Type  | Required | Description                         |
| --------- | :----: | :------: | ----------------------------------- |
| page      | number |    No    | Trang hiện tại (mặc định: 1)        |
| limit     | number |    No    | Số bản ghi mỗi trang (mặc định: 10) |
| sectionId | number |    No    | Lọc theo lớp học phần               |

```
GET /api/registrations?page=1&limit=10
```

**Example Response:**

- Success:

  ```json
  {
    "success": true,
    "data": [
      {
        "sectionId": 1,
        "studentProfileId": 3,
        "studentName": "Trần Thị B",
        "subjectName": "OOP"
      }
    ],
    "meta": {
      "page": 1,
      "limit": 10,
      "total": 1
    }
  }
  ```

- Error:

  ```json
  {
    "success": false,
    "error": {
      "code": "FORBIDDEN",
      "message": "Bạn không có quyền truy cập tài nguyên này"
    }
  }
  ```

---

#### 6.2. Register Section

**Description**: Sinh viên đăng ký vào lớp học phần. Yêu cầu role: `STUDENT`.

**URL**: `/api/registrations`

**Method**: `POST`

**Body Request**:

| Field     |  Type  | Required | Description     |
| --------- | :----: | :------: | --------------- |
| sectionId | number |   Yes    | ID lớp học phần |

```json
{
  "sectionId": 1
}
```

**Example Response:**

- Success:

  ```json
  {
    "success": true,
    "data": {
      "sectionId": 1,
      "studentProfileId": 3
    }
  }
  ```

- Error:

  ```json
  {
    "success": false,
    "error": {
      "code": "SECTION_FULL",
      "message": "Lớp học phần đã đạt sĩ số tối đa"
    }
  }
  ```

---

#### 6.3. Cancel Registration

**Description**: Sinh viên hủy đăng ký lớp học phần. Yêu cầu role: `STUDENT`.

**URL**: `/api/registrations/{sectionId}`

**Method**: `DELETE`

**Query Params**: Không có.

**Example Response:**

- Success:

  ```json
  {
    "success": true,
    "data": null
  }
  ```

- Error:

  ```json
  {
    "success": false,
    "error": {
      "code": "REGISTRATION_NOT_FOUND",
      "message": "Bạn chưa đăng ký lớp học phần này"
    }
  }
  ```

---

#### 6.4. Get My Registrations

**Description**: Sinh viên xem danh sách lớp học phần đã đăng ký. Yêu cầu role: `STUDENT`.

**URL**: `/api/registrations/my-registrations`

**Method**: `GET`

**Query Params**:

| Field |  Type  | Required | Description                         |
| ----- | :----: | :------: | ----------------------------------- |
| page  | number |    No    | Trang hiện tại (mặc định: 1)        |
| limit | number |    No    | Số bản ghi mỗi trang (mặc định: 10) |

```
GET /api/registrations/my-registrations?page=1&limit=10
```

**Example Response:**

- Success:

  ```json
  {
    "success": true,
    "data": [
      {
        "sectionId": 1,
        "subjectName": "OOP",
        "lecturerName": "TS. Lê Văn C",
        "year": "2024-2025",
        "status": 1
      }
    ],
    "meta": {
      "page": 1,
      "limit": 10,
      "total": 1
    }
  }
  ```

- Error:

  ```json
  {
    "success": false,
    "error": {
      "code": "FORBIDDEN",
      "message": "Chỉ sinh viên mới có thể truy cập"
    }
  }
  ```

---

#### 6.5. Get Registrations by Section

**Description**: Lấy danh sách đăng ký của một lớp học phần cụ thể. Yêu cầu role: `ADMIN`, `LECTURER`.

**URL**: `/api/sections/{sectionId}/registrations`

**Method**: `GET`

**Query Params**:

| Field |  Type  | Required | Description                         |
| ----- | :----: | :------: | ----------------------------------- |
| page  | number |    No    | Trang hiện tại (mặc định: 1)        |
| limit | number |    No    | Số bản ghi mỗi trang (mặc định: 10) |

```
GET /api/sections/1/registrations?page=1&limit=30
```

**Example Response:**

- Success:

  ```json
  {
    "success": true,
    "data": [
      {
        "studentProfileId": 3,
        "fullName": "Trần Thị B",
        "email": "tranthib@example.com"
      }
    ],
    "meta": {
      "page": 1,
      "limit": 30,
      "total": 1
    }
  }
  ```

- Error:

  ```json
  {
    "success": false,
    "error": {
      "code": "SECTION_NOT_FOUND",
      "message": "Lớp học phần không tồn tại"
    }
  }
  ```

---

### 7. Room

#### 7.1. Get Room List

**Description**: Lấy danh sách phòng học. Yêu cầu xác thực: `Authorization: Bearer <token>`.

**URL**: `/api/rooms`

**Method**: `GET`

**Query Params**:

| Field    |  Type  | Required | Description                         |
| -------- | :----: | :------: | ----------------------------------- |
| page     | number |    No    | Trang hiện tại (mặc định: 1)        |
| limit    | number |    No    | Số bản ghi mỗi trang (mặc định: 10) |
| campus   | string |    No    | Lọc theo cơ sở                      |
| roomType | string |    No    | Lọc theo loại phòng                 |
| status   | string |    No    | Lọc theo trạng thái                 |

```
GET /api/rooms?campus=A&roomType=lecture
```

**Example Response:**

- Success:

  ```json
  {
    "success": true,
    "data": [
      {
        "roomId": 1,
        "roomName": "A101",
        "roomType": "lecture",
        "campus": "A",
        "capacity": 50,
        "status": "available"
      }
    ],
    "meta": {
      "page": 1,
      "limit": 10,
      "total": 1
    }
  }
  ```

- Error:

  ```json
  {
    "success": false,
    "error": {
      "code": "UNAUTHORIZED",
      "message": "Vui lòng đăng nhập để tiếp tục"
    }
  }
  ```

---

#### 7.2. Create Room

**Description**: Tạo phòng học mới. Yêu cầu role: `ADMIN`.

**URL**: `/api/rooms`

**Method**: `POST`

**Body Request**:

| Field    |  Type  | Required | Description                      |
| -------- | :----: | :------: | -------------------------------- |
| roomName | string |   Yes    | Tên phòng (duy nhất)             |
| roomType | string |   Yes    | Loại phòng                       |
| campus   | string |   Yes    | Cơ sở                            |
| capacity | number |   Yes    | Sức chứa                         |
| status   | string |    No    | Trạng thái (mặc định: available) |

```json
{
  "roomName": "B201",
  "roomType": "lab",
  "campus": "B",
  "capacity": 30,
  "status": "available"
}
```

**Example Response:**

- Success:

  ```json
  {
    "success": true,
    "data": {
      "roomId": 2,
      "roomName": "B201",
      "roomType": "lab",
      "campus": "B",
      "capacity": 30,
      "status": "available"
    }
  }
  ```

- Error:

  ```json
  {
    "success": false,
    "error": {
      "code": "ROOM_NAME_EXISTED",
      "message": "Tên phòng đã tồn tại"
    }
  }
  ```

---

#### 7.3. Get Room Detail

**Description**: Lấy chi tiết phòng học. Yêu cầu xác thực: `Authorization: Bearer <token>`.

**URL**: `/api/rooms/{roomId}`

**Method**: `GET`

**Query Params**: Không có.

**Example Response:**

- Success:

  ```json
  {
    "success": true,
    "data": {
      "roomId": 1,
      "roomName": "A101",
      "roomType": "lecture",
      "campus": "A",
      "capacity": 50,
      "status": "available"
    }
  }
  ```

- Error:

  ```json
  {
    "success": false,
    "error": {
      "code": "ROOM_NOT_FOUND",
      "message": "Phòng học không tồn tại"
    }
  }
  ```

---

#### 7.4. Update Room

**Description**: Cập nhật thông tin phòng học. Yêu cầu role: `ADMIN`.

**URL**: `/api/rooms/{roomId}`

**Method**: `PUT`

**Body Request**:

| Field    |  Type  | Required | Description |
| -------- | :----: | :------: | ----------- |
| roomName | string |    No    | Tên phòng   |
| roomType | string |    No    | Loại phòng  |
| campus   | string |    No    | Cơ sở       |
| capacity | number |    No    | Sức chứa    |
| status   | string |    No    | Trạng thái  |

```json
{
  "capacity": 55,
  "status": "maintenance"
}
```

**Example Response:**

- Success:

  ```json
  {
    "success": true,
    "data": {
      "roomId": 1,
      "roomName": "A101",
      "capacity": 55,
      "status": "maintenance"
    }
  }
  ```

- Error:

  ```json
  {
    "success": false,
    "error": {
      "code": "ROOM_NOT_FOUND",
      "message": "Phòng học không tồn tại"
    }
  }
  ```

---

#### 7.5. Delete Room

**Description**: Xóa phòng học. Yêu cầu role: `ADMIN`.

**URL**: `/api/rooms/{roomId}`

**Method**: `DELETE`

**Query Params**: Không có.

**Example Response:**

- Success:

  ```json
  {
    "success": true,
    "data": null
  }
  ```

- Error:

  ```json
  {
    "success": false,
    "error": {
      "code": "ROOM_IN_USE",
      "message": "Không thể xóa phòng đang có lịch học"
    }
  }
  ```

---

#### 7.6. Get Room Schedules

**Description**: Lấy danh sách lịch học của một phòng. Yêu cầu role: `ADMIN`.

**URL**: `/api/rooms/{roomId}/schedules`

**Method**: `GET`

**Query Params**:

| Field     |  Type  | Required | Description           |
| --------- | :----: | :------: | --------------------- |
| startDate | string |    No    | Từ ngày (YYYY-MM-DD)  |
| endDate   | string |    No    | Đến ngày (YYYY-MM-DD) |

```
GET /api/rooms/1/schedules?startDate=2025-01-01&endDate=2025-06-30
```

**Example Response:**

- Success:

  ```json
  {
    "success": true,
    "data": [
      {
        "scheduleId": 1,
        "sectionId": 1,
        "subjectName": "OOP",
        "dayOfWeek": "Monday",
        "startPeriod": 1,
        "endPeriod": 3,
        "startDate": "2025-01-06",
        "endDate": "2025-05-30"
      }
    ]
  }
  ```

- Error:

  ```json
  {
    "success": false,
    "error": {
      "code": "ROOM_NOT_FOUND",
      "message": "Phòng học không tồn tại"
    }
  }
  ```

---

#### 7.7. Get Available Rooms

**Description**: Lấy danh sách phòng học còn trống theo tiêu chí ngày, tiết và sức chứa. Yêu cầu role: `ADMIN`.

**URL**: `/api/rooms/available`

**Method**: `GET`

**Query Params**:

| Field       |  Type  | Required | Description               |
| ----------- | :----: | :------: | ------------------------- |
| date        | string |   Yes    | Ngày cần đặt (YYYY-MM-DD) |
| startPeriod | number |   Yes    | Tiết bắt đầu              |
| endPeriod   | number |   Yes    | Tiết kết thúc             |
| capacity    | number |    No    | Sức chứa tối thiểu        |

```
GET /api/rooms/available?date=2025-03-15&startPeriod=1&endPeriod=3&capacity=30
```

**Example Response:**

- Success:

  ```json
  {
    "success": true,
    "data": [
      {
        "roomId": 2,
        "roomName": "B201",
        "roomType": "lab",
        "campus": "B",
        "capacity": 30
      }
    ]
  }
  ```

- Error:

  ```json
  {
    "success": false,
    "error": {
      "code": "MISSING_REQUIRED_PARAMS",
      "message": "Thiếu tham số bắt buộc: date, startPeriod, endPeriod"
    }
  }
  ```

---

### 8. Schedule

#### 8.1. Get Schedule List

**Description**: Lấy danh sách lịch học. Yêu cầu role: `ADMIN`.

**URL**: `/api/schedules`

**Method**: `GET`

**Query Params**:

| Field     |  Type  | Required | Description                         |
| --------- | :----: | :------: | ----------------------------------- |
| page      | number |    No    | Trang hiện tại (mặc định: 1)        |
| limit     | number |    No    | Số bản ghi mỗi trang (mặc định: 10) |
| roomId    | number |    No    | Lọc theo phòng học                  |
| sectionId | number |    No    | Lọc theo lớp học phần               |

```
GET /api/schedules?page=1&limit=10
```

**Example Response:**

- Success:

  ```json
  {
    "success": true,
    "data": [
      {
        "scheduleId": 1,
        "roomId": 1,
        "roomName": "A101",
        "sectionId": 1,
        "subjectName": "OOP",
        "dayOfWeek": "Monday",
        "startPeriod": 1,
        "endPeriod": 3,
        "totalPeriods": 3,
        "startDate": "2025-01-06",
        "endDate": "2025-05-30"
      }
    ],
    "meta": {
      "page": 1,
      "limit": 10,
      "total": 1
    }
  }
  ```

- Error:

  ```json
  {
    "success": false,
    "error": {
      "code": "FORBIDDEN",
      "message": "Bạn không có quyền truy cập tài nguyên này"
    }
  }
  ```

---

#### 8.2. Create Schedule

**Description**: Tạo lịch học mới. Yêu cầu role: `ADMIN`.

**URL**: `/api/schedules`

**Method**: `POST`

**Body Request**:

| Field        |  Type  | Required | Description                |
| ------------ | :----: | :------: | -------------------------- |
| roomId       | number |   Yes    | ID phòng học               |
| sectionId    | number |   Yes    | ID lớp học phần            |
| dayOfWeek    | string |   Yes    | Thứ trong tuần             |
| startPeriod  | number |   Yes    | Tiết bắt đầu               |
| endPeriod    | number |   Yes    | Tiết kết thúc              |
| totalPeriods | number |   Yes    | Tổng số tiết               |
| startDate    | string |   Yes    | Ngày bắt đầu (YYYY-MM-DD)  |
| endDate      | string |   Yes    | Ngày kết thúc (YYYY-MM-DD) |

```json
{
  "roomId": 1,
  "sectionId": 1,
  "dayOfWeek": "Monday",
  "startPeriod": 1,
  "endPeriod": 3,
  "totalPeriods": 3,
  "startDate": "2025-01-06",
  "endDate": "2025-05-30"
}
```

**Example Response:**

- Success:

  ```json
  {
    "success": true,
    "data": {
      "scheduleId": 1,
      "roomId": 1,
      "sectionId": 1,
      "dayOfWeek": "Monday",
      "startPeriod": 1,
      "endPeriod": 3,
      "totalPeriods": 3,
      "startDate": "2025-01-06",
      "endDate": "2025-05-30"
    }
  }
  ```

- Error:

  ```json
  {
    "success": false,
    "error": {
      "code": "ROOM_SCHEDULE_CONFLICT",
      "message": "Phòng học đã có lịch trong thời gian này"
    }
  }
  ```

---

#### 8.3. Get Schedule Detail

**Description**: Lấy chi tiết một lịch học. Yêu cầu xác thực: `Authorization: Bearer <token>`.

**URL**: `/api/schedules/{scheduleId}`

**Method**: `GET`

**Query Params**: Không có.

**Example Response:**

- Success:

  ```json
  {
    "success": true,
    "data": {
      "scheduleId": 1,
      "roomId": 1,
      "roomName": "A101",
      "sectionId": 1,
      "subjectName": "OOP",
      "dayOfWeek": "Monday",
      "startPeriod": 1,
      "endPeriod": 3,
      "totalPeriods": 3,
      "startDate": "2025-01-06",
      "endDate": "2025-05-30"
    }
  }
  ```

- Error:

  ```json
  {
    "success": false,
    "error": {
      "code": "SCHEDULE_NOT_FOUND",
      "message": "Lịch học không tồn tại"
    }
  }
  ```

---

#### 8.4. Update Schedule

**Description**: Cập nhật lịch học. Yêu cầu role: `ADMIN`.

**URL**: `/api/schedules/{scheduleId}`

**Method**: `PUT`

**Body Request**:

| Field        |  Type  | Required | Description                |
| ------------ | :----: | :------: | -------------------------- |
| roomId       | number |    No    | ID phòng học mới           |
| dayOfWeek    | string |    No    | Thứ trong tuần             |
| startPeriod  | number |    No    | Tiết bắt đầu               |
| endPeriod    | number |    No    | Tiết kết thúc              |
| totalPeriods | number |    No    | Tổng số tiết               |
| startDate    | string |    No    | Ngày bắt đầu (YYYY-MM-DD)  |
| endDate      | string |    No    | Ngày kết thúc (YYYY-MM-DD) |

```json
{
  "roomId": 2,
  "dayOfWeek": "Wednesday"
}
```

**Example Response:**

- Success:

  ```json
  {
    "success": true,
    "data": {
      "scheduleId": 1,
      "roomId": 2,
      "dayOfWeek": "Wednesday"
    }
  }
  ```

- Error:

  ```json
  {
    "success": false,
    "error": {
      "code": "ROOM_SCHEDULE_CONFLICT",
      "message": "Phòng học đã có lịch trong thời gian này"
    }
  }
  ```

---

#### 8.5. Delete Schedule

**Description**: Xóa lịch học. Yêu cầu role: `ADMIN`.

**URL**: `/api/schedules/{scheduleId}`

**Method**: `DELETE`

**Query Params**: Không có.

**Example Response:**

- Success:

  ```json
  {
    "success": true,
    "data": null
  }
  ```

- Error:

  ```json
  {
    "success": false,
    "error": {
      "code": "SCHEDULE_NOT_FOUND",
      "message": "Lịch học không tồn tại"
    }
  }
  ```

---

#### 8.6. Get My Schedule

**Description**: Lấy lịch học của người dùng đang đăng nhập (sinh viên xem lịch học phần đã đăng ký, giảng viên xem lịch dạy). Yêu cầu xác thực: `Authorization: Bearer <token>`.

**URL**: `/api/schedules/my-schedule`

**Method**: `GET`

**Query Params**:

| Field     |  Type  | Required | Description           |
| --------- | :----: | :------: | --------------------- |
| startDate | string |    No    | Từ ngày (YYYY-MM-DD)  |
| endDate   | string |    No    | Đến ngày (YYYY-MM-DD) |

```
GET /api/schedules/my-schedule?startDate=2025-03-01&endDate=2025-03-31
```

**Example Response:**

- Success:

  ```json
  {
    "success": true,
    "data": [
      {
        "scheduleId": 1,
        "roomName": "A101",
        "subjectName": "OOP",
        "dayOfWeek": "Monday",
        "startPeriod": 1,
        "endPeriod": 3
      }
    ]
  }
  ```

- Error:

  ```json
  {
    "success": false,
    "error": {
      "code": "UNAUTHORIZED",
      "message": "Vui lòng đăng nhập để tiếp tục"
    }
  }
  ```

---

#### 8.7. Get Schedules by Section

**Description**: Lấy toàn bộ lịch học của một lớp học phần. Yêu cầu xác thực: `Authorization: Bearer <token>`.

**URL**: `/api/sections/{sectionId}/schedules`

**Method**: `GET`

**Query Params**: Không có.

**Example Response:**

- Success:

  ```json
  {
    "success": true,
    "data": [
      {
        "scheduleId": 1,
        "roomId": 1,
        "roomName": "A101",
        "dayOfWeek": "Monday",
        "startPeriod": 1,
        "endPeriod": 3,
        "totalPeriods": 3,
        "startDate": "2025-01-06",
        "endDate": "2025-05-30"
      }
    ]
  }
  ```

- Error:

  ```json
  {
    "success": false,
    "error": {
      "code": "SECTION_NOT_FOUND",
      "message": "Lớp học phần không tồn tại"
    }
  }
  ```

---

### 9. UsageHistory

#### 9.1. Get Usage History List

**Description**: Lấy danh sách lịch sử sử dụng phòng. Yêu cầu role: `ADMIN`.

**URL**: `/api/usage-histories`

**Method**: `GET`

**Query Params**:

| Field  |  Type  | Required | Description                         |
| ------ | :----: | :------: | ----------------------------------- |
| page   | number |    No    | Trang hiện tại (mặc định: 1)        |
| limit  | number |    No    | Số bản ghi mỗi trang (mặc định: 10) |
| roomId | number |    No    | Lọc theo phòng học                  |

```
GET /api/usage-histories?page=1&limit=10
```

**Example Response:**

- Success:

  ```json
  {
    "success": true,
    "data": [
      {
        "usageHistoryId": 1,
        "roomId": 1,
        "roomName": "A101",
        "startTime": "2025-01-06",
        "endTime": "2025-05-30",
        "note": "Sử dụng cho học kỳ I 2024-2025"
      }
    ],
    "meta": {
      "page": 1,
      "limit": 10,
      "total": 1
    }
  }
  ```

- Error:

  ```json
  {
    "success": false,
    "error": {
      "code": "FORBIDDEN",
      "message": "Bạn không có quyền truy cập tài nguyên này"
    }
  }
  ```

---

#### 9.2. Create Usage History

**Description**: Tạo bản ghi sử dụng phòng học. Yêu cầu role: `ADMIN`.

**URL**: `/api/usage-histories`

**Method**: `POST`

**Body Request**:

| Field     |  Type  | Required | Description                     |
| --------- | :----: | :------: | ------------------------------- |
| roomId    | number |   Yes    | ID phòng học                    |
| startTime | string |   Yes    | Thời gian bắt đầu (YYYY-MM-DD)  |
| endTime   | string |   Yes    | Thời gian kết thúc (YYYY-MM-DD) |
| note      | string |    No    | Ghi chú                         |

```json
{
  "roomId": 1,
  "startTime": "2025-01-06",
  "endTime": "2025-05-30",
  "note": "Sử dụng cho học kỳ I 2024-2025"
}
```

**Example Response:**

- Success:

  ```json
  {
    "success": true,
    "data": {
      "usageHistoryId": 1,
      "roomId": 1,
      "startTime": "2025-01-06",
      "endTime": "2025-05-30",
      "note": "Sử dụng cho học kỳ I 2024-2025"
    }
  }
  ```

- Error:

  ```json
  {
    "success": false,
    "error": {
      "code": "ROOM_NOT_FOUND",
      "message": "Phòng học không tồn tại"
    }
  }
  ```

---

#### 9.3. Get Usage History Detail

**Description**: Lấy chi tiết bản ghi sử dụng phòng. Yêu cầu role: `ADMIN`.

**URL**: `/api/usage-histories/{usageHistoryId}`

**Method**: `GET`

**Query Params**: Không có.

**Example Response:**

- Success:

  ```json
  {
    "success": true,
    "data": {
      "usageHistoryId": 1,
      "roomId": 1,
      "roomName": "A101",
      "startTime": "2025-01-06",
      "endTime": "2025-05-30",
      "note": "Sử dụng cho học kỳ I 2024-2025",
      "sections": [
        {
          "sectionId": 1,
          "subjectName": "OOP"
        }
      ]
    }
  }
  ```

- Error:

  ```json
  {
    "success": false,
    "error": {
      "code": "USAGE_HISTORY_NOT_FOUND",
      "message": "Bản ghi sử dụng phòng không tồn tại"
    }
  }
  ```

---

#### 9.4. Update Usage History

**Description**: Cập nhật bản ghi sử dụng phòng. Yêu cầu role: `ADMIN`.

**URL**: `/api/usage-histories/{usageHistoryId}`

**Method**: `PUT`

**Body Request**:

| Field     |  Type  | Required | Description                     |
| --------- | :----: | :------: | ------------------------------- |
| startTime | string |    No    | Thời gian bắt đầu (YYYY-MM-DD)  |
| endTime   | string |    No    | Thời gian kết thúc (YYYY-MM-DD) |
| note      | string |    No    | Ghi chú                         |

```json
{
  "note": "Cập nhật ghi chú sử dụng phòng"
}
```

**Example Response:**

- Success:

  ```json
  {
    "success": true,
    "data": {
      "usageHistoryId": 1,
      "note": "Cập nhật ghi chú sử dụng phòng"
    }
  }
  ```

- Error:

  ```json
  {
    "success": false,
    "error": {
      "code": "USAGE_HISTORY_NOT_FOUND",
      "message": "Bản ghi sử dụng phòng không tồn tại"
    }
  }
  ```

---

#### 9.5. Delete Usage History

**Description**: Xóa bản ghi sử dụng phòng. Yêu cầu role: `ADMIN`.

**URL**: `/api/usage-histories/{usageHistoryId}`

**Method**: `DELETE`

**Query Params**: Không có.

**Example Response:**

- Success:

  ```json
  {
    "success": true,
    "data": null
  }
  ```

- Error:

  ```json
  {
    "success": false,
    "error": {
      "code": "USAGE_HISTORY_NOT_FOUND",
      "message": "Bản ghi sử dụng phòng không tồn tại"
    }
  }
  ```

---

#### 9.6. Get Usage Histories by Room

**Description**: Lấy toàn bộ lịch sử sử dụng của một phòng học. Yêu cầu role: `ADMIN`.

**URL**: `/api/rooms/{roomId}/usage-histories`

**Method**: `GET`

**Query Params**:

| Field |  Type  | Required | Description                         |
| ----- | :----: | :------: | ----------------------------------- |
| page  | number |    No    | Trang hiện tại (mặc định: 1)        |
| limit | number |    No    | Số bản ghi mỗi trang (mặc định: 10) |

```
GET /api/rooms/1/usage-histories?page=1&limit=10
```

**Example Response:**

- Success:

  ```json
  {
    "success": true,
    "data": [
      {
        "usageHistoryId": 1,
        "startTime": "2025-01-06",
        "endTime": "2025-05-30",
        "note": "Học kỳ I 2024-2025"
      }
    ],
    "meta": {
      "page": 1,
      "limit": 10,
      "total": 1
    }
  }
  ```

- Error:

  ```json
  {
    "success": false,
    "error": {
      "code": "ROOM_NOT_FOUND",
      "message": "Phòng học không tồn tại"
    }
  }
  ```

---

#### 9.7. Add Section to Usage History

**Description**: Gắn một lớp học phần vào bản ghi sử dụng phòng. Yêu cầu role: `ADMIN`.

**URL**: `/api/usage-histories/{usageHistoryId}/sections`

**Method**: `POST`

**Body Request**:

| Field     |  Type  | Required | Description     |
| --------- | :----: | :------: | --------------- |
| sectionId | number |   Yes    | ID lớp học phần |

```json
{
  "sectionId": 1
}
```

**Example Response:**

- Success:

  ```json
  {
    "success": true,
    "data": {
      "usageHistoryId": 1,
      "sectionId": 1
    }
  }
  ```

- Error:

  ```json
  {
    "success": false,
    "error": {
      "code": "SECTION_ALREADY_LINKED",
      "message": "Lớp học phần đã được gắn vào bản ghi này"
    }
  }
  ```

---

#### 9.8. Remove Section from Usage History

**Description**: Gỡ một lớp học phần khỏi bản ghi sử dụng phòng. Yêu cầu role: `ADMIN`.

**URL**: `/api/usage-histories/{usageHistoryId}/sections/{sectionId}`

**Method**: `DELETE`

**Query Params**: Không có.

**Example Response:**

- Success:

  ```json
  {
    "success": true,
    "data": null
  }
  ```

- Error:

  ```json
  {
    "success": false,
    "error": {
      "code": "SECTION_NOT_LINKED",
      "message": "Lớp học phần không thuộc bản ghi sử dụng phòng này"
    }
  }
  ```

---

### 10. Attendance

#### 10.1. Get Attendance List

**Description**: Lấy danh sách buổi điểm danh. Yêu cầu role: `ADMIN`.

**URL**: `/api/attendances`

**Method**: `GET`

**Query Params**:

| Field     |  Type  | Required | Description                         |
| --------- | :----: | :------: | ----------------------------------- |
| page      | number |    No    | Trang hiện tại (mặc định: 1)        |
| limit     | number |    No    | Số bản ghi mỗi trang (mặc định: 10) |
| sectionId | number |    No    | Lọc theo lớp học phần               |

```
GET /api/attendances?page=1&limit=10
```

**Example Response:**

- Success:

  ```json
  {
    "success": true,
    "data": [
      {
        "attendanceId": 1,
        "sectionId": 1,
        "subjectName": "OOP",
        "attendanceDate": "2025-02-10",
        "slot": 1,
        "note": "Buổi học bình thường",
        "createdAt": "2025-02-10T07:00:00Z"
      }
    ],
    "meta": {
      "page": 1,
      "limit": 10,
      "total": 1
    }
  }
  ```

- Error:

  ```json
  {
    "success": false,
    "error": {
      "code": "FORBIDDEN",
      "message": "Bạn không có quyền truy cập tài nguyên này"
    }
  }
  ```

---

#### 10.2. Create Attendance

**Description**: Tạo buổi điểm danh mới cho lớp học phần. Yêu cầu role: `LECTURER`.

**URL**: `/api/attendances`

**Method**: `POST`

**Body Request**:

| Field          |  Type  | Required | Description                 |
| -------------- | :----: | :------: | --------------------------- |
| sectionId      | number |   Yes    | ID lớp học phần             |
| attendanceDate | string |   Yes    | Ngày điểm danh (YYYY-MM-DD) |
| slot           | number |   Yes    | Tiết học                    |
| note           | string |    No    | Ghi chú                     |

```json
{
  "sectionId": 1,
  "attendanceDate": "2025-02-10",
  "slot": 1,
  "note": "Buổi học bình thường"
}
```

**Example Response:**

- Success:

  ```json
  {
    "success": true,
    "data": {
      "attendanceId": 1,
      "sectionId": 1,
      "attendanceDate": "2025-02-10",
      "slot": 1,
      "note": "Buổi học bình thường",
      "createdAt": "2025-02-10T07:00:00Z"
    }
  }
  ```

- Error:

  ```json
  {
    "success": false,
    "error": {
      "code": "ATTENDANCE_EXISTED",
      "message": "Buổi điểm danh cho tiết này đã tồn tại"
    }
  }
  ```

---

#### 10.3. Get Attendance Detail

**Description**: Lấy chi tiết một buổi điểm danh. Yêu cầu role: `ADMIN`, `LECTURER`.

**URL**: `/api/attendances/{attendanceId}`

**Method**: `GET`

**Query Params**: Không có.

**Example Response:**

- Success:

  ```json
  {
    "success": true,
    "data": {
      "attendanceId": 1,
      "sectionId": 1,
      "subjectName": "OOP",
      "attendanceDate": "2025-02-10",
      "slot": 1,
      "note": "Buổi học bình thường",
      "createdAt": "2025-02-10T07:00:00Z"
    }
  }
  ```

- Error:

  ```json
  {
    "success": false,
    "error": {
      "code": "ATTENDANCE_NOT_FOUND",
      "message": "Buổi điểm danh không tồn tại"
    }
  }
  ```

---

#### 10.4. Update Attendance

**Description**: Cập nhật thông tin buổi điểm danh. Yêu cầu role: `LECTURER`.

**URL**: `/api/attendances/{attendanceId}`

**Method**: `PUT`

**Body Request**:

| Field          |  Type  | Required | Description                 |
| -------------- | :----: | :------: | --------------------------- |
| attendanceDate | string |    No    | Ngày điểm danh (YYYY-MM-DD) |
| slot           | number |    No    | Tiết học                    |
| note           | string |    No    | Ghi chú                     |

```json
{
  "note": "Học bù do nghỉ lễ"
}
```

**Example Response:**

- Success:

  ```json
  {
    "success": true,
    "data": {
      "attendanceId": 1,
      "note": "Học bù do nghỉ lễ"
    }
  }
  ```

- Error:

  ```json
  {
    "success": false,
    "error": {
      "code": "ATTENDANCE_NOT_FOUND",
      "message": "Buổi điểm danh không tồn tại"
    }
  }
  ```

---

#### 10.5. Delete Attendance

**Description**: Xóa buổi điểm danh. Yêu cầu role: `ADMIN`, `LECTURER`.

**URL**: `/api/attendances/{attendanceId}`

**Method**: `DELETE`

**Query Params**: Không có.

**Example Response:**

- Success:

  ```json
  {
    "success": true,
    "data": null
  }
  ```

- Error:

  ```json
  {
    "success": false,
    "error": {
      "code": "ATTENDANCE_NOT_FOUND",
      "message": "Buổi điểm danh không tồn tại"
    }
  }
  ```

---

#### 10.6. Get Attendances by Section

**Description**: Lấy danh sách các buổi điểm danh của một lớp học phần. Yêu cầu role: `ADMIN`, `LECTURER`.

**URL**: `/api/sections/{sectionId}/attendances`

**Method**: `GET`

**Query Params**:

| Field |  Type  | Required | Description                         |
| ----- | :----: | :------: | ----------------------------------- |
| page  | number |    No    | Trang hiện tại (mặc định: 1)        |
| limit | number |    No    | Số bản ghi mỗi trang (mặc định: 10) |

```
GET /api/sections/1/attendances?page=1&limit=20
```

**Example Response:**

- Success:

  ```json
  {
    "success": true,
    "data": [
      {
        "attendanceId": 1,
        "attendanceDate": "2025-02-10",
        "slot": 1,
        "note": "Buổi học bình thường"
      }
    ],
    "meta": {
      "page": 1,
      "limit": 20,
      "total": 1
    }
  }
  ```

- Error:

  ```json
  {
    "success": false,
    "error": {
      "code": "SECTION_NOT_FOUND",
      "message": "Lớp học phần không tồn tại"
    }
  }
  ```

---

### 11. AttendanceDetail

#### 11.1. Get Attendance Details

**Description**: Lấy danh sách trạng thái điểm danh từng sinh viên trong một buổi. Yêu cầu role: `ADMIN`, `LECTURER`.

**URL**: `/api/attendances/{attendanceId}/details`

**Method**: `GET`

**Query Params**:

| Field |  Type  | Required | Description                         |
| ----- | :----: | :------: | ----------------------------------- |
| page  | number |    No    | Trang hiện tại (mặc định: 1)        |
| limit | number |    No    | Số bản ghi mỗi trang (mặc định: 50) |

```
GET /api/attendances/1/details
```

**Example Response:**

- Success:

  ```json
  {
    "success": true,
    "data": [
      {
        "attendanceDetailId": 1,
        "studentProfileId": 3,
        "studentName": "Trần Thị B",
        "status": "present",
        "note": ""
      }
    ],
    "meta": {
      "page": 1,
      "limit": 50,
      "total": 1
    }
  }
  ```

- Error:

  ```json
  {
    "success": false,
    "error": {
      "code": "ATTENDANCE_NOT_FOUND",
      "message": "Buổi điểm danh không tồn tại"
    }
  }
  ```

---

#### 11.2. Create Attendance Details (Bulk)

**Description**: Tạo hàng loạt chi tiết điểm danh cho toàn bộ sinh viên trong một buổi. Yêu cầu role: `LECTURER`.

**URL**: `/api/attendances/{attendanceId}/details`

**Method**: `POST`

**Body Request**:

| Field                      |  Type  | Required | Description                       |
| -------------------------- | :----: | :------: | --------------------------------- |
| details                    | array  |   Yes    | Mảng chi tiết điểm danh           |
| details[].studentProfileId | number |   Yes    | ID hồ sơ sinh viên                |
| details[].status           | string |   Yes    | Trạng thái: present, absent, late |
| details[].note             | string |    No    | Ghi chú cho sinh viên             |

```json
{
  "details": [
    {
      "studentProfileId": 3,
      "status": "present",
      "note": ""
    },
    {
      "studentProfileId": 4,
      "status": "absent",
      "note": "Không phép"
    }
  ]
}
```

**Example Response:**

- Success:

  ```json
  {
    "success": true,
    "data": {
      "created": 2,
      "attendanceId": 1
    }
  }
  ```

- Error:

  ```json
  {
    "success": false,
    "error": {
      "code": "ATTENDANCE_DETAIL_EXISTED",
      "message": "Chi tiết điểm danh cho buổi này đã được tạo"
    }
  }
  ```

---

#### 11.3. Update Attendance Detail

**Description**: Cập nhật trạng thái điểm danh của một sinh viên trong buổi học. Yêu cầu role: `LECTURER`.

**URL**: `/api/attendances/{attendanceId}/details/{detailId}`

**Method**: `PUT`

**Body Request**:

| Field  |  Type  | Required | Description                       |
| ------ | :----: | :------: | --------------------------------- |
| status | string |    No    | Trạng thái: present, absent, late |
| note   | string |    No    | Ghi chú                           |

```json
{
  "status": "late",
  "note": "Đến muộn 15 phút"
}
```

**Example Response:**

- Success:

  ```json
  {
    "success": true,
    "data": {
      "attendanceDetailId": 1,
      "status": "late",
      "note": "Đến muộn 15 phút"
    }
  }
  ```

- Error:

  ```json
  {
    "success": false,
    "error": {
      "code": "ATTENDANCE_DETAIL_NOT_FOUND",
      "message": "Chi tiết điểm danh không tồn tại"
    }
  }
  ```

---

#### 11.4. Get Attendance Summary by Student

**Description**: Lấy tổng hợp điểm danh của một sinh viên (số buổi có mặt, vắng, muộn) trong toàn bộ hoặc một lớp cụ thể. Yêu cầu role: `ADMIN`, `LECTURER`, hoặc chính chủ.

**URL**: `/api/profiles/{profileId}/attendance-summary`

**Method**: `GET`

**Query Params**:

| Field     |  Type  | Required | Description           |
| --------- | :----: | :------: | --------------------- |
| sectionId | number |    No    | Lọc theo lớp học phần |

```
GET /api/profiles/3/attendance-summary?sectionId=1
```

**Example Response:**

- Success:

  ```json
  {
    "success": true,
    "data": {
      "profileId": 3,
      "studentName": "Trần Thị B",
      "sectionId": 1,
      "subjectName": "OOP",
      "totalSessions": 20,
      "present": 17,
      "absent": 2,
      "late": 1,
      "attendanceRate": 85
    }
  }
  ```

- Error:

  ```json
  {
    "success": false,
    "error": {
      "code": "PROFILE_NOT_FOUND",
      "message": "Hồ sơ sinh viên không tồn tại"
    }
  }
  ```

---

### 12. ProfileApplication

#### 12.1. Get Application List

**Description**: Lấy danh sách hồ sơ xét duyệt. Yêu cầu role: `ADMIN`.

**URL**: `/api/profile-applications`

**Method**: `GET`

**Query Params**:

| Field             |  Type  | Required | Description                         |
| ----------------- | :----: | :------: | ----------------------------------- |
| page              | number |    No    | Trang hiện tại (mặc định: 1)        |
| limit             | number |    No    | Số bản ghi mỗi trang (mặc định: 10) |
| applicationStatus | string |    No    | Lọc theo trạng thái                 |

```
GET /api/profile-applications?page=1&applicationStatus=pending
```

**Example Response:**

- Success:

  ```json
  {
    "success": true,
    "data": [
      {
        "applicationId": 1,
        "studentProfileId": 3,
        "studentName": "Trần Thị B",
        "applicationStatus": "pending",
        "submissionDate": "2025-03-01T08:00:00Z"
      }
    ],
    "meta": {
      "page": 1,
      "limit": 10,
      "total": 1
    }
  }
  ```

- Error:

  ```json
  {
    "success": false,
    "error": {
      "code": "FORBIDDEN",
      "message": "Bạn không có quyền truy cập tài nguyên này"
    }
  }
  ```

---

#### 12.2. Submit Application

**Description**: Sinh viên nộp hồ sơ xét duyệt. Yêu cầu role: `STUDENT`.

**URL**: `/api/profile-applications`

**Method**: `POST`

**Body Request**:

| Field                                      | Type | Required | Description                                 |
| ------------------------------------------ | :--: | :------: | ------------------------------------------- |
| (Không có body thêm; dữ liệu lấy từ token) |  —   |    —     | Hồ sơ được tạo cho sinh viên đang đăng nhập |

```json
{}
```

**Example Response:**

- Success:

  ```json
  {
    "success": true,
    "data": {
      "applicationId": 2,
      "studentProfileId": 3,
      "applicationStatus": "pending",
      "submissionDate": "2025-03-05T09:00:00Z"
    }
  }
  ```

- Error:

  ```json
  {
    "success": false,
    "error": {
      "code": "APPLICATION_ALREADY_SUBMITTED",
      "message": "Bạn đã nộp hồ sơ và đang chờ xét duyệt"
    }
  }
  ```

---

#### 12.3. Get Application Detail

**Description**: Lấy chi tiết hồ sơ xét duyệt. Yêu cầu role: `ADMIN` hoặc chính chủ.

**URL**: `/api/profile-applications/{applicationId}`

**Method**: `GET`

**Query Params**: Không có.

**Example Response:**

- Success:

  ```json
  {
    "success": true,
    "data": {
      "applicationId": 1,
      "studentProfileId": 3,
      "studentName": "Trần Thị B",
      "applicationStatus": "pending",
      "submissionDate": "2025-03-01T08:00:00Z",
      "reviewedByProfileId": null,
      "reviewDate": null,
      "reviewNotes": null
    }
  }
  ```

- Error:

  ```json
  {
    "success": false,
    "error": {
      "code": "APPLICATION_NOT_FOUND",
      "message": "Hồ sơ không tồn tại"
    }
  }
  ```

---

#### 12.4. Update Application

**Description**: Sinh viên cập nhật hồ sơ chưa được duyệt. Yêu cầu role: `STUDENT` (chính chủ).

**URL**: `/api/profile-applications/{applicationId}`

**Method**: `PUT`

**Body Request**:

| Field                                                     | Type | Required | Description |
| --------------------------------------------------------- | :--: | :------: | ----------- |
| (Thêm/thay đổi chứng chỉ qua endpoint certificates riêng) |  —   |    —     | —           |

```json
{}
```

**Example Response:**

- Success:

  ```json
  {
    "success": true,
    "data": {
      "applicationId": 1,
      "applicationStatus": "pending"
    }
  }
  ```

- Error:

  ```json
  {
    "success": false,
    "error": {
      "code": "APPLICATION_ALREADY_REVIEWED",
      "message": "Hồ sơ đã được duyệt, không thể chỉnh sửa"
    }
  }
  ```

---

#### 12.5. Review Application

**Description**: Admin duyệt hoặc từ chối hồ sơ xét duyệt. Yêu cầu role: `ADMIN`.

**URL**: `/api/profile-applications/{applicationId}/review`

**Method**: `PATCH`

**Body Request**:

| Field             |  Type  | Required | Description                        |
| ----------------- | :----: | :------: | ---------------------------------- |
| applicationStatus | string |   Yes    | Trạng thái mới: approved, rejected |
| reviewNotes       | string |    No    | Ghi chú xét duyệt                  |

```json
{
  "applicationStatus": "approved",
  "reviewNotes": "Hồ sơ hợp lệ, đã xét duyệt thành công"
}
```

**Example Response:**

- Success:

  ```json
  {
    "success": true,
    "data": {
      "applicationId": 1,
      "applicationStatus": "approved",
      "reviewedByProfileId": 1,
      "reviewDate": "2025-03-06T10:00:00Z",
      "reviewNotes": "Hồ sơ hợp lệ, đã xét duyệt thành công"
    }
  }
  ```

- Error:

  ```json
  {
    "success": false,
    "error": {
      "code": "APPLICATION_NOT_FOUND",
      "message": "Hồ sơ không tồn tại"
    }
  }
  ```

---

#### 12.6. Get My Applications

**Description**: Sinh viên xem danh sách hồ sơ đã nộp. Yêu cầu role: `STUDENT`.

**URL**: `/api/profile-applications/my-applications`

**Method**: `GET`

**Query Params**:

| Field |  Type  | Required | Description                         |
| ----- | :----: | :------: | ----------------------------------- |
| page  | number |    No    | Trang hiện tại (mặc định: 1)        |
| limit | number |    No    | Số bản ghi mỗi trang (mặc định: 10) |

```
GET /api/profile-applications/my-applications
```

**Example Response:**

- Success:

  ```json
  {
    "success": true,
    "data": [
      {
        "applicationId": 1,
        "applicationStatus": "approved",
        "submissionDate": "2025-03-01T08:00:00Z",
        "reviewDate": "2025-03-06T10:00:00Z"
      }
    ],
    "meta": {
      "page": 1,
      "limit": 10,
      "total": 1
    }
  }
  ```

- Error:

  ```json
  {
    "success": false,
    "error": {
      "code": "FORBIDDEN",
      "message": "Chỉ sinh viên mới có thể truy cập"
    }
  }
  ```

---

### 13. CertificateType

#### 13.1. Get Certificate Type List

**Description**: Lấy danh sách loại chứng chỉ. Yêu cầu xác thực: `Authorization: Bearer <token>`.

**URL**: `/api/certificate-types`

**Method**: `GET`

**Query Params**:

| Field |  Type  | Required | Description                         |
| ----- | :----: | :------: | ----------------------------------- |
| page  | number |    No    | Trang hiện tại (mặc định: 1)        |
| limit | number |    No    | Số bản ghi mỗi trang (mặc định: 10) |

```
GET /api/certificate-types
```

**Example Response:**

- Success:

  ```json
  {
    "success": true,
    "data": [
      {
        "certificateTypeId": 1,
        "typeName": "IELTS",
        "description": "Chứng chỉ tiếng Anh quốc tế"
      }
    ],
    "meta": {
      "page": 1,
      "limit": 10,
      "total": 1
    }
  }
  ```

- Error:

  ```json
  {
    "success": false,
    "error": {
      "code": "UNAUTHORIZED",
      "message": "Vui lòng đăng nhập để tiếp tục"
    }
  }
  ```

---

#### 13.2. Create Certificate Type

**Description**: Tạo loại chứng chỉ mới. Yêu cầu role: `ADMIN`.

**URL**: `/api/certificate-types`

**Method**: `POST`

**Body Request**:

| Field       |  Type  | Required | Description        |
| ----------- | :----: | :------: | ------------------ |
| typeName    | string |   Yes    | Tên loại chứng chỉ |
| description | string |    No    | Mô tả chi tiết     |

```json
{
  "typeName": "TOEIC",
  "description": "Chứng chỉ tiếng Anh thương mại quốc tế"
}
```

**Example Response:**

- Success:

  ```json
  {
    "success": true,
    "data": {
      "certificateTypeId": 2,
      "typeName": "TOEIC",
      "description": "Chứng chỉ tiếng Anh thương mại quốc tế"
    }
  }
  ```

- Error:

  ```json
  {
    "success": false,
    "error": {
      "code": "CERTIFICATE_TYPE_EXISTED",
      "message": "Loại chứng chỉ đã tồn tại"
    }
  }
  ```

---

#### 13.3. Get Certificate Type Detail

**Description**: Lấy chi tiết loại chứng chỉ. Yêu cầu xác thực: `Authorization: Bearer <token>`.

**URL**: `/api/certificate-types/{typeId}`

**Method**: `GET`

**Query Params**: Không có.

**Example Response:**

- Success:

  ```json
  {
    "success": true,
    "data": {
      "certificateTypeId": 1,
      "typeName": "IELTS",
      "description": "Chứng chỉ tiếng Anh quốc tế"
    }
  }
  ```

- Error:

  ```json
  {
    "success": false,
    "error": {
      "code": "CERTIFICATE_TYPE_NOT_FOUND",
      "message": "Loại chứng chỉ không tồn tại"
    }
  }
  ```

---

#### 13.4. Update Certificate Type

**Description**: Cập nhật loại chứng chỉ. Yêu cầu role: `ADMIN`.

**URL**: `/api/certificate-types/{typeId}`

**Method**: `PUT`

**Body Request**:

| Field       |  Type  | Required | Description        |
| ----------- | :----: | :------: | ------------------ |
| typeName    | string |    No    | Tên loại chứng chỉ |
| description | string |    No    | Mô tả chi tiết     |

```json
{
  "description": "Chứng chỉ IELTS Academic và General"
}
```

**Example Response:**

- Success:

  ```json
  {
    "success": true,
    "data": {
      "certificateTypeId": 1,
      "typeName": "IELTS",
      "description": "Chứng chỉ IELTS Academic và General"
    }
  }
  ```

- Error:

  ```json
  {
    "success": false,
    "error": {
      "code": "CERTIFICATE_TYPE_NOT_FOUND",
      "message": "Loại chứng chỉ không tồn tại"
    }
  }
  ```

---

#### 13.5. Delete Certificate Type

**Description**: Xóa loại chứng chỉ. Yêu cầu role: `ADMIN`.

**URL**: `/api/certificate-types/{typeId}`

**Method**: `DELETE`

**Query Params**: Không có.

**Example Response:**

- Success:

  ```json
  {
    "success": true,
    "data": null
  }
  ```

- Error:

  ```json
  {
    "success": false,
    "error": {
      "code": "CERTIFICATE_TYPE_IN_USE",
      "message": "Không thể xóa loại chứng chỉ đang được sử dụng"
    }
  }
  ```

---

### 14. CertificateDetail

#### 14.1. Get Certificate List

**Description**: Lấy danh sách tất cả chứng chỉ. Yêu cầu role: `ADMIN`.

**URL**: `/api/certificates`

**Method**: `GET`

**Query Params**:

| Field             |  Type  | Required | Description                         |
| ----------------- | :----: | :------: | ----------------------------------- |
| page              | number |    No    | Trang hiện tại (mặc định: 1)        |
| limit             | number |    No    | Số bản ghi mỗi trang (mặc định: 10) |
| certificateTypeId | number |    No    | Lọc theo loại chứng chỉ             |

```
GET /api/certificates?page=1&limit=10
```

**Example Response:**

- Success:

  ```json
  {
    "success": true,
    "data": [
      {
        "certificateId": 1,
        "applicationId": 1,
        "certificateTypeId": 1,
        "typeName": "IELTS",
        "score": 7.5,
        "issueDate": "2024-06-01",
        "expiryDate": "2026-06-01",
        "evidenceURL": "https://storage.example.com/certs/ielts.pdf"
      }
    ],
    "meta": {
      "page": 1,
      "limit": 10,
      "total": 1
    }
  }
  ```

- Error:

  ```json
  {
    "success": false,
    "error": {
      "code": "FORBIDDEN",
      "message": "Bạn không có quyền truy cập tài nguyên này"
    }
  }
  ```

---

#### 14.2. Create Certificate

**Description**: Tạo chi tiết chứng chỉ cho một hồ sơ. Yêu cầu role: `ADMIN`.

**URL**: `/api/certificates`

**Method**: `POST`

**Body Request**:

| Field             |  Type  | Required | Description                 |
| ----------------- | :----: | :------: | --------------------------- |
| applicationId     | number |   Yes    | ID hồ sơ xét duyệt          |
| certificateTypeId | number |   Yes    | ID loại chứng chỉ           |
| score             | number |    No    | Điểm số                     |
| issueDate         | string |    No    | Ngày cấp (YYYY-MM-DD)       |
| expiryDate        | string |    No    | Ngày hết hạn (YYYY-MM-DD)   |
| evidenceURL       | string |    No    | URL minh chứng              |
| metadata          | object |    No    | Thông tin bổ sung dạng JSON |

```json
{
  "applicationId": 1,
  "certificateTypeId": 1,
  "score": 7.5,
  "issueDate": "2024-06-01",
  "expiryDate": "2026-06-01",
  "evidenceURL": "https://storage.example.com/certs/ielts.pdf",
  "metadata": { "band": "C1" }
}
```

**Example Response:**

- Success:

  ```json
  {
    "success": true,
    "data": {
      "certificateId": 1,
      "applicationId": 1,
      "certificateTypeId": 1,
      "score": 7.5,
      "issueDate": "2024-06-01",
      "expiryDate": "2026-06-01",
      "evidenceURL": "https://storage.example.com/certs/ielts.pdf"
    }
  }
  ```

- Error:

  ```json
  {
    "success": false,
    "error": {
      "code": "APPLICATION_NOT_FOUND",
      "message": "Hồ sơ không tồn tại"
    }
  }
  ```

---

#### 14.3. Get Certificate Detail

**Description**: Lấy chi tiết một chứng chỉ. Yêu cầu role: `ADMIN` hoặc chính chủ.

**URL**: `/api/certificates/{certificateId}`

**Method**: `GET`

**Query Params**: Không có.

**Example Response:**

- Success:

  ```json
  {
    "success": true,
    "data": {
      "certificateId": 1,
      "applicationId": 1,
      "certificateTypeId": 1,
      "typeName": "IELTS",
      "score": 7.5,
      "issueDate": "2024-06-01",
      "expiryDate": "2026-06-01",
      "evidenceURL": "https://storage.example.com/certs/ielts.pdf",
      "metadata": { "band": "C1" }
    }
  }
  ```

- Error:

  ```json
  {
    "success": false,
    "error": {
      "code": "CERTIFICATE_NOT_FOUND",
      "message": "Chứng chỉ không tồn tại"
    }
  }
  ```

---

#### 14.4. Update Certificate

**Description**: Cập nhật thông tin chứng chỉ. Yêu cầu role: `ADMIN`.

**URL**: `/api/certificates/{certificateId}`

**Method**: `PUT`

**Body Request**:

| Field       |  Type  | Required | Description                 |
| ----------- | :----: | :------: | --------------------------- |
| score       | number |    No    | Điểm số                     |
| issueDate   | string |    No    | Ngày cấp (YYYY-MM-DD)       |
| expiryDate  | string |    No    | Ngày hết hạn (YYYY-MM-DD)   |
| evidenceURL | string |    No    | URL minh chứng              |
| metadata    | object |    No    | Thông tin bổ sung dạng JSON |

```json
{
  "score": 8.0,
  "expiryDate": "2027-06-01"
}
```

**Example Response:**

- Success:

  ```json
  {
    "success": true,
    "data": {
      "certificateId": 1,
      "score": 8.0,
      "expiryDate": "2027-06-01"
    }
  }
  ```

- Error:

  ```json
  {
    "success": false,
    "error": {
      "code": "CERTIFICATE_NOT_FOUND",
      "message": "Chứng chỉ không tồn tại"
    }
  }
  ```

---

#### 14.5. Delete Certificate

**Description**: Xóa chứng chỉ. Yêu cầu role: `ADMIN`.

**URL**: `/api/certificates/{certificateId}`

**Method**: `DELETE`

**Query Params**: Không có.

**Example Response:**

- Success:

  ```json
  {
    "success": true,
    "data": null
  }
  ```

- Error:

  ```json
  {
    "success": false,
    "error": {
      "code": "CERTIFICATE_NOT_FOUND",
      "message": "Chứng chỉ không tồn tại"
    }
  }
  ```

---

#### 14.6. Get Certificates by Application

**Description**: Lấy danh sách chứng chỉ thuộc một hồ sơ xét duyệt. Yêu cầu role: `ADMIN` hoặc chính chủ.

**URL**: `/api/profile-applications/{applicationId}/certificates`

**Method**: `GET`

**Query Params**: Không có.

**Example Response:**

- Success:

  ```json
  {
    "success": true,
    "data": [
      {
        "certificateId": 1,
        "certificateTypeId": 1,
        "typeName": "IELTS",
        "score": 7.5,
        "issueDate": "2024-06-01",
        "expiryDate": "2026-06-01",
        "evidenceURL": "https://storage.example.com/certs/ielts.pdf"
      }
    ]
  }
  ```

- Error:

  ```json
  {
    "success": false,
    "error": {
      "code": "APPLICATION_NOT_FOUND",
      "message": "Hồ sơ không tồn tại"
    }
  }
  ```

---

### 15. StudentCertificates

#### 15.1. Get Student Certificates

**Description**: Lấy danh sách chứng chỉ của một sinh viên. Yêu cầu role: `ADMIN` hoặc chính chủ.

**URL**: `/api/profiles/{profileId}/certificates`

**Method**: `GET`

**Query Params**:

| Field |  Type  | Required | Description                         |
| ----- | :----: | :------: | ----------------------------------- |
| page  | number |    No    | Trang hiện tại (mặc định: 1)        |
| limit | number |    No    | Số bản ghi mỗi trang (mặc định: 10) |

```
GET /api/profiles/3/certificates
```

**Example Response:**

- Success:

  ```json
  {
    "success": true,
    "data": [
      {
        "certificateId": 1,
        "typeName": "IELTS",
        "score": 7.5,
        "issueDate": "2024-06-01",
        "expiryDate": "2026-06-01",
        "evidenceURL": "https://storage.example.com/certs/ielts.pdf"
      }
    ],
    "meta": {
      "page": 1,
      "limit": 10,
      "total": 1
    }
  }
  ```

- Error:

  ```json
  {
    "success": false,
    "error": {
      "code": "PROFILE_NOT_FOUND",
      "message": "Hồ sơ sinh viên không tồn tại"
    }
  }
  ```

---

#### 15.2. Add Certificate to Student

**Description**: Gắn một chứng chỉ cho sinh viên. Yêu cầu role: `ADMIN`.

**URL**: `/api/profiles/{profileId}/certificates`

**Method**: `POST`

**Body Request**:

| Field         |  Type  | Required | Description  |
| ------------- | :----: | :------: | ------------ |
| certificateId | number |   Yes    | ID chứng chỉ |

```json
{
  "certificateId": 1
}
```

**Example Response:**

- Success:

  ```json
  {
    "success": true,
    "data": {
      "studentId": 3,
      "certificateId": 1
    }
  }
  ```

- Error:

  ```json
  {
    "success": false,
    "error": {
      "code": "CERTIFICATE_ALREADY_LINKED",
      "message": "Chứng chỉ đã được gắn cho sinh viên này"
    }
  }
  ```

---

#### 15.3. Remove Certificate from Student

**Description**: Gỡ một chứng chỉ khỏi sinh viên. Yêu cầu role: `ADMIN`.

**URL**: `/api/profiles/{profileId}/certificates/{certificateId}`

**Method**: `DELETE`

**Query Params**: Không có.

**Example Response:**

- Success:

  ```json
  {
    "success": true,
    "data": null
  }
  ```

- Error:

  ```json
  {
    "success": false,
    "error": {
      "code": "CERTIFICATE_NOT_LINKED",
      "message": "Chứng chỉ không thuộc sinh viên này"
    }
  }
  ```

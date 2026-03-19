# API Document

- [API Document](#api-document)
  - [I. General information](#i-general-information)
    - [Enum Conventions](#enum-conventions)
    - [Query Param Conventions](#query-param-conventions)
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
      - [3.1. Create Profile](#31-create-profile)
      - [3.2. Get Profile List](#32-get-profile-list)
      - [3.3. Get Profile Detail](#33-get-profile-detail)
      - [3.4. Update Profile](#34-update-profile)
      - [3.5. Get My Profile](#35-get-my-profile)
      - [3.6. Update My Profile](#36-update-my-profile)
      - [3.7. Get Student List](#37-get-student-list)
      - [3.8. Get Lecturer List](#38-get-lecturer-list)
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
        "details": {
            "formErrors": string[],
            "fieldErrors": Record<string, string[]>
        }
    } | null,
    "meta": {
        "page": number,
        "limit": number,
        "total": number
    } | null
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
      "data": null,
      "error": {
          "code": "EMAIL_EXISTED",
        "message": "Đăng ký thất bại, email đã tồn tại",
        "details": {
          "formErrors": [],
          "fieldErrors": {
            "email": ["Email đã được sử dụng"]
          }
        }
      },
      "meta": null
  }
  ```

### Error Details Conventions

- Validation errors (`400`):
  - Put messages in `error.details.fieldErrors` by field name.
  - Keep `error.details.formErrors` empty unless there is a form-level validation rule.
- Authentication/business errors (`401`, `403`, `409`, ...):
  - Put user-facing messages in `error.details.formErrors`.
  - Keep `error.details.fieldErrors` empty when the error is not tied to one specific input field.

### Enum Conventions

- Account Role: ADMIN, LECTURER, STUDENT, PARENT
- Profile Status: ACTIVE, INACTIVE, BANNED
- Profile Gender: MALE, FEMALE
- Section Status: OPEN, COMPLETED, CANCELLED
- Room:
  - Type: LECTURE, LAB
  - Status: ACTIVE, INACTIVE, MAINTENANCE
- Schedule Day of week: MONDAY, TUESDAY, WEDNESDAY, THURSDAY, FRIDAY, SATURDAY, SUNDAY
- Attendance Status: PRESENT, ABSENT, EXCUSED_ABSENCE, LATE
- Application Status: PENDING, APPROVED, REJECTED, CANCELLED

### Query Param Conventions

- Pagination:
- `page`: page number (default: `1`)
- `limit`: number of records per page (default: `10`)
- Search:
- `search`: full-text search keyword by main fields (name, code, email, ...)
- Enum filters:
- Enum values ​​in the query use UPPERCASE according to the Enum section above.
- Date range:
- Use pair `startDate`/`endDate` ​​for calendar/usage resources.
- Use the `<field>From`/`<field>To` ​​pair for resources with multiple timestamps (e.g. `submissionFrom`, `submissionTo`).

## II. Endpoints

---

### 1. Auth

#### 1.1. Login

**Description**: Log in to the system. Returns the access token and refresh token. No prior authentication required.

**URL**: `/api/auth/login`

**Method**: `POST`

**Body Request**:

| Field    |  Type  | Required | Description |
| -------- | :----: | :------: | ----------- |
| username | string |   Yes    | Username    |
| password | string |   Yes    | Password    |

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
        "email": "admin@university.edu.vn",
        "role": "ADMIN",
        "profile": {
          "profileId": 1,
          "fullName": "Nguyễn Văn Admin",
          "avatar": "https://storage.example.com/avatars/1.jpg",
          "status": "ACTIVE"
        }
      }
    },
    "error": null,
    "meta": null
  }
  ```

- Error - Validation (`AUTH_LOGIN_INVALID_INPUT`):

  ```json
  {
    "success": false,
    "data": null,
    "error": {
      "code": "AUTH_LOGIN_INVALID_INPUT",
      "message": "Dữ liệu đăng nhập không hợp lệ",
      "details": {
        "formErrors": [],
        "fieldErrors": {
          "username": [
            "Tên đăng nhập là bắt buộc"
          ]
        }
      }
    },
    "meta": null
  }
  ```

- Error - Invalid Credentials (`AUTH_LOGIN_INVALID_CREDENTIALS`):

  ```json
  {
    "success": false,
    "data": null,
    "error": {
      "code": "AUTH_LOGIN_INVALID_CREDENTIALS",
      "message": "Tên đăng nhập hoặc mật khẩu không đúng",
      "details": {
        "formErrors": [
          "Tên đăng nhập hoặc mật khẩu không đúng"
        ],
        "fieldErrors": {}
      }
    },
    "meta": null
  }
  ```

---

#### 1.2. Logout

**Description**: Log out of the current session by invalidating the provided refresh token. No prior authentication required.

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
    "data": {
      "message": "Đăng xuất thành công"
    },
    "error": null,
    "meta": null
  }
  ```

- Error - Validation (`AUTH_LOGOUT_INVALID_INPUT`):

  ```json
  {
    "success": false,
    "data": null,
    "error": {
      "code": "AUTH_LOGOUT_INVALID_INPUT",
      "message": "Dữ liệu đăng xuất không hợp lệ",
      "details": {
        "formErrors": [],
        "fieldErrors": {
          "refreshToken": [
            "Refresh token là bắt buộc"
          ]
        }
      }
    },
    "meta": null
  }
  ```

- Error - Invalid Token (`AUTH_LOGOUT_INVALID_TOKEN`):

  ```json
  {
    "success": false,
    "data": null,
    "error": {
      "code": "AUTH_LOGOUT_INVALID_TOKEN",
      "message": "Refresh token không hợp lệ hoặc đã hết hạn",
      "details": {
        "formErrors": [
          "Refresh token không hợp lệ hoặc đã hết hạn"
        ],
        "fieldErrors": {}
      }
    },
    "meta": null
  }
  ```

---

#### 1.3. Refresh Token

**Description**: Refresh access token with existing refresh token.

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
    },
    "error": null,
    "meta": null
  }
  ```

- Error:

  ```json
  {
    "success": false,
    "data": null,
    "error": {
      "code": "AUTH_REFRESH_TOKEN_INVALID_TOKEN",
      "message": "Refresh token không hợp lệ hoặc đã hết hạn",
      "details": {
        "formErrors": [
          "Refresh token không hợp lệ hoặc đã hết hạn"
        ],
        "fieldErrors": {}
      }
    },
    "meta": null
  }
  ```

---

#### 1.4. Change Password

**Description**: Change current account password. Authentication request: `Authorization: Bearer <token>`.

**URL**: `/api/auth/change-password`

**Method**: `PUT`

**Body Request**:

| Field           |  Type  | Required | Description      |
| --------------- | :----: | :------: | ---------------- |
| currentPassword | string |   Yes    | Current password |
| newPassword     | string |   Yes    | New password     |

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

**Description**: Self-register for a new account (for students). The system automatically creates `Account` with the corresponding roles `STUDENT` ​​and `UserProfile`. No prior authentication required.

**URL**: `/api/auth/register`

**Method**: `POST`

**Body Request**:

| Field           |  Type  | Required | Description                            |
| --------------- | :----: | :------: | -------------------------------------- |
| fullName        | string |   Yes    | Full name                              |
| username        | string |   Yes    | Username                               |
| email           | string |   Yes    | User's email                           |
| password        | string |   Yes    | Password                               |
| confirmPassword | string |   Yes    | Confirm password (must match password) |

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
        "email": "nguyenvana@example.com",
        "role": "STUDENT",
        "profile": {
          "profileId": 10,
          "fullName": "Nguyễn Văn A",
          "avatar": null,
          "status": "ACTIVE"
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

**Description**: Gets a list of accounts with pagination, search, and filtering. Requires role: `ADMIN`.

**URL**: `/api/accounts`

**Method**: `GET`

**Query Params**:

| Field  |  Type  | Required | Description                                        |
| ------ | :----: | :------: | -------------------------------------------------- |
| page   | number |    No    | Current page (default: 1)                          |
| limit  | number |    No    | Number of records per page (default: 10)           |
| search | string |    No    | Search by username or email                        |
| roles  | string |    No    | Filter by role: ADMIN, LECTURER, STUDENT           |
| status | string |    No    | Filter by profile status: ACTIVE, INACTIVE, BANNED |

```
GET /api/accounts?page=1&limit=10&search=student&role=STUDENT&status=ACTIVE
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
        "email": "admin@university.edu.vn",
        "role": "STUDENT",
        "profile": {
          "profileId": 1,
          "fullName": "Nguyễn Văn Admin",
          "avatar": "https://storage.example.com/avatars/1.jpg",
          "status": "ACTIVE"
        }
      },
      {
        "accountId": 2,
        "username": "student01",
        "email": "tranthib@example.com",
        "role": "STUDENT",
        "profile": {
          "profileId": 3,
          "fullName": "Trần Thị B",
          "avatar": null,
          "status": "ACTIVE"
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

**Description**: Create a new account. Requires role: `ADMIN`.

**URL**: `/api/accounts`

**Method**: `POST`

**Body Request**:

| Field    |  Type  | Required | Description                            |
| -------- | :----: | :------: | -------------------------------------- |
| username | string |   Yes    | Username (unique)                      |
| email    | string |   Yes    | Email                                  |
| password | string |   Yes    | Password                               |
| role     | string |   Yes    | Role: ADMIN, LECTURER, STUDENT, PARENT |

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
      "email": "nguyenvana@example.com",
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

**Description**: Get details of an account by ID. Requires role: `ADMIN`.

**URL**: `/api/accounts/{accountId}`

**Method**: `GET`

**Query Params**: None.

**Example Response:**

- Success:

  ```json
  {
    "success": true,
    "data": {
      "accountId": 5,
      "username": "lecturer01",
      "email": "levanc@university.edu.vn",
      "role": "LECTURER",
      "profile": {
        "profileId": 5,
        "fullName": "TS. Lê Văn C",
        "avatar": "https://storage.example.com/avatars/5.jpg",
        "status": "ACTIVE"
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

**Description**: Update account information (username, role). Requires role: `ADMIN`.

**URL**: `/api/accounts/{accountId}`

**Method**: `PUT`

**Body Request**:

| Field    |  Type  | Required | Description                         |
| -------- | :----: | :------: | ----------------------------------- |
| username | string |    No    | New username                        |
| roles    | string |    No    | New roles: ADMIN, LECTURER, STUDENT |

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
      "email": "levanc@university.edu.vn",
      "role": "LECTURER",
      "profile": {
        "profileId": 5,
        "fullName": "TS. Lê Văn C",
        "avatar": "https://storage.example.com/avatars/5.jpg",
        "status": "ACTIVE"
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

**Description**: Delete account by ID. Requires role: `ADMIN`.

**URL**: `/api/accounts/{accountId}`

**Method**: `DELETE`

**Query Params**: None.

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

**Description**: Get account information of the currently logged in user. Authentication request: `Authorization: Bearer <token>`.

**URL**: `/api/accounts/me`

**Method**: `GET`

**Query Params**: None.

**Example Response:**

- Success:

  ```json
  {
    "success": true,
    "data": {
      "accountId": 5,
      "username": "lecturer01",
      "role": "LECTURER",
      "email": "levanc@university.edu.vn",
      "profile": {
        "profileId": 5,
        "fullName": "TS. Lê Văn C",
        "avatar": "https://storage.example.com/avatars/5.jpg",
        "status": "ACTIVE"
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

#### 3.1. Create Profile

**Description**: Create profile for account created by admin ([2.2. Create Account](#22-create-account)). Requires role `ADMIN`.

**URL**: `/api/profiles`

**Method**: `POST`

**Body Request**:

| Field       |  Type  | Required | Description                  |
| ----------- | :----: | :------: | ---------------------------- |
| accountId   | number |   Yes    | Account ID to create profile |
| fullName    | string |   Yes    | Full name                    |
| phoneNumber | string |    No    | Phone number                 |
| dateOfBirth | string |    No    | Date of birth (YYYY-MM-DD)   |
| gender      | string |    No    | Gender                       |
| avatars     | string |    No    | Profile image URL            |
| citizenId   | string |    No    | CCCD/CMND                    |
| hometown    | string |    No    | Hometown                     |
| status      | string |    No    | Status                       |

```json
{
  "accountId": 2,
  "fullName": "Nguyễn Văn A",
  "phoneNumber": "0901234567"
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
      "code": "ACCOUNT_NOT_FOUND",
      "message": "Tài khoản không tồn tại"
    }
  }
  ```

#### 3.2. Get Profile List

**Description**: Gets the list of user profiles. Requires role: `ADMIN`.

**URL**: `/api/profiles`

**Method**: `GET`

**Query Params**:

| Field  |  Type  | Required | Description                                      |
| ------ | :----: | :------: | ------------------------------------------------ |
| page   | number |    No    | Current page (default: 1)                        |
| limit  | number |    No    | Number of records per page (default: 10)         |
| search | string |    No    | Search by name or email                          |
| roles  | string |    No    | Filter by role: ADMIN, LECTURER, STUDENT, PARENT |
| status | string |    No    | Filter by status: ACTIVE, INACTIVE, BANNED       |
| gender | string |    No    | Filter by gender                                 |

```
GET /api/profiles?page=1&limit=10&search=Nguyen&role=STUDENT&status=ACTIVE
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
        "gender": "MALE",
        "status": "ACTIVE"
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

#### 3.3. Get Profile Detail

**Description**: Get profile details by ID. Requires role: `ADMIN` or owner.

**URL**: `/api/profiles/{profileId}`

**Method**: `GET`

**Query Params**: None.

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
      "gender": "MALE",
      "avatar": "https://storage.example.com/avatars/1.jpg",
      "citizenId": "079202012345",
      "hometown": "Hà Nội",
      "status": "ACTIVE"
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

#### 3.4. Update Profile

**Description**: Update records by ID. Requires role: `ADMIN` or owner.

**URL**: `/api/profiles/{profileId}`

**Method**: `PUT`

**Body Request**:

| Field       |  Type  | Required | Description                |
| ----------- | :----: | :------: | -------------------------- |
| fullName    | string |    No    | Full name                  |
| phoneNumber | string |    No    | Phone number               |
| dateOfBirth | string |    No    | Date of birth (YYYY-MM-DD) |
| gender      | string |    No    | Gender                     |
| email       | string |    No    | Email                      |
| avatars     | string |    No    | Profile image URL          |
| citizenId   | string |    No    | CCCD/CMND                  |
| hometown    | string |    No    | Hometown                   |
| status      | string |    No    | Status                     |

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

#### 3.5. Get My Profile

**Description**: Gets the profile of the currently logged in user. Authentication request: `Authorization: Bearer <token>`.

**URL**: `/api/profiles/me`

**Method**: `GET`

**Query Params**: None.

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
      "gender": "MALE",
      "status": "ACTIVE"
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

#### 3.6. Update My Profile

**Description**: Updates the currently logged in user's profile. Authentication request: `Authorization: Bearer <token>`.

**URL**: `/api/profiles/me`

**Method**: `PUT`

**Body Request**:

| Field       |  Type  | Required | Description                |
| ----------- | :----: | :------: | -------------------------- |
| fullName    | string |    No    | Full name                  |
| phoneNumber | string |    No    | Phone number               |
| dateOfBirth | string |    No    | Date of birth (YYYY-MM-DD) |
| gender      | string |    No    | Gender                     |
| email       | string |    No    | Email                      |
| avatars     | string |    No    | Profile image URL          |
| citizenId   | string |    No    | CCCD/CMND                  |
| hometown    | string |    No    | Hometown                   |

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

#### 3.7. Get Student List

**Description**: Get the list of student profiles. Role requirements: `ADMIN`, `LECTURER`.

**URL**: `/api/profiles/students`

**Method**: `GET`

**Query Params**:

| Field  |  Type  | Required | Description                                |
| ------ | :----: | :------: | ------------------------------------------ |
| page   | number |    No    | Current page (default: 1)                  |
| limit  | number |    No    | Number of records per page (default: 10)   |
| search | string |    No    | Search by name or email                    |
| status | string |    No    | Filter by status: ACTIVE, INACTIVE, BANNED |
| gender | string |    No    | Filter by gender                           |

```
GET /api/profiles/students?page=1&limit=20&search=Tran&status=ACTIVE
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
        "status": "ACTIVE"
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

#### 3.8. Get Lecturer List

**Description**: Get a list of lecturer profiles. Requires role: `ADMIN`.

**URL**: `/api/profiles/lecturers`

**Method**: `GET`

**Query Params**:

| Field  |  Type  | Required | Description                                |
| ------ | :----: | :------: | ------------------------------------------ |
| page   | number |    No    | Current page (default: 1)                  |
| limit  | number |    No    | Number of records per page (default: 10)   |
| search | string |    No    | Search by name or email                    |
| status | string |    No    | Filter by status: ACTIVE, INACTIVE, BANNED |
| gender | string |    No    | Filter by gender                           |

```
GET /api/profiles/lecturers?page=1&limit=10&search=Le&status=ACTIVE
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
        "status": "ACTIVE"
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

**Description**: Get the list of subjects. Authentication request: `Authorization: Bearer <token>`.

**URL**: `/api/subjects`

**Method**: `GET`

**Query Params**:

| Field      |  Type  | Required | Description                                                         |
| ---------- | :----: | :------: | ------------------------------------------------------------------- |
| page       | number |    No    | Current page (default: 1)                                           |
| limit      | number |    No    | Number of records per page (default: 10)                            |
| search     | string |    No    | Search by subject name                                              |
| minPeriods | number |    No    | Filter subjects with the number of periods greater than or equal to |
| maxPeriods | number |    No    | Filter subjects with the number of periods less than or equal to    |

```
GET /api/subjects?page=1&limit=10&search=Lap%20trinh&minPeriods=30&maxPeriods=60
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

**Description**: Create a new subject. Requires role: `ADMIN`.

**URL**: `/api/subjects`

**Method**: `POST`

**Body Request**:

| Field       |  Type  | Required | Description       |
| ----------- | :----: | :------: | ----------------- |
| subjectName | string |   Yes    | Subject name      |
| periods     | number |   Yes    | Number of lessons |

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
      "code": "SUBJECT_CREATE_NAME_EXISTS",
      "message": "Tên môn học đã tồn tại"
    }
  }
  ```

---

#### 4.3. Get Subject Detail

**Description**: Get details of a subject. Authentication request: `Authorization: Bearer <token>`.

**URL**: `/api/subjects/{subjectId}`

**Method**: `GET`

**Query Params**: None.

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

**Description**: Update subject information. Requires role: `ADMIN`.

**URL**: `/api/subjects/{subjectId}`

**Method**: `PUT`

**Body Request**:

| Field       |  Type  | Required | Description       |
| ----------- | :----: | :------: | ----------------- |
| subjectName | string |    No    | New subject name  |
| periods     | number |    No    | Number of lessons |

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

**Description**: Delete subject. Requires role: `ADMIN`.

**URL**: `/api/subjects/{subjectId}`

**Method**: `DELETE`

**Query Params**: None.

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

**Description**: Get the section list. Requires role: `ADMIN`.

**URL**: `/api/sections`

**Method**: `GET`

**Query Params**:

| Field             |  Type  | Required | Description                                    |
| ----------------- | :----: | :------: | ---------------------------------------------- |
| page              | number |    No    | Current page (default: 1)                      |
| limit             | number |    No    | Number of records per page (default: 10)       |
| search            | string |    No    | Search by subject code/name or instructor name |
| subjectId         | number |    No    | Filter by subject                              |
| lecturerProfileId | number |    No    | Filter by lecturer                             |
| year              | string |    No    | Filter by school year                          |
| status            | number |    No    | Filter by status                               |
| visibility        | number |    No    | Filter by display status                       |

```
GET /api/sections?page=1&limit=10&search=OOP&year=2024-2025&subjectId=2&status=1&visibility=1
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

**Description**: Create a new section class. Simultaneously create Schedule, UsageHistory, SectionUsageHistory and attendance according to schedule.

Flow: Section -> Schedule -> Attendance -> UsageHistory -> SectionUsageHistory.

Requires role: `ADMIN`.

**URL**: `/api/sections`

**Method**: `POST`

**Body Request**:

| Field             |      Type      | Required | Description                    |
| ----------------- | :------------: | :------: | ------------------------------ |
| subjectId         |     number     |   Yes    | Subject ID                     |
| lecturerProfileId |     number     |   Yes    | Lecturer profile ID            |
| year              |     string     |   Yes    | School year (eg: 2024-2025)    |
| maxCapacity       |     number     |   Yes    | Maximum number of participants |
| status            |     number     |    No    | Status (default: 0)            |
| visibility        |     number     |    No    | Display (default: 1)           |
| schedule          | array\<object> |   Yes    | List of class schedules        |

**Schedule item** (`schedule[]`):

| Field       |  Type  | Required | Description                       |
| ----------- | :----: | :------: | --------------------------------- |
| roomId      | number |   Yes    | Classroom ID                      |
| dayOfWeek   | string |   Yes    | Day of the week (eg: `MONDAY`)    |
| startPeriod | number |   Yes    | Lesson starts                     |
| endPeriod   | number |   Yes    | End of section                    |
| startDate   | string |   Yes    | Start date (format: `YYYY-MM-DD`) |
| endDate     | string |   Yes    | End date (format: `YYYY-MM-DD`)   |

```json
{
  "subjectId": 2,
  "lecturerProfileId": 5,
  "year": "2024-2025",
  "maxCapacity": 40,
  "status": 1,
  "visibility": 1,
  "schedule": [
    {
      "roomId": 1,
      "dayOfWeek": "MONDAY",
      "startPeriod": 1,
      "endPeriod": 3,
      "startDate": "2025-01-06",
      "endDate": "2025-05-30"
    },
    {
      "roomId": 1,
      "dayOfWeek": "MONDAY",
      "startPeriod": 4,
      "endPeriod": 5,
      "startDate": "2025-01-06",
      "endDate": "2025-05-30"
    }
  ]
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
      "code": "LECTURER_NOT_FOUND",
      "message": "Giảng viên không tồn tại"
    }
  }
  ```

---

#### 5.3. Get Section Detail

**Description**: Get section class details. Authentication request: `Authorization: Bearer <token>`.

**URL**: `/api/sections/{sectionId}`

**Method**: `GET`

**Query Params**: None.

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
      "visibility": 1,
      "schedule": [
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
        },
        {
          "scheduleId": 1,
          "roomId": 1,
          "roomName": "A101",
          "sectionId": 1,
          "subjectName": "OOP",
          "dayOfWeek": "Monday",
          "startPeriod": 4,
          "endPeriod": 5,
          "totalPeriods": 2,
          "startDate": "2025-01-06",
          "endDate": "2025-05-30"
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
      "code": "SECTION_NOT_FOUND",
      "message": "Lớp học phần không tồn tại"
    }
  }
  ```

---

#### 5.4. Update Section

**Description**: Update section class information. Requires role: `ADMIN`.

**URL**: `/api/sections/{sectionId}`

**Method**: `PUT`

**Body Request**:

| Field             |  Type  | Required | Description                    |
| ----------------- | :----: | :------: | ------------------------------ |
| lecturerProfileId | number |    No    | Lecturer profile ID            |
| year              | string |    No    | School year                    |
| maxCapacity       | number |    No    | Maximum number of participants |
| status            | number |    No    | Status                         |
| visibility        | number |    No    | Show                           |

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

**Description**: Delete the section class. Requires role: `ADMIN`.

**URL**: `/api/sections/{sectionId}`

**Method**: `DELETE`

**Query Params**: None.

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

**Description**: Get the list of students registered in the class. Role requirements: `ADMIN`, `LECTURER`.

**URL**: `/api/sections/{sectionId}/students`

**Method**: `GET`

**Query Params**:

| Field |  Type  | Required | Description                              |
| ----- | :----: | :------: | ---------------------------------------- |
| page  | number |    No    | Current page (default: 1)                |
| limit | number |    No    | Number of records per page (default: 10) |

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

**Description**: Get the list of classes for the currently logged in instructor. Requires role: `LECTURER`.

**URL**: `/api/sections/my-sections`

**Method**: `GET`

**Query Params**:

| Field |  Type  | Required | Description                              |
| ----- | :----: | :------: | ---------------------------------------- |
| page  | number |    No    | Current page (default: 1)                |
| limit | number |    No    | Number of records per page (default: 10) |
| year  | string |    No    | Filter by school year                    |

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

**Description**: Update section class status. Role requirements: `ADMIN`, `LECTURER`.

**URL**: `/api/sections/{sectionId}/status`

**Method**: `PATCH`

**Body Request**:

| Field  |  Type  | Required | Description |
| ------ | :----: | :------: | ----------- |
| status | number |   Yes    | New Status  |

```json
{
  "status": 1
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
      "code": "SECTION_NOT_FOUND",
      "message": "Lớp học phần không tồn tại"
    }
  }
  ```

---

#### 5.9. Update Section Visibility

**Description**: Update the visibility (show/hide) of the section class. Role requirements: `ADMIN`, `LECTURER`.

**URL**: `/api/sections/{sectionId}/visibility`

**Method**: `PATCH`

**Body Request**:

| Field      |  Type  | Required | Description    |
| ---------- | :----: | :------: | -------------- |
| visibility | number |   Yes    | Display status |

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
    "data": null
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

**Description**: Get a list of all course registrations. Requires role: `ADMIN`.

**URL**: `/api/registrations`

**Method**: `GET`

**Query Params**:

| Field            |  Type  | Required | Description                                |
| ---------------- | :----: | :------: | ------------------------------------------ |
| page             | number |    No    | Current page (default: 1)                  |
| limit            | number |    No    | Number of records per page (default: 10)   |
| sectionId        | number |    No    | Filter by class section                    |
| studentProfileId | number |    No    | Filter by student                          |
| status           | number |    No    | Filter by subscription status              |
| registeredFrom   | string |    No    | Registration period from date (YYYY-MM-DD) |
| registeredTo     | string |    No    | Registration period to date (YYYY-MM-DD)   |

```
GET /api/registrations?page=1&limit=10&sectionId=1&status=1&registeredFrom=2025-01-01&registeredTo=2025-03-31
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

**Description**: Student registers for the module class. Requires role: `STUDENT`.

**URL**: `/api/registrations`

**Method**: `POST`

**Body Request**:

| Field     |  Type  | Required | Description   |
| --------- | :----: | :------: | ------------- |
| sectionId | number |   Yes    | Part class ID |

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
    "data": null
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

**Description**: Student cancels class registration. Requires role: `STUDENT`.

**URL**: `/api/registrations/{sectionId}`

**Method**: `DELETE`

**Query Params**: None.

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

**Description**: Students see the list of registered classes. Requires role: `STUDENT`.

**URL**: `/api/registrations/my-registrations`

**Method**: `GET`

**Query Params**:

| Field          |  Type  | Required | Description                                |
| -------------- | :----: | :------: | ------------------------------------------ |
| page           | number |    No    | Current page (default: 1)                  |
| limit          | number |    No    | Number of records per page (default: 10)   |
| status         | number |    No    | Filter by subscription status              |
| year           | string |    No    | Filter by school year                      |
| registeredFrom | string |    No    | Registration period from date (YYYY-MM-DD) |
| registeredTo   | string |    No    | Registration period to date (YYYY-MM-DD)   |

```
GET /api/registrations/my-registrations?page=1&limit=10&status=1&year=2024-2025
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

**Description**: Get the registration list of a specific class. Role requirements: `ADMIN`, `LECTURER`.

**URL**: `/api/sections/{sectionId}/registrations`

**Method**: `GET`

**Query Params**:

| Field  |  Type  | Required | Description                              |
| ------ | :----: | :------: | ---------------------------------------- |
| page   | number |    No    | Current page (default: 1)                |
| limit  | number |    No    | Number of records per page (default: 10) |
| search | string |    No    | Search by student name or email          |
| status | number |    No    | Filter by registration status            |

```
GET /api/sections/1/registrations?page=1&limit=30&search=Tran&status=1
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

**Description**: Get the list of classrooms. Authentication request: `Authorization: Bearer <token>`.

**URL**: `/api/rooms`

**Method**: `GET`

**Query Params**:

| Field       |  Type  | Required | Description                                     |
| ----------- | :----: | :------: | ----------------------------------------------- |
| page        | number |    No    | Current page (default: 1)                       |
| limit       | number |    No    | Number of records per page (default: 10)        |
| search      | string |    No    | Search by room name                             |
| campus      | string |    No    | Filter by facility                              |
| roomType    | string |    No    | Filter by room type: LECTURE, LAB               |
| status      | string |    No    | Filter by status: ACTIVE, INACTIVE, MAINTENANCE |
| minCapacity | number |    No    | Filter minimum capacity                         |
| maxCapacity | number |    No    | Filter maximum capacity                         |

```
GET /api/rooms?page=1&limit=10&search=A1&campus=A&roomType=LECTURE&status=ACTIVE&minCapacity=30
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
        "roomType": "LECTURE",
        "campus": "A",
        "capacity": 50,
        "status": "ACTIVE"
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

**Description**: Create a new classroom. Requires role: `ADMIN`.

**URL**: `/api/rooms`

**Method**: `POST`

**Body Request**:

| Field    |  Type  | Required | Description              |
| -------- | :----: | :------: | ------------------------ |
| roomName | string |   Yes    | Room name (unique)       |
| roomType | string |   Yes    | Room type                |
| campus   | string |   Yes    | Facility                 |
| capacity | number |   Yes    | Capacity                 |
| status   | string |    No    | Status (default: ACTIVE) |

```json
{
  "roomName": "B201",
  "roomType": "LAB",
  "campus": "B",
  "capacity": 30,
  "status": "ACTIVE"
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
      "roomType": "LAB",
      "campus": "B",
      "capacity": 30,
      "status": "ACTIVE"
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

**Description**: Get classroom details. Authentication request: `Authorization: Bearer <token>`.

**URL**: `/api/rooms/{roomId}`

**Method**: `GET`

**Query Params**: None.

**Example Response:**

- Success:

  ```json
  {
    "success": true,
    "data": {
      "roomId": 1,
      "roomName": "A101",
      "roomType": "LECTURE",
      "campus": "A",
      "capacity": 50,
      "status": "ACTIVE"
    }
  }
  ```

- Error:

  ```json
  {
    "success": false,
    "error": {
      "code": "ROOM_GET_NOT_FOUND",
      "message": "Phòng học không tồn tại"
    }
  }
  ```

---

#### 7.4. Update Room

**Description**: Update classroom information. Requires role: `ADMIN`.

**URL**: `/api/rooms/{roomId}`

**Method**: `PUT`

**Body Request**:

| Field    |  Type  | Required | Description |
| -------- | :----: | :------: | ----------- |
| roomName | string |    No    | Room name   |
| roomType | string |    No    | Room type   |
| campus   | string |    No    | Facility    |
| capacity | number |    No    | Capacity    |
| status   | string |    No    | Status      |

```json
{
  "capacity": 55,
  "status": "MAINTENANCE"
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
      "status": "MAINTENANCE"
    }
  }
  ```

- Error:

  ```json
  {
    "success": false,
    "error": {
      "code": "ROOM_GET_NOT_FOUND",
      "message": "Phòng học không tồn tại"
    }
  }
  ```

---

#### 7.5. Delete Room

**Description**: Delete classroom. Requires role: `ADMIN`.

**URL**: `/api/rooms/{roomId}`

**Method**: `DELETE`

**Query Params**: None.

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

**Description**: Get a list of class schedules for a room. Requires role: `ADMIN`.

**URL**: `/api/rooms/{roomId}/schedules`

**Method**: `GET`

**Query Params**:

| Field     |  Type  | Required | Description            |
| --------- | :----: | :------: | ---------------------- |
| startDate | string |    No    | From date (YYYY-MM-DD) |
| endDate   | string |    No    | To date (YYYY-MM-DD)   |

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
      "code": "ROOM_GET_NOT_FOUND",
      "message": "Phòng học không tồn tại"
    }
  }
  ```

---

#### 7.7. Get Available Rooms

**Description**: Get a list of available classrooms based on date, period and capacity criteria. Requires role: `ADMIN`.

**URL**: `/api/rooms/available`

**Method**: `GET`

**Query Params**:

| Field       |  Type  | Required | Description                |
| ----------- | :----: | :------: | -------------------------- |
| date        | string |   Yes    | Date to order (YYYY-MM-DD) |
| startPeriod | number |   Yes    | Lesson starts              |
| endPeriod   | number |   Yes    | End of section             |
| capacity    | number |    No    | Minimum capacity           |

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
        "roomType": "LAB",
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

**Description**: Get a list of class schedules. Requires role: `ADMIN`.

**URL**: `/api/schedules`

**Method**: `GET`

**Query Params**:

| Field     |  Type  | Required | Description                              |
| --------- | :----: | :------: | ---------------------------------------- |
| page      | number |    No    | Current page (default: 1)                |
| limit     | number |    No    | Number of records per page (default: 10) |
| roomId    | number |    No    | Filter by classroom                      |
| sectionId | number |    No    | Filter by class section                  |
| dayOfWeek | string |    No    | Filter by day: MONDAY ... SUNDAY         |
| startDate | string |    No    | From date (YYYY-MM-DD)                   |
| endDate   | string |    No    | To date (YYYY-MM-DD)                     |

```
GET /api/schedules?page=1&limit=10&sectionId=1&dayOfWeek=MONDAY&startDate=2025-01-01&endDate=2025-03-31
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

**Description**: Create a new class schedule. Requires role: `ADMIN`.

**URL**: `/api/schedules`

**Method**: `POST`

**Body Request**:

| Field        |  Type  | Required | Description             |
| ------------ | :----: | :------: | ----------------------- |
| roomId       | number |   Yes    | Classroom ID            |
| sectionId    | number |   Yes    | Part class ID           |
| dayOfWeek    | string |   Yes    | Day of the week         |
| startPeriod  | number |   Yes    | Lesson starts           |
| endPeriod    | number |   Yes    | End of section          |
| totalPeriods | number |   Yes    | Total number of periods |
| startDate    | string |   Yes    | Start date (YYYY-MM-DD) |
| endDate      | string |   Yes    | End Date (YYYY-MM-DD)   |

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
    "data": null
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

**Description**: Get details of a class schedule. Authentication request: `Authorization: Bearer <token>`.

**URL**: `/api/schedules/{scheduleId}`

**Method**: `GET`

**Query Params**: None.

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

**Description**: Updated class schedule. Requires role: `ADMIN`.

**URL**: `/api/schedules/{scheduleId}`

**Method**: `PUT`

**Body Request**:

| Field        |  Type  | Required | Description             |
| ------------ | :----: | :------: | ----------------------- |
| roomId       | number |    No    | New classroom ID        |
| dayOfWeek    | string |    No    | Day of the week         |
| startPeriod  | number |    No    | Lesson starts           |
| endPeriod    | number |    No    | End of section          |
| totalPeriods | number |    No    | Total number of periods |
| startDate    | string |    No    | Start date (YYYY-MM-DD) |
| endDate      | string |    No    | End Date (YYYY-MM-DD)   |

```json
{
  "roomId": 2,
  "dayOfWeek": "WEDNESDAY"
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
      "dayOfWeek": "WEDNESDAY"
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

**Description**: Delete class schedule. Requires role: `ADMIN`.

**URL**: `/api/schedules/{scheduleId}`

**Method**: `DELETE`

**Query Params**: None.

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

**Description**: Get the class schedule of the currently logged in user (students see the registered course schedule, lecturers see the teaching schedule). Authentication request: `Authorization: Bearer <token>`.

**URL**: `/api/schedules/my-schedule`

**Method**: `GET`

**Query Params**:

| Field     |  Type  | Required | Description                      |
| --------- | :----: | :------: | -------------------------------- |
| sectionId | number |    No    | Filter by class section          |
| roomId    | number |    No    | Filter by classroom              |
| dayOfWeek | string |    No    | Filter by day: MONDAY ... SUNDAY |
| startDate | string |    No    | From date (YYYY-MM-DD)           |
| endDate   | string |    No    | To date (YYYY-MM-DD)             |

```
GET /api/schedules/my-schedule?sectionId=1&dayOfWeek=MONDAY&startDate=2025-03-01&endDate=2025-03-31
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

**Description**: Get the entire class schedule of a section class. Authentication request: `Authorization: Bearer <token>`.

**URL**: `/api/sections/{sectionId}/schedules`

**Method**: `GET`

**Query Params**: None.

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

**Description**: Get a list of room usage history. Requires role: `ADMIN`.

**URL**: `/api/usage-histories`

**Method**: `GET`

**Query Params**:

| Field     |  Type  | Required | Description                              |
| --------- | :----: | :------: | ---------------------------------------- |
| page      | number |    No    | Current page (default: 1)                |
| limit     | number |    No    | Number of records per page (default: 10) |
| roomId    | number |    No    | Filter by classroom                      |
| sectionId | number |    No    | Filter by class section                  |
| startDate | string |    No    | From date (YYYY-MM-DD)                   |
| endDate   | string |    No    | To date (YYYY-MM-DD)                     |

```
GET /api/usage-histories?page=1&limit=10&roomId=1&sectionId=2&startDate=2025-01-01&endDate=2025-06-30
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

**Description**: Create a classroom usage record. Requires role: `ADMIN`.

**URL**: `/api/usage-histories`

**Method**: `POST`

**Body Request**:

| Field     |  Type  | Required | Description             |
| --------- | :----: | :------: | ----------------------- |
| roomId    | number |   Yes    | Classroom ID            |
| startTime | string |   Yes    | Start time (YYYY-MM-DD) |
| endTime   | string |   Yes    | End time (YYYY-MM-DD)   |
| notes     | string |    No    | Notes                   |

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
      "code": "ROOM_GET_NOT_FOUND",
      "message": "Phòng học không tồn tại"
    }
  }
  ```

---

#### 9.3. Get Usage History Detail

**Description**: Get room usage record details. Requires role: `ADMIN`.

**URL**: `/api/usage-histories/{usageHistoryId}`

**Method**: `GET`

**Query Params**: None.

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

**Description**: Update room usage record. Requires role: `ADMIN`.

**URL**: `/api/usage-histories/{usageHistoryId}`

**Method**: `PUT`

**Body Request**:

| Field     |  Type  | Required | Description             |
| --------- | :----: | :------: | ----------------------- |
| startTime | string |    No    | Start time (YYYY-MM-DD) |
| endTime   | string |    No    | End time (YYYY-MM-DD)   |
| notes     | string |    No    | Notes                   |

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

**Description**: Delete room usage record. Requires role: `ADMIN`.

**URL**: `/api/usage-histories/{usageHistoryId}`

**Method**: `DELETE`

**Query Params**: None.

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

**Description**: Get the entire usage history of a classroom. Requires role: `ADMIN`.

**URL**: `/api/rooms/{roomId}/usage-histories`

**Method**: `GET`

**Query Params**:

| Field     |  Type  | Required | Description                              |
| --------- | :----: | :------: | ---------------------------------------- |
| page      | number |    No    | Current page (default: 1)                |
| limit     | number |    No    | Number of records per page (default: 10) |
| sectionId | number |    No    | Filter by class section                  |
| startDate | string |    No    | From date (YYYY-MM-DD)                   |
| endDate   | string |    No    | To date (YYYY-MM-DD)                     |

```
GET /api/rooms/1/usage-histories?page=1&limit=10&sectionId=2&startDate=2025-01-01&endDate=2025-06-30
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
      "code": "ROOM_GET_NOT_FOUND",
      "message": "Phòng học không tồn tại"
    }
  }
  ```

---

#### 9.7. Add Section to Usage History

**Description**: Attach a section class to the room occupancy record. Requires role: `ADMIN`.

**URL**: `/api/usage-histories/{usageHistoryId}/sections`

**Method**: `POST`

**Body Request**:

| Field     |  Type  | Required | Description   |
| --------- | :----: | :------: | ------------- |
| sectionId | number |   Yes    | Part class ID |

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

**Description**: Removes a section class from the room usage record. Requires role: `ADMIN`.

**URL**: `/api/usage-histories/{usageHistoryId}/sections/{sectionId}`

**Method**: `DELETE`

**Query Params**: None.

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

**Description**: Get the roll call list. Requires role: `ADMIN`.

**URL**: `/api/attendances`

**Method**: `GET`

**Query Params**:

| Field          |  Type  | Required | Description                              |
| -------------- | :----: | :------: | ---------------------------------------- |
| page           | number |    No    | Current page (default: 1)                |
| limit          | number |    No    | Number of records per page (default: 10) |
| sectionId      | number |    No    | Filter by class section                  |
| attendanceDate | string |    No    | Filter by attendance date (YYYY-MM-DD)   |
| slots          | number |    No    | Filter by period                         |

```
GET /api/attendances?page=1&limit=10&sectionId=1&attendanceDate=2025-02-10&slot=1
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

**Description**: Create a new attendance session for the module class. Requires role: `LECTURER`.

**URL**: `/api/attendances`

**Method**: `POST`

**Body Request**:

| Field          |  Type  | Required | Description                  |
| -------------- | :----: | :------: | ---------------------------- |
| sectionId      | number |   Yes    | Part class ID                |
| attendanceDate | string |   Yes    | Attendance date (YYYY-MM-DD) |
| slots          | number |   Yes    | Lesson                       |
| notes          | string |    No    | Notes                        |

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
    "data": null
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

**Description**: Get details of a roll call session. Role requirements: `ADMIN`, `LECTURER`.

**URL**: `/api/attendances/{attendanceId}`

**Method**: `GET`

**Query Params**: None.

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

**Description**: Update roll call information. Requires role: `LECTURER`.

**URL**: `/api/attendances/{attendanceId}`

**Method**: `PUT`

**Body Request**:

| Field          |  Type  | Required | Description                  |
| -------------- | :----: | :------: | ---------------------------- |
| attendanceDate | string |    No    | Attendance date (YYYY-MM-DD) |
| slots          | number |    No    | Lesson                       |
| notes          | string |    No    | Notes                        |

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

**Description**: Delete the roll call session. Role requirements: `ADMIN`, `LECTURER`.

**URL**: `/api/attendances/{attendanceId}`

**Method**: `DELETE`

**Query Params**: None.

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

**Description**: Get the list of attendance of a module class. Role requirements: `ADMIN`, `LECTURER`.

**URL**: `/api/sections/{sectionId}/attendances`

**Method**: `GET`

**Query Params**:

| Field          |  Type  | Required | Description                              |
| -------------- | :----: | :------: | ---------------------------------------- |
| page           | number |    No    | Current page (default: 1)                |
| limit          | number |    No    | Number of records per page (default: 10) |
| attendanceDate | string |    No    | Filter by attendance date (YYYY-MM-DD)   |
| slots          | number |    No    | Filter by period                         |

```
GET /api/sections/1/attendances?page=1&limit=20&attendanceDate=2025-02-10&slot=1
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

**Description**: Get a list of attendance status for each student in a session. Role requirements: `ADMIN`, `LECTURER`.

**URL**: `/api/attendances/{attendanceId}/details`

**Method**: `GET`

**Query Params**:

| Field            |  Type  | Required | Description                                              |
| ---------------- | :----: | :------: | -------------------------------------------------------- |
| page             | number |    No    | Current page (default: 1)                                |
| limit            | number |    No    | Number of records per page (default: 50)                 |
| studentProfileId | number |    No    | Filter by student                                        |
| status           | string |    No    | Filter by status: PRESENT, ABSENT, EXCUSED_ABSENCE, LATE |

```
GET /api/attendances/1/details?page=1&limit=50&status=PRESENT
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
        "status": "PRESENT",
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

**Description**: Create a series of attendance details for all students in one session. Requires role: `LECTURER`.

**URL**: `/api/attendances/{attendanceId}/details`

**Method**: `POST`

**Body Request**:

| Field                      |  Type  | Required | Description                   |
| -------------------------- | :----: | :------: | ----------------------------- |
| details                    | array  |   Yes    | Attendance detail array       |
| details[].studentProfileId | number |   Yes    | Student profile ID            |
| details[].status           | string |   Yes    | Status: PRESENT, ABSENT, LATE |
| details[].note             | string |    No    | Notes for students            |

```json
{
  "details": [
    {
      "studentProfileId": 3,
      "status": "PRESENT",
      "note": ""
    },
    {
      "studentProfileId": 4,
      "status": "ABSENT",
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

**Description**: Update the attendance status of a student during a class session. Requires role: `LECTURER`.

**URL**: `/api/attendances/{attendanceId}/details/{detailId}`

**Method**: `PUT`

**Body Request**:

| Field  |  Type  | Required | Description                   |
| ------ | :----: | :------: | ----------------------------- |
| status | string |    No    | Status: PRESENT, ABSENT, LATE |
| notes  | string |    No    | Notes                         |

```json
{
  "status": "LATE",
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
      "status": "LATE",
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

**Description**: Get the total attendance of a student (number of sessions present, absent, late) in the entire or a specific class. Requires role: `ADMIN`, `LECTURER`, or owner.

**URL**: `/api/profiles/{profileId}/attendance-summary`

**Method**: `GET`

**Query Params**:

| Field     |  Type  | Required | Description             |
| --------- | :----: | :------: | ----------------------- |
| sectionId | number |    No    | Filter by class section |

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

**Description**: Get the application list. Requires role: `ADMIN`.

**URL**: `/api/profile-applications`

**Method**: `GET`

**Query Params**:

| Field             |  Type  | Required | Description                                              |
| ----------------- | :----: | :------: | -------------------------------------------------------- |
| page              | number |    No    | Current page (default: 1)                                |
| limit             | number |    No    | Number of records per page (default: 10)                 |
| search            | string |    No    | Search by student name                                   |
| applicationStatus | string |    No    | Filter by status: PENDING, APPROVED, REJECTED, CANCELLED |
| submissionFrom    | string |    No    | Date submitted from (YYYY-MM-DD)                         |
| submissionTo      | string |    No    | Submission date to (YYYY-MM-DD)                          |

```
GET /api/profile-applications?page=1&limit=10&search=Tran&applicationStatus=PENDING&submissionFrom=2025-03-01&submissionTo=2025-03-31
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
        "applicationStatus": "PENDING",
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

**Description**: Student submits application for review. Requires role: `STUDENT`.

**URL**: `/api/profile-applications`

**Method**: `POST`

**Body Request**:

| Field                                       | Type | Required | Description                                     |
| ------------------------------------------- | :--: | :------: | ----------------------------------------------- |
| (No additional body; data taken from token) |  —   |    —     | Profile created for currently logged in student |

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
      "applicationStatus": "PENDING",
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

**Description**: Get details of the approval file. Requires role: `ADMIN` or owner.

**URL**: `/api/profile-applications/{applicationId}`

**Method**: `GET`

**Query Params**: None.

**Example Response:**

- Success:

  ```json
  {
    "success": true,
    "data": {
      "applicationId": 1,
      "studentProfileId": 3,
      "studentName": "Trần Thị B",
      "applicationStatus": "PENDING",
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

**Description**: Student's profile update has not been approved. Role requirement: `STUDENT` (owner).

**URL**: `/api/profile-applications/{applicationId}`

**Method**: `PUT`

**Body Request**:

| Field                                                       | Type | Required | Description |
| ----------------------------------------------------------- | :--: | :------: | ----------- |
| (Add/change certificates via private certificates endpoint) |  —   |    —     | —           |

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
      "applicationStatus": "PENDING"
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

**Description**: Admin approves or rejects the review application. Requires role: `ADMIN`.

**URL**: `/api/profile-applications/{applicationId}/review`

**Method**: `PATCH`

**Body Request**:

| Field             |  Type  | Required | Description                    |
| ----------------- | :----: | :------: | ------------------------------ |
| applicationStatus | string |   Yes    | New status: APPROVED, REJECTED |
| reviewNotes       | string |    No    | Review notes                   |

```json
{
  "applicationStatus": "APPROVED",
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
      "applicationStatus": "APPROVED",
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

**Description**: Students see the list of submitted documents. Requires role: `STUDENT`.

**URL**: `/api/profile-applications/my-applications`

**Method**: `GET`

**Query Params**:

| Field |  Type  | Required | Description                              |
| ----- | :----: | :------: | ---------------------------------------- |
| page  | number |    No    | Current page (default: 1)                |
| limit | number |    No    | Number of records per page (default: 10) |

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
        "applicationStatus": "APPROVED",
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

**Description**: Get the list of certificate types. Authentication request: `Authorization: Bearer <token>`.

**URL**: `/api/certificate-types`

**Method**: `GET`

**Query Params**:

| Field  |  Type  | Required | Description                              |
| ------ | :----: | :------: | ---------------------------------------- |
| page   | number |    No    | Current page (default: 1)                |
| limit  | number |    No    | Number of records per page (default: 10) |
| search | string |    No    | Search by certificate type name          |

```
GET /api/certificate-types?page=1&limit=10&search=IELTS
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

**Description**: Create a new certificate type. Requires role: `ADMIN`.

**URL**: `/api/certificate-types`

**Method**: `POST`

**Body Request**:

| Field       |  Type  | Required | Description           |
| ----------- | :----: | :------: | --------------------- |
| typeName    | string |   Yes    | Certificate type name |
| description | string |    No    | Detailed description  |

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

**Description**: Get details of the certificate type. Authentication request: `Authorization: Bearer <token>`.

**URL**: `/api/certificate-types/{typeId}`

**Method**: `GET`

**Query Params**: None.

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

**Description**: Update certificate type. Requires role: `ADMIN`.

**URL**: `/api/certificate-types/{typeId}`

**Method**: `PUT`

**Body Request**:

| Field       |  Type  | Required | Description           |
| ----------- | :----: | :------: | --------------------- |
| typeName    | string |    No    | Certificate type name |
| description | string |    No    | Detailed description  |

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

**Description**: Delete certificate type. Requires role: `ADMIN`.

**URL**: `/api/certificate-types/{typeId}`

**Method**: `DELETE`

**Query Params**: None.

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

**Description**: Get a list of all certificates. Requires role: `ADMIN`.

**URL**: `/api/certificates`

**Method**: `GET`

**Query Params**:

| Field             |  Type   | Required | Description                                          |
| ----------------- | :-----: | :------: | ---------------------------------------------------- |
| page              | number  |    No    | Current page (default: 1)                            |
| limit             | number  |    No    | Number of records per page (default: 10)             |
| search            | string  |    No    | Search by certificate type name or demonstration URL |
| certificateTypeId | number  |    No    | Filter by certificate type                           |
| isVerified        | boolean |    No    | Filter by certificate verification status            |
| issueDateFrom     | string  |    No    | Date issued from (YYYY-MM-DD)                        |
| issueDateTo       | string  |    No    | Date issued to (YYYY-MM-DD)                          |
| expiryDateFrom    | string  |    No    | Expiration date from (YYYY-MM-DD)                    |
| expiryDateTo      | string  |    No    | Expiry date to (YYYY-MM-DD)                          |

```
GET /api/certificates?page=1&limit=10&search=IELTS&certificateTypeId=1&isVerified=true&issueDateFrom=2024-01-01
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

**Description**: Creates certificate details for a profile. Requires role: `ADMIN`.

**URL**: `/api/certificates`

**Method**: `POST`

**Body Request**:

| Field             |  Type  | Required | Description                    |
| ----------------- | :----: | :------: | ------------------------------ |
| applicationId     | number |   Yes    | ID of review file              |
| certificateTypeId | number |   Yes    | Certificate type ID            |
| scores            | number |    No    | Score                          |
| issueDate         | string |    No    | Issue date (YYYY-MM-DD)        |
| expiryDate        | string |    No    | Expiration date (YYYY-MM-DD)   |
| evidenceURL       | string |    No    | Demonstration URL              |
| metadata          | object |    No    | Additional information in JSON |

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

**Description**: Get details of a certificate. Requires role: `ADMIN` or owner.

**URL**: `/api/certificates/{certificateId}`

**Method**: `GET`

**Query Params**: None.

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

**Description**: Update certificate information. Requires role: `ADMIN`.

**URL**: `/api/certificates/{certificateId}`

**Method**: `PUT`

**Body Request**:

| Field       |  Type  | Required | Description                    |
| ----------- | :----: | :------: | ------------------------------ |
| scores      | number |    No    | Score                          |
| issueDate   | string |    No    | Issue date (YYYY-MM-DD)        |
| expiryDate  | string |    No    | Expiration date (YYYY-MM-DD)   |
| evidenceURL | string |    No    | Demonstration URL              |
| metadata    | object |    No    | Additional information in JSON |

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

**Description**: Delete certificate. Requires role: `ADMIN`.

**URL**: `/api/certificates/{certificateId}`

**Method**: `DELETE`

**Query Params**: None.

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

**Description**: Get a list of certificates belonging to an approval profile. Requires role: `ADMIN` or owner.

**URL**: `/api/profile-applications/{applicationId}/certificates`

**Method**: `GET`

**Query Params**: None.

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

**Description**: Get a list of a student's certificates. Requires role: `ADMIN` or owner.

**URL**: `/api/profiles/{profileId}/certificates`

**Method**: `GET`

**Query Params**:

| Field             |  Type   | Required | Description                              |
| ----------------- | :-----: | :------: | ---------------------------------------- |
| page              | number  |    No    | Current page (default: 1)                |
| limit             | number  |    No    | Number of records per page (default: 10) |
| search            | string  |    No    | Search by certificate type name          |
| certificateTypeId | number  |    No    | Filter by certificate type               |
| isVerified        | boolean |    No    | Filter by verification status            |

```
GET /api/profiles/3/certificates?page=1&limit=10&search=IELTS&certificateTypeId=1&isVerified=true
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

**Description**: Attach a certificate to the student. Requires role: `ADMIN`.

**URL**: `/api/profiles/{profileId}/certificates`

**Method**: `POST`

**Body Request**:

| Field         |  Type  | Required | Description    |
| ------------- | :----: | :------: | -------------- |
| certificateId | number |   Yes    | Certificate ID |

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

**Description**: Remove a certificate from a student. Requires role: `ADMIN`.

**URL**: `/api/profiles/{profileId}/certificates/{certificateId}`

**Method**: `DELETE`

**Query Params**: None.

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

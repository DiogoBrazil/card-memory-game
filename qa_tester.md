
# Application Testing Plan


---

### Authentication (`/api/users`)

* **`POST /register`**: Registers a new user.
    * **Request Body:**
        ```json
        {
          "username": "your_username",
          "password": "your_password"
        }
        ```
    * **Response (Success):** `201 Created` -
        ```json
        { "message": "User registered successfully" }
        ```
    * **Response (Error):** `400 Bad Request` -
        ```json
        { "message": "Username already exists" }
        ```
* **`POST /login`**: Authenticates an existing user.
    * **Request Body:**
        ```json
        {
          "username": "your_username",
          "password": "your_password"
        }
        ```
    * **Response (Success):** `200 OK` -
        ```json
        {
          "token": "your_jwt_token",
          "userID": "user_id"
        }
        ```
    * **Response (Error):** `400 Bad Request` -
        ```json
        { "message": "Invalid username or password" }
        ```

---

### Memory Game (`/api/memory`)

* **`POST /save`**: Saves the data of a completed game session.
    * **Request Body:**
        ```json
        {
          "userID": "user_id",
          "gameDate": "iso_date_string",
          "failed": number_of_fails,
          "difficulty": "Easy|Normal|Hard",
          "completed": number_of_completed_pairs,
          "timeTaken": time_in_seconds
        }
        ```
    * **Response (Success):** `201 Created` -
        ```json
        { "message": "Game data saved successfully" }
        ```
    * **Response (Error):** `400 Bad Request` - `{ "message": "Missing required fields" }` or validation error.
* **`GET /history`**: Retrieves the history of all game sessions (sorted by date).
    * **Response (Success):** `200 OK` - Array of saved game objects, populated with the `username`.
    * **Response (Error):** `500 Internal Server Error` -
        ```json
        { "message": "Error fetching game history" }
        ```

---

## Backend Testing Plan

### 1. Testing Strategy

The testing strategy for the backend will focus on:

* **API Tests:** Validate each endpoint (`/api/users/register`, `/api/users/login`, `/api/memory/save`, `/api/memory/history`) for correct functionality, handling of valid and invalid data, and expected HTTP responses.
* **Functional Tests:** Ensure key features (user registration, login, game progress saving, history retrieval) work as expected.
* **Integration Tests:** Verify the interaction between routes, controllers, models, and the database.
* **Data Validation Tests:** Ensure saved data (`save.js`, `user.js`) is correct and validations (required fields, types, enums) are working.
* **Security Tests:** Focus on authentication security (password hashing, JWT token validation) and malicious input prevention.

---

### 2. Detailed Test Cases

| ID  | Test Title                                | Steps                                                                                                                                                           | Expected Result                                                                                                                                                  | Relevant APIs/Files                        |
|-----|-------------------------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------|---------------------------------------------|
| TC1 | Register New User (Success)               | 1. Send a POST request to `/api/users/register` with valid and unique `username` and `password`.                                                               | 1. HTTP 201 Created. 2. Message: "User registered successfully". 3. New user created in DB with hashed password.                                                  | `/api/users/register`, `userController.js`, `user.js` |
| TC2 | Register User (Fail - Username Exists)    | 1. Try to register using an existing `username` via POST to `/api/users/register`.                                                                              | 1. HTTP 400 Bad Request. 2. Message: "Username already exists".                                                                                                   | `/api/users/register`, `userController.js`  |
| TC3 | User Login (Success)                      | 1. Send a POST request to `/api/users/login` with correct `username` and `password`.                                                                            | 1. HTTP 200 OK. 2. Response contains valid JWT `token` and `userID`.                                                                                              | `/api/users/login`, `userController.js`     |
| TC4 | User Login (Fail - Incorrect Password)    | 1. Send a POST request to `/api/users/login` with correct `username` and incorrect `password`.                                                                 | 1. HTTP 400 Bad Request. 2. Message: "Invalid username or password".                                                                                              | `/api/users/login`, `userController.js`     |
| TC5 | Save Game Data (Success)                  | 1. Log in to get `userID`. 2. Send POST to `/api/memory/save` with valid `userID`, `gameDate`, `failed`, `difficulty` (Easy, Normal, or Hard), `completed`, `timeTaken`. | 1. HTTP 201 Created. 2. Message: "Game data saved successfully". 3. New save document created in DB.                                                             | `/api/memory/save`, `memoryController.js`, `save.js` |
| TC6 | Save Game Data (Fail - Missing Fields)    | 1. Send POST to `/api/memory/save` missing a required field (e.g. `difficulty`).                                                                                 | 1. HTTP 400 Bad Request. 2. Message: "Missing required fields".                                                                                                   | `/api/memory/save`, `memoryController.js`   |
| TC7 | Save Game Data (Fail - Invalid Difficulty)| 1. Send POST to `/api/memory/save` with invalid `difficulty` (e.g. "Very Easy").                                                                                 | 1. HTTP 500 (or 400). 2. Error indicating validation failure for `difficulty` enum.                                                                              | `/api/memory/save`, `memoryController.js`, `save.js` |
| TC8 | Get Game History (Success)                | 1. Send a GET request to `/api/memory/history`.                                                                                                                  | 1. HTTP 200 OK. 2. Array of saved games, with `username` populated and sorted by `gameDate`.                                                                     | `/api/memory/history`, `memoryController.js`|

---

### 3. Best Practices for Maintaining Quality

* **Version Control (Git):** Essential for managing source code history and collaboration.
* **Code Reviews:** Use peer reviews to identify bugs early and improve code quality.
* **Automated Testing:**
    * **Unit Tests:** Isolate and test individual functions/modules (controllers, models) — consider using Jest or Mocha.
    * **Integration Tests:** Ensure components work together properly (routes -> controllers -> models).
    * **E2E Tests:** Simulate full API flows from request to response.
* **CI/CD (Continuous Integration/Deployment):** Automate build, testing, and deployment pipelines.
* **Configuration Management:** Use environment variables (`.env`) for sensitive or environment-specific configs.
* **Linting & Formatting:** Use ESLint/Prettier to enforce consistency and detect issues early.
* **Monitoring & Logging:** Implement structured logging and monitor production performance/errors.
* **Documentation:** Keep API and codebase documentation up to date and clear for all developers.
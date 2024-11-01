<div style="text-align:center; margin:2rem 0;">
<span style="color:red; font-size:2rem; font-weight:bold;">Note-></span> <span style=" font-size:1.5rem; font-weight:bold;">Use this documentation to integrate this api with any frontend framework</span>
</div>

# API INTEGRATION WITH FRONTEND:

First you have to install backend in your system through this [guideline](/docs/api/api-development-guidelines.md). After configuring backend your system you can follow the rest.

# `Authentication`

#### You can validate using `zod` or any other validation library.

## 1.`POST` register

<span style="color:red; font-size:2rem; font-weight:bold;">Note-></span> The <code>register</code> endpoint also send the OTP on user email for verification.

```bash
    /api/v1/auth/register
```

### You will send to the server

Send the following data to backend by using above endpoint in `body`.

- username
- fullName
- email
- password
  <br>

### Make sure you validate this data properly according to following.

- username: It must be `string`. Username can only have `lowercase`, `number`, `periods` and `underscore` also it must have atleast `3` minimum characters and `50` maximum characters e.g: john_doe.
- fullName: It must be `string`. Full name can only contain `letters` and `spaces` also it must have atleast `3` minimum characters and `50` maximum characters e.g: John Doe
- emaill: It must be `string`. It must be valid email. It must be in lowercase.It must have atleast `3`characters and `150` maximum characters.
- password: It must be `string`. It must contain atleast `6` characters. It can have `50` maximum characters.

### You will recieve from the server.

If operation was successfully you will recieve `fullName` and `email` in response and server will send `OTP` to the user's email. After that you have to
use `OTP` verification screen, so user can enter that `OTP`. If user entered correct `OTP` you automatically login him/her without using login screen.

## 2. `POST` verifyEmail

```bash
/api/v1/auth/login
```

### You will send to the server

Send the following data to backend by using above endpoint in `body`.

- OTP: You will send 6 digit OTP which can only have 6 digits but in `string` datatype not `number` datatype.

### You will recieve from the server

If verification was successfully you will recieve two jwt tokens one is `refreshToken` which will expire in "7d" while accessToken will be expired in "14m". You can use refresh token to renew the accessToken. Without accessToken no one can access Protected routes.

## 3.`POST` resend OTP

### You will send to the server

Send the following data to backend by using above endpoint in `body`.

- email: Send email to the server without taking it from user again.

### Note

You will only use this route if somehow user was unable to get `OTP` or he was unable to verify his account under `30` minutes. Note that server will send only two OTP's in one minute.This endpoint will only accept the user email so server can resend the email to the user and also don't take email second time from the user if you want better user experience. Save the email to local storage or cookie during the registration process.
Use this route on verification screen on `resend otp` button so user can resend otp on his/her account for verification.

## 4. `POST` login

<span style="color:red; font-size:2rem; font-weight:bold;">Important Note-></span> Don't use Login screen if user is not verified. Only verified user can use login screen in order to renew their `refresh` and `accessToken`

```bash
    /api/v1/auth/login
```

Send the following data to backend by using above endpoint in `body`.

- email
- password
  <br>

### Make sure you validate this data properly according to following.

- emaill: It must be valid email and `string`. It can have `150` maximum characters. `don't do any other validation here`
- password: It must be `string`. `don't do any other validation here`

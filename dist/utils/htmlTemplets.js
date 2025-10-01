// رسالة الترحيب عند التسجيل
export const signUpTemplate = (userName) => `
<!DOCTYPE html>
<html>
<head>
    <title>Welcome to Our Hotel</title>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f9f9f9;
            color: #333;
            text-align: center;
            padding: 40px;
        }
        .container {
            background-color: #ffffff;
            border: 1px solid #ddd;
            border-radius: 8px;
            padding: 20px;
            max-width: 500px;
            margin: 0 auto;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }
        h2 {
            color: #4CAF50;
        }
        p {
            line-height: 1.6;
        }
    </style>
</head>
<body>
    <div class="container">
        <h2>Welcome, ${userName} 🎉</h2>
        <p>Thank you for signing up at <b>Our Hotel Booking System</b>.</p>
        <p>You can now log in and start booking rooms easily.</p>
        <p>We’re excited to have you on board 🚀</p>
    </div>
</body>
</html>
`;
// رسالة استرجاع كلمة السر
export const resetPassTemplate = (resetCode) => `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Password Reset Request</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
        }
        .container {
            background-color: #ffffff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
            max-width: 400px;
            width: 100%;
            text-align: center;
        }
        .header {
            background-color: #007BFF;
            color: #ffffff;
            padding: 10px 0;
            font-size: 24px;
            border-top-left-radius: 8px;
            border-top-right-radius: 8px;
        }
        .content {
            margin: 20px 0;
            line-height: 1.6;
            color: #333;
        }
        .code {
            background-color: #007BFF;
            color: #ffffff;
            font-weight: bold;
            padding: 10px 20px;
            border-radius: 4px;
            display: inline-block;
            margin: 10px 0;
        }
        .footer {
            margin-top: 20px;
            font-size: 12px;
            color: #777;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">Password Reset Request</div>
        <div class="content">
            <p>Hello,</p>
            <p>We received a request to reset your password. Use the code below to reset it:</p>
            <div class="code">${resetCode}</div>
            <p>This code will expire in 15 minutes. If you didn't request this, please ignore this email.</p>
        </div>
        <div class="footer">&copy; ${new Date().getFullYear()} Our Hotel. All rights reserved.</div>
    </div>
</body>
</html>
`;
//# sourceMappingURL=htmlTemplets.js.map
const cancelHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Payment Cancelled</title>
    <style>
        body { font-family: Arial, sans-serif; background-color: #f9f9f9; text-align: center; padding: 40px; }
        .container { background-color: #fff; border: 1px solid #ddd; border-radius: 8px; padding: 20px; max-width: 500px; margin: 0 auto; box-shadow: 0 4px 8px rgba(0,0,0,0.1); }
        h2 { color: #FF5722; }
        p { line-height: 1.6; }
    </style>
</head>
<body>
    <div class="container">
        <h2>Payment Cancelled ❌</h2>
        <p>Your reservation was not paid.</p>
        <p>Please try again if you want to complete your booking.</p>
    </div>
</body>
</html>
`;

export default cancelHtml;

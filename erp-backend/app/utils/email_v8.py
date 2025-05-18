import yagmail

def send_order_email(supplier_email, subject, body, attachment=None):
    # Make sure to configure these with your SMTP details or use environment variables for security
    yag = yagmail.SMTP(user="your_email@example.com", password="your_password")
    yag.send(
        to=supplier_email,
        subject=subject,
        contents=body,
        attachments=attachment
    )
const nodemailer = require('nodemailer');

// Create transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: process.env.SMTP_PORT || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

/**
 * Gửi email chung
 */
const sendEmail = async (to, subject, html) => {
  try {
    const info = await transporter.sendMail({
      from: `"Siêu Thị ABC" <${process.env.SMTP_USER}>`,
      to,
      subject,
      html
    });

    console.log('Email sent:', info.messageId);
    return true;
  } catch (error) {
    console.error('Send email error:', error);
    throw new Error('Gửi email thất bại');
  }
};

/**
 * Email xác nhận đăng ký
 */
const sendWelcomeEmail = async (userEmail, userName) => {
  const html = `
    <h1>Chào mừng ${userName} đến với Siêu Thị ABC!</h1>
    <p>Cảm ơn bạn đã đăng ký tài khoản.</p>
    <p>Chúc bạn có trải nghiệm mua sắm tuyệt vời!</p>
  `;

  return sendEmail(userEmail, 'Chào mừng đến với Siêu Thị ABC', html);
};

/**
 * Email xác nhận đơn hàng
 */
const sendOrderConfirmationEmail = async (userEmail, order) => {
  const html = `
    <h1>Đơn hàng ${order.orderCode} đã được xác nhận</h1>
    <p>Cảm ơn bạn đã đặt hàng tại Siêu Thị ABC.</p>
    <p>Tổng tiền: ${order.total.toLocaleString()}đ</p>
    <p>Chúng tôi sẽ xử lý đơn hàng của bạn trong thời gian sớm nhất.</p>
  `;

  return sendEmail(userEmail, `Xác nhận đơn hàng ${order.orderCode}`, html);
};

/**
 * Email thông báo giao hàng
 */
const sendShippingEmail = async (userEmail, order) => {
  const html = `
    <h1>Đơn hàng ${order.orderCode} đang được giao</h1>
    <p>Đơn hàng của bạn đang trên đường giao đến.</p>
    <p>Vui lòng kiểm tra hàng và thanh toán cho nhân viên giao hàng.</p>
  `;

  return sendEmail(userEmail, `Đơn hàng ${order.orderCode} đang được giao`, html);
};

/**
 * Email reset password
 */
const sendResetPasswordEmail = async (userEmail, resetToken) => {
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
  
  const html = `
    <h1>Đặt lại mật khẩu</h1>
    <p>Bạn đã yêu cầu đặt lại mật khẩu.</p>
    <p>Click vào link sau để đặt lại mật khẩu:</p>
    <a href="${resetUrl}">${resetUrl}</a>
    <p>Link này sẽ hết hạn sau 1 giờ.</p>
  `;

  return sendEmail(userEmail, 'Đặt lại mật khẩu - Siêu Thị ABC', html);
};

module.exports = {
  sendEmail,
  sendWelcomeEmail,
  sendOrderConfirmationEmail,
  sendShippingEmail,
  sendResetPasswordEmail
};

import React, { useState } from 'react';
import { Modal, Radio, Button, Space, Progress, Alert } from 'antd';
import {
  DollarOutlined,
  CreditCardOutlined,
  WalletOutlined,
  LoadingOutlined
} from '@ant-design/icons';
import { PAYMENT_METHODS, PAYMENT_PROCESSING_DELAY } from '../../utils/constants';
import { formatCurrency } from '../../utils/helpers';
import usePayment from '../../hooks/usePayment';
import './PaymentModal.css';

const PaymentModal = ({ visible, onCancel, order, onSuccess }) => {
  const [selectedMethod, setSelectedMethod] = useState(PAYMENT_METHODS.MOMO);
  const {
    isProcessing,
    countdown,
    processMomoPayment,
    processZaloPayPayment,
    executePayPalPayment,
    createPayment
  } = usePayment();

  const handlePayment = async () => {
    try {
      // Create payment
      const paymentData = await createPayment(
        selectedMethod,
        order.id,
        order.total,
        `Đơn hàng #${order.id}`
      );

      if (selectedMethod === PAYMENT_METHODS.COD) {
        onSuccess(paymentData);
        return;
      }

      // Process payment with 20s delay
      let result;
      switch (selectedMethod) {
        case PAYMENT_METHODS.MOMO:
          result = await processMomoPayment(paymentData);
          break;
        case PAYMENT_METHODS.ZALOPAY:
          result = await processZaloPayPayment(paymentData);
          break;
        case PAYMENT_METHODS.PAYPAL:
          result = await executePayPalPayment(paymentData.paymentId, paymentData.payerId);
          break;
        default:
          throw new Error('Invalid payment method');
      }

      if (result.status === 'success') {
        onSuccess(result);
      } else {
        throw new Error('Payment failed');
      }
    } catch (error) {
      console.error('Payment error:', error);
    }
  };

  const paymentOptions = [
    {
      value: PAYMENT_METHODS.MOMO,
      label: 'Momo',
      icon: <WalletOutlined />,
      description: 'Thanh toán qua ví Momo'
    },
    {
      value: PAYMENT_METHODS.ZALOPAY,
      label: 'ZaloPay',
      icon: <WalletOutlined />,
      description: 'Thanh toán qua ví ZaloPay'
    },
    {
      value: PAYMENT_METHODS.PAYPAL,
      label: 'PayPal',
      icon: <CreditCardOutlined />,
      description: 'Thanh toán qua PayPal'
    },
    {
      value: PAYMENT_METHODS.COD,
      label: 'Thanh toán khi nhận hàng',
      icon: <DollarOutlined />,
      description: 'Thanh toán tiền mặt khi nhận hàng'
    }
  ];

  const progressPercent = countdown > 0 
    ? ((PAYMENT_PROCESSING_DELAY / 1000 - countdown) / (PAYMENT_PROCESSING_DELAY / 1000)) * 100 
    : 0;

  return (
    <Modal
      title="Chọn phương thức thanh toán"
      open={visible}
      onCancel={onCancel}
      footer={null}
      width={600}
      className="payment-modal"
    >
      <div className="payment-content">
        <div className="order-summary">
          <h3>Thông tin đơn hàng</h3>
          <div className="summary-row">
            <span>Mã đơn hàng:</span>
            <strong>#{order?.id}</strong>
          </div>
          <div className="summary-row">
            <span>Tổng tiền:</span>
            <strong className="total-amount">{formatCurrency(order?.total)}</strong>
          </div>
        </div>

        {isProcessing ? (
          <div className="processing-container">
            <Alert
              message="Đang xử lý thanh toán"
              description={`Vui lòng chờ ${countdown} giây để hoàn tất giao dịch...`}
              type="info"
              showIcon
              icon={<LoadingOutlined />}
            />
            <Progress 
              percent={progressPercent} 
              status="active"
              strokeColor={{
                '0%': '#108ee9',
                '100%': '#87d068',
              }}
            />
            <p className="processing-note">
              * Đây là mô phỏng thanh toán với thời gian xử lý 20 giây
            </p>
          </div>
        ) : (
          <>
            <Radio.Group
              value={selectedMethod}
              onChange={(e) => setSelectedMethod(e.target.value)}
              className="payment-methods"
            >
              <Space direction="vertical" style={{ width: '100%' }}>
                {paymentOptions.map(option => (
                  <Radio key={option.value} value={option.value} className="payment-option">
                    <div className="payment-option-content">
                      <span className="payment-icon">{option.icon}</span>
                      <div className="payment-info">
                        <div className="payment-label">{option.label}</div>
                        <div className="payment-description">{option.description}</div>
                      </div>
                    </div>
                  </Radio>
                ))}
              </Space>
            </Radio.Group>

            <div className="payment-actions">
              <Button onClick={onCancel}>
                Hủy
              </Button>
              <Button
                type="primary"
                size="large"
                onClick={handlePayment}
                disabled={!selectedMethod}
              >
                Thanh toán
              </Button>
            </div>
          </>
        )}
      </div>
    </Modal>
  );
};

export default PaymentModal;

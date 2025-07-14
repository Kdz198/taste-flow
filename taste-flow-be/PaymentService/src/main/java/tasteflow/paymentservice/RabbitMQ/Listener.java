package tasteflow.paymentservice.RabbitMQ;


import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import tasteflow.paymentservice.model.Payment;
import tasteflow.paymentservice.service.DiscountService;
import tasteflow.paymentservice.service.PaymentService;

@Component
public class Listener {

    @Autowired
    private PaymentService paymentService;

    @Autowired
    private DiscountService discountService;

   @RabbitListener(queues = "payment.queue")
    public void confirmOrder(OrderEvent order) throws Exception {
        Payment payment = new Payment();
        payment.setOrderId(order.getOrderId());
        payment.setStatus(Payment.PaymentStatus.PENDING);
        payment.setAmount((int) order.getTotalAmount());
        payment.setDiscountCode(order.getDiscountCode());
        if (payment.getDiscountCode() != null)
        {
            payment.setDiscountValue(discountService.findByDiscountCode(payment.getDiscountCode()).getDiscount());
        }
        paymentService.processPayment(payment);
       System.out.println("Order Confirmed " + order);
    }

    @RabbitListener(queues = "payment.cancel.queue")
    public void unlockOrder(int orderId) throws Exception {
        System.out.println("UnLock Order: " + orderId);
        paymentService.cancelPayment(orderId);
    }
}

package tasteflow.paymentservice.RabbitMQ;


import jakarta.persistence.criteria.Order;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class Producer {

    @Autowired
    private RabbitTemplate rabbitTemplate;

    public record PaymentConfirmedEvent(int orderId, int paymentId) {}

    public void confirmPayment(int orderId, int paymentId) throws Exception {
        System.out.println("Confirm payment " + orderId);
        PaymentConfirmedEvent event = new PaymentConfirmedEvent(orderId, paymentId);
        rabbitTemplate.convertAndSend("payment.exchange", "payment.confirmed", event);
    }

    public void readyPayment(int orderId)
    {
        System.out.println("Ready payment " + orderId);
        rabbitTemplate.convertAndSend("payment.exchange", "payment.ready", orderId);

    }


}

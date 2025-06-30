package tasteflow.paymentservice.RabbitMQ;


import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class Listener {



   // @RabbitListener(queues = "order.exchange")
    public void confirmOrder(OrderEvent order) {
    }
}

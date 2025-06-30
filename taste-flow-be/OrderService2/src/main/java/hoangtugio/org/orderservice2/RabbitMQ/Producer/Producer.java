package hoangtugio.org.orderservice2.RabbitMQ.Producer;

import hoangtugio.org.orderservice2.Model.OrderItem;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class Producer {

    @Autowired
    private RabbitTemplate rabbitTemplate;


    public void sendOrder( List<OrderItem> listItem) {
        System.out.println("Sending Order Items");
        System.out.println(listItem);
        rabbitTemplate.convertAndSend("order.exchange", "order.created", listItem);
    }
}

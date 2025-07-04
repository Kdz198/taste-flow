package hoangtugio.org.orderservice2.RabbitMQ.Listener;


import hoangtugio.org.orderservice2.Service.OrderService;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class Listener {

    @Autowired
    private OrderService orderService;

  //  @RabbitListener(queues = "ExchangecuaInventory")
    public void confirmOrder(int orderId) {
        orderService.confirmOrder(orderId);
    }
}

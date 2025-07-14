package hoangtugio.org.orderservice2.RabbitMQ.Listener;


import hoangtugio.org.orderservice2.Service.OrderService;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class Listener {

    @Autowired
    private OrderService orderService;

    public record InventoryStatus(int orderId, String status) {}

      @RabbitListener(queues = "inventory.queue")
    public void confirmOrder(InventoryStatus inventoryStatus) {
        orderService.confirmOrder(inventoryStatus.orderId, inventoryStatus.status);
    }

    public record PaymentConfirmedEvent(int orderId, int paymentId) {}

    @RabbitListener(queues = "order.queue")
    public void paymentSuccess(PaymentConfirmedEvent event) {
        System.out.println("Payment Success Id: " + event.paymentId+" "+event.orderId);
        orderService.completedOrder(event.orderId,event.paymentId);
    }
}

package hoangtugio.org.orderservice2.RabbitMQ.Listener;


import hoangtugio.org.orderservice2.Service.OrderService;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.Map;

@Component
public class Listener {

    @Autowired
    private OrderService orderService;

    public record status(int orderId, String status) {}


    @RabbitListener(queues = "inventoryOfOrder.queue")
      public void confirmOrder(status inventoryStatus) {
        orderService.confirmOrder(inventoryStatus.orderId, inventoryStatus.status);
      }

    public record PaymentConfirmedEvent(int orderId, int paymentId) {}


    @RabbitListener(queues = "order.queue")
    public void paymentSuccess(PaymentConfirmedEvent event) {
        System.out.println("Payment Success Id: " + event.orderId);
        orderService.completedOrder(event.orderId, event.paymentId);
    }

    @RabbitListener(queues = "inventoryUnlock.queue")
    public void cancelOrder (int orderId) {
        System.out.println("Cancel Order Id: " + orderId);
        orderService.cancleOrder(orderId);
    }

    @RabbitListener(queues = "readyPayment.queue")
    public void readyPayment (int orderId) {
        System.out.println("Ready Payment For Order Id: " + orderId);
        orderService.readyForPayment(orderId);
    }
}

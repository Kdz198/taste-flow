package tasteflow.InventoryService.RabbitMQ;

import org.apache.hc.core5.http.Message;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import tasteflow.InventoryService.dto.OrderItemDTO;
import tasteflow.InventoryService.service.IngredientDetailService;

import java.time.LocalDateTime;
import java.util.List;

@Component
public class Listener {

    @Autowired
    private IngredientDetailService ingredientDetailService;
    @Autowired
    private Producer producer;

    public record PaymentConfirmedEvent(int orderId, int paymentId) {}


    @RabbitListener(queues = "payment.queue")
    public void confirmPayment(PaymentConfirmedEvent paymentConfirmedEvent) {
        System.out.println(paymentConfirmedEvent);
        ingredientDetailService.doneOrder(paymentConfirmedEvent.orderId);
    }


    @RabbitListener(queues = "inventory.queue")
    public void receive(List<OrderItemDTO> orderItem) {
        int orderId = orderItem.getFirst().getOrder().getOrderId();
        producer.checkInventory(orderId, ingredientDetailService.checkAvaiable(orderItem));
    }
}

package hoangtugio.org.orderservice2.Service;


import hoangtugio.org.orderservice2.Model.Order;
import hoangtugio.org.orderservice2.Model.OrderItem;
import hoangtugio.org.orderservice2.Model.RequestOrderDTO;
import hoangtugio.org.orderservice2.RabbitMQ.Producer.Producer;
import hoangtugio.org.orderservice2.Repository.OrderItemRepository;
import hoangtugio.org.orderservice2.Repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class OrderService {
    @Autowired
    OrderRepository orderRepository;
    @Autowired
    OrderItemRepository orderItemRepository;
    @Autowired
    Producer producer;

    public Order makeOrder(RequestOrderDTO orderDTO) {

        Order order = orderDTO.getOrder();
        order.setStatus(Order.OrderStatus.PENDING);
        List<OrderItem> listItem = orderDTO.getOrderItemList();

        Order saveOrder = orderRepository.save(order);
        for (OrderItem orderItem : listItem) {
            orderItem.setOrder(saveOrder);
            orderItemRepository.save(orderItem);
        }
        //khúc này bắn sự kiện qua inventory để check kho
        producer.sendOrder(listItem);
        return saveOrder;
    }

    // sau khi nhận event lock kho thì đổi state & bắn sự kiện cho payment tạo url
    public void confirmOrder (int orderId) {
        Order order  = orderRepository.findById(orderId).orElseThrow();
        order.setStatus(Order.OrderStatus.CONFIRMED);
        orderRepository.save(order);
        producer.confirmOrder(order);
    }

    public void completedOrder (int orderId, int paymentId) {
        Order order  = orderRepository.findById(orderId).orElse(null);
        System.out.println(order);
        order.setStatus(Order.OrderStatus.COMPLETED);
        order.setPaymentId(paymentId);
        orderRepository.save(order);
    }

    public Order cancleOrder(int orderId) {
        Order order = orderRepository.findById(orderId).orElseThrow();
        order.setStatus(Order.OrderStatus.CANCELLED);
        // Bắn event roll back compensating transaction
        return orderRepository.save(order);
    }
}

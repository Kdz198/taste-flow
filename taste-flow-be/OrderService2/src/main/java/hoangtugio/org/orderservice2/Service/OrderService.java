package hoangtugio.org.orderservice2.Service;


import hoangtugio.org.orderservice2.Model.Order;
import hoangtugio.org.orderservice2.Model.OrderItem;
import hoangtugio.org.orderservice2.Model.RequestOrderDTO;
import hoangtugio.org.orderservice2.RabbitMQ.Producer.Producer;
import hoangtugio.org.orderservice2.Repository.OrderItemRepository;
import hoangtugio.org.orderservice2.Repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class OrderService {
    @Autowired
    OrderRepository orderRepository;
    @Autowired
    OrderItemRepository orderItemRepository;
    @Autowired
    Producer producer;
    @Autowired
    CartService cartService;

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
    public void confirmOrder (int orderId, String status) {
        Order order  = orderRepository.findById(orderId).orElseThrow();
        System.out.println(status);
        if (status.equals("Out_Of_Stock")) {
            order.setStatus(Order.OrderStatus.CANCELLED);
        }
        else if (status.equals("Available")) {
            order.setStatus(Order.OrderStatus.CONFIRMED);
            producer.confirmOrder(order);
        }

        orderRepository.save(order);

    }

    public String checkStatus (int orderId) {
        Order order = orderRepository.findById(orderId).orElse(null);
        if (order != null )
            return order.getStatus().toString();

        else
            return "NOT FOUND";
    }



    public void completedOrder (int orderId, int paymentId) {
        Order order  = orderRepository.findById(orderId).orElse(null);
        System.out.println(order);
        order.setStatus(Order.OrderStatus.COMPLETED);
        order.setPaymentId(paymentId);
        orderRepository.save(order);

        // Xóa ra khỏi cart
        Map<Integer,Integer> map = findOrderItem(orderId);
        cartService.removeFromCart(order.getUserId(), map);
    }

    public Order cancleOrder(int orderId) {
        Order order = orderRepository.findById(orderId).orElseThrow();
        order.setStatus(Order.OrderStatus.CANCELLED);
        return orderRepository.save(order);
    }

    public Order readyForPayment(int orderId) {
        Order order = orderRepository.findById(orderId).orElseThrow();
        order.setStatus(Order.OrderStatus.READY_FOR_PAYMENT);
        return orderRepository.save(order);
    }

    public Map<Integer,Integer>  findOrderItem( int orderId)
    {
        List<OrderItem> list = orderItemRepository.findByOrderOrderId(orderId);
        Map<Integer,Integer> map = new HashMap<>();
        for (OrderItem orderItem : list) {
            map.put(orderItem.getDishId(), orderItem.getQuantity());
        }
        return map;

    }
}

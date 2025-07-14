package hoangtugio.org.orderservice2.Controller;


import hoangtugio.org.orderservice2.Model.Order;
import hoangtugio.org.orderservice2.Model.RequestOrderDTO;
import hoangtugio.org.orderservice2.RabbitMQ.Producer.Producer;
import hoangtugio.org.orderservice2.Service.OrderService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/order")
public class OrderController {

    @Autowired
    OrderService orderService;

    @Autowired
    Producer producer;

    @PostMapping
    public Order makeOrder(@RequestBody @Valid RequestOrderDTO orderDTO) {
       return orderService.makeOrder(orderDTO);
    }

    @PutMapping("{id}")
    public Order cancelOrder(@PathVariable int id) {
        return orderService.cancleOrder(id);
    }

    @GetMapping("{orderId}")
    public String checkStatus(@PathVariable int orderId)
    {
        return orderService.checkStatus(orderId);
    }
}

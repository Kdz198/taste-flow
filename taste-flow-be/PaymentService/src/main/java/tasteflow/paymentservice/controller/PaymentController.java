package tasteflow.paymentservice.controller;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import tasteflow.paymentservice.model.Payment;
import tasteflow.paymentservice.service.*;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("api/payment")
public class PaymentController {

    @Autowired
    PaymentService paymentService;
    @GetMapping
    public List<Payment> getAllPayments() {
        return paymentService.getAllPayments();
    }

    @GetMapping("{id}")
    public Payment getPaymentById(@PathVariable int id) {

        return paymentService.getPaymentById(id);
    }

    @GetMapping("/user/{userId}")
    public List<Payment> getPaymentByUserId(@PathVariable int userId) {
        return paymentService.getPaymentHistoryByUser(userId);
    }

    @GetMapping("/{orderId}/status")
    public String getPaymentByOrderId(@PathVariable int orderId) {
        Optional<Payment> payment = paymentService.getPaymentByOrderId(orderId);
        if (payment.isPresent()) {
            return "READY";
        }


         return "NOT FOUND";
    }


    @PostMapping()
    public String confirmPayment ( @RequestParam int orderId,@RequestParam String paymentMethod,@RequestParam String discountCode) throws Exception {
        return paymentService.confirmPayment(orderId,paymentMethod,discountCode);
    }





}

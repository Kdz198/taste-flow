package tasteflow.paymentservice.controller;


import com.netflix.discovery.converters.Auto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import tasteflow.paymentservice.model.Payment;
import tasteflow.paymentservice.model.UrlPayment;
import tasteflow.paymentservice.service.*;
import java.util.List;

@RestController
@RequestMapping("api/payment")
public class PaymentController {

    @Autowired
    PaymentService paymentService;
    @Autowired
    UrlPaymentService urlPaymentService;

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

    @GetMapping("/url")
    public UrlPayment getUrlPaymentByOrderId(@RequestParam int orderId) {
        return urlPaymentService.getUrlPayment(orderId);
    }



    @PostMapping()
    public String createPayment(@RequestBody Payment payment) throws Exception {
        String url ="";
        int total = payment.getAmount();

        paymentService.processPayment(payment);
        return url;
    }

}

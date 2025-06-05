package tasteflow.paymentservice.controller;


import com.netflix.discovery.converters.Auto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import tasteflow.paymentservice.model.Payment;
import tasteflow.paymentservice.service.DiscountService;
import tasteflow.paymentservice.service.PaymentService;
import tasteflow.paymentservice.service.VNPAYService;

import java.io.UnsupportedEncodingException;
import java.util.List;

@RestController
@RequestMapping("api/payment")
public class PaymentController {

    @Autowired
    PaymentService paymentService;
    @Autowired
    VNPAYService vnpayService;
    @Autowired
    DiscountService discountService;

    @GetMapping
    public List<Payment> getAllPayments() {
        return paymentService.getAllPayments();
    }

    @PostMapping()
    public String createPayment(@RequestBody Payment payment) throws UnsupportedEncodingException {

        // bỏ vào DB payment trước sau đó mới gọi VNPAY/Momo để tạo url thanh toán
        if (payment.getDiscountId()==0)
        {
            System.out.println("discount deo co");
        }
        else
        {
            //Neu co discountId thi set discount cho cai payment
            payment.setDiscountValue(discountService.getDiscountById(payment.getDiscountId()).getDiscount());
        }
        paymentService.processPayment(payment);


        // Cần xét if ENUM để gọi VNPAY/Momo các kiểu nha
        String url = vnpayService.createVnpayUrl(String.valueOf(payment.getId()),payment.getAmount(),"");

        return url;
    }

}

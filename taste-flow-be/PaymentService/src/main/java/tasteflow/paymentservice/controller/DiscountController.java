package tasteflow.paymentservice.controller;

import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import tasteflow.paymentservice.model.Discount;
import tasteflow.paymentservice.service.DiscountService;

import java.util.List;

@RestController
@RequestMapping("/api/discounts")
public class DiscountController {
    @Autowired
    private DiscountService discountService;

    @GetMapping
    public List<Discount> getDiscounts() {
        return discountService.getAllDiscount();
    }

    @GetMapping("/{id}")
    public Discount getDiscount(@PathVariable int id) {
        return discountService.getDiscountById(id);
    }

    @GetMapping("find")
    public Discount getDiscountByCode(@RequestParam String discountCode) {
        return discountService.findByDiscountCode(discountCode);
    }

    @PostMapping
    public Discount createDiscount(@Valid @RequestBody Discount discount) {
        return discountService.createDiscount(discount);
    }

    @PutMapping
    public Discount updateDiscount(@Valid @RequestBody Discount discount) {
        return discountService.updateDiscount(discount);
    }

    @GetMapping("set-active/{id}")
    public void setActive(@PathVariable int id) {
        discountService.setActive(id);
    }
}

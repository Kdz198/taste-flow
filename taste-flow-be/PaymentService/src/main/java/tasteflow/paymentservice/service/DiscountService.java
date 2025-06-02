package tasteflow.paymentservice.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import tasteflow.paymentservice.exception.CustomException;
import tasteflow.paymentservice.model.Discount;
import tasteflow.paymentservice.repository.DiscountRepository;

import java.util.List;

@Service
public class DiscountService {
    @Autowired
    private DiscountRepository discountRepository;

    public List<Discount> getAllDiscount() {
        return discountRepository.findAll();
    }
     public Discount getDiscountById(int id) {
        if(!discountRepository.existsById(id)) {
            throw new CustomException("Discount not found", HttpStatus.NOT_FOUND);
        }
        return discountRepository.findById(id);
     }

     public Discount createDiscount(Discount discount) {
        if (discountRepository.existsByCoupon(discount.getCoupon())) {
            throw new CustomException("Counpon is exist !", HttpStatus.BAD_REQUEST);
        }
        return discountRepository.save(discount);
     }

     public Discount updateDiscount(Discount discount) {
        if (discountRepository.existsById(discount.getId())) {
            return discountRepository.save(discount);
        }
        else{
            throw new CustomException("Discount not found !", HttpStatus.BAD_REQUEST);
        }
     }

     public void setActive(int id){
        Discount discount = discountRepository.findById(id);

        if (discount != null) {
            if(discount.isActive()) {
                discount.setActive(false);
            }
            else {
                discount.setActive(true);
            }
        }
        else {
            throw new CustomException("Discount not found !", HttpStatus.BAD_REQUEST);
        }
     }
}

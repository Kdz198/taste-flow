package tasteflow.InventoryService.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import tasteflow.InventoryService.exception.CustomException;
import tasteflow.InventoryService.model.InventoryOrder;
import tasteflow.InventoryService.repository.InventoryOrderRepository;

import java.util.List;

@Service
public class InventoryOrderService {
    @Autowired
    private InventoryOrderRepository inventoryOrderRepository;

    public InventoryOrder save(InventoryOrder inventoryOrder) {
        return inventoryOrderRepository.save(inventoryOrder);
    }

    public InventoryOrder findById(int id) {
      if(inventoryOrderRepository.existsById(id)) {
          return inventoryOrderRepository.findById(id).get();
      }
      else{
          throw new CustomException("Order not found !", HttpStatus.NOT_FOUND);
      }
    }

    public List<InventoryOrder> findAll() {
        return inventoryOrderRepository.findAll();
    }


    public InventoryOrder findByOrderId(int orderId) {
        if(inventoryOrderRepository.existsByOrderId(orderId)) {
            return inventoryOrderRepository.findByOrderId(orderId);
        }
        else{
            throw new CustomException("InventoryOrder with ID:"+orderId +"not found !", HttpStatus.NOT_FOUND);
        }
    }

    public void delete(int id) {
        if(inventoryOrderRepository.existsById(id)) {
            inventoryOrderRepository.deleteById(id);
        }
        else{
            throw new CustomException("Order not found !", HttpStatus.NOT_FOUND);
        }
    }


}

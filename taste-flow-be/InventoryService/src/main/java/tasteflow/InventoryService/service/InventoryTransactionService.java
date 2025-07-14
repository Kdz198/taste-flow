package tasteflow.InventoryService.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import tasteflow.InventoryService.exception.CustomException;
import tasteflow.InventoryService.model.InventoryTransaction;
import tasteflow.InventoryService.repository.InventoryTransactionRepository;

import java.sql.Date;
import java.time.LocalDate;
import java.util.List;

@Service
public class InventoryTransactionService {
    @Autowired
    private InventoryTransactionRepository repo;

    public List<InventoryTransaction> findAll() {
        return repo.findAll();
    }

    public InventoryTransaction findById(int id) {
        if (repo.existsById(id)) {
            return repo.findById(id).get();
        }
       else {
           throw new CustomException("Transaction does not exist !", HttpStatus.NOT_FOUND);
        }
    }

    public InventoryTransaction save(InventoryTransaction inventoryTransaction) {
        inventoryTransaction.setDate(Date.valueOf(LocalDate.now()));
        return repo.save(inventoryTransaction);
    }

    public void delete(int id) {
        if (repo.existsById(id)) {
            repo.deleteById(id);
        }
        else{
            throw new CustomException("Transaction does not exist !", HttpStatus.NOT_FOUND);
        }
    }

    public InventoryTransaction update(InventoryTransaction inventoryTransaction) {
        if (repo.existsById(inventoryTransaction.getId())) {
            return repo.save(inventoryTransaction);
        }
        else {
            throw new CustomException("Transaction does not exist !", HttpStatus.NOT_FOUND);
        }
    }


}

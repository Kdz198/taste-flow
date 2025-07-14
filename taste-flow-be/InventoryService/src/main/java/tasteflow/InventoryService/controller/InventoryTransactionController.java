package tasteflow.InventoryService.controller;

import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import tasteflow.InventoryService.model.InventoryTransaction;
import tasteflow.InventoryService.service.InventoryTransactionService;

import java.util.List;

@RestController
@RequestMapping("/api/inventory-transactions")
public class InventoryTransactionController {
    @Autowired
    InventoryTransactionService service;

    @GetMapping
    public List<InventoryTransaction> getAllInventoryTransactions() {
        return service.findAll();
    }

    @PostMapping
    public InventoryTransaction addInventoryTransaction(@Valid @RequestBody InventoryTransaction inventoryTransaction) {
        return service.save(inventoryTransaction);
    }

    @PutMapping
    public InventoryTransaction updateInventoryTransaction(@Valid @RequestBody InventoryTransaction inventoryTransaction) {
        return service.update(inventoryTransaction);
    }

    @DeleteMapping("/{id}")
    public void deleteInventoryTransaction(@PathVariable int id) {
        service.delete(id);
    }

    @GetMapping("/{id}")
    public InventoryTransaction getInventoryTransactionById(@PathVariable int id) {
        return service.findById(id);
    }
}

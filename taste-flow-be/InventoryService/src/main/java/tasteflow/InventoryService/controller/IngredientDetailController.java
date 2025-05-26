package tasteflow.InventoryService.controller;

import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import tasteflow.InventoryService.model.IngredientDetail;
import tasteflow.InventoryService.service.IngredientDetailService;

import java.util.List;

@RestController
@RequestMapping("/api/ingredient-details")
public class IngredientDetailController {
    @Autowired
    private IngredientDetailService service;

    @GetMapping
    public List<IngredientDetail> getAllIngredientDetails() {
        return service.findAll();
    }

    @PostMapping
    public IngredientDetail addIngredientDetail(@Valid @RequestBody IngredientDetail ingredientDetail) {
        return service.save(ingredientDetail);
    }

    @PutMapping
    public IngredientDetail updateIngredientDetail(@Valid @RequestBody IngredientDetail ingredientDetail) {
        return service.update(ingredientDetail);
    }

    @DeleteMapping("/{id}")
    public void deleteIngredientDetail(@PathVariable int id) {
        service.delete(id);
    }

    @GetMapping("/{id}")
    public IngredientDetail getIngredientDetail(@PathVariable int id) {
        return service.findById(id);
    }

    @GetMapping("find-by-ingredient/{id}")
    public List<IngredientDetail> getIngredientDetailByIngredientId(@PathVariable int id) {
        return service.findByIngredient(id);
    }

}

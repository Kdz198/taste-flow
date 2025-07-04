package tasteflow.InventoryService.controller;

import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import tasteflow.InventoryService.model.Ingredient;
import tasteflow.InventoryService.model.IngredientDetail;
import tasteflow.InventoryService.service.IngredientDetailService;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/ingredient-details")
@CrossOrigin("*")
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

    @GetMapping("/low-stock")
    public List<Ingredient> getLowStockIngredient() {
        return service.getLowStockIngredient();
    }

    @GetMapping("/set-active/{id}")
    public void setActiveIngredientDetails(@PathVariable int id) {
        service.setActive(id);
    }

}

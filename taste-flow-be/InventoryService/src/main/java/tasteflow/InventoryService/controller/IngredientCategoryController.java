package tasteflow.InventoryService.controller;

import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import tasteflow.InventoryService.model.IngredientCategory;
import tasteflow.InventoryService.service.IngredientCategoryService;

import java.util.List;

@RestController
@RequestMapping("/api/ingredient-categories")
public class IngredientCategoryController {
    @Autowired
    private IngredientCategoryService service;

    @GetMapping
    public List<IngredientCategory> getAll() {
        return service.findAll();
    }

    @GetMapping("/{id}")
    public IngredientCategory findById(@PathVariable int id) {
        return service.findById(id);
    }

    @PostMapping()
    public IngredientCategory create(@Valid @RequestBody IngredientCategory ingredientCategory) {
        return service.save(ingredientCategory);
    }

    @PutMapping()
    public IngredientCategory update(@Valid @RequestBody IngredientCategory ingredientCategory) {
        return service.update(ingredientCategory);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable int id) {
        service.delete(id);
    }
}

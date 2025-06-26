package tasteflow.InventoryService.controller;

import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import tasteflow.InventoryService.model.Ingredient;
import tasteflow.InventoryService.model.IngredientCategory;
import tasteflow.InventoryService.service.IngredientCategoryService;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/ingredient-categories")
@CrossOrigin("*")
public class IngredientCategoryController {
    @Autowired
    private IngredientCategoryService service;

    @GetMapping
    public List<IngredientCategory> getAllIngredientCategory() {
        return service.findAll();
    }

    @GetMapping("/{id}")
    public IngredientCategory findById(@PathVariable int id) {
        return service.findById(id);
    }

    @PostMapping()
    public IngredientCategory createIngredientCategory(@Valid @RequestBody IngredientCategory ingredientCategory) {
        return service.save(ingredientCategory);
    }

    @PutMapping()
    public IngredientCategory updateIngredientCategory(@Valid @RequestBody IngredientCategory ingredientCategory) {
        return service.update(ingredientCategory);
    }

    @DeleteMapping("/{id}")
    public void deleteIngredientCategory(@PathVariable int id) {
        service.delete(id);
    }


}

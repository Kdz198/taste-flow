package tasteflow.InventoryService.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.Nationalized;
import org.hibernate.validator.constraints.Length;

@Entity
@Table(name="Ingredients")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Ingredient {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @NotBlank(message = "Name can not blank !")
    @Length(min = 10, message = "Name must greater than 10 chars")
    @Nationalized
    private String name;

    @JoinColumn(name = "cateId")
    @ManyToOne
    private IngredientCategory category;

    @Enumerated(EnumType.STRING)
    private Unit unit;

    @Column(name="active")
    private boolean active;
}

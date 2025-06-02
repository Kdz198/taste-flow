package tasteflow.paymentservice.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import lombok.*;

import java.sql.Date;
@Entity
@Table(name = "Discounts")
@AllArgsConstructor
@NoArgsConstructor
@Data
public class Discount {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id ;
    private String name;
    private Date startTime;
    private Date endTime;
    @Column(unique = true)
    private String coupon;
    @Min(value = 0, message = "Discount must be greater than 0 !")
    private int discount;
    private String description;
    private boolean active;
}

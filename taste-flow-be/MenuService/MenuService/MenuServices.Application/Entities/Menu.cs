using System.ComponentModel.DataAnnotations;

namespace MenuServices.Application.Entities
{
    public class Menu
    {
        [Key]
        public int Id
        {
            get; set;
        }

        [Required]
        public string Name { get; set; } = string.Empty;

        [Required]
        public float Price
        {
            get; set;
        }

        public bool Status { get; set; } = true;

        public string ImgUrl { get; set; } = string.Empty;

        public List<Ingredient> Ingredients
        {
            get; set;
        } = new List<Ingredient>();

        public List<Category> Categories
        {
            get; set;
        } = new List<Category>();
    }
}

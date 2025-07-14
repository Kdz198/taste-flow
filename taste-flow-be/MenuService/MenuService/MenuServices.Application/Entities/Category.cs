using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace MenuServices.Application.Entities
{
    public class Category
    {
        [Key]
        public int Id
        {
            get; set;
        }
        [Required]
        public string Name { get; set; } = string.Empty;
        public bool Status { get; set; } = true;

        [JsonIgnore]
        public List<Menu> Menus
        {
            get; set;
        } = new List<Menu>();
    }
}

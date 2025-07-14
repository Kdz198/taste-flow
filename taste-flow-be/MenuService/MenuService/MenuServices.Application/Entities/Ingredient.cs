using System.Text.Json.Serialization;

namespace MenuServices.Application.Entities
{
    public class Ingredient
    {
        public int Id
        {
            get; set;
        }
        public int Quantity
        {
            get; set;
        }


        [JsonIgnore]
        public int MenuId
        {
            get; set;
        }

        [System.Text.Json.Serialization.JsonIgnore]
        public Menu Menu { get; set; } = null!;
    }
}

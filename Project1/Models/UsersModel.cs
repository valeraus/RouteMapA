using System.Text.Json.Serialization;

namespace Project1.Models
{
    public class UsersModel
    {
        public Guid Id { get; set; }
        //public string? FirstName { get; set; }
        //public string? LastName { get; set; }
        public string? Email { get; set; }
        //public string? Phone { get; set; }

        [JsonIgnore]
        public string? Password { get; set; }
    }
}

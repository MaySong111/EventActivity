using System.ComponentModel.DataAnnotations;

namespace API.core.Dtos
{
    public class CreateActivityDto
    {
        [Required]
        public string Title { get; set; } = "";
        [Required]
        public DateTime Date { get; set; } = DateTime.UtcNow;
        [Required]
        public string Description { get; set; }
        [Required]
        public string Category { get; set; } = "";
        public string City { get; set; } = "";
        [Required]
        public string Venue { get; set; } = "";
        public string Latitude { get; set; } = "";
        public string Longitude { get; set; } = "";
    }
}
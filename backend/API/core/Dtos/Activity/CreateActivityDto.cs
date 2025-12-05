namespace API.core.Dtos
{
    public class CreateActivityDto
    {
        public required string Title { get; set; }
        public DateTime Date { get; set; } = DateTime.UtcNow;
        public required string Description { get; set; }
        public required string Category { get; set; }
        public bool IsCancelled { get; set; }
        // location props
        public required string City { get; set; }
        public required string Venue { get; set; }
        public string Latitude { get; set; }
        public string Longitude { get; set; }
    }
}
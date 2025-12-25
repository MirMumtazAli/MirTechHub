namespace MTHAPI.DTO.Note
{
    public class NoteReadDTO
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string? Description { get; set; }
        public string? Content { get; set; }
        public decimal Price { get; set; }
        public bool IsFree { get; set; }
        public string? FileUrl { get; set; }
        public int Pages { get; set; }
        public DateTime CreatedAt { get; set; }

        // Optional: Include reviews if you want nested info
        //public ICollection<ReviewDTO>? Reviews { get; set; }
    }

}

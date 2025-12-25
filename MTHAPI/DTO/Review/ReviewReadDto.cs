namespace MTHAPI.DTO.Review
{
    public class ReviewReadDto
    {
        public int Id { get; set; }
        public int Rating { get; set; }
        public string Comment { get; set; }
        public int? NoteId { get; set; }
        public int? SoftwareId { get; set; }
        public DateTime CreatedAt { get; set; }
    }

}

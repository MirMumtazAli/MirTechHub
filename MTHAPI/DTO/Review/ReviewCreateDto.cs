namespace MTHAPI.DTO.Review
{
    public class ReviewCreateDto
    {
        public int Rating { get; set; }
        public string Comment { get; set; }
        public int? NoteId { get; set; }
        public int? SoftwareId { get; set; }
    }

}

namespace MTHAPI.DTO.Note
{
    public class NoteCreateDto
    {
        public string Title { get; set; }
        public string Description { get; set; }
        public decimal Price { get; set; }
        public bool IsFree { get; set; }
        public int Pages { get; set; }
        public string FileUrl { get; set; }
    }
}

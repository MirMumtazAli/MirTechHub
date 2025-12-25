namespace MTHAPI.DTO.Blog
{
    public class BlogReadDto
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Slug { get; set; }
        public string Content { get; set; }
        public System.DateTime CreatedAt { get; set; }
    }
}

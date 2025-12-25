public class Review
{
    public int Id { get; set; }

    public int Rating { get; set; }
    public string Comment { get; set; }

    public string UserId { get; set; }
    public MTHUser User { get; set; }

    public int? NoteId { get; set; }
    public Note Note { get; set; }

    public int? SoftwareId { get; set; }
    public Software Software { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public bool IsDeleted { get; set; } = false;
}

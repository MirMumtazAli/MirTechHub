using System;
using System.ComponentModel.DataAnnotations;

// DTOs for Review-related operations

public class ReviewDto
{
    public int Id { get; set; }
    public required string RelatedId { get; set; }
    public required string Type { get; set; }
    public required string AuthorName { get; set; }
    public required string AuthorId { get; set; }
    public int? Rating { get; set; }
    public required string Comment { get; set; }
    public DateTime Date { get; set; }
    public bool IsVisible { get; set; }
}

public class ReviewCreateDto
{
    [Required]
    public required string RelatedId { get; set; }
    [Required]
    public required string Type { get; set; }
    public int? Rating { get; set; }
    [Required]
    [MinLength(5)]
    public required string Comment { get; set; }
}

public class ReviewUpdateDto
{
    public int? Rating { get; set; }
    [Required]
    [MinLength(5)]
    public required string Comment { get; set; }
}

public class ReviewVisibilityUpdateDto
{
    [Required]
    public bool IsVisible { get; set; }
}

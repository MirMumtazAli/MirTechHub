using System;
using System.Collections.Generic;
using System.Text;

namespace DAL.DAO
{
    public class Blog
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Slug { get; set; }
        public string Content { get; set; }
        public string Summary { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public bool IsPublished { get; set; }
        public bool IsDeleted { get; set; }
    }

}

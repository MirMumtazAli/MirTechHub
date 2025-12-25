using System;
using System.Collections.Generic;
using System.Text;

namespace DAL.DAO
{
    public class Cart
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public int? NoteId { get; set; }
        public int? SoftwareId { get; set; }
        public decimal Price { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public bool IsDeleted { get; set; } = false;
    }

}

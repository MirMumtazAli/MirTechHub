using System;
using System.Collections.Generic;
using System.Text;

namespace DAL.DAO
{
    public enum UserRole { User, Admin }
    public enum ProductType { Note, Software }
    public enum OrderStatus { Pending, Processing, Completed, Cancelled }
    public enum ReviewType { Product, Blog }
}

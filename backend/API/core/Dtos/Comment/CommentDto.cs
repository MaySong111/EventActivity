using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.core.Dtos.Comment
{
    public class CommentDto
    {
        public required string Id { get; set; }
        public required string Body { get; set; }
        public DateTime CreatedAt { get; set; }
        public required string ActivityId { get; set; }
        public required string UserId { get; set; }
    }
}
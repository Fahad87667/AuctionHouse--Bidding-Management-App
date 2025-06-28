using System.ComponentModel.DataAnnotations;

public class AuctionItem
{
    public int Id { get; set; }
    
    [Required]
    [StringLength(200)]
    public string Title { get; set; } = string.Empty;
    
    [Required]
    public string Description { get; set; } = string.Empty;
    
    public string? ImageUrl { get; set; }
    
    [Required]
    [Range(0.01, double.MaxValue, ErrorMessage = "Starting price must be greater than 0")]
    public decimal StartingPrice { get; set; }
    
    [Required]
    public DateTime EndTime { get; set; }
    
    public ICollection<Bid> Bids { get; set; } = new List<Bid>();
    
    public string? WinnerUserId { get; set; }
    public bool IsCompleted { get; set; } = false;
    public bool IsPaid { get; set; } = false;
    
    public string OwnerId { get; set; } // User who created the auction
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
} 
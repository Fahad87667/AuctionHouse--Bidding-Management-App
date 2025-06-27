using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Identity;

public class Bid
{
    public int Id { get; set; }
    
    [Required]
    [Range(0.01, double.MaxValue, ErrorMessage = "Bid amount must be greater than 0")]
    public decimal Amount { get; set; }
    
    public DateTime Timestamp { get; set; }
    
    [Required]
    public string UserId { get; set; } = string.Empty;
    
    public IdentityUser? User { get; set; }
    
    public int AuctionItemId { get; set; }
    
    public AuctionItem? AuctionItem { get; set; }
} 
using System;
using System.ComponentModel.DataAnnotations;

public class UpdateAuctionItemDTO
{
    [Required]
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
} 
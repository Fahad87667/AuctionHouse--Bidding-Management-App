using System;
using System.ComponentModel.DataAnnotations.Schema;

public class Payment
{
    public int Id { get; set; }
    [Column("AuctionItemId")]
    public int AuctionId { get; set; }
    public string UserId { get; set; }
    public decimal Amount { get; set; }
    public string Status { get; set; } // Pending, Success, Failed
    public string TransactionId { get; set; }
    public DateTime Timestamp { get; set; }
    public string Gateway { get; set; } // e.g., 'Mock'
    public string RawResponse { get; set; }
} 
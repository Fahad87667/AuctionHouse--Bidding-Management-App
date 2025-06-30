using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using System.Threading.Tasks;
using System.Security.Claims;

[ApiController]
[Route("api/[controller]")]
public class PaymentsController : ControllerBase
{
    private readonly EshopDbContext _context;
    public PaymentsController(EshopDbContext context)
    {
        _context = context;
    }

    // POST: api/payments/create-order
    [HttpPost("create-order")]
    [Authorize]
    public async Task<IActionResult> CreateOrder([FromBody] CreatePaymentOrderDto dto)
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        var auction = await _context.AuctionItems.Include(a => a.Bids).FirstOrDefaultAsync(a => a.Id == dto.AuctionId);
        if (auction == null) return NotFound("Auction not found");

        // Force-complete auction if end time has passed
        if (!auction.IsCompleted && auction.EndTime <= DateTime.UtcNow)
        {
            var winningBid = auction.Bids.OrderByDescending(b => b.Amount).FirstOrDefault();
            if (winningBid != null)
            {
                auction.WinnerUserId = winningBid.UserId;
            }
            auction.IsCompleted = true;
            await _context.SaveChangesAsync();
        }

        if (!auction.IsCompleted) return BadRequest("Auction not ended");
        if (auction.WinnerUserId != userId) return Forbid();
        if (auction.IsPaid) return BadRequest("Auction already paid");
        var amount = auction.Bids.OrderByDescending(b => b.Amount).FirstOrDefault()?.Amount ?? auction.StartingPrice;
        // Create a mock order
        var orderId = Guid.NewGuid().ToString();
        return Ok(new { orderId, amount });
    }

    // POST: api/payments/confirm
    [HttpPost("confirm")]
    [Authorize]
    public async Task<IActionResult> ConfirmPayment([FromBody] ConfirmPaymentDto dto)
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        var auction = await _context.AuctionItems.Include(a => a.Bids).FirstOrDefaultAsync(a => a.Id == dto.AuctionId);
        if (auction == null) return NotFound("Auction not found");

        // Force-complete auction if end time has passed
        if (!auction.IsCompleted && auction.EndTime <= DateTime.UtcNow)
        {
            var winningBid = auction.Bids.OrderByDescending(b => b.Amount).FirstOrDefault();
            if (winningBid != null)
            {
                auction.WinnerUserId = winningBid.UserId;
            }
            auction.IsCompleted = true;
            await _context.SaveChangesAsync();
        }

        if (!auction.IsCompleted) return BadRequest("Auction not ended");
        if (auction.WinnerUserId != userId) return Forbid();
        if (auction.IsPaid) return BadRequest("Auction already paid");
        var amount = auction.Bids.OrderByDescending(b => b.Amount).FirstOrDefault()?.Amount ?? auction.StartingPrice;
        // Mark as paid
        auction.IsPaid = true;
        var payment = new Payment
        {
            AuctionId = auction.Id,
            UserId = userId,
            Amount = amount,
            Status = "Success",
            TransactionId = dto.TransactionId ?? Guid.NewGuid().ToString(),
            Timestamp = DateTime.UtcNow,
            Gateway = "Mock",
            RawResponse = dto.RawResponse ?? "{}"
        };
        _context.Payments.Add(payment);
        await _context.SaveChangesAsync();
        return Ok(new { success = true });
    }

    // GET: api/payments/logs
    [HttpGet("logs")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> GetLogs()
    {
        var logs = await _context.Payments.OrderByDescending(p => p.Timestamp).ToListAsync();
        return Ok(logs);
    }

    // GET: api/payments/my-payments
    [HttpGet("my-payments")]
    [Authorize]
    public async Task<IActionResult> GetMyPayments()
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userId)) return Unauthorized();
        var payments = await _context.Payments
            .Where(p => p.UserId == userId)
            .OrderByDescending(p => p.Timestamp)
            .ToListAsync();
        return Ok(payments);
    }

    // POST: api/payments/stripe-intent
    [HttpPost("stripe-intent")]
    [Authorize]
    public async Task<IActionResult> CreateStripeIntent([FromBody] CreatePaymentOrderDto dto)
    {
        var userId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
        var auction = await _context.AuctionItems.Include(a => a.Bids).FirstOrDefaultAsync(a => a.Id == dto.AuctionId);
        if (auction == null) return NotFound("Auction not found");

        // Force-complete auction if end time has passed
        if (!auction.IsCompleted && auction.EndTime <= DateTime.UtcNow)
        {
            var winningBid = auction.Bids.OrderByDescending(b => b.Amount).FirstOrDefault();
            if (winningBid != null)
            {
                auction.WinnerUserId = winningBid.UserId;
            }
            auction.IsCompleted = true;
            await _context.SaveChangesAsync();
        }

        if (!auction.IsCompleted) return BadRequest("Auction not ended");
        if (auction.WinnerUserId != userId) return Forbid();
        if (auction.IsPaid) return BadRequest("Auction already paid");
        var amount = auction.Bids.OrderByDescending(b => b.Amount).FirstOrDefault()?.Amount ?? auction.StartingPrice;
        // MOCK: Return a fake client secret (replace with real Stripe logic if needed)
        var clientSecret = "mock_client_secret_" + Guid.NewGuid();
        return Ok(new { clientSecret, amount });
    }

    // GET: api/payments/order-receipt/{auctionId}
    [HttpGet("order-receipt/{auctionId}")]
    [Authorize]
    public async Task<IActionResult> GetOrderReceipt(int auctionId)
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        var auction = await _context.AuctionItems.Include(a => a.Bids).FirstOrDefaultAsync(a => a.Id == auctionId);
        if (auction == null) return NotFound("Auction not found");
        if (auction.WinnerUserId != userId) return Forbid();
        var payment = await _context.Payments.OrderByDescending(p => p.Timestamp).FirstOrDefaultAsync(p => p.AuctionId == auctionId && p.UserId == userId);
        if (payment == null) return NotFound("Payment not found");
        // Optionally, fetch user info (if needed)
        // For now, just return placeholders for delivery details
        return Ok(new {
            Auction = new {
                auction.Id,
                auction.Title,
                auction.Description,
                auction.ImageUrl,
                auction.EndTime,
                auction.IsPaid,
                auction.IsCompleted
            },
            Payment = new {
                payment.Id,
                payment.Amount,
                payment.Status,
                payment.TransactionId,
                payment.Timestamp,
                payment.Gateway
            },
            Delivery = new {
                Address = "123 Demo Street, City, Country",
                EstimatedDelivery = System.DateTime.UtcNow.AddDays(5).ToString("yyyy-MM-dd")
            }
        });
    }

    // POST: api/payments/force-complete
    [HttpPost("force-complete")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> ForceComplete([FromBody] int auctionId)
    {
        var auction = await _context.AuctionItems.Include(a => a.Bids).FirstOrDefaultAsync(a => a.Id == auctionId);
        if (auction == null) return NotFound("Auction not found");
        if (auction.IsCompleted) return Ok(new { message = "Auction already completed." });
        var winningBid = auction.Bids.OrderByDescending(b => b.Amount).FirstOrDefault();
        if (winningBid != null)
        {
            auction.WinnerUserId = winningBid.UserId;
        }
        auction.IsCompleted = true;
        await _context.SaveChangesAsync();
        return Ok(new { success = true, winnerUserId = auction.WinnerUserId });
    }
}

public class CreatePaymentOrderDto
{
    public int AuctionId { get; set; }
}

public class ConfirmPaymentDto
{
    public int AuctionId { get; set; }
    public string TransactionId { get; set; }
    public string RawResponse { get; set; }
} 
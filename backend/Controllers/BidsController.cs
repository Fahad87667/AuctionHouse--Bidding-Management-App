using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using Microsoft.AspNetCore.Identity;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class BidsController : ControllerBase
{
    private readonly EshopDbContext _context;
    public BidsController(EshopDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> GetAll([FromQuery] int? auctionItemId = null)
    {
        var query = _context.Bids.Include(b => b.User).Include(b => b.AuctionItem).AsQueryable();
        
        if (auctionItemId.HasValue)
            query = query.Where(b => b.AuctionItemId == auctionItemId.Value);

        var bids = await query.OrderByDescending(b => b.Amount).ToListAsync();
        var result = bids.Select(b => new {
            b.Id,
            b.Amount,
            b.Timestamp,
            b.UserId,
            UserName = b.User.UserName,
            b.AuctionItemId,
            AuctionTitle = b.AuctionItem.Title
        });
        return Ok(result);
    }

    [HttpGet("my-bids")]
    public async Task<IActionResult> GetMyBids()
    {
        var userId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userId))
            return Unauthorized();

        var bids = await _context.Bids
            .Include(b => b.AuctionItem)
            .ThenInclude(ai => ai.Bids)
            .Where(b => b.UserId == userId)
            .OrderByDescending(b => b.Timestamp)
            .ToListAsync();

        // Only keep the latest (or highest) bid per auction
        var latestBidsPerAuction = bids
            .GroupBy(b => b.AuctionItemId)
            .Select(g => g.OrderByDescending(b => b.Amount).ThenByDescending(b => b.Timestamp).First())
            .ToList();

        // Patch: Ensure all ended auctions are marked completed and winner is set
        var now = DateTime.UtcNow;
        var updatedAuctions = new HashSet<int>();
        foreach (var bid in latestBidsPerAuction)
        {
            var auction = bid.AuctionItem;
            if (!auction.IsCompleted && auction.EndTime <= now && !updatedAuctions.Contains(auction.Id))
            {
                var winningBid = auction.Bids.OrderByDescending(b => b.Amount).FirstOrDefault();
                if (winningBid != null)
                {
                    auction.WinnerUserId = winningBid.UserId;
                }
                auction.IsCompleted = true;
                updatedAuctions.Add(auction.Id);
            }
        }
        if (updatedAuctions.Count > 0)
            await _context.SaveChangesAsync();

        var result = latestBidsPerAuction.Select(b => new {
            b.Id,
            b.Amount,
            b.Timestamp,
            b.AuctionItemId,
            AuctionTitle = b.AuctionItem.Title,
            AuctionImageUrl = b.AuctionItem.ImageUrl,
            AuctionDescription = b.AuctionItem.Description,
            AuctionEndTime = b.AuctionItem.EndTime,
            IsWinning = b.Amount == b.AuctionItem.Bids.Max(bid => bid.Amount),
            WinnerUserId = b.AuctionItem.WinnerUserId,
            IsCompleted = b.AuctionItem.IsCompleted,
            IsPaid = b.AuctionItem.IsPaid,
            UserId = b.UserId
        });
        return Ok(result);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateBidDTO dto)
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userId))
            return Unauthorized();

        // Prevent admin from bidding
        var user = await _context.Users.FirstOrDefaultAsync(u => u.Id == userId);
        if (user != null)
        {
            var userManager = HttpContext.RequestServices.GetService(typeof(UserManager<IdentityUser>)) as UserManager<IdentityUser>;
            var roles = userManager != null ? await userManager.GetRolesAsync(user) : new List<string>();
            if (roles.Contains("Admin"))
                return BadRequest("Admins cannot place bids.");
        }

        // Get auction item
        var auctionItem = await _context.AuctionItems
            .Include(a => a.Bids)
            .FirstOrDefaultAsync(a => a.Id == dto.AuctionItemId);

        if (auctionItem == null)
            return BadRequest("Auction item not found");

        // Check if auction has ended
        if (auctionItem.EndTime <= DateTime.UtcNow)
            return BadRequest("Auction has ended");

        // Get current highest bid
        var currentHighestBid = auctionItem.Bids.OrderByDescending(b => b.Amount).FirstOrDefault()?.Amount ?? auctionItem.StartingPrice;

        // Validate bid amount
        if (dto.Amount <= currentHighestBid)
            return BadRequest($"Bid must be higher than current highest bid (${currentHighestBid})");

        // Check if user is not bidding on their own highest bid
        var userHighestBid = auctionItem.Bids
            .Where(b => b.UserId == userId)
            .OrderByDescending(b => b.Amount)
            .FirstOrDefault();

        if (userHighestBid != null && userHighestBid.Amount == currentHighestBid)
            return BadRequest("You already have the highest bid");

        var bid = new Bid
        {
            AuctionItemId = dto.AuctionItemId,
            Amount = dto.Amount,
            UserId = userId,
            Timestamp = DateTime.UtcNow
        };

        _context.Bids.Add(bid);
        await _context.SaveChangesAsync();

        return Ok(new { bid.Id, bid.Amount, bid.Timestamp, Message = "Bid placed successfully" });
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Delete(int id)
    {
        var bid = await _context.Bids.FindAsync(id);
        if (bid == null) return NotFound();

        _context.Bids.Remove(bid);
        await _context.SaveChangesAsync();
        return NoContent();
    }
} 
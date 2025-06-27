using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

[ApiController]
[Route("api/[controller]")]
public class AuctionItemsController : ControllerBase
{
    private readonly EshopDbContext _context;
    public AuctionItemsController(EshopDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var items = await _context.AuctionItems
            .Include(a => a.Bids)
            .ThenInclude(b => b.User)
            .ToListAsync();
        var result = items.Select(item => new {
            item.Id,
            item.Title,
            item.Description,
            item.ImageUrl,
            item.StartingPrice,
            item.EndTime,
            HighestBid = item.Bids.OrderByDescending(b => b.Amount).FirstOrDefault()?.Amount ?? item.StartingPrice,
            BidCount = item.Bids.Count,
            WinningUser = item.Bids.OrderByDescending(b => b.Amount).FirstOrDefault()?.User?.UserName,
            TimeLeft = (item.EndTime - DateTime.UtcNow).TotalSeconds > 0 ? (item.EndTime - DateTime.UtcNow).ToString(@"hh\:mm\:ss") : "Ended"
        });
        return Ok(result);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> Get(int id)
    {
        var item = await _context.AuctionItems.Include(a => a.Bids).ThenInclude(b => b.User).FirstOrDefaultAsync(a => a.Id == id);
        if (item == null) return NotFound();
        return Ok(new {
            item.Id,
            item.Title,
            item.Description,
            item.ImageUrl,
            item.StartingPrice,
            item.EndTime,
            HighestBid = item.Bids.OrderByDescending(b => b.Amount).FirstOrDefault()?.Amount ?? item.StartingPrice,
            BidCount = item.Bids.Count,
            WinningUser = item.Bids.OrderByDescending(b => b.Amount).FirstOrDefault()?.User?.UserName,
            TimeLeft = (item.EndTime - DateTime.UtcNow).TotalSeconds > 0 ? (item.EndTime - DateTime.UtcNow).ToString(@"hh\:mm\:ss") : "Ended",
            Bids = item.Bids.OrderByDescending(b => b.Amount).Select(b => new { b.Id, b.Amount, b.Timestamp, b.UserId, UserName = b.User.UserName })
        });
    }

    [HttpPost]
    [Authorize(Roles = "Admin,Seller")]
    public async Task<IActionResult> Create(AuctionItem item)
    {
        if (item.EndTime <= DateTime.UtcNow)
            return BadRequest("End time must be in the future");

        if (item.StartingPrice <= 0)
            return BadRequest("Starting price must be greater than 0");

        _context.AuctionItems.Add(item);
        await _context.SaveChangesAsync();
        return Ok(item);
    }

    [HttpPut("{id}")]
    [Authorize(Roles = "Admin,Seller")]
    public async Task<IActionResult> Update(int id, AuctionItem item)
    {
        if (id != item.Id) return BadRequest();
        
        var existingItem = await _context.AuctionItems.Include(a => a.Bids).FirstOrDefaultAsync(a => a.Id == id);
        if (existingItem == null) return NotFound();
        
        // Only allow edit if no bids placed
        if (existingItem.Bids.Any())
            return BadRequest("Cannot edit auction with existing bids");

        // Explicitly set each property
        existingItem.Title = item.Title;
        existingItem.Description = item.Description;
        existingItem.ImageUrl = item.ImageUrl;
        existingItem.StartingPrice = item.StartingPrice;
        existingItem.EndTime = item.EndTime;

        await _context.SaveChangesAsync();
        return NoContent();
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Delete(int id)
    {
        var item = await _context.AuctionItems.Include(a => a.Bids).FirstOrDefaultAsync(a => a.Id == id);
        if (item == null) return NotFound();
        
        // Only allow delete if no bids placed
        if (item.Bids.Any())
            return BadRequest("Cannot delete auction with existing bids");
            
        _context.AuctionItems.Remove(item);
        await _context.SaveChangesAsync();
        return NoContent();
    }
} 
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using Microsoft.AspNetCore.Http;
using System.IO;
using System.Linq;

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
        var now = DateTime.UtcNow;
        var items = await _context.AuctionItems
            .Include(a => a.Bids)
            .ThenInclude(b => b.User)
            .ToListAsync();
        foreach (var item in items)
        {
            if (!item.IsCompleted && item.EndTime <= now)
            {
                var winningBid = item.Bids.OrderByDescending(b => b.Amount).FirstOrDefault();
                if (winningBid != null)
                {
                    item.WinnerUserId = winningBid.UserId;
                }
                item.IsCompleted = true;
            }
        }
        await _context.SaveChangesAsync();
        var result = items.Select(item => new {
            item.Id,
            item.Title,
            item.Description,
            item.ImageUrl,
            item.StartingPrice,
            item.EndTime,
            item.IsCompleted,
            item.IsPaid,
            item.WinnerUserId,
            WinnerUserName = item.Bids.FirstOrDefault(b => b.UserId == item.WinnerUserId)?.User?.UserName,
            HighestBid = item.Bids.OrderByDescending(b => b.Amount).FirstOrDefault()?.Amount ?? item.StartingPrice,
            BidCount = item.Bids.Count,
            Bids = item.Bids
                .OrderByDescending(b => b.Amount)
                .Take(1)
                .Select(b => new {
                    b.Id,
                    b.Amount,
                    b.Timestamp,
                    b.UserId,
                    UserName = b.User.UserName,
                    UserEmail = b.User.Email
                }),
            TimeLeft = (item.EndTime - now).TotalSeconds > 0 ? (item.EndTime - now).ToString(@"hh\:mm\:ss") : "Ended"
        });
        return Ok(result);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> Get(int id)
    {
        var now = DateTime.UtcNow;
        var item = await _context.AuctionItems.Include(a => a.Bids).ThenInclude(b => b.User).FirstOrDefaultAsync(a => a.Id == id);
        if (item == null) return NotFound();
        if (!item.IsCompleted && item.EndTime <= now)
        {
            var winningBid = item.Bids.OrderByDescending(b => b.Amount).FirstOrDefault();
            if (winningBid != null)
            {
                item.WinnerUserId = winningBid.UserId;
            }
            item.IsCompleted = true;
            await _context.SaveChangesAsync();
        }
        return Ok(new {
            item.Id,
            item.Title,
            item.Description,
            item.ImageUrl,
            item.StartingPrice,
            item.EndTime,
            item.IsCompleted,
            item.IsPaid,
            item.WinnerUserId,
            WinnerUserName = item.Bids.FirstOrDefault(b => b.UserId == item.WinnerUserId)?.User?.UserName,
            HighestBid = item.Bids.OrderByDescending(b => b.Amount).FirstOrDefault()?.Amount ?? item.StartingPrice,
            BidCount = item.Bids.Count,
            Bids = item.Bids.OrderByDescending(b => b.Amount).Select(b => new { b.Id, b.Amount, b.Timestamp, b.UserId, UserName = b.User.UserName }),
            TimeLeft = (item.EndTime - now).TotalSeconds > 0 ? (item.EndTime - now).ToString(@"hh\:mm\:ss") : "Ended"
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

    [HttpPost("upload-image")]
    [Authorize(Roles = "Admin,Seller")]
    public async Task<IActionResult> UploadImage([FromForm] IFormFile image)
    {
        if (image == null || image.Length == 0)
            return BadRequest("No file uploaded");

        // Validate file type
        var allowedExtensions = new[] { ".jpg", ".jpeg", ".png", ".gif", ".webp", ".avif" };
        var extension = Path.GetExtension(image.FileName).ToLowerInvariant();
        if (!allowedExtensions.Contains(extension))
            return BadRequest("Invalid file type. Only image files are allowed.");

        // Generate unique filename
        var fileName = $"{Guid.NewGuid()}{extension}";
        var imagesPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "images");
        if (!Directory.Exists(imagesPath))
            Directory.CreateDirectory(imagesPath);
        var filePath = Path.Combine(imagesPath, fileName);

        // Save file
        try
        {
            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await image.CopyToAsync(stream);
            }
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"Error saving file: {ex.Message}");
        }

        // Return relative path
        var relativePath = $"/images/{fileName}";
        return Ok(new { imageUrl = relativePath });
    }
} 
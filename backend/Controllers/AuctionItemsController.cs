using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using Microsoft.AspNetCore.Http;
using System.IO;
using System.Linq;
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
                else
                {
                    item.WinnerUserId = null;
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
            WinnerUserName = (
                (from b in item.Bids.OrderByDescending(b => b.Amount)
                 join u in _context.Set<Microsoft.AspNetCore.Identity.IdentityUser>() on b.UserId equals u.Id into userJoin
                 from u in userJoin.DefaultIfEmpty()
                 select u.UserName ?? b.User.UserName ?? b.User.Email ?? b.UserId).FirstOrDefault()
            ),
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
            else
            {
                item.WinnerUserId = null;
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
            WinnerUserName = (
                (from b in item.Bids.OrderByDescending(b => b.Amount)
                 join u in _context.Set<Microsoft.AspNetCore.Identity.IdentityUser>() on b.UserId equals u.Id into userJoin
                 from u in userJoin.DefaultIfEmpty()
                 select u.UserName ?? b.User.UserName ?? b.User.Email ?? b.UserId).FirstOrDefault()
            ),
            HighestBid = item.Bids.OrderByDescending(b => b.Amount).FirstOrDefault()?.Amount ?? item.StartingPrice,
            BidCount = item.Bids.Count,
            Bids = item.Bids.OrderByDescending(b => b.Amount).Select(b => new { b.Id, b.Amount, b.Timestamp, b.UserId, UserName = b.User.UserName }),
            TimeLeft = (item.EndTime - now).TotalSeconds > 0 ? (item.EndTime - now).ToString(@"hh\:mm\:ss") : "Ended"
        });
    }

    [HttpPost]
    [Authorize(Roles = "Admin,Seller")]
    public async Task<IActionResult> Create(CreateAuctionItemDTO dto)
    {
        if (dto.EndTime <= DateTime.UtcNow)
            return BadRequest("End time must be in the future");

        if (dto.StartingPrice <= 0)
            return BadRequest("Starting price must be greater than 0");

        var userId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userId))
            return BadRequest("OwnerId could not be determined from user context");

        var item = new AuctionItem
        {
            Title = dto.Title,
            Description = dto.Description,
            ImageUrl = dto.ImageUrl,
            StartingPrice = dto.StartingPrice,
            EndTime = dto.EndTime,
            OwnerId = userId,
            CreatedAt = DateTime.UtcNow
        };

        _context.AuctionItems.Add(item);
        await _context.SaveChangesAsync();
        return Ok(item);
    }

    [HttpPut("{id}")]
    [Authorize(Roles = "Admin,Seller")]
    public async Task<IActionResult> Update(int id, UpdateAuctionItemDTO dto)
    {
        if (id != dto.Id) return BadRequest();

        var existingItem = await _context.AuctionItems.Include(a => a.Bids).FirstOrDefaultAsync(a => a.Id == id);
        if (existingItem == null) return NotFound();

        // Set OwnerId from user context (not from client)
        var userId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userId))
            return BadRequest("OwnerId could not be determined from user context");

        if (existingItem.Bids.Any())
        {
            // Allow updating Description, ImageUrl, and EndTime if there are bids
            existingItem.Description = dto.Description;
            existingItem.ImageUrl = dto.ImageUrl;
            existingItem.EndTime = dto.EndTime;
        }
        else
        {
            // If no bids, allow updating all fields
            existingItem.Title = dto.Title;
            existingItem.Description = dto.Description;
            existingItem.ImageUrl = dto.ImageUrl;
            existingItem.StartingPrice = dto.StartingPrice;
            existingItem.EndTime = dto.EndTime;
        }
        existingItem.OwnerId = userId;
        await _context.SaveChangesAsync();
        return NoContent();
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Delete(int id)
    {
        var item = await _context.AuctionItems.Include(a => a.Bids).FirstOrDefaultAsync(a => a.Id == id);
        if (item == null) return NotFound();
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
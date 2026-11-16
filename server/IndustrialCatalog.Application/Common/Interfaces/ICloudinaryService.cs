using System.IO;
using System.Threading;
using System.Threading.Tasks;

namespace IndustrialCatalog.Application.Common.Interfaces;

public class CloudinaryUploadResult
{
    public string SecureUrl { get; set; } = string.Empty;
    public string PublicId { get; set; } = string.Empty;
    public string Format { get; set; } = string.Empty;
    public int Width { get; set; }
    public int Height { get; set; }
    public long Bytes { get; set; }
}

public interface ICloudinaryService
{
    Task<CloudinaryUploadResult> UploadImageAsync(Stream fileStream, string fileName, string? folder = "uws-machinery", CancellationToken ct = default);
    Task<bool> DeleteImageAsync(string publicId, CancellationToken ct = default);
}

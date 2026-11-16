using System;
using System.IO;
using System.Threading;
using System.Threading.Tasks;
using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using IndustrialCatalog.Application.Common.Interfaces;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

namespace IndustrialCatalog.Infrastructure.Services;

public class CloudinaryService : ICloudinaryService
{
    private readonly Cloudinary? _cloudinary;
    private readonly ILogger<CloudinaryService> _logger;
    private readonly string? _cloudName;

    public CloudinaryService(IConfiguration configuration, ILogger<CloudinaryService> logger)
    {
        _logger = logger;
        _cloudName = configuration["Cloudinary:CloudName"];
        var apiKey = configuration["Cloudinary:ApiKey"];
        var apiSecret = configuration["Cloudinary:ApiSecret"];

        if (!string.IsNullOrWhiteSpace(_cloudName) &&
            !string.IsNullOrWhiteSpace(apiKey) &&
            !string.IsNullOrWhiteSpace(apiSecret))
        {
            var account = new Account(_cloudName, apiKey, apiSecret);
            _cloudinary = new Cloudinary(account)
            {
                Api = { Secure = true }
            };
        }
        else
        {
            _logger.LogWarning("Cloudinary credentials are not fully configured. CloudName: '{CloudName}', ApiKey present: {HasKey}",
                _cloudName, !string.IsNullOrWhiteSpace(apiKey));
        }
    }

    public async Task<CloudinaryUploadResult> UploadImageAsync(
        Stream fileStream,
        string fileName,
        string? folder = "uws-machinery",
        CancellationToken ct = default)
    {
        if (_cloudinary == null)
        {
            throw new InvalidOperationException(
                $"Cloudinary is not properly configured. Please ensure 'Cloudinary:CloudName', 'Cloudinary:ApiKey', and 'Cloudinary:ApiSecret' are set in appsettings.json. Current CloudName: '{_cloudName}'");
        }

        if (fileStream.CanSeek)
        {
            fileStream.Position = 0;
        }

        var uploadParams = new ImageUploadParams
        {
            File = new FileDescription(fileName, fileStream),
            Folder = string.IsNullOrWhiteSpace(folder) ? "uws-machinery" : folder,
            UseFilename = true,
            UniqueFilename = true,
            Overwrite = false,
        };

        var result = await _cloudinary.UploadAsync(uploadParams, ct);

        if (result.Error != null)
        {
            _logger.LogError("Cloudinary upload failed: {Error}", result.Error.Message);
            throw new Exception($"Cloudinary upload failed: {result.Error.Message}");
        }

        return new CloudinaryUploadResult
        {
            SecureUrl = result.SecureUrl?.ToString() ?? result.Url?.ToString() ?? string.Empty,
            PublicId = result.PublicId ?? string.Empty,
            Format = result.Format ?? string.Empty,
            Width = result.Width,
            Height = result.Height,
            Bytes = result.Bytes,
        };
    }

    public async Task<bool> DeleteImageAsync(string publicId, CancellationToken ct = default)
    {
        if (_cloudinary == null || string.IsNullOrWhiteSpace(publicId))
        {
            return false;
        }

        var deleteParams = new DeletionParams(publicId);
        var result = await _cloudinary.DestroyAsync(deleteParams);
        return result.Result == "ok";
    }
}

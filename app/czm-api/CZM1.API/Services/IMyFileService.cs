namespace CZM1.API.Services;

public interface IMyFileService
{
    Task<string> SaveFileAsync(IFormFile file, string relativePath, CancellationToken cancellationToken = default);
    void DeleteFile(string relativeFilePath);
    bool FileExists(string relativeFilePath);
    Task<byte[]> ReadFileAsync(string relativeFilePath, CancellationToken cancellationToken);
}

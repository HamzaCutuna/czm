using CZM1.API.Services;
using Serilog;
using System.Text;
using System.Text.Json;

namespace CZM1.API.Helpers
{
    public static class ErrorLoggerHelper
    {
        public static async Task<string> LogExceptionAsync(HttpContext context, Exception? ex, CancellationToken cancellationToken)
        {
            var request = context.Request;

            request.EnableBuffering(); // omogućava ponovno čitanje bodyja

            string body = string.Empty;

            if (request.HasFormContentType)
            {
                var form = await request.ReadFormAsync(cancellationToken);

                var formDataSb = new StringBuilder();
                formDataSb.AppendLine("Form data:");
                foreach (var field in form)
                    formDataSb.AppendLine($"\t{field.Key}: {field.Value}");

                if (form.Files.Count > 0)
                {
                    formDataSb.AppendLine("Files:");
                    foreach (var file in form.Files)
                        formDataSb.AppendLine($"\t{file.Name} ({file.FileName}, {file.Length} bytes)");
                }

                body = formDataSb.ToString();
            }
            else if (request.ContentLength > 0 && request.Body.CanSeek)
            {
                request.Body.Position = 0;
                using var reader = new StreamReader(request.Body, Encoding.UTF8, leaveOpen: true);
                body = await reader.ReadToEndAsync(cancellationToken);
                request.Body.Position = 0;
            }


            var sb = new StringBuilder();
            sb.AppendLine("===== UNHANDLED EXCEPTION =====");
            sb.AppendLine($"Time: {DateTime.UtcNow}");
            sb.AppendLine($"Method: {request.Method}");
            sb.AppendLine($"Path: {request.Path}");
            sb.AppendLine($"Query: {request.QueryString}");
            sb.AppendLine("Headers:");
            foreach (var header in request.Headers)
            {
                if (header.Key == "my-auth-token")
                {
                    sb.AppendLine($"\t{header.Key}: {header.Value}");
                }
            }

            if (!string.IsNullOrWhiteSpace(body))
            {
                sb.AppendLine("Body:");
                sb.AppendLine(body);
            }

            sb.AppendLine("================================");

            Log.Error(sb.ToString());

            return sb.ToString();
        }

    }
}

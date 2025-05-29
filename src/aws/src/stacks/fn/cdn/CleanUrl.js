/**
 * This function to create clean URLs for CloudFront
 * @param {} event
 * @returns
 */
function handler(event) {
    var request = event.request;
    var uri = request.uri;

    if (uri.endsWith("/")) {
        request.uri = uri + "index.html";
    } else if (!uri.includes(".")) {
        request.uri += "/index.html";
    }

    return request;
}

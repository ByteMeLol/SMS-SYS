export class ApiError extends Error {
  constructor(message: string, readonly status: number) {
    super(message);
    this.name = "ApiError";
  }
}

type ApiOptions = RequestInit & {
  authenticated?: boolean;
};

export async function apiRequest<T>(
  path: string,
  options: ApiOptions = {},
): Promise<T> {
  const { authenticated = true, headers: requestHeaders, ...requestOptions } =
    options;
  const headers = new Headers(requestHeaders);
  headers.set("Accept", "application/json, text/plain");

  if (requestOptions.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  if (authenticated && typeof window !== "undefined") {
    const token = window.sessionStorage.getItem("sms-sys-token");
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
  }

  let response: Response;
  try {
    response = await fetch(`/api${path}`, {
      ...requestOptions,
      headers,
    });
  } catch {
    throw new Error(
      "Cannot reach the school service. Check that the backend is running and try again.",
    );
  }

  const responseText = await response.text();
  const contentType = response.headers.get("content-type") ?? "";
  let responseBody: unknown = responseText;

  if (responseText && contentType.includes("application/json")) {
    try {
      responseBody = JSON.parse(responseText);
    } catch {
      throw new Error("The school service returned an invalid response.");
    }
  }

  if (!response.ok) {
    const message =
      response.status >= 500
        ? `The school service returned an error (${response.status}). Check that the backend is running and review its logs.`
        :
      typeof responseBody === "string"
        ? responseBody
        : responseBody &&
            typeof responseBody === "object" &&
            "message" in responseBody &&
            typeof responseBody.message === "string"
          ? responseBody.message
          : `The school service request failed (${response.status}).`;
    throw new ApiError(message, response.status);
  }

  return responseBody as T;
}

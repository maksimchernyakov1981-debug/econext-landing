import {
  handleUpload,
  handleUploadPresigned,
  type HandleUploadBody,
  type HandleUploadPresignedBody,
} from "@vercel/blob/client";
import { issueSignedToken } from "@vercel/blob";
import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import {
  blobClientUploadSetupHint,
  blobUploadConstraints,
  getBlobReadWriteToken,
  getBlobUploadMode,
} from "@/lib/blob-auth";

export const maxDuration = 60;

export async function POST(request: Request): Promise<NextResponse> {
  const body = (await request.json()) as HandleUploadBody | HandleUploadPresignedBody;
  const mode = getBlobUploadMode();

  if (body.type === "blob.upload-completed") {
    return handleCompletedWebhook(body, request, mode);
  }

  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (mode === "none") {
    return NextResponse.json({ error: blobClientUploadSetupHint() }, { status: 503 });
  }

  const constraints = blobUploadConstraints();

  try {
    if (mode === "presigned" || body.type === "blob.generate-presigned-url") {
      const jsonResponse = await handleUploadPresigned({
        body: body as HandleUploadPresignedBody,
        request,
        getSignedToken: async (pathname, clientPayload) => {
          if (!pathname.startsWith("uploads/")) {
            throw new Error("Недопустимый путь загрузки");
          }
          const token = await issueSignedToken({
            pathname,
            operations: ["put"],
            allowedContentTypes: constraints.allowedContentTypes,
            maximumSizeInBytes: constraints.maximumSizeInBytes,
          });
          return {
            token,
            urlOptions: {
              access: "public" as const,
              addRandomSuffix: true,
              tokenPayload: clientPayload ?? undefined,
            },
          };
        },
      });
      return NextResponse.json(jsonResponse);
    }

    const rwToken = getBlobReadWriteToken();
    if (!rwToken) {
      return NextResponse.json({ error: blobClientUploadSetupHint() }, { status: 503 });
    }

    const jsonResponse = await handleUpload({
      body: body as HandleUploadBody,
      request,
      token: rwToken,
      onBeforeGenerateToken: async (pathname, clientPayload) => {
        if (!pathname.startsWith("uploads/")) {
          throw new Error("Недопустимый путь загрузки");
        }
        return {
          allowedContentTypes: constraints.allowedContentTypes,
          maximumSizeInBytes: constraints.maximumSizeInBytes,
          addRandomSuffix: true,
          tokenPayload: clientPayload,
        };
      },
    });
    return NextResponse.json(jsonResponse);
  } catch (e) {
    console.error("[blob-upload]", e);
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Ошибка Blob upload" },
      { status: 400 }
    );
  }
}

async function handleCompletedWebhook(
  body: HandleUploadBody | HandleUploadPresignedBody,
  request: Request,
  mode: ReturnType<typeof getBlobUploadMode>
): Promise<NextResponse> {
  try {
    if (mode === "presigned") {
      const jsonResponse = await handleUploadPresigned({
        body: body as HandleUploadPresignedBody,
        request,
        getSignedToken: async () => {
          throw new Error("Unexpected presigned token request on upload-completed");
        },
      });
      return NextResponse.json(jsonResponse);
    }

    const rwToken = getBlobReadWriteToken();
    if (!rwToken) {
      return NextResponse.json({ error: "Missing token" }, { status: 503 });
    }

    const jsonResponse = await handleUpload({
      body: body as HandleUploadBody,
      request,
      token: rwToken,
      onBeforeGenerateToken: async () => {
        throw new Error("Unexpected token request on upload-completed");
      },
    });
    return NextResponse.json(jsonResponse);
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Webhook error" },
      { status: 400 }
    );
  }
}

import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import {
  blobClientUploadSetupHint,
  blobUploadConstraints,
  getBlobReadWriteToken,
} from "@/lib/blob-auth";

export const maxDuration = 60;

export async function POST(request: Request): Promise<NextResponse> {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const rwToken = getBlobReadWriteToken();
  if (!rwToken) {
    return NextResponse.json({ error: blobClientUploadSetupHint() }, { status: 503 });
  }

  const body = (await request.json()) as HandleUploadBody;
  const constraints = blobUploadConstraints();

  try {
    const jsonResponse = await handleUpload({
      body,
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
      onUploadCompleted: async () => {
        /* регистрация в БД — отдельным запросом с клиента после upload() */
      },
    });
    return NextResponse.json(jsonResponse);
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Ошибка Blob upload" },
      { status: 400 }
    );
  }
}

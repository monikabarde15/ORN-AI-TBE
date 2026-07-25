// artifacts/api-server/src/lib/cv-processor.ts
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { eq } from "drizzle-orm";
import { db, candidatesTable } from "@workspace/db";
import { s3 } from "./s3";
import { parseCvBuffer } from "./cv-parser";
import { parseCvWithAI } from "./cv-parser-ai";
import { evaluateWithAI } from "./evaluation-full-ai";

export interface ProcessCvOptions {
  candidateId: string;
  fileBuffer: Buffer;
  fileName: string;
  mimeType: string;
  fileSize: number;
}

export async function processAndSaveCv(options: ProcessCvOptions) {
  const { candidateId, fileBuffer, fileName, mimeType, fileSize } = options;

  const key = `resume/${candidateId}/${Date.now()}-${fileName.replace(/[^a-zA-Z0-9._-]/g, "_")}`;

  let fileUrl = "";
  if (process.env.AWS_BUCKET_NAME && process.env.AWS_REGION) {
    try {
      await s3.send(
        new PutObjectCommand({
          Bucket: process.env.AWS_BUCKET_NAME,
          Key: key,
          Body: fileBuffer,
          ContentType: mimeType,
        })
      );
      fileUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
    } catch (err) {
      console.error("S3 Upload Failed:", err);
    }
  }

  // Step 1: Extract text from file buffer
  const rawText = await parseCvBuffer(fileBuffer, mimeType);

  // Step 2: Parse extracted text using AI
  const parsedResume = await parseCvWithAI(rawText);

  // Step 3: Fetch existing candidate to merge skills
  const [existingCandidate] = await db
    .select()
    .from(candidatesTable)
    .where(eq(candidatesTable.id, candidateId));

  if (!existingCandidate) {
    throw new Error(`Candidate with ID ${candidateId} not found.`);
  }

  const mergedSkills = [
    ...new Set([
      ...(existingCandidate.skills ?? []),
      ...(parsedResume.skills ?? []),
    ]),
  ];

  const cvObject = {
    fileName,
    fileSize,
    key,
    url: fileUrl,
    rawText,
    resumeAnalysis: parsedResume,
  };

  // Step 4: Update candidate DB record with CV info and merged skills
  const [candidate] = await db
    .update(candidatesTable)
    .set({
      cv: cvObject,
      cvFileName: fileName,
      cvMimeType: mimeType,
      cvFileBytes: fileBuffer,
      yearsExperience:
        parsedResume.yearsExperience ?? existingCandidate.yearsExperience,
      careerGapMonths:
        parsedResume.careerGapMonths ?? existingCandidate.careerGapMonths,
      skills: mergedSkills,
    })
    .where(eq(candidatesTable.id, candidateId))
    .returning();

  // Step 5: Perform AI evaluation with rawText & resumeAnalysis included
  let evaluationResult = null;
  try {
    evaluationResult = await evaluateWithAI({
      id: candidate.id,
      fullName: candidate.fullName,
      email: candidate.email,
      englishLevel: candidate.englishLevel,
      visaStatus: candidate.visaStatus,
      yearsExperience: candidate.yearsExperience,
      euWorkEligible: candidate.euWorkEligible,
      targetRole: candidate.targetRole,
      country: candidate.country,
      skills: candidate.skills,
      careerGapMonths: candidate.careerGapMonths ?? 0,
      cv: candidate.cv as any,
      resumeText: rawText,
      resumeAnalysis: parsedResume,
    });

    await db
      .update(candidatesTable)
      .set({
        evaluation: evaluationResult,
      })
      .where(eq(candidatesTable.id, candidate.id));
  } catch (err) {
    console.error("AI Evaluation Failed during CV process:", err);
  }

  const [updatedCandidate] = await db
    .select()
    .from(candidatesTable)
    .where(eq(candidatesTable.id, candidate.id));

  return {
    candidate: updatedCandidate,
    cv: updatedCandidate.cv,
    evaluation: updatedCandidate.evaluation ?? evaluationResult,
  };
}

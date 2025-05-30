'use server';

import {
  NewResourceParams,
  insertResourceSchema,
  resources,
} from '@/lib/db/schema/resources';
import { db } from '../db';
import { generateEmbeddings } from '../ai/embedding';
import { embeddings as embeddingsTable } from '../db/schema/embeddings';
import { eq } from 'drizzle-orm';

export const createResource = async (input: NewResourceParams) => {
  try {
    const { content, category, sub, topic, meta } = insertResourceSchema.parse(input);

    if (topic == null) {
      throw new Error('Topic must not be null');
    }
    const existing = await db.select().from(resources).where(eq(resources.topic, topic));
    if (existing.length > 0) return existing[0];

    const [resource] = await db
      .insert(resources)
      .values({ content, category, sub, topic, meta })
      .returning();

    const embeddings = await generateEmbeddings(content);
    await db.insert(embeddingsTable).values(
      embeddings.map(embedding => ({
        resourceId: resource.id,
        ...embedding,
      })),
    );

    return 'Resource successfully created and embedded.';
  } catch (error) {
    return error instanceof Error && error.message.length > 0
      ? error.message
      : 'Error, please try again.';
  }
};
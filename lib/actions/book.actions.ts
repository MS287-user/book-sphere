"use server";

import { connectToDatabase } from "@/database/mongoose";
import { CreateBook, TextSegment } from "@/types";
import { generateSlug, serializeData } from "../utils";
import Book from "@/database/models/book.model";
import BookSegment from "@/database/models/bookSegment.model";

export const getAllBooks = async () => {
  try {
    await connectToDatabase();

    const books = await Book.find().sort({ createdAt: -1 }).lean();

    return {
      success: true,
      data: serializeData(books),
    };
  } catch (error) {
    console.error("Error connecting to database", error);
    return {
      success: false,
      error: error,
    };
  }
};

export const checkBookExists = async (title: string) => {
  try {
    await connectToDatabase();

    const slug = generateSlug(title);

    const existingBook = await Book.findOne({ slug }).lean();

    if (existingBook) {
      return {
        exists: true,
        book: serializeData(existingBook),
      };
    }

    return {
      exists: false,
    };
  } catch (error) {
    console.error("Error checking book exists:", error);
    return {
      exists: false,
      error: error,
    };
  }
};

export const createBook = async (data: CreateBook) => {
  try {
    await connectToDatabase();

    const slug = generateSlug(data.title);

    const existingBook = await Book.findOne({ slug }).lean();

    if (existingBook) {
      return {
        success: true,
        data: serializeData(existingBook),
        alreadyExists: true,
      };
    }

    // Todo: Check subscription limits before creating a book

    const book = await Book.create({ ...data, slug, totalSegments: 0 });

    return {
      success: true,
      data: serializeData(book),
    };
  } catch (error) {
    console.error("Error creating a book:", error);
    return {
      success: false,
      error: error,
    };
  }
};

export const saveBookSegments = async (
  bookId: string,
  clerkId: string,
  segments: TextSegment[],
) => {
  try {
    await connectToDatabase();

    const segmentsToInsert = segments.map(
      ({ text, segmentIndex, pageNumber, wordCount }) => ({
        clerkId,
        bookId,
        content: text,
        segmentIndex,
        pageNumber,
        wordCount,
      }),
    );

    await BookSegment.insertMany(segmentsToInsert);
    await Book.findByIdAndUpdate(bookId, { totalSegments: segments.length });

    console.log("Book segments saved successfully");

    return {
      success: true,
      data: { segmentsCreated: segments.length },
    };
  } catch (error) {
    console.error("Error saving a segment:", error);

    await BookSegment.deleteMany({ bookId });
    await Book.findByIdAndDelete(bookId);

    console.error(
      "Deleted book segments due to failure to save other book segments",
    );

    return {
      success: false,
      error: error,
    };
  }
};

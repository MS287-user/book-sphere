"use client";

import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Upload, ImageIcon } from "lucide-react";
import { UploadSchema } from "@/lib/zod";
import { BookUploadFormValues } from "@/types";
import { Field, FieldLabel, FieldError } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ACCEPTED_PDF_TYPES, ACCEPTED_IMAGE_TYPES } from "@/lib/constants";
import FileUploader from "./FileUploader";
import VoiceSelector from "./VoiceSelector";
import LoadingOverlay from "./LoadingOverlay";

const UploadForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const form = useForm<BookUploadFormValues>({
    resolver: zodResolver(UploadSchema),
    defaultValues: {
      title: "",
      author: "",
      persona: "",
      pdfFile: undefined,
      coverImage: undefined,
    },
  });

  const onSubmit = async (data: BookUploadFormValues) => {
    setIsSubmitting(true);
    console.log(data);
    await new Promise((resolve) => setTimeout(resolve, 3000));
    setIsSubmitting(false);
  };

  if (!isMounted) return null;

  return (
    <>
      {isSubmitting && <LoadingOverlay />}

      <div className="new-book-wrapper">
        {/* ← Removed <Form> provider; plain <form> with handleSubmit is sufficient */}
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {/* 1. PDF File Upload — FileUploader uses Controller internally */}
          <FileUploader
            control={form.control}
            name="pdfFile"
            label="Book PDF File"
            acceptTypes={ACCEPTED_PDF_TYPES}
            icon={Upload}
            placeholder="Click to upload PDF"
            hint="PDF file (max 50MB)"
            disabled={isSubmitting}
          />

          {/* 2. Cover Image Upload */}
          <FileUploader
            control={form.control}
            name="coverImage"
            label="Cover Image (Optional)"
            acceptTypes={ACCEPTED_IMAGE_TYPES}
            icon={ImageIcon}
            placeholder="Click to upload cover image"
            hint="Leave empty to auto-generate from PDF"
            disabled={isSubmitting}
          />

          {/* 3. Title Input */}
          <Controller
            name="title"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Title</FieldLabel>
                <Input
                  {...field}
                  id={field.name}
                  className="form-input"
                  placeholder="ex: Rich Dad Poor Dad"
                  aria-invalid={fieldState.invalid}
                  disabled={isSubmitting}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          {/* 4. Author Input */}
          <Controller
            name="author"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Author Name</FieldLabel>
                <Input
                  {...field}
                  id={field.name}
                  className="form-input"
                  placeholder="ex: Robert Kiyosaki"
                  aria-invalid={fieldState.invalid}
                  disabled={isSubmitting}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          {/* 5. Voice Selector — wired like a Select: value + onChange */}
          <Controller
            name="persona"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>
                  Choose Assistant Voice
                </FieldLabel>
                <VoiceSelector
                  value={field.value}
                  onChange={field.onChange} // ← onChange not spread directly (custom component)
                  disabled={isSubmitting}
                  aria-invalid={fieldState.invalid}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          {/* 6. Submit */}
          <Button type="submit" className="form-btn" disabled={isSubmitting}>
            Begin Synthesis
          </Button>
        </form>
      </div>
    </>
  );
};

export default UploadForm;

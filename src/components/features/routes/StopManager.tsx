"use client";

import { useFieldArray, Control, UseFormReturn } from "react-hook-form";
import { createRouteSchema } from "@/validators";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Trash2, Plus, ArrowUp, ArrowDown } from "lucide-react";

type RouteFormValues = z.infer<typeof createRouteSchema>;

interface StopManagerProps {
  form: UseFormReturn<RouteFormValues>;
}

export function StopManager({ form }: StopManagerProps) {
  const { fields, append, remove, move } = useFieldArray({
    control: form.control,
    name: "stops",
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Stops</h3>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => append({ name: "", location: "" })}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Stop
        </Button>
      </div>

      {fields.map((field, index) => (
        <div key={field.id} className="flex gap-2 items-center p-4 border rounded-lg bg-muted/30">
          <div className="flex flex-col gap-1">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              disabled={index === 0}
              onClick={() => move(index, index - 1)}
            >
              <ArrowUp className="w-4 h-4" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              disabled={index === fields.length - 1}
              onClick={() => move(index, index + 1)}
            >
              <ArrowDown className="w-4 h-4" />
            </Button>
          </div>

          <div className="flex-1 space-y-4">
            <FormField
              control={form.control}
              name={`stops.${index}.name`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className={index > 0 ? "sr-only" : ""}>
                    Stop {index + 1} Name
                  </FormLabel>
                  <FormControl>
                    <Input placeholder={`Stop ${index + 1} Name`} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name={`stops.${index}.location`}
              render={({ field }) => (
                <FormItem className="mb-0">
                  <FormLabel className="sr-only">Location</FormLabel>
                  <FormControl>
                    <Input placeholder="Location/Coordinates (optional)" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {fields.length > 2 && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="text-destructive hover:text-destructive hover:bg-destructive/10 self-center"
              onClick={() => remove(index)}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          )}
        </div>
      ))}
      {form.formState.errors.stops?.root?.message && (
        <p className="text-sm font-medium text-destructive">
          {form.formState.errors.stops.root.message}
        </p>
      )}
    </div>
  );
}

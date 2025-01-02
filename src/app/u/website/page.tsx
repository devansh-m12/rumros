'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useToast } from '@/hooks/use-toast';

const websiteSchema = z.object({
  name: z.string().min(1, 'Website name is required'),
  domain: z.string().min(1, 'Domain is required'),
  description: z.string().optional(),
});

export default function WebsitePage() {
  const { toast } = useToast();
  const form = useForm({
    resolver: zodResolver(websiteSchema),
    defaultValues: {
      name: '',
      domain: '',
      description: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof websiteSchema>) => {
    try {
      // Mock API call
      console.log('Form submitted:', values);
      toast({
        title: 'Success',
        description: 'Website settings saved successfully',
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to save website settings',
      });
    }
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-black p-4">
      <div className="relative w-full max-w-2xl bg-black px-8 py-12 md:rounded-2xl md:shadow-[0_0_40px_rgba(255,255,255,0.1)]">
        <div className="absolute left-0 top-0 h-16 w-16 rounded-tl-2xl border-l-2 border-t-2 border-white/10" />
        <div className="absolute bottom-0 right-0 h-16 w-16 rounded-br-2xl border-b-2 border-r-2 border-white/10" />

        <div className="relative space-y-8">
          <div className="space-y-2">
            <h2 className="text-center text-3xl font-bold tracking-tight text-white">
              Website Settings
            </h2>
            <p className="text-center text-sm text-gray-400">
              Configure your website details and preferences
            </p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-gray-300">
                        Website Name
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="My Awesome Website"
                          className="w-full rounded-full border border-white/10 bg-white/5 px-6 py-2.5 text-gray-100 placeholder-gray-500 backdrop-blur-sm transition-all duration-200 focus:border-white/20 focus:bg-white/10 focus:outline-none focus:ring-1 focus:ring-white/20"
                        />
                      </FormControl>
                      <FormMessage className="text-sm text-red-400" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="domain"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-gray-300">
                        Domain
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="example.com"
                          className="w-full rounded-full border border-white/10 bg-white/5 px-6 py-2.5 text-gray-100 placeholder-gray-500 backdrop-blur-sm transition-all duration-200 focus:border-white/20 focus:bg-white/10 focus:outline-none focus:ring-1 focus:ring-white/20"
                        />
                      </FormControl>
                      <FormMessage className="text-sm text-red-400" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-gray-300">
                        Description
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Brief description of your website"
                          className="w-full rounded-full border border-white/10 bg-white/5 px-6 py-2.5 text-gray-100 placeholder-gray-500 backdrop-blur-sm transition-all duration-200 focus:border-white/20 focus:bg-white/10 focus:outline-none focus:ring-1 focus:ring-white/20"
                        />
                      </FormControl>
                      <FormMessage className="text-sm text-red-400" />
                    </FormItem>
                  )}
                />
              </div>

              <button
                type="submit"
                className="group relative flex w-full justify-center rounded-full border border-white/10 bg-white/5 px-6 py-3 text-sm font-medium text-white transition-all duration-300 hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/20"
              >
                Save Settings
              </button>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}

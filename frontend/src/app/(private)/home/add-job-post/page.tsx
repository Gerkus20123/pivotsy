'use client'

import FieldForm from '@/components/fieldform';
import { zodResolver } from '@hookform/resolvers/zod';
import React, { useEffect, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form';
import * as z from "zod"
import { FieldConfig } from '@/lib/interfaces/fields'
import { JobCategoryOptions } from '../../../../../constants/job_category_options';
import { AgreementTypeOptions } from '../../../../../constants/agreement_type_options';
import { ScheduleOptions } from '../../../../../constants/schedule_options';
import { WorkExperienceOptions } from '../../../../../constants/work_experience_options';
import { TransportAvailabilityOptions } from '../../../../../constants/trasport_availability_options';
import { CurrencyOptionsData } from '../../../../../constants/currency_options';
import { AdditionalRequirements } from '../../../../../constants/additional_requirements';
import { TypeOfWorkOptions } from '../../../../../constants/type_of_work_options';
import { Button } from '@/components/ui/button';
import { fetchingCurrentUserData } from '@/lib/api/fetching';
import { cn } from '@/lib/utils';
import { createAJob } from '@/lib/api/postRequests';

const formSchema = z.object({
  short_description: z.string().min(1, "Title is required"),
  image: z.string().optional(),
  long_description: z.string().min(10, "Description is too short"),
  currency: z.string(),
  payment: z.number().int().positive(),
  agreement_type: z.array(z.string()).min(1, "Choose at least one work agreement"),
  location: z.string(),
  experience_requirement: z.string().min(1, "Choose the work experience criteria"),
  transport_availability: z.array(z.string()).min(1, "Choose at least one transport availability option"),
  schedule: z.array(z.string()).min(1, "Choose at least one work schedule"),
  category: z.string(),
  subcategory: z.string().optional(),
  additional_requirements: z.array(z.string()),
  type_of_work: z.array(z.string()),
  author_info: z.object({
    name: z.string().min(2, "Name is required"),
    phone_number: z.string().min(9, "Write the correct phonenumber"),
    company_name: z.string().optional()
  })
})

type FormValues = z.infer<typeof formSchema>

function AddJobPost() {

  const [userData, setUserData] = useState<any>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { 
      short_description: "", 
      image: "", 
      long_description: "", 
      currency: "",
      payment: 1,
      agreement_type: [],
      location: "",
      experience_requirement: "",
      transport_availability: [],
      schedule: [],
      category: "",
      subcategory: "",
      additional_requirements: [],
      type_of_work: [],
      author_info: {
        name: userData?.name || "",
        phone_number: userData?.phone_number || "",
        company_name: userData?.company_name || ""
      }
    },
  });

  const addJobConfig: FieldConfig<FormValues>[] = useMemo(() => [
    { name: 'short_description', label: 'Job Title', type: 'text', placeholder: 'Job Title...'},
    { name: 'category', label: 'Category', type: 'category_selector', categories: JobCategoryOptions},
    { name: 'long_description', label: 'Description', type: 'textarea', placeholder: 'Description...'},
    { name: 'agreement_type', label: 'Agreement type', type: 'checkbox', options: AgreementTypeOptions},
    { name: 'schedule', label: 'Schedule', type: 'checkbox', options: ScheduleOptions},
    { name: 'experience_requirement', label: 'Experience Requirement', type: 'checkbox', options: WorkExperienceOptions},
    { name: 'transport_availability', label: 'Transport Availability', type: 'checkbox', options: TransportAvailabilityOptions},
    { name: 'payment', label: 'Payment', type: 'number'},
    { name: 'location', label: 'Job Location', type: 'text'},
    { name: 'currency', label: 'Currency', type: 'currency_selector', currency: CurrencyOptionsData},
    { name: 'additional_requirements', label: 'Additional Requirements', type: 'checkbox', options: AdditionalRequirements},
    { name: 'type_of_work', label: 'Type Of Work', type: 'checkbox', options: TypeOfWorkOptions},
    { name: 'author_info', label: 'Author Data', type: 'author'}
  ], []);

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const onSubmit = async (data: FormValues) => {

    // Transforming the data to fit db (as stirings .. , ..)
    const formattedData = {
      ...data,
      agreement_type: data.agreement_type.join(", "),
      schedule: data.schedule.join(", "),
      transport_availability: data.transport_availability.join(", "),
      additional_requirements: data.additional_requirements.join(", "),
      type_of_work: data.type_of_work.join(", "),
    };

    try {
      setLoading(true);
      await createAJob(formattedData);
    } catch (error: any) {
      console.error(error);
      const msg = error.response?.data?.message || "An unexpected error occurred while creating a job.";
      setErrorMessage(msg);
    } finally {
      setLoading(false);
    }
  };

  const loadingAuthor = async () => {
    try {
      const data = await fetchingCurrentUserData()
      setUserData(data);

      if (!data) {
        console.warn("No user data found");
        return;
      }

      setUserData(data);

      form.reset({
        ...form.getValues(),
        author_info: {
          name: data?.name || "",
          phone_number: data?.phone_number ?? "",
          company_name: data?.company_name ?? ""
        }
      });
    } catch (error) {
      console.error("An error occured while loading the data:", error);
    }
  }

  useEffect(() => {
    loadingAuthor()  
  }, [])

  return (
    <div className='min-h-screen'>

            {/* Page Title */}
            <h1 className="text-3xl font-bold mb-8">Add Job Offer</h1>

            <hr></hr>

            <div>
              <div className='text-xl mt-10'>
                  <h2> The more the details, the better</h2>
              </div>
              
              <div className='mt-10'>
                <FieldForm 
                  form={form} 
                  formId="add-job-form" 
                  fieldsConfig={addJobConfig}
                  onSubmit={onSubmit}
                />
              </div>
              
              <Button 
                type="submit" 
                form="add-job-form"
                variant="default"
                className="mt-5 w-full"
                disabled={loading}
                onClick={() => {
                  const errors = form.formState.errors;
                  if (Object.keys(errors).length > 0) {
                    console.log("Formularz zawiera błędy:", errors);
                  }
                }}
              >
                {loading ? "Creating..." : "Create A Job"}
              </Button>

              {errorMessage && (
                <div className="bg-destructive/15 text-destructive p-3 rounded-lg mb-5 text-sm">
                  {errorMessage}
                </div>
              )}

              {/* Form Errors */}
              <div className="relative w-full h-[100px]"> 
                <div className={cn(
                  "absolute inset-0 transition-all duration-300 transform",
                  Object.keys(form.formState.errors).length > 0 
                    ? "opacity-100 scale-100 translate-y-0" 
                    : "opacity-0 scale-95 -translate-y-2 pointer-events-none"
                )}>
                  <div className="bg-red-50 p-3 rounded-xl border border-red-100 shadow-sm">
                    <p className="text-red-600 font-bold text-[10px] uppercase tracking-wider mb-1">
                      Validation Errors
                    </p>
                    <ul className="space-y-1">
                      {Object.values(form.formState.errors).map((error, index) => (
                        <li key={index} className="text-red-500 text-xs flex items-center gap-1">
                          <span className="w-1 h-1 bg-red-400 rounded-full shrink-0" />
                          {error?.message?.toString()}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
    </div>
  )
}

export default AddJobPost;